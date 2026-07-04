"use client";

import { useEffect, useState } from "react";
import { Coffee, TrendingUp, ShoppingBag, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

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

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => o.paymentStatus === "paid" ? sum + o.totalAmount : sum, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "placed" || o.orderStatus === "confirmed").length;
  const processingOrders = orders.filter((o) => o.orderStatus === "processing" || o.orderStatus === "shipped").length;
  const completedOrders = orders.filter((o) => o.orderStatus === "delivered").length;

  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: "Roastery Revenue (Paid)", value: `₹${Math.round(totalRevenue).toLocaleString("en-IN")}`, icon: TrendingUp, desc: "Cumulative prepaid + settled orders" },
    { label: "New / Confirmed", value: pendingOrders, icon: ShoppingBag, desc: "Pending roast batch allocation" },
    { label: "In Process / Transit", value: processingOrders, icon: Coffee, desc: "Roasting or with delivery logistics" },
    { label: "Delivered Batches", value: completedOrders, icon: CheckCircle, desc: "Delivered to customers" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-wide">Admin Overview</h1>
        <p className="text-xs text-[#F7F3EE]/60 mt-1 font-sans">
          Real-time roastery operations tracking metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#1C120D] border border-[#5A3825]/30 p-6 rounded-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-[#F7F3EE]/55">{stat.label}</span>
                <Icon className="w-5 h-5 text-[#6B4B7D]" />
              </div>
              <p className="text-3xl font-playfair font-bold text-[#F7F3EE]">{stat.value}</p>
              <p className="text-[10px] text-[#F7F3EE]/40 font-sans leading-tight">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#1C120D] border border-[#5A3825]/30 rounded-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#5A3825]/20 pb-4">
          <div>
            <h3 className="font-playfair text-lg font-bold">Recent Incoming Batches</h3>
            <p className="text-[10px] text-[#F7F3EE]/50 mt-0.5">Most recent order placement updates</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs text-[#6B4B7D] hover:text-[#F7F3EE] font-semibold uppercase tracking-wider transition-colors"
          >
            Manage All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-[#F7F3EE]/50 py-8 text-center">No orders registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#5A3825]/30 text-[#F7F3EE]/40 uppercase tracking-wider font-semibold">
                  <th className="py-3 pr-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A3825]/20 text-[#F7F3EE]/80">
                {recentOrders.map((order) => (
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
                    <td className="py-4 px-4 text-[#F7F3EE]/50">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#F7F3EE]">₹{Math.round(order.totalAmount)}</td>
                    <td className="py-4 px-4 uppercase font-semibold text-[#F7F3EE]/60">{order.paymentMethod}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] uppercase font-bold tracking-wide text-[#6B4B7D]">
                        {order.orderStatus}
                      </span>
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
