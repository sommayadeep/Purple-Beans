"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("all");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, updates: { orderStatus?: string; paymentStatus?: string }) => {
    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Order status updated!", { id: toastId });
        loadOrders();
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

  const tabs = ["all", "placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  const filteredOrders = orders.filter((o) => {
    if (filterTab === "all") return true;
    return o.orderStatus === filterTab;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-wide">Orders Management</h1>
        <p className="text-xs text-[#F7F3EE]/60 mt-1 font-sans">
          Manage, verify, and update order statuses across all customer logs
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#5A3825]/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
              filterTab === tab
                ? "bg-[#6B4B7D] text-[#FFFFFF]"
                : "bg-[#1C120D] text-[#F7F3EE]/60 hover:text-[#F7F3EE]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#1C120D] border border-[#5A3825]/30 rounded-sm p-6">
        {filteredOrders.length === 0 ? (
          <p className="text-xs text-[#F7F3EE]/50 py-12 text-center">No orders matched the filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#5A3825]/30 text-[#F7F3EE]/40 uppercase tracking-wider font-semibold">
                  <th className="py-3 pr-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A3825]/20 text-[#F7F3EE]/80">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#5A3825]/10 transition-colors">
                    <td className="py-4 pr-4 font-mono font-bold text-[#F7F3EE]">
                      <Link href={`/admin/orders/${order.orderId}`} className="hover:underline">
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold">{order.user?.name || "Guest"}</p>
                        <p className="text-[10px] text-[#F7F3EE]/40 font-mono">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#F7F3EE]">₹{Math.round(order.totalAmount)}</td>
                    <td className="py-4 px-4 uppercase font-semibold text-[#F7F3EE]/60">{order.paymentMethod}</td>
                    <td className="py-4 px-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleStatusChange(order.orderId, { paymentStatus: e.target.value })}
                        className="bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-[10px] py-1 px-2 text-[#F7F3EE] focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.orderId, { orderStatus: e.target.value })}
                        className="bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-[10px] py-1 px-2 text-[#F7F3EE] focus:outline-none"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <Link
                        href={`/admin/orders/${order.orderId}`}
                        className="inline-flex items-center gap-1 hover:text-[#6B4B7D]"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
