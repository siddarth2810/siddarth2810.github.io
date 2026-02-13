type SheetCell = {
  v: string | number | boolean | null;
  f?: string;
};

type GvizResponse = {
  table?: {
    cols?: Array<{ id: string; label: string; type: string }>;
    rows?: Array<{ c: Array<SheetCell | null> }>;
  };
};

export type LinkItem = {
  title: string;
  link: string;
  [key: string]: string;
};

export type LearningSubtype = "read" | "lecture";

export type LearningItem = {
  category: string;
  subtype: LearningSubtype;
  title: string;
  link: string;
};

const sanitizeKey = (value: string, index: number) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .replace(/\s+/g, "_");
  return normalized.length ? normalized : `col_${index}`;
};

const parseGviz = (payload: string): GvizResponse => {
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Invalid Google Sheet response");
  }

  return JSON.parse(payload.slice(start, end + 1)) as GvizResponse;
};

export const fetchSheetRows = async (
  sheetName: string,
): Promise<Array<Record<string, string>>> => {
  const sheetId = import.meta.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is missing. Add it in your .env file.");
  }

  const query = new URLSearchParams({
    sheet: sheetName,
    tqx: "out:json",
    headers: "1",
  });

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?${query.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: ${sheetName}`);
  }

  const text = await response.text();
  const data = parseGviz(text);

  const cols = data.table?.cols ?? [];
  const rows = data.table?.rows ?? [];
  const headers = cols.map((col, index) => sanitizeKey(col.label || col.id, index));

  return rows.map((row) => {
    const entry: Record<string, string> = {};

    row.c.forEach((cell, index) => {
      const key = headers[index] ?? `col_${index}`;
      const value = cell?.f ?? cell?.v ?? "";
      entry[key] = String(value).trim();
    });

    return entry;
  });
};

export const fetchSheetLinks = async (sheetName: string): Promise<LinkItem[]> => {
  const rows = await fetchSheetRows(sheetName);

  const getFirstMatch = (row: Record<string, string>, keys: string[]) => {
    for (const key of keys) {
      if (row[key]) return row[key];
    }
    return "";
  };

  return rows
    .map((row) => {
      const title = getFirstMatch(row, ["title"]);
      const link = getFirstMatch(row, ["link"]);

      return {
        ...row,
        title,
        link,
      };
    })
    .filter((row) => row.title && row.link)
    .map((row) => ({
      ...row,
      title: row.title,
      link: row.link,
    }));
};

const normalizeSubtype = (value: string): LearningSubtype | null => {
  const normalized = value.trim().toLowerCase();

  if (["read", "reads", "book", "article"].includes(normalized)) {
    return "read";
  }

  if (["lecture", "lectures", "video", "course"].includes(normalized)) {
    return "lecture";
  }

  return null;
};

export const fetchLearningItems = async (
  sheetName = "learning",
): Promise<LearningItem[]> => {
  const rows = await fetchSheetRows(sheetName);

  return rows
    .map((row) => {
      const category = row.category?.trim() ?? "";
      const title = row.title?.trim() ?? "";
      const link = row.link?.trim() ?? "";
      const subtype = normalizeSubtype(row.subtype ?? "");

      if (!category || !title || !link || !subtype) {
        return null;
      }

      return {
        category,
        subtype,
        title,
        link,
      };
    })
    .filter((item): item is LearningItem => Boolean(item));
};
