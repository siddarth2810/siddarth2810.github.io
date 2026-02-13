type SheetCell = { v?: string | null };
type GvizResponse = {
  table?: { rows?: Array<{ c: Array<SheetCell | null> }> };
};

export type LearningSubtype = "read" | "video";

export type LearningItem = {
  category: string;
  subtype: LearningSubtype;
  title: string;
  link: string;
};

const CACHE_KEY = "learning_items";

declare global {
  interface Window {
    __GOOGLE_SHEET_ID?: string;
  }
}

const normalizeSubtype = (value: string): LearningSubtype | null => {
  const v = value.trim().toLowerCase();
  if (v === "read" || v === "reads") return "read";
  if (v === "video" || v === "videos" || v === "lecture" || v === "lectures")
    return "video";
  return null;
};

const parseGviz = (payload: string): GvizResponse => {
  // console.log("[Raw Payload ]", payload);
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Invalid Google Sheet response");
  }

  return JSON.parse(payload.slice(start, end + 1)) as GvizResponse;
};

const get = (cells: SheetCell[] | undefined, i: number) =>
  String(cells?.[i]?.v ?? "").trim();

export const fetchReadingItems = async (
  sheetName = "reads"
): Promise<LearningItem[]> => {
  const sheetId =
    import.meta.env.PUBLIC_GOOGLE_SHEET_ID ||
    import.meta.env.GOOGLE_SHEET_ID ||
    (typeof window !== "undefined" ? window.__GOOGLE_SHEET_ID : undefined);

  if (!sheetId) throw new Error("GOOGLE_SHEET_ID missing");

  const qs = new URLSearchParams({
    sheet: sheetName,
    tqx: "out:json",
    headers: "1",
  });
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?${qs.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${sheetName}`);

  const json = parseGviz(await res.text());
  const rows = json?.table?.rows ?? [];

  return rows
    .map((r: any) => {
      const c = r?.c as any[] | undefined;

      const category = get(c, 0);
      const subtype = normalizeSubtype(get(c, 1));
      const title = get(c, 2);
      const link = get(c, 3);

      if (!category || !title || !link || !subtype) return null;
      return { category, subtype, title, link };
    })
    .filter(Boolean) as LearningItem[];
};

export const fetchLearningItems = async (): Promise<LearningItem[]> => {
  return fetchReadingItems("reads");
};

export const fetchLearningItemsWithCache = async (): Promise<LearningItem[]> => {
  // localStorage is only available in the browser
  if (typeof window === "undefined") {
    return fetchLearningItems();
  }

  const cached = localStorage.getItem(CACHE_KEY);

  if (cached) {
    try {
      const parsed = JSON.parse(cached) as LearningItem[];

      // Background refresh
      void fetchLearningItems()
        .then((fresh) => {
          localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
        })
        .catch(() => {});

      return parsed;
    } catch {
      // Corrupted cache, continue with a fresh fetch below
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // First load
  const data = await fetchLearningItems();
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  return data;
};
