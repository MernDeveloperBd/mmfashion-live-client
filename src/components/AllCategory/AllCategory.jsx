
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AllCategory = () => {
  const { categories } = useSelector(state => state.home)
  // 1) Normalize + dedupe by slug (fallback to _id)
  const normalized = [];
  const seen = new Set();

  for (const c of categories) {
    if (!c) continue;
    const slug = c.slug || String(c._id || c.id || "");
    if (!slug) continue; // skip if no identifier
    if (seen.has(slug)) continue; // remove duplicates by slug
    seen.add(slug);

    normalized.push({
      id: c._id || c.id || slug,
      name: c.name || "Category",
      image: c.image || "",
      slug,
    });
  }

  // 2) Ensure minimum 6 tiles to fill the mosaic layout
  const tiles = normalized.slice(0, 6);
  while (tiles.length < 6) {
    tiles.push({
      id: `placeholder-${tiles.length}`,
      name: "Coming Soon",
      image: "",
      slug: "#",
    });
  }

  // 3) Safe helper for image fallback
  const handleImgError = (e) => {
    e.currentTarget.src =
      "https://via.placeholder.com/800x600.png?text=Category";
  };

  // 4) Tile component
  const Tile = ({ item, className, titleClass = "text-xl md:text-2xl" }) => {
    const to = item.slug === "#" ? "#" : `/products?category=${encodeURIComponent(item.name)}`;  
    return (
      <Link
        to={to}
        aria-label={item.name}
        className={`${className} bg-green-600 rounded-xl overflow-hidden group`}
      >
        <div className="w-full h-full relative">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              onError={handleImgError}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-400" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h3 className={`text-white font-bold text-center px-2 ${titleClass}`}>
              {item.name}
            </h3>
          </div>
        </div>
      </Link>
    );
  };

  // যদি একদমই ক্যাটেগরি না থাকে
  if (!tiles.length) return null;

  return (
    <div className="w-[95%] mx-auto px-0 py-4">
    
      {/* Mobile: simple 2-column grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {tiles.map((item) => (
          <Tile key={item.id} item={item} className="aspect-[4/3]" titleClass="text-lg" />
        ))}
      </div>

      {/* Desktop: mosaic layout (original design) */}
      <div className="hidden md:grid grid-cols-5 grid-rows-2 gap-4 h-[460px]">
        {/* Left tall */}
        <Tile
          item={tiles[0]}
          className="col-start-1 col-end-2 row-start-1 row-end-3"
        />

        {/* Middle Top Left */}
        <Tile
          item={tiles[1]}
          className="col-start-2 col-end-4 row-start-1 row-end-2"
        />

        {/* Middle Top Right */}
        <Tile
          item={tiles[2]}
          className="col-start-4 col-end-5 row-start-1 row-end-2"
          titleClass="text-lg md:text-xl"
        />

        {/* Middle Bottom Left */}
        <Tile
          item={tiles[3]}
          className="col-start-2 col-end-3 row-start-2 row-end-3"
          titleClass="text-lg md:text-xl"
        />

        {/* Middle Bottom Right */}
        <Tile
          item={tiles[4]}
          className="col-start-3 col-end-5 row-start-2 row-end-3"
        />

        {/* Right tall */}
        {/* Note: এখানে slug ব্যবহার করা হচ্ছে (আগে id ছিল) */}
        <Tile
          item={tiles[5]}
          className="col-start-5 col-end-6 row-start-1 row-end-3"
        />
      </div>
    </div>
  );
};

export default AllCategory;