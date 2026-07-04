"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, Package } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  grind: string;
  weight: string;
}

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#1C120D]">My Orders</h1>
          <p className="text-xs text-[#5A3825]/85 mt-1 font-sans">
            Track and manage your premium roastery batches
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="border border-[#EADFCC] bg-[#FFFFFF]/50 rounded-sm p-12 text-center space-y-4">
            <Package className="w-12 h-12 text-[#6B4B7D]/60 mx-auto" />
            <h3 className="font-playfair text-lg font-bold text-[#1C120D]">No Orders Yet</h3>
            <p className="text-xs text-[#5A3825]/80 max-w-sm mx-auto">
              You haven&apos;t placed any premium coffee orders yet. Visit our roastery collections to make a selection.
            </p>
            <Link
              href="/shop"
              className="inline-block py-2.5 px-6 bg-[#1C120D] text-[#F7F3EE] hover:bg-[#6B4B7D] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#FFFFFF] border border-[#EADFCC] p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#1C120D]">{order.orderId}</span>
                    <span className="text-[10px] text-[#1C120D]/50 font-sans">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`px-2 py-0.5 border rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="text-xs text-[#5A3825]/80 space-y-1">
                    <p className="font-semibold text-[#1C120D]">
                      {order.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
                    </p>
                    <p className="text-[10px]">
                      Payment: <span className="uppercase font-semibold">{order.paymentMethod}</span> (
                      {order.paymentStatus})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-[#EADFCC]/50">
                  <div className="text-left md:text-right">
                    <span className="block text-[10px] text-[#1C120D]/50 uppercase tracking-wider">Total</span>
                    <span className="font-playfair text-lg font-bold text-[#1C120D]">
                      ₹{Math.round(order.totalAmount)}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${order.orderId}`}
                    className="flex items-center gap-1.5 py-2 px-4 border border-[#EADFCC] hover:bg-[#F7F3EE] text-xs font-semibold uppercase tracking-wider text-[#1C120D] rounded-sm transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
