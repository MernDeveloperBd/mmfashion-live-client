import { BsShop } from 'react-icons/bs';

const BecomeSellerBtn = () => {
    return (
        <div>
            <a
  href={`${import.meta.env.VITE_DASHBOARD_URL}`}
  target="_blank"
  rel="noreferrer"
  title="Become a seller"
  aria-label="Become a seller"
  className="group relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold
             shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-[#0d6b54]/40 focus-visible:ring-offset-2 hover:shadow-md"
  style={{ border: '1px solid #0d6b54', color: '#0d6b54', background: '#fff' }}
  onMouseDown={(e) => e.currentTarget.classList.add('scale-[0.98]')}
  onMouseUp={(e) => e.currentTarget.classList.remove('scale-[0.98]')}
>
  <BsShop className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
  <span>Become a seller</span>
  {/* subtle hover tint */}
  <span
    className="absolute inset-0 -z-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    style={{ backgroundColor: '#0d6b54', opacity: 0.06 }}
  />
</a>
        </div>
    );
};

export default BecomeSellerBtn;