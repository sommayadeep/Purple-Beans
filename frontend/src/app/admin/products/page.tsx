"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Edit, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  productId: string;
  name: string;
  price: number;
  description: string;
  category: string;
  roastLevel: string;
  origin: string;
  stockQuantity: number;
  isActive: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Single Origin");
  const [roastLevel, setRoastLevel] = useState("Medium");
  const [origin, setOrigin] = useState("");
  const [stockQuantity, setStockQuantity] = useState(100);
  const [image, setImage] = useState("/purple-beans/coffee1.png");

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !name || price <= 0 || !origin) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading("Adding product to catalog...");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name,
          price,
          description,
          longDescription: description, // fallback
          category,
          roastLevel,
          origin,
          stockQuantity,
          image,
          notes: ["Sweet", "Fruity"], // placeholder tags
          reviews: [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product added!", { id: toastId });
        setShowAddForm(false);
        // Reset fields
        setProductId("");
        setName("");
        setPrice(0);
        setDescription("");
        setOrigin("");
        loadProducts();
      } else {
        throw new Error(data.error || "Failed to add product");
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleToggleActive = async (id: string, currentlyActive: boolean) => {
    const toastId = toast.loading("Saving configuration...");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentlyActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Product visibility updated!", { id: toastId });
        loadProducts();
      } else {
        throw new Error(data.error || "Failed to update product status");
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#6B4B7D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-3xl font-bold tracking-wide">Products Catalog</h1>
          <p className="text-xs text-[#F7F3EE]/60 mt-1 font-sans">
            Add new roasted micro-lots and manage quantities in stock
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 py-2.5 px-4 bg-[#6B4B7D] hover:bg-[#5A3825] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <form onSubmit={handleAddProduct} className="bg-[#1C120D] border border-[#5A3825]/30 p-6 rounded-sm space-y-6">
          <h3 className="font-playfair text-lg font-bold border-b border-[#5A3825]/20 pb-2">New Micro-Lot Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/55 mb-1">Product ID (Unique)</label>
              <input
                type="text"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="e.g. signature-espresso"
                className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/55 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ethiopian Yirgacheffe"
                className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/55 mb-1">Price (₹ INR)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/55 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
              >
                <option value="Single Origin">Single Origin</option>
                <option value="Espresso Blends">Espresso Blends</option>
                <option value="Signature">Signature</option>
                <option value="Cold Brew">Cold Brew</option>
                <option value="Dark Roasts">Dark Roasts</option>
                <option value="Decaf">Decaf</option>
                <option value="Everyday">Everyday</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/55 mb-1">Roast level</label>
              <input
                type="text"
                required
                value={roastLevel}
                onChange={(e) => setRoastLevel(e.target.value)}
                placeholder="e.g. Medium Light"
                className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/55 mb-1">Country of Origin</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Colombia"
                className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs py-2 px-3 text-[#F7F3EE]"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] uppercase tracking-wider text-[#F7F3EE]/55 mb-1">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write roastery profile notes, aroma descriptions..."
                className="w-full bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-xs p-3 text-[#F7F3EE] min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#6B4B7D] hover:bg-[#5A3825] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2.5 px-6 border border-[#5A3825]/45 hover:bg-[#5A3825]/20 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Catalog Table */}
      <div className="bg-[#1C120D] border border-[#5A3825]/30 rounded-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#5A3825]/30 text-[#F7F3EE]/40 uppercase tracking-wider font-semibold">
                <th className="py-3 pr-4">Code / ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Stock Qty</th>
                <th className="py-3 px-4">Active Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A3825]/20 text-[#F7F3EE]/80">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-[#5A3825]/10 transition-colors">
                  <td className="py-4 pr-4 font-mono font-bold text-[#F7F3EE]">{product.productId}</td>
                  <td className="py-4 px-4 font-semibold">{product.name}</td>
                  <td className="py-4 px-4 font-bold text-[#F7F3EE]">₹{Math.round(product.price)}</td>
                  <td className="py-4 px-4">{product.category}</td>
                  <td className="py-4 px-4">{product.origin}</td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      defaultValue={product.stockQuantity}
                      onBlur={(e) => handleUpdateStock(product.productId, Number(e.target.value))}
                      className="w-16 bg-[#120A07] border border-[#5A3825]/40 rounded-sm text-center py-1 text-xs text-[#F7F3EE]"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(product.productId, product.isActive)}
                      className="text-[#F7F3EE] hover:opacity-80 cursor-pointer"
                    >
                      {product.isActive ? (
                        <ToggleRight className="w-6 h-6 text-[#6B4B7D]" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-[#F7F3EE]/40" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
