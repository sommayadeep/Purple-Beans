"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, CreditCard, Lock, CheckCircle2, ShoppingBag, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LocationPicker from "@/components/ui/LocationPicker";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

interface Address {
  road: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface SavedAddress {
  label: string;
  street: string;
  suburb?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay");
  const [address, setAddress] = useState<Address>({
    road: "",
    suburb: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
  });
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | "new">("new");
  const [addressLabel, setAddressLabel] = useState("Home");
  const [saveAddress, setSaveAddress] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent("/checkout")}`);
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const loadSavedAddresses = async () => {
      try {
        const res = await fetch("/api/me/addresses", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success) {
          const addresses = data.addresses || [];
          setSavedAddresses(addresses);
          if (data.phone) setPhone(data.phone);

          const defaultIndex = addresses.findIndex((savedAddress: SavedAddress) => savedAddress.isDefault);
          const indexToUse = defaultIndex >= 0 ? defaultIndex : addresses.length > 0 ? 0 : "new";

          if (indexToUse !== "new") {
            setSelectedAddressIndex(indexToUse);
            const savedAddress = addresses[indexToUse];
            setAddress({
              road: savedAddress.street,
              suburb: savedAddress.suburb || "",
              city: savedAddress.city,
              state: savedAddress.state,
              postcode: savedAddress.postalCode,
              country: savedAddress.country,
            });
            setAddressLabel(savedAddress.label || "Home");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadSavedAddresses();
  }, [status]);

  const selectSavedAddress = (index: number | "new") => {
    setSelectedAddressIndex(index);
    if (index === "new") {
      setAddress({
        road: "",
        suburb: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      });
      setAddressLabel("Home");
      setSaveAddress(true);
      return;
    }

    const savedAddress = savedAddresses[index];
    setAddress({
      road: savedAddress.street,
      suburb: savedAddress.suburb || "",
      city: savedAddress.city,
      state: savedAddress.state,
      postcode: savedAddress.postalCode,
      country: savedAddress.country,
    });
    setAddressLabel(savedAddress.label || "Home");
    setSaveAddress(false);
  };

  const totalPrice = getTotalPrice();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!address.road || !address.city || !address.state || !address.postcode || !address.country) {
      toast.error("Please fill in all required shipping address fields");
      return;
    }

    if (!phone) {
      toast.error("Phone number is required");
      return;
    }

    if (!turnstileToken) {
      toast.error("Please complete the security check");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing order...");

    try {
      // 1. Verify Turnstile
      const turnstileRes = await fetch("/api/turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        toast.error("Security verification failed. Please refresh.", { id: toastId });
        setIsProcessing(false);
        return;
      }

      const formattedAddress = {
        label: addressLabel,
        street: address.road,
        suburb: address.suburb,
        city: address.city,
        state: address.state,
        postalCode: address.postcode,
        country: address.country,
        phone,
      };

      if (paymentMethod === "cod") {
        // COD Direct order creation
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              grind: item.grind,
              weight: item.weight,
            })),
            shippingAddress: formattedAddress,
            paymentMethod: "cod",
            notes,
            saveAddress,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData.error || "Failed to place order");
        }

        setOrderId(orderData.order.orderId);
        setIsSuccess(true);
        clearCart();
        toast.success("Order placed successfully!", { id: toastId });
      } else {
        // Razorpay Payment flow
        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
          throw new Error("Razorpay SDK failed to load. Are you offline?");
        }

        // Initialize Razorpay order on backend
        const payRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice }),
        });

        const payData = await payRes.json();
        if (!payRes.ok) {
          throw new Error(payData.error || "Failed to create payment order");
        }

        if (!payData.keyId) {
          throw new Error("Razorpay public key is missing from the payment order");
        }

        const options = {
          key: payData.keyId,
          amount: payData.order.amount,
          currency: payData.order.currency,
          name: "Purple Beans",
          description: "Luxury Coffee Purchase",
          order_id: payData.order.id,
          handler: async function (response: any) {
            toast.loading("Verifying transaction...", { id: toastId });

            // Create order first
            const orderRes = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: items.map((item) => ({
                  productId: item.product.id,
                  name: item.product.name,
                  quantity: item.quantity,
                  grind: item.grind,
                  weight: item.weight,
                })),
                shippingAddress: formattedAddress,
                paymentMethod: "razorpay",
                notes,
                razorpayOrderId: payData.order.id,
                saveAddress,
              }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) {
              toast.error(orderData.error || "Failed to create order trace", { id: toastId });
              setIsProcessing(false);
              return;
            }

            // Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.order.orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setOrderId(orderData.order.orderId);
              setIsSuccess(true);
              clearCart();
              toast.success("Payment verified and order placed!", { id: toastId });
            } else {
              toast.error(verifyData.error || "Payment verification failed", { id: toastId });
            }
            setIsProcessing(false);
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            contact: phone,
          },
          theme: {
            color: "#6B4B7D",
          },
          modal: {
            ondismiss: function () {
              toast.dismiss(toastId);
              toast.error("Payment modal closed");
              setIsProcessing(false);
            },
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Checkout failed", { id: toastId });
      setIsProcessing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen bg-[#F7F3EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

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
              Your premium B2B coffee shipment has been registered. You can monitor its preparation progress in the dashboard.
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
              <span className="text-[#5A3825]">Payment Mode:</span>
              <span className="text-[#1C120D] uppercase font-semibold">{paymentMethod}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href="/orders"
              className="w-full block py-3.5 bg-[#6B4B7D] hover:bg-[#5A3825] text-[#FFFFFF] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-sm"
            >
              Track Order
            </Link>
            <Link
              href="/shop"
              className="w-full block py-3.5 border border-[#EADFCC] text-[#1C120D] hover:bg-[#F7F3EE] text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300"
            >
              Back to Collections
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F3EE] pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#6B4B7D] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel Checkout
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-1">
              <h1 className="font-playfair text-3xl font-bold text-[#1C120D]">
                Shipping & B2B Purchase
              </h1>
              <p className="text-xs text-[#5A3825]/85">
                Authenticated session for {session?.user?.email}. Double check addresses for precise fresh roast logistics.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Contact info (Prefilled or User Entered) */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] border-b border-[#EADFCC]/50 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
                      Billing Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-[#F7F3EE]/50 border border-[#EADFCC]/60 rounded-sm text-sm text-[#1C120D]/70 outline-none"
                      value={session?.user?.name || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] border-b border-[#EADFCC]/50 pb-2">
                  Delivery Address
                </h3>

                {savedAddresses.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {savedAddresses.map((savedAddress, index) => (
                      <button
                        key={`${savedAddress.street}-${savedAddress.postalCode}-${index}`}
                        type="button"
                        onClick={() => selectSavedAddress(index)}
                        className={`text-left p-4 border rounded-sm transition-all cursor-pointer ${
                          selectedAddressIndex === index
                            ? "border-[#6B4B7D] bg-[#6B4B7D]/5"
                            : "border-[#EADFCC] bg-[#FFFFFF]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1C120D]">
                            {savedAddress.label || "Saved Address"}
                          </span>
                          {savedAddress.isDefault && (
                            <span className="text-[10px] uppercase tracking-wider text-[#6B4B7D] font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-[#5A3825]/80 leading-relaxed">
                          {savedAddress.street}
                          {savedAddress.suburb ? `, ${savedAddress.suburb}` : ""}, {savedAddress.city}, {savedAddress.state} - {savedAddress.postalCode}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-[#5A3825]/60 mt-1">
                          {savedAddress.country}
                        </p>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => selectSavedAddress("new")}
                      className={`text-left p-4 border rounded-sm transition-all cursor-pointer ${
                        selectedAddressIndex === "new"
                          ? "border-[#6B4B7D] bg-[#6B4B7D]/5"
                          : "border-[#EADFCC] bg-[#FFFFFF]"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1C120D]">
                        New Address
                      </span>
                      <p className="mt-2 text-xs text-[#5A3825]/80">
                        Add another delivery location for this order.
                      </p>
                    </button>
                  </div>
                )}

                {selectedAddressIndex === "new" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
                        Address Label
                      </label>
                      <input
                        type="text"
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
                        placeholder="Home, Office, Warehouse..."
                      />
                    </div>

                    <LocationPicker
                      onAddressSelected={(addr) => {
                        setAddress(addr);
                        setSaveAddress(true);
                      }}
                    />

                    <label className="flex items-center gap-2 text-xs text-[#5A3825]">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="accent-[#6B4B7D]"
                      />
                      Save this address for faster checkout next time
                    </label>
                  </div>
                )}

                {selectedAddressIndex !== "new" && (
                  <label className="flex items-center gap-2 text-xs text-[#5A3825]">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="accent-[#6B4B7D]"
                    />
                    Update my saved phone/address details after placing this order
                  </label>
                )}
              </div>

              {/* Internal Roastery Notes */}
              <div>
                <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
                  Roastery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
                  placeholder="Special roast requests, customized packaging, grinding details..."
                />
              </div>

              {/* Payment Select */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C120D] flex items-center gap-1.5 border-b border-[#EADFCC]/50 pb-2">
                  <CreditCard className="w-4 h-4 text-[#6B4B7D]" />
                  Secure Payment Method
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "razorpay"
                        ? "border-[#6B4B7D] bg-[#6B4B7D]/5 text-[#6B4B7D]"
                        : "border-[#EADFCC] bg-[#FFFFFF] text-[#1C120D]"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">UPI / Card / Netbanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 border rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#6B4B7D] bg-[#6B4B7D]/5 text-[#6B4B7D]"
                        : "border-[#EADFCC] bg-[#FFFFFF] text-[#1C120D]"
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Cash on Delivery</span>
                  </button>
                </div>
              </div>

              <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />

              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full py-4 bg-[#1C120D] hover:bg-[#6B4B7D] disabled:opacity-50 text-[#FFFFFF] text-sm uppercase tracking-wider font-bold rounded-sm transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Place Order • ₹${Math.round(totalPrice)}`
                )}
              </button>
            </form>
          </div>

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
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2.5 pt-4 text-xs text-[#5A3825] border-t border-[#EADFCC]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C120D]">₹{Math.round(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Roastery Air Freight</span>
                <span className="uppercase font-semibold text-[#6B4B7D] tracking-wider">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1C120D] pt-2 border-t border-[#EADFCC]/50">
                <span>Estimated Total</span>
                <span>₹{Math.round(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
