import Link from "next/link";

interface PaginationProps {
  page: number;
  pageCount: number;
  /** Current search params (without `page`) to preserve across pages. */
  params: Record<string, string>;
}

export function Pagination({ page, pageCount, params }: PaginationProps) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams(params);
    if (p > 1) qs.set("page", String(p));
    else qs.delete("page");
    const s = qs.toString();
    return s ? `/residences?${s}` : "/residences";
  };

  const linkBase = "inline-flex h-11 min-w-11 items-center justify-center px-3 text-sm transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${linkBase} hover:text-olive-ink`} rel="prev">
          <span aria-hidden="true">←</span>
          <span className="ml-2">Previous</span>
        </Link>
      ) : null}
      <ul className="flex items-center gap-1">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={`${linkBase} border ${
                p === page ? "border-charcoal bg-charcoal text-ivory" : "border-transparent hover:border-line"
              }`}
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>
      {page < pageCount ? (
        <Link href={href(page + 1)} className={`${linkBase} hover:text-olive-ink`} rel="next">
          <span className="mr-2">Next</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </nav>
  );
}
