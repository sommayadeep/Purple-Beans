"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotalPrice, getTotalItems } =
    useCartStore();

  const handleClose = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-[#1C120D] backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#F7F3EE] shadow-2xl flex flex-col border-l border-[#EADFCC]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#EADFCC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#6B4B7D]" />
                <h2 className="font-playfair text-xl font-semibold text-[#1C120D]">
                  Your Selection ({getTotalItems()})
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full text-[#5A3825] hover:bg-[#EADFCC] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-[#EADFCC] text-[#6B4B7D]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-[#1C120D]">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-[#5A3825] mt-1">
                      Begin your sensory coffee journey by exploring our collection.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-6 py-2.5 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-sm uppercase tracking-wider rounded-sm transition-all duration-300"
                  >
                    Browse Blends
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.grind}-${item.weight}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-4 border-b border-[#EADFCC]/50 pb-6 last:border-b-0"
                  >
                    {/* Image Preview */}
                    <div className="relative w-20 h-20 bg-[#EADFCC] rounded-sm overflow-hidden flex-shrink-0 border border-[#EADFCC]">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-playfair text-sm font-semibold text-[#1C120D] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-sm font-semibold text-[#1C120D]">
₹{Math.round(item.product.price * item.quantity)}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B4B7D] mt-0.5">
                          {item.grind} / {item.weight}
                        </p>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#EADFCC] rounded-sm bg-[#FFFFFF]">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.grind,
                                item.weight,
                                item.quantity - 1
                              )
                            }
                            className="p-1 hover:bg-[#F7F3EE] text-[#5A3825] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-[#1C120D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.grind,
                                item.weight,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-[#F7F3EE] text-[#5A3825] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.grind, item.weight)
                          }
                          className="text-xs text-[#5A3825] hover:text-[#6B4B7D] underline transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-[#EADFCC] border-t border-[#EADFCC]">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-[#5A3825]">
                    <span>Shipping</span>
                    <span className="uppercase tracking-wider">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-playfair text-base font-semibold text-[#1C120D]">
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#1C120D]">
₹{Math.round(getTotalPrice())}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={handleClose}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#5A3825] hover:bg-[#6B4B7D] text-[#FFFFFF] text-sm uppercase tracking-wider font-semibold rounded-sm transition-all duration-300 shadow-md group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full text-center mt-3 text-xs text-[#5A3825] hover:text-[#6B4B7D] transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
