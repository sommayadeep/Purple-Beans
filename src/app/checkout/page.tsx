"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, CreditCard, Lock, CheckCircle2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // Calculate price
  const totalPrice = getTotalPrice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);

    // Simulate luxury rapid payment processing gate
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const generatedId = `PB-${new Date().getFullYear()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      setOrderId(generatedId);
      clearCart();
    }, 2000);
  };

  // If order was placed successfully, show elegant minimal success confirmation screen
  if (isSuccess) {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] flex items-center justify-center py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#FFFFFF] border border-[#EADFCC] p-8 text-center space-y-6 shadow-xl rounded-sm"
        >
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-[#6B4B7D]/10 text-[#6B4B7D] animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#6B4B7D]">
              Order Confirmed
            </span>
            <h1 className="font-playfair text-2xl font-bold text-[#1C120D]">
              Thank you for your order
            </h1>
            <p className="text-xs text-[#5A3825]/80 leading-relaxed">
              Your sensory coffee lot is now registered for roasting. A confirmation email has been dispatched with tracking metrics.
            </p>
          </div>

          <div className="bg-[#F7F3EE] p-4 border border-[#EADFCC]/50 rounded-sm text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#5A3825]">Order Reference:</span>
              <span className="font-bold text-[#1C120D]">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A3825]">Status:</span>
              <span className="font-semibold text-[#6B4B7D]">Queueing for Roast</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A3825]">Delivery:</span>
              <span className="text-[#1C120D]">Complimentary Air Express (2-3 Days)</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="w-full block py-3.5 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-sm"
            >
              Continue Selection
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#6B4B7D] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel Checkout
        </Link>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Checkout Form Form (Left) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-1">
              <h1 className="font-playfair text-3xl font-bold text-[#1C120D]">
                Shipping & Details
              </h1>
              <p className="text-xs text-[#5A3825]/85">
                Ensure shipping address is accurate to preserve fresh roast transit schedules.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Contact */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D]">
                  Contact Information
                </h3>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address for notifications"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-[#FFFFFF] border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                  required
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D]">
                  Shipping Address
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3.5 bg-[#FFFFFF] border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-3.5 bg-[#FFFFFF] border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address line (Street, Apt)"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3.5 bg-[#FFFFFF] border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3.5 bg-[#FFFFFF] border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3.5 bg-[#FFFFFF] border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Payment Card Details */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#6B4B7D]" />
                  Secure Payment Method
                </h3>
                
                <div className="border border-[#EADFCC] rounded-sm p-4 bg-[#FFFFFF] space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#5A3825]/60 pb-2 border-b border-[#EADFCC]/50">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#6B4B7D]" />
                      SSL Encryption Secured
                    </span>
                    <span className="font-semibold text-[#1C120D]">Cards Accepted</span>
                  </div>
                  
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#F7F3EE]/40 border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM / YY"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#F7F3EE]/40 border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                      required
                    />
                    <input
                      type="text"
                      name="cardCvc"
                      placeholder="CVC"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#F7F3EE]/40 border border-[#EADFCC] focus:border-[#6B4B7D] rounded-sm text-sm placeholder-[#5A3825]/40 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Action */}
              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full py-4 bg-[#5A3825] hover:bg-[#6B4B7D] disabled:bg-[#5A3825]/50 text-[#FFFFFF] text-sm uppercase tracking-wider font-semibold rounded-sm transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? "Processing Vault Payment..." : `Authorize Purchase • $${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Cart items Summary Panel (Right) */}
          <div className="lg:col-span-5 p-6 bg-[#FFFFFF]/60 border border-[#EADFCC] rounded-sm space-y-6 lg:sticky lg:top-28">
            <h3 className="font-playfair text-lg font-bold text-[#1C120D] pb-3 border-b border-[#EADFCC] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6B4B7D]" />
              Order Summary
            </h3>

            {items.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#5A3825]/60">
                No coffee selections in your cart.
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.grind}-${item.weight}`}
                    className="flex justify-between items-center text-xs border-b border-[#EADFCC]/30 pb-3"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-[#EADFCC]">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1C120D] line-clamp-1">{item.product.name}</h4>
                        <span className="text-[10px] text-[#5A3825]/60 block mt-0.5">
                          Qty: {item.quantity} / {item.grind} / {item.weight}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#1C120D]">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 text-xs text-[#5A3825] border-t border-[#EADFCC]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C120D]">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Roastery Air Freight</span>
                <span className="uppercase font-semibold text-[#6B4B7D] tracking-wider">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1C120D] pt-2 border-t border-[#EADFCC]/50">
                <span>Estimated Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
