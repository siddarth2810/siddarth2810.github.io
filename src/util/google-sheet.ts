type SheetCell = { v?: unknown };
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

export type LearningGroup = {
  category: string;
  read: LearningItem[];
  video: LearningItem[];
};

const normalizeSubtype = (value: string): LearningSubtype | null => {
  const v = value.trim().toLowerCase();
  if (v === "read" || v === "reads") return "read";
  if (v === "video" || v === "videos" || v === "lecture" || v === "lectures")
    return "video";
  return null;
};

const normalizeSheetId = (rawValue: string | undefined): string | undefined => {
  if (!rawValue) return undefined;

  const trimmed = rawValue.trim();

  // Accept either a raw sheet ID or a full Google Sheet URL.
  const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? trimmed;
};

const parseGviz = (payload: string): GvizResponse => {
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Invalid Google Sheet response");
  }

  return JSON.parse(payload.slice(start, end + 1)) as GvizResponse;
};

const get = (cells: Array<SheetCell | null> | undefined, i: number) =>
  String(cells?.[i]?.v ?? "").trim();

const isLearningItem = (item: LearningItem | null): item is LearningItem =>
  item !== null;

/**
 * Reads the public "reads" sheet. Runs at build time only — the result is
 * baked into the generated HTML, so nothing about this ships to the browser.
 */
export const fetchLearningItems = async (
  sheetName = "reads",
): Promise<LearningItem[]> => {
  const sheetId = normalizeSheetId(import.meta.env.PUBLIC_GOOGLE_SHEET_ID);

  if (!sheetId) throw new Error("PUBLIC_GOOGLE_SHEET_ID missing");

  const qs = new URLSearchParams({
    sheet: sheetName,
    tqx: "out:json",
    headers: "1",
  });
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?${qs.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch sheet: ${sheetName} (${res.status} ${res.statusText})`,
    );
  }

  const json = parseGviz(await res.text());

  return (json?.table?.rows ?? [])
    .map((row) => {
      const cells = row.c;
      const category = get(cells, 0);
      const subtype = normalizeSubtype(get(cells, 1));
      const title = get(cells, 2);
      const link = get(cells, 3);

      if (!category || !title || !link || !subtype) return null;
      return { category, subtype, title, link };
    })
    .filter(isLearningItem);
};

export const groupLearningItems = (items: LearningItem[]): LearningGroup[] => {
  const byCategory = new Map<string, LearningGroup>();

  for (const item of items) {
    let group = byCategory.get(item.category);

    if (!group) {
      group = { category: item.category, read: [], video: [] };
      byCategory.set(item.category, group);
    }

    group[item.subtype].push(item);
  }

  return [...byCategory.values()].sort((a, b) =>
    a.category.localeCompare(b.category),
  );
};

/**
 * Build-time entry point. A transient Google outage should not fail the whole
 * site build, so a failure degrades to an empty list and a loud warning.
 */
export const getReadingGroups = async (): Promise<LearningGroup[]> => {
  try {
    return groupLearningItems(await fetchLearningItems());
  } catch (error) {
    console.warn(
      `[reads] Could not load the reading list at build time — the page will render empty. ${
        error instanceof Error ? error.message : error
      }`,
    );
    return [];
  }
};
