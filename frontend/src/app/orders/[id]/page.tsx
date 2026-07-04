"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, Circle, Truck, Package, ShieldCheck } from "lucide-react";
import LinkNext from "next/link";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  grind: string;
  weight: string;
}

interface ShippingAddress {
  street: string;
  suburb: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  notes?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          router.push("/orders");
        }
      } catch (err) {
        console.error(err);
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  const steps = [
    { label: "Placed", key: "placed", desc: "Order details queued" },
    { label: "Confirmed", key: "confirmed", desc: "Roastery reservation locked" },
    { label: "Processing", key: "processing", desc: "Artisanal roasting in progress" },
    { label: "Shipped", key: "shipped", desc: "Dispatched via Air Express" },
    { label: "Delivered", key: "delivered", desc: "Arrived at destination" },
  ];

  const getStepIndex = (status: string) => {
    return steps.findIndex((s) => s.key === status);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  const currentStepIdx = getStepIndex(order.orderStatus);

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <LinkNext
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#6B4B7D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </LinkNext>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EADFCC]/50 pb-6">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-[#1C120D]">Order {order.orderId}</h1>
            <p className="text-xs text-[#5A3825]/85 mt-1 font-sans">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="block text-[10px] text-[#1C120D]/50 uppercase tracking-wider">Estimated Total</span>
            <span className="font-playfair text-2xl font-bold text-[#1C120D]">
              ₹{Math.round(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Status Timeline Progress Bar */}
        <div className="bg-[#FFFFFF] border border-[#EADFCC] p-6 rounded-sm space-y-6">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D]">Roastery Progress</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex flex-row sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  <div className="relative">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-[#6B4B7D]" />
                    ) : (
                      <Circle className="w-6 h-6 text-[#EADFCC] fill-[#F7F3EE]" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        isCurrent ? "text-[#6B4B7D]" : "text-[#1C120D]"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-[#5A3825]/60 mt-0.5 leading-snug">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Summary Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Shipping details (Left) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#EADFCC] p-6 rounded-sm space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] border-b border-[#EADFCC]/50 pb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#6B4B7D]" />
                Delivery Information
              </h3>
              <div className="text-xs text-[#5A3825]/90 space-y-1 font-sans">
                <p className="font-semibold text-[#1C120D]">Shipping Address:</p>
                <p>{order.shippingAddress.street}</p>
                {order.shippingAddress.suburb && <p>{order.shippingAddress.suburb}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2 font-mono text-[10px] text-[#1C120D]/60">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              {order.notes && (
                <div className="pt-2 border-t border-[#EADFCC]/50">
                  <p className="text-[10px] font-semibold text-[#1C120D] uppercase tracking-wider">Roastery Note:</p>
                  <p className="text-xs text-[#5A3825]/80 italic mt-0.5">&ldquo;{order.notes}&rdquo;</p>
                </div>
              )}
            </div>

            <div className="bg-[#FFFFFF] border border-[#EADFCC] p-6 rounded-sm space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] border-b border-[#EADFCC]/50 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6B4B7D]" />
                Payment Summary
              </h3>
              <div className="text-xs space-y-2 font-sans">
                <div className="flex justify-between">
                  <span className="text-[#5A3825]">Method:</span>
                  <span className="font-semibold text-[#1C120D] uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A3825]">Payment Status:</span>
                  <span
                    className={`font-semibold uppercase ${
                      order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Summary (Right) */}
          <div className="md:col-span-5 bg-[#FFFFFF] border border-[#EADFCC] p-6 rounded-sm space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] border-b border-[#EADFCC]/50 pb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#6B4B7D]" />
              Items Ordered
            </h3>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-[#EADFCC]/30 pb-3 last:border-b-0 last:pb-0">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#1C120D]">{item.name}</h4>
                    <p className="text-[10px] text-[#5A3825]/60">
                      Qty: {item.quantity} / {item.grind} / {item.weight}
                    </p>
                  </div>
                  <span className="font-semibold text-[#1C120D]">
                    ₹{Math.round(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
