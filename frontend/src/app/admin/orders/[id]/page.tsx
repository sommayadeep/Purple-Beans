"use client";

import { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Truck, Package, ShieldCheck, FileText, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  grind: string;
  weight: string;
}

interface ShippingAddress {
  label?: string;
  street: string;
  suburb: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  lat?: number;
  lng?: number;
}

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  notes?: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        router.push("/admin/orders");
      }
    } catch (error) {
      console.error(error);
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadOrder();
    }
  }, [params.id]);

  const updateStatus = async (updates: { orderStatus?: string; paymentStatus?: string; notes?: string }) => {
    const toastId = toast.loading("Saving changes...");
    try {
      const res = await fetch(`/api/orders/${order?.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Order updated successfully", { id: toastId });
        loadOrder();
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update order", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

  if (!order) return null;
  const deliveryPhone = order.shippingAddress.phone || order.customerPhone || "";
  const mapsUrl = order.shippingAddress.lat && order.shippingAddress.lng
    ? `https://www.google.com/maps/search/?api=1&query=${order.shippingAddress.lat},${order.shippingAddress.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([
        order.shippingAddress.street,
        order.shippingAddress.suburb,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.postalCode,
        order.shippingAddress.country,
      ].filter(Boolean).join(", "))}`;

  return (
    <div className="space-y-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F7F3EE]/60 hover:text-[#F7F3EE] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders list
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#5A3825]/30 pb-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold tracking-wide">Order {order.orderId}</h1>
          <p className="text-xs text-[#F7F3EE]/60 mt-1">
            Registered on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-left md:text-right">
          <span className="block text-[10px] text-[#F7F3EE]/40 uppercase tracking-wider">Total amount</span>
          <span className="font-playfair text-2xl font-bold text-[#F7F3EE]">
            ₹{Math.round(order.totalAmount)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Forms/Logs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Status Selectors */}
          <div className="bg-[#1C120D] border border-[#5A3825]/30 p-6 rounded-sm space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#F7F3EE] border-b border-[#5A3825]/20 pb-2">
              Order Status Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/50 mb-1">
                  Fulfilment / Roast Tracking
                </label>
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus({ orderStatus: e.target.value })}
                  className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/50 mb-1">
                  Settlement / Payment Status
                </label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => updateStatus({ paymentStatus: e.target.value })}
                  className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipping detail */}
          <div className="bg-[#1C120D] border border-[#5A3825]/30 p-6 rounded-sm space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#F7F3EE] border-b border-[#5A3825]/20 pb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#6B4B7D]" />
              Shipping Destination
            </h3>
            <div className="text-xs space-y-1">
              <p className="font-semibold">{order.user?.name || "Guest User"}</p>
              <p className="font-mono text-[#F7F3EE]/50">{order.user?.email}</p>
              {order.shippingAddress.label && (
                <p className="mt-2 text-[10px] uppercase tracking-wider text-[#6B4B7D] font-bold">
                  {order.shippingAddress.label}
                </p>
              )}
              <p className="mt-2 text-[#F7F3EE]/80">{order.shippingAddress.street}</p>
              {order.shippingAddress.suburb && <p className="text-[#F7F3EE]/80">{order.shippingAddress.suburb}</p>}
              <p className="text-[#F7F3EE]/80">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="text-[#F7F3EE]/80">{order.shippingAddress.country}</p>
              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                {deliveryPhone && (
                  <a
                    href={`tel:${deliveryPhone}`}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-[10px] font-mono text-[#F7F3EE] hover:border-[#6B4B7D]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#6B4B7D]" />
                    {deliveryPhone}
                  </a>
                )}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-[10px] font-semibold uppercase tracking-wider text-[#F7F3EE] hover:border-[#6B4B7D]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#6B4B7D]" />
                  Open Map
                </a>
              </div>
            </div>
          </div>

          {/* internal comments notes */}
          <div className="bg-[#1C120D] border border-[#5A3825]/30 p-6 rounded-sm space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#F7F3EE] border-b border-[#5A3825]/20 pb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#6B4B7D]" />
              Internal Comments / Customer Notes
            </h3>
            <textarea
              className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs p-3 text-[#F7F3EE] focus:outline-none min-h-[80px]"
              defaultValue={order.notes || ""}
              onBlur={(e) => updateStatus({ notes: e.target.value })}
              placeholder="Store internal notes or add additional context to shipping tracking..."
            />
          </div>
        </div>

        {/* Right Side: Items ordered */}
        <div className="lg:col-span-4 bg-[#1C120D] border border-[#5A3825]/30 p-6 rounded-sm space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[#F7F3EE] border-b border-[#5A3825]/20 pb-2 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#6B4B7D]" />
            Items summary
          </h3>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-[#5A3825]/10 pb-3 last:border-b-0 last:pb-0">
                <div>
                  <h4 className="font-bold text-[#F7F3EE]">{item.name}</h4>
                  <p className="text-[10px] text-[#F7F3EE]/55">
                    Qty: {item.quantity} / {item.grind} / {item.weight}
                  </p>
                </div>
                <span className="font-semibold text-[#F7F3EE]">
                  ₹{Math.round(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
