import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get_order } from '../../store/Reducers/orderReducer';

const Order = () => {
  // রুটে যদি /dashboard/order/details/:id থাকে, তাহলে এখানে id নিন
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { myOrder, loader, errorMessage } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (orderId) dispatch(get_order(orderId));
  }, [dispatch, orderId]);

  if (loader) return <div className="w-[95%] mx-auto py-6">Loading...</div>;
  if (errorMessage) return <div className="w-[95%] mx-auto py-6 text-red-500">{errorMessage}</div>;
  if (!myOrder) return <div className="w-[95%] mx-auto py-6">No order found</div>;

  return (
    <div className="w-[95%] mx-auto py-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Order #{myOrder?._id || '...'}</h2>
            <p className="text-sm text-slate-500">Placed on {myOrder?.date || '-'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 text-xs rounded-full ${
                myOrder?.payment_status === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              Payment: {myOrder?.payment_status || '-'}
            </span>
            <span
              className={`px-2.5 py-1 text-xs rounded-full ${
                myOrder?.delivery_status === 'delivered'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              Status: {myOrder?.delivery_status || '-'}
            </span>
          </div>
        </div>

        {/* Info blocks */}
        <div className="p-1 md:p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery */}
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Delivery to</h3>
              <p className="text-slate-800 font-medium">{myOrder?.shippingInfo?.name || '-'}</p>
              <div className="mt-1">
                <span className="inline-block bg-blue-100 text-blue-800 text-[11px] font-medium mr-2 px-2.5 py-0.5 rounded-full">
                  Home
                </span>
                <span className="text-sm text-slate-600">
                  {myOrder?.shippingInfo?.address || ''} {myOrder?.shippingInfo?.province || ''}{' '}
                  {myOrder?.shippingInfo?.city || ''} {myOrder?.shippingInfo?.area || ''}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Email: <span className="font-medium">{userInfo?.email || '-'}</span>
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Summary</h3>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Items</span>
                <span>{myOrder?.products?.length || 0}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Price (incl. shipping)</span>
                <span className="font-semibold text-slate-800">TK {myOrder?.price ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="mt-6">
            <h3 className="text-base font-semibold text-slate-800 mb-3">Products</h3>
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
              {(myOrder?.products || []).map((p, i) => (
                <div key={p?._id || i} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-16 h-16 rounded object-cover bg-slate-100"
                      src={p?.images?.[0] || '/placeholder.png'}
                      alt={p?.name || 'product'}
                    />
                    <div className="flex flex-col">
                      <Link to="#" className="text-sm font-medium text-slate-800 hover:text-indigo-600">
                        {p?.name || '-'}
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5 flex gap-3">
                        <span>Brand: {p?.brand || '-'}</span>
                        <span>Qty: {p?.quantity ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <div className="text-sm font-semibold text-orange-600">TK {p?.price ?? 0}</div>
                    {p?.oldPrice > 0 && (
                      <div className="text-xs text-slate-400 line-through">TK {p?.oldPrice}</div>
                    )}
                    {p?.discount > 0 && (
                      <span className="mt-1 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                        -{p?.discount}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {!myOrder?.products?.length && <div className="p-4 text-slate-500">No products</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;