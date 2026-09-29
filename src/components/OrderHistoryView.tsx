import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import {
  PackageCheck,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { orders, cancelOrder, setActiveView } = useShop();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <PackageCheck className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getTimelineSteps = (status: OrderStatus) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(status);

    if (status === 'Cancelled') {
      return (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>This order has been cancelled.</span>
        </div>
      );
    }

    return (
      <div className="relative flex items-center justify-between mt-3 mb-4">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: currentIndex >= 0 ? `${(currentIndex / (steps.length - 1)) * 100}%` : '0%',
          }}
        />

        {steps.map((s, index) => {
          const isPassed = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : isPassed
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`text-[11px] mt-1.5 font-semibold ${
                  isCurrent ? 'text-indigo-600' : isPassed ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <PackageCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Placed Yet</h3>
        <p className="text-sm text-slate-500 mb-6">
          When you purchase items from ShopEase, your orders and shipment tracking will appear here.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Order Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track packages, view item receipts, and manage order statuses in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Orders List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            All Orders ({orders.length})
          </h3>

          <div className="space-y-3">
            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-1 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-sm font-bold text-indigo-700">
                      {order.order_number}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      ${order.total_amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.product_name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        title={item.product_name}
                      />
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-100">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Order Detail Card */}
        {selectedOrder && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Order Details
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {selectedOrder.order_number}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Order Tracking
              </h4>
              {getTimelineSteps(selectedOrder.status)}
            </div>

            {/* Ordered Items List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Ordered Products ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 shrink-0">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-600" /> Shipping Destination
                </h5>
                <p className="font-semibold text-slate-800">{selectedOrder.customer.name}</p>
                <p className="text-slate-600">{selectedOrder.customer.address}</p>
                <p className="text-slate-600">
                  {selectedOrder.customer.city}, {selectedOrder.customer.state}{' '}
                  {selectedOrder.customer.postal_code}
                </p>
                <p className="text-slate-600">{selectedOrder.customer.country}</p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" /> Contact & Payment
                </h5>
                <p className="text-slate-600">Email: {selectedOrder.customer.email}</p>
                <p className="text-slate-600">Phone: {selectedOrder.customer.phone}</p>
                <p className="text-slate-600 uppercase">
                  Payment: <strong>{selectedOrder.payment_method}</strong>
                </p>
                {selectedOrder.estimated_delivery && (
                  <p className="text-emerald-700 font-semibold mt-1">
                    Est. Delivery: {selectedOrder.estimated_delivery}
                  </p>
                )}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>
                  {selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-indigo-600 font-black">
                  ${selectedOrder.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Cancel Action if pending */}
            {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => cancelOrder(selectedOrder.id)}
                  className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  Cancel This Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
