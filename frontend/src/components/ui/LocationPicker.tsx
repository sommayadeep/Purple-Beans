"use client";

import { useState } from "react";
import { MapPin, Navigation, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Address {
  road: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  raw?: string;
}

interface LocationPickerProps {
  onAddressSelected: (address: Address) => void;
  initialAddress?: Address;
}

export default function LocationPicker({ onAddressSelected, initialAddress }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>(
    initialAddress || {
      road: "",
      suburb: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
    }
  );

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    toast.loading("Detecting your location...", { id: "geo" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/location?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (data.success && data.address) {
            setAddress(data.address);
            onAddressSelected(data.address);
            toast.success("Location auto-filled!", { id: "geo" });
          } else {
            throw new Error(data.error || "Failed to retrieve address details");
          }
        } catch (error: any) {
          console.error(error);
          toast.error("Unable to get address details. Please enter manually.", { id: "geo" });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setLoading(false);
        toast.error("Location access denied or timed out. Please enter manually.", { id: "geo" });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...address, [name]: value };
    setAddress(updated);
    onAddressSelected(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#EADFCC]/50">
        <h3 className="text-sm font-semibold tracking-wider text-[#1C120D] uppercase font-sans">
          Shipping Address
        </h3>
        <button
          type="button"
          onClick={detectLocation}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#6B4B7D] hover:text-[#5A3825] transition-colors uppercase tracking-wider disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          Detect My Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
            Street Address / Road
          </label>
          <input
            type="text"
            name="road"
            value={address.road}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
            placeholder="Apartment, suite, street name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
            Suburb / Area
          </label>
          <input
            type="text"
            name="suburb"
            value={address.suburb}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
            placeholder="Suburb, neighborhood or sector"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
            State / Region
          </label>
          <input
            type="text"
            name="state"
            value={address.state}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
            placeholder="State"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
            Postal / ZIP Code
          </label>
          <input
            type="text"
            name="postcode"
            value={address.postcode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
            placeholder="PIN / Postcode"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[#1C120D]/60 uppercase tracking-wider mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={address.country}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 bg-transparent border border-[#EADFCC] rounded-sm text-sm text-[#1C120D] focus:border-[#6B4B7D] focus:outline-none transition-colors"
            placeholder="Country"
          />
        </div>
      </div>
    </div>
  );
}
