import { useEffect, useMemo, useState } from "react";
import { fetchLearningItemsWithCache, type LearningItem } from "../util/google-sheet";

type LinkItem = { title: string; link: string };

type CategoryGroup = {
  read: LinkItem[];
  video: LinkItem[];
};

type GroupedItems = Record<string, CategoryGroup>;

type ReadsListProps = {
  googleSheetId?: string;
};

const groupItems = (items: LearningItem[]): GroupedItems =>
  items.reduce<GroupedItems>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { read: [], video: [] };
    }

    acc[item.category][item.subtype].push({
      title: item.title,
      link: item.link,
    });

    return acc;
  }, {});

export default function ReadsList({ googleSheetId }: ReadsListProps) {
  const [items, setItems] = useState<LearningItem[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (googleSheetId) {
      window.__GOOGLE_SHEET_ID = googleSheetId;
    }

    let isActive = true;

    fetchLearningItemsWithCache()
      .then((data) => {
        if (isActive) setItems(data);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      });

    return () => {
      isActive = false;
    };
  }, [googleSheetId]);

  const grouped = useMemo(() => (items ? groupItems(items) : null), [items]);

  if (hasError) {
    return (
      <p className="text-red-600 text-sm">Could not load reads right now.</p>
    );
  }

  if (!grouped) {
    return <p className="text-title text-sm">Loading reads...</p>;
  }

  const orderedCategories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <div className="pt-3 flex-col gap-2">
      {orderedCategories.map((category) => (
        <section key={category}>
          <h2 className="font-serif text-black mt-4 text-base md:text-lg">
            {category}
          </h2>

          {grouped[category].read.length > 0 && (
            <div className="mt-2">
              <p className="text-md text-black">Reads :</p>
              <ul>
                {grouped[category].read.map((item) => (
                  <li key={item.link}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-2 hover:underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {grouped[category].video.length > 0 && (
            <div className="mt-4">
              <p className="text-md text-black">Videos :</p>
              <ul>
                {grouped[category].video.map((item) => (
                  <li key={item.link}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-2 hover:underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
