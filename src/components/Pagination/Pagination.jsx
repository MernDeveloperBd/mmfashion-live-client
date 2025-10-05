import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdFirstPage, MdLastPage } from "react-icons/md";

const Pagination = ({
  pageNumber,
  setPageNumber,
  totalItem = 0,
  perPage = 10,
  showItem = 7, 
}) => {
  const totalPage = Math.max(1, Math.ceil(totalItem / perPage));
  if (totalPage <= 1) return null;

 
  const maxVisible = Math.max(3, showItem % 2 === 0 ? showItem - 1 : showItem);

  const clamp = (n) => Math.min(totalPage, Math.max(1, n));
  const goTo = (n) => setPageNumber(clamp(n));

  // পেজ আইটেম জেনারেটর
  const items = [];
  const sideCount = Math.floor(maxVisible / 2);

  if (totalPage <= maxVisible + 2) {
    // ছোট রেঞ্জ: সব পেজ দেখাও
    for (let i = 1; i <= totalPage; i++) {
      items.push({ type: "page", value: i });
    }
  } else {
    // বড় রেঞ্জ: 1 ... [middle range] ... last
    let start = pageNumber - sideCount;
    let end = pageNumber + sideCount;

    if (start < 2) {
      end += 2 - start;
      start = 2;
    }
    if (end > totalPage - 1) {
      start -= end - (totalPage - 1);
      end = totalPage - 1;
    }

    start = Math.max(2, start);
    end = Math.min(totalPage - 1, end);

    items.push({ type: "page", value: 1 });
    if (start > 2) items.push({ type: "ellipsis", id: "left" });

    for (let i = start; i <= end; i++) {
      items.push({ type: "page", value: i });
    }

    if (end < totalPage - 1) items.push({ type: "ellipsis", id: "right" });
    items.push({ type: "page", value: totalPage });
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") goTo(pageNumber - 1);
    if (e.key === "ArrowRight") goTo(pageNumber + 1);
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex justify-center items-center gap-1 mt-4"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* First */}
      <button
        onClick={() => goTo(1)}
        disabled={pageNumber === 1}
        aria-label="First page"
        className={`p-2 rounded-full transition-colors ${
          pageNumber === 1
            ? "text-gray-500 cursor-not-allowed"
            : "text-[#0a0f1a] hover:bg-teal-600/70"
        }`}
      >
        <MdFirstPage size={20} />
      </button>

      {/* Prev */}
      <button
        onClick={() => goTo(pageNumber - 1)}
        disabled={pageNumber === 1}
        aria-label="Previous page"
        className={`p-2 rounded-full transition-colors ${
          pageNumber === 1
            ? "text-gray-500 cursor-not-allowed"
            : "text-[#0a0f1a] hover:bg-teal-600/70"
        }`}
      >
        <MdKeyboardArrowLeft size={20} />
      </button>

      {/* Pages */}
      {items.map((item, idx) =>
        item.type === "ellipsis" ? (
          <span
            key={`ellipsis-${item.id}-${idx}`}
            className="text-gray-400 text-xl px-1 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${item.value}`}
            onClick={() => goTo(item.value)}
            aria-label={`Page ${item.value}`}
            aria-current={item.value === pageNumber ? "page" : undefined}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
              item.value === pageNumber
                ? "bg-teal-600 text-white shadow-lg shadow-teal-500/50"
                : "bg-slate-700 text-[#d0d2d6] hover:bg-teal-600 hover:text-white"
            }`}
          >
            {item.value}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(pageNumber + 1)}
        disabled={pageNumber === totalPage}
        aria-label="Next page"
        className={`p-2 rounded-full transition-colors ${
          pageNumber === totalPage
            ? "text-gray-400 cursor-not-allowed"
            : "text-[#0a0f1a] hover:bg-teal-600/70"
        }`}
      >
        <MdKeyboardArrowRight size={20} />
      </button>

      {/* Last */}
      <button
        onClick={() => goTo(totalPage)}
        disabled={pageNumber === totalPage}
        aria-label="Last page"
        className={`p-2 rounded-full transition-colors ${
          pageNumber === totalPage
            ? "text-gray-500 cursor-not-allowed"
            : "text-[#0a0f1a] hover:bg-teal-600/70"
        }`}
      >
        <MdLastPage size={20} />
      </button>
    </nav>
  );
};

export default Pagination;