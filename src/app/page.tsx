"use client";

import { useState, useEffect, useCallback } from "react";

// ── TYPES ────────────────────────────────────────────────────────────
type Page =
  | "home" | "products" | "product-detail" | "categories"
  | "cart" | "wishlist" | "checkout" | "login" | "register"
  | "forgot" | "profile" | "orders" | "admin";

type AdminTab = "overview" | "products" | "orders" | "users" | "analytics" | "vendors";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  cat: string;
  icon: string;
  badge?: "sale" | "new" | "hot";
  rating: string;
}

interface Category {
  name: string;
  icon: string;
  count: string;
}

interface CartItem {
  name: string;
  variant: string;
  price: number;
  icon: string;
}

interface Toast {
  id: number;
  msg: string;
  type: string;
}

// ── DATA ─────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, name: "AirPods Pro (2nd Gen)", brand: "Apple", price: 24990, oldPrice: 26900, cat: "Electronics", icon: "🎧", badge: "sale", rating: "★★★★★" },
  { id: 2, name: "Nike Air Max 270", brand: "Nike", price: 12995, cat: "Fashion", icon: "👟", badge: "hot", rating: "★★★★☆" },
  { id: 3, name: "MacBook Air M3", brand: "Apple", price: 99900, cat: "Electronics", icon: "💻", badge: "new", rating: "★★★★★" },
  { id: 4, name: "Clean Code", brand: "Robert Martin", price: 650, cat: "Books", icon: "📚", rating: "★★★★☆" },
  { id: 5, name: "Ergonomic Chair", brand: "Herman Miller", price: 129999, oldPrice: 149999, cat: "Home", icon: "🛋️", badge: "sale", rating: "★★★★★" },
  { id: 6, name: "PS5 DualSense", brand: "Sony", price: 5990, cat: "Gaming", icon: "🎮", badge: "new", rating: "★★★★★" },
  { id: 7, name: "Yoga Mat Pro", brand: "Lululemon", price: 6800, cat: "Sports", icon: "🧘", rating: "★★★★☆" },
  { id: 8, name: "Vitamin C Serum", brand: "The Ordinary", price: 950, cat: "Beauty", icon: "🧴", badge: "hot", rating: "★★★★★" },
];

const CATS: Category[] = [
  { name: "Electronics", icon: "📱", count: "8,420 products" },
  { name: "Fashion", icon: "👗", count: "12,800 products" },
  { name: "Home & Garden", icon: "🏡", count: "6,340 products" },
  { name: "Sports", icon: "⚽", count: "4,200 products" },
  { name: "Books", icon: "📚", count: "22,000 products" },
  { name: "Beauty", icon: "💄", count: "5,600 products" },
  { name: "Gaming", icon: "🎮", count: "3,100 products" },
  { name: "Toys", icon: "🧸", count: "2,800 products" },
];

const CART_ITEMS_DATA: CartItem[] = [
  { name: "AirPods Pro (2nd Gen)", variant: "White", price: 24990, icon: "🎧" },
  { name: "Nike Air Max 270", variant: "Size 10", price: 12995, icon: "👟" },
  { name: "Clean Code", variant: "Paperback", price: 650, icon: "📚" },
];

const REV_DATA = [62, 78, 54, 91, 84, 72, 96];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CAT_DATA = [
  { name: "Electronics", pct: 38, color: "#1a1916" },
  { name: "Fashion", pct: 28, color: "#c9a227" },
  { name: "Home", pct: 18, color: "#1a5fa8" },
  { name: "Sports", pct: 10, color: "#2d7a4f" },
  { name: "Other", pct: 6, color: "#b0ae9f" },
];
const TOP_PRODS = [
  { n: "AirPods Pro", v: 82 }, { n: "Nike Air Max", v: 64 },
  { n: "MacBook Air", v: 58 }, { n: "PS5 DualSense", v: 41 }, { n: "Yoga Mat", v: 33 },
];
const TRAFFIC = [
  { s: "Organic", v: 44 }, { s: "Direct", v: 28 }, { s: "Social", v: 16 },
  { s: "Email", v: 8 }, { s: "Paid", v: 4 },
];

const formatINR = (value: number) => value.toLocaleString("en-IN");

const REVIEW_COUNTS: Record<number, number> = {
  1: 2847, 2: 1432, 3: 981, 4: 456, 5: 2103, 6: 3421, 7: 789, 8: 1654,
};

// ── MAIN COMPONENT ───────────────────────────────────────────────────
export default function Page() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const [cartCount, setCartCount] = useState(3);
  const [qty, setQty] = useState(1);
  const [pdpThumb, setPdpThumb] = useState("🎧");
  const [activeVariant, setActiveVariant] = useState("White");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchVal, setSearchVal] = useState("");
  const [productsCount, setProductsCount] = useState(48);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((msg: string, type = "") => {
    const id = toastId + 1;
    setToastId(id);
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, [toastId]);

  const addToCart = () => {
    setCartCount((c) => c + 1);
    showToast("Added to cart! 🛒", "success");
  };

  const addToWishlist = () => showToast("Saved to wishlist ♡", "success");

  const handleSearch = (val: string) => {
    setSearchVal(val);
    setProductsCount(val ? Math.floor(Math.random() * 20 + 5) : 48);
  };

  const doLogin = () => {
    showToast("Welcome back! 👋", "success");
    navigate("home");
  };

  // ── SUB-COMPONENTS ───────────────────────────────────────────────

  const ProductCard = ({ p }: { p: Product }) => (
    <div
      className="product-card"
      onClick={() => navigate("product-detail")}
      style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden", cursor: "pointer", transition: "all .2s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
    >
      <div style={{ aspectRatio: "1", background: "var(--c-surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative", overflow: "hidden" }}>
        {p.icon}
        {p.badge && (
          <div style={{ position: "absolute", top: 10, left: 10, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: p.badge === "sale" ? "var(--c-accent2)" : p.badge === "new" ? "var(--c-text)" : "var(--c-gold)", color: "#fff" }}>
            {p.badge.toUpperCase()}
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--c-muted)", marginBottom: 4 }}>{p.brand}</div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, lineHeight: 1.35 }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>₹{formatINR(p.price)}</span>
          {p.oldPrice && <span style={{ fontSize: 12, color: "var(--c-muted)", textDecoration: "line-through" }}>₹{formatINR(p.oldPrice)}</span>}
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: "var(--c-gold)" }}>{p.rating} <span style={{ color: "var(--c-muted)" }}>({REVIEW_COUNTS[p.id] ?? 500})</span></div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button
            style={{ flex: 1, padding: "7px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: "var(--c-text)", color: "#fff", fontFamily: "var(--font-body)", transition: "all .15s" }}
            onClick={(e) => { e.stopPropagation(); addToCart(); }}
          >Add to Cart</button>
          <button
            style={{ flex: "0 0 36px", padding: "7px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "var(--c-surface2)", color: "var(--c-text)", border: "1px solid var(--c-border)", fontFamily: "var(--font-body)" }}
            onClick={(e) => { e.stopPropagation(); addToWishlist(); }}
          >♡</button>
        </div>
      </div>
    </div>
  );

  const CatCard = ({ c }: { c: Category }) => (
    <div
      style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: "24px 20px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}
      onClick={() => navigate("products")}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
      <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 4 }}>{c.count}</div>
    </div>
  );

  // ── HOME PAGE ────────────────────────────────────────────────────
  const HomePage = () => (
    <div>
      {/* Hero */}
      <div style={{ background: "var(--c-text)", color: "#fff", padding: "80px 48px 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 70% 50%, #2d2923 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--c-gold)", fontWeight: 600, marginBottom: 20 }}>Multi-vendor marketplace</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 600, marginBottom: 20 }}>
            Shop smarter,<br />Live <em style={{ fontStyle: "normal", color: "var(--c-accent2)" }}>better</em>
          </h1>
          <p style={{ color: "#a09e98", fontSize: 16, maxWidth: 460, lineHeight: 1.7, marginBottom: 36 }}>Discover thousands of products from verified vendors. Premium quality, guaranteed.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate("products")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "#fff", color: "var(--c-text)", transition: "all .15s" }}>Browse Products →</button>
            <button onClick={() => navigate("categories")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)", transition: "all .15s" }}>Explore Categories</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
            {["⚡ Free shipping ₹75+", "🔒 Secure payments", "↩️ 30-day returns", "⭐ Verified vendors"].map((tag) => (
              <span key={tag} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#b0ae9f" }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 36, marginTop: 36, flexWrap: "wrap" }}>
            {[["48K+", "Products"], ["1,200+", "Vendors"], ["850K", "Customers"], ["4.9★", "Avg rating"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#7a7870", marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Featured Products</div>
            <div style={{ color: "var(--c-muted)", fontSize: 14, marginTop: 4 }}>Handpicked by our team</div>
          </div>
          <button onClick={() => navigate("products")} style={{ fontSize: 13, color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none" }}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: 48, background: "var(--c-surface)", borderTop: "1px solid var(--c-border)", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Shop by Category</div>
        <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 24 }}>Find exactly what you need</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {CATS.slice(0, 6).map((c) => <CatCard key={c.name} c={c} />)}
        </div>
      </div>

      {/* Trending */}
      <div style={{ padding: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Trending Now</div>
            <div style={{ color: "var(--c-muted)", fontSize: 14, marginTop: 4 }}>What everyone&apos;s buying this week</div>
          </div>
          <button onClick={() => navigate("products")} style={{ fontSize: 13, color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none" }}>See more →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {PRODUCTS.slice(4, 8).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );

  // ── PRODUCTS PAGE ─────────────────────────────────────────────────
  const ProductsPage = () => (
    <div>
      <Breadcrumb items={[{ label: "Home", page: "home" }, { label: "Products" }]} />
      <div style={{ padding: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>All Products</div>
            <div style={{ color: "var(--c-muted)", fontSize: 14 }}>Showing {productsCount} products{searchVal ? ` for "${searchVal}"` : ""}</div>
          </div>
          <select onChange={(e) => showToast(`Sorted by: ${e.target.value}`)} style={{ padding: "7px 12px", border: "1px solid var(--c-border)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 13, background: "var(--c-surface)", cursor: "pointer", outline: "none" }}>
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
            <option>Best Rating</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r)", marginBottom: 20 }}>
          <span style={{ color: "var(--c-muted)" }}>🔍</span>
          <input type="text" placeholder="Search products, brands, categories..." value={searchVal} onChange={(e) => handleSearch(e.target.value)} style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: 14, background: "transparent", color: "var(--c-text)" }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--c-muted)", fontWeight: 600 }}>Filter:</span>
          {["All", "Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty", "Under ₹50", "On Sale 🔥"].map((f) => (
            <div
              key={f}
              onClick={() => { setActiveFilter(f); showToast(`Filtered: ${f}`); }}
              style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${activeFilter === f ? "var(--c-text)" : "var(--c-border)"}`, background: activeFilter === f ? "var(--c-text)" : "var(--c-surface)", color: activeFilter === f ? "#fff" : "var(--c-text)", transition: "all .15s" }}
            >{f}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {PRODUCTS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 32 }}>
          {["‹", "1", "2", "3", "4", "…", "12", "›"].map((b, i) => (
            <button key={i} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--c-border)", background: b === "1" ? "var(--c-text)" : "var(--c-surface)", color: b === "1" ? "#fff" : "var(--c-text)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>{b}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PRODUCT DETAIL ────────────────────────────────────────────────
  const ProductDetailPage = () => {
    const thumbs = ["🎧", "📦", "🔌", "📋"];
    return (
      <div>
        <Breadcrumb items={[{ label: "Home", page: "home" }, { label: "Products", page: "products" }, { label: "AirPods Pro" }]} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, padding: 48 }}>
          <div>
            <div style={{ background: "var(--c-surface2)", borderRadius: "var(--r-lg)", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100, marginBottom: 12, border: "1px solid var(--c-border)" }}>{pdpThumb}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {thumbs.map((t) => (
                <div key={t} onClick={() => setPdpThumb(t)} style={{ background: "var(--c-surface2)", borderRadius: 8, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, cursor: "pointer", border: `2px solid ${pdpThumb === t ? "var(--c-text)" : "transparent"}`, transition: "border-color .15s" }}>{t}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--c-muted)", fontWeight: 600 }}>Apple</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.5 }}>AirPods Pro (2nd Gen)</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--c-gold)", fontSize: 14 }}>★★★★★</span>
              <span style={{ fontSize: 12, color: "var(--c-muted)" }}>4.9 (2,847 reviews)</span>
              <span style={{ fontSize: 11, color: "var(--c-success)", fontWeight: 600 }}>✓ In stock</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 800 }}>₹24,990 <span style={{ fontSize: 16, color: "var(--c-muted)", textDecoration: "line-through", fontWeight: 400, fontFamily: "var(--font-body)" }}>₹26,900</span></div>
            <p style={{ color: "var(--c-muted)", lineHeight: 1.7, fontSize: 14 }}>Active Noise Cancellation up to 2x more powerful. Adaptive Transparency. Personalized Spatial Audio with dynamic head tracking. Up to 30 hours total listening time with case.</p>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Color</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["White", "Space Gray"].map((v) => (
                  <button key={v} onClick={() => setActiveVariant(v)} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${activeVariant === v ? "var(--c-text)" : "var(--c-border)"}`, fontSize: 13, cursor: "pointer", background: activeVariant === v ? "var(--c-text)" : "var(--c-surface)", color: activeVariant === v ? "#fff" : "var(--c-text)", transition: "all .15s", fontFamily: "var(--font-body)" }}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Quantity</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px 0 0 8px" }}>−</button>
                  <div style={{ width: 48, height: 36, border: "1px solid var(--c-border)", borderLeft: "none", borderRight: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{qty}</div>
                  <button onClick={() => setQty((q) => q + 1)} style={{ width: 36, height: 36, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 8px 8px 0" }}>+</button>
                </div>
                <span style={{ fontSize: 12, color: "var(--c-muted)" }}>Only 8 left</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={addToCart} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff" }}>🛒 Add to Cart</button>
              <button onClick={addToWishlist} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", background: "transparent", border: "1.5px solid var(--c-text)", color: "var(--c-text)" }}>♡ Wishlist</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["Free shipping", "30-day returns", "Secure checkout", "Price match guarantee"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-muted)" }}>
                  <span style={{ fontWeight: 700, color: "var(--c-success)" }}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: 48, borderTop: "1px solid var(--c-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Related Products</div>
            <button onClick={() => navigate("products")} style={{ fontSize: 13, color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none" }}>View all</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {PRODUCTS.slice(3, 7).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </div>
    );
  };

  // ── CATEGORIES PAGE ───────────────────────────────────────────────
  const CategoriesPage = () => (
    <div>
      <Breadcrumb items={[{ label: "Home", page: "home" }, { label: "Categories" }]} />
      <div style={{ padding: 48 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>All Categories</div>
        <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 24 }}>Explore our full product range</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {CATS.map((c) => <CatCard key={c.name} c={c} />)}
        </div>
      </div>
    </div>
  );

  // ── CART PAGE ─────────────────────────────────────────────────────
  const CartPage = () => (
    <div>
      <Breadcrumb items={[{ label: "Home", page: "home" }, { label: "Cart" }]} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, padding: "32px 48px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Your Cart ({cartCount})</h2>
            <button style={{ fontSize: 13, color: "var(--c-muted)", fontWeight: 600, cursor: "pointer", border: "none", background: "none" }}>Clear all</button>
          </div>
          {CART_ITEMS_DATA.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 16, padding: 16, background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r)", marginBottom: 12, alignItems: "center" }}>
              <div style={{ background: "var(--c-surface2)", borderRadius: 8, width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "var(--c-muted)" }}>{item.variant}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button onClick={() => showToast("Quantity updated")} style={{ width: 28, height: 28, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", borderRadius: "8px 0 0 8px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <div style={{ width: 36, height: 28, border: "1px solid var(--c-border)", borderLeft: "none", borderRight: "none", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13 }}>1</div>
                    <button onClick={() => showToast("Quantity updated")} style={{ width: 28, height: 28, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", borderRadius: "0 8px 8px 0", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <button onClick={() => showToast("Removed from cart", "warning")} style={{ background: "none", border: "none", fontSize: 12, color: "var(--c-accent2)", cursor: "pointer", fontWeight: 600 }}>Remove</button>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>₹{formatINR(item.price)}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 24, position: "sticky", top: "calc(var(--nav-h) + 20px)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="text" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--c-border)", borderRadius: 8, fontFamily: "var(--font-body)", fontSize: 13, background: "var(--c-surface2)", outline: "none" }} />
              <button onClick={() => showToast("Promo applied!", "success")} style={{ padding: "9px 14px", background: "var(--c-surface2)", border: "1px solid var(--c-border)", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)" }}>Apply</button>
            </div>
            {[["Subtotal (3 items)", "₹38,635"], ["Shipping", <span key="ship" style={{ color: "var(--c-success)" }}>Free</span>], ["Tax (8%)", "₹3,090.80"], [<span key="promo" style={{ color: "var(--c-accent2)" }}>Promo (SAVE10)</span>, <span key="promoamt" style={{ color: "var(--c-accent2)" }}>−₹3,863.50</span>]].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12 }}><span>{row[0]}</span><span>{row[1]}</span></div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, borderTop: "1px solid var(--c-border)", paddingTop: 14 }}><span>Total</span><span>₹37,862.30</span></div>
            <button onClick={() => navigate("checkout")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff", marginTop: 16 }}>Checkout →</button>
            <button onClick={() => navigate("products")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", background: "transparent", border: "1.5px solid var(--c-text)", color: "var(--c-text)", marginTop: 8 }}>Continue Shopping</button>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--c-muted)", marginBottom: 8 }}>Secure payment</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: 18 }}>💳 🔒 ✅</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── WISHLIST PAGE ─────────────────────────────────────────────────
  const WishlistPage = () => (
    <div>
      <Breadcrumb items={[{ label: "Home", page: "home" }, { label: "Wishlist" }]} />
      <div style={{ padding: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>My Wishlist</div>
            <div style={{ color: "var(--c-muted)", fontSize: 14, marginTop: 4 }}>4 items saved</div>
          </div>
          <button style={{ fontSize: 13, color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none" }}>Share wishlist</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );

  // ── CHECKOUT PAGE ─────────────────────────────────────────────────
  const CheckoutPage = () => (
    <div>
      <Breadcrumb items={[{ label: "Home", page: "home" }, { label: "Cart", page: "cart" }, { label: "Checkout" }]} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, padding: "32px 48px" }}>
        <div>
          <div style={{ display: "flex", gap: 0, marginBottom: 28, borderRadius: "var(--r)", overflow: "hidden", border: "1px solid var(--c-border)" }}>
            {[["✓ Cart", "done"], ["2. Shipping", "active"], ["3. Payment", ""], ["4. Review", ""]].map(([label, state]) => (
              <div key={label} style={{ flex: 1, padding: "12px 16px", textAlign: "center", fontSize: 13, fontWeight: 600, background: state === "active" ? "var(--c-text)" : state === "done" ? "var(--c-surface2)" : "var(--c-surface)", color: state === "active" ? "#fff" : state === "done" ? "var(--c-success)" : "var(--c-muted)" }}>{label}</div>
            ))}
          </div>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Shipping Information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["First Name", "John"], ["Last Name", "Doe"]].map(([lbl, ph]) => (
                <div key={lbl}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{lbl}</label>
                  <input className="form-input" placeholder={ph} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--c-border)", borderRadius: "var(--r)", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--c-surface2)", color: "var(--c-text)", outline: "none" }} />
                </div>
              ))}
              {[["Address Line 1", "123 Main Street"], ["Address Line 2", "Apt, Suite, etc. (optional)"]].map(([lbl, ph]) => (
                <div key={lbl} style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{lbl}</label>
                  <input placeholder={ph} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--c-border)", borderRadius: "var(--r)", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--c-surface2)", color: "var(--c-text)", outline: "none" }} />
                </div>
              ))}
              {[["City", "New York"], ["ZIP Code", "10001"], ["State", "NY"], ["Phone", "+1 (555) 000-0000"]].map(([lbl, ph]) => (
                <div key={lbl}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{lbl}</label>
                  <input placeholder={ph} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--c-border)", borderRadius: "var(--r)", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--c-surface2)", color: "var(--c-text)", outline: "none" }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Shipping Method</div>
              {[["Standard (3-5 days) — FREE", "₹0", true], ["Express (1-2 days)", "₹499", false]].map(([label, price, checked]) => (
                <label key={label as string} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: `${checked ? "1.5px solid var(--c-text)" : "1px solid var(--c-border)"}`, borderRadius: 8, cursor: "pointer", background: checked ? "var(--c-surface2)" : "transparent", marginBottom: 8 }}>
                  <input type="radio" name="ship" defaultChecked={checked as boolean} style={{ accentColor: "var(--c-text)" }} />
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{label as string}</span>
                  <span style={{ fontWeight: 700 }}>{price as string}</span>
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => navigate("cart")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", background: "var(--c-surface2)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}>← Back to Cart</button>
              <button onClick={() => showToast("Payment step coming!", "success")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff" }}>Continue to Payment →</button>
            </div>
          </div>
        </div>
        <div>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
            {[["🎧", "AirPods Pro 2nd Gen", "White · Qty 1", "₹24,990"], ["👟", "Nike Air Max 270", "Size 10 · Qty 1", "₹12,995"], ["📚", "Clean Code Book", "Paperback · Qty 1", "₹650"]].map(([icon, name, variant, price]) => (
              <div key={name as string} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div style={{ background: "var(--c-surface2)", borderRadius: 6, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon as string}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{name as string}</div><div style={{ fontSize: 11, color: "var(--c-muted)" }}>{variant as string}</div></div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{price as string}</div>
              </div>
            ))}
            {[["Subtotal", "₹38,635"], ["Shipping", <span key="s" style={{ color: "var(--c-success)" }}>Free</span>], ["Tax", "₹3,090.80"]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12 }}><span>{k}</span><span>{v}</span></div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, borderTop: "1px solid var(--c-border)", paddingTop: 14 }}><span>Total</span><span>₹41,725.80</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── AUTH PAGES ────────────────────────────────────────────────────
  const AuthCard = ({ children }: { children: React.ReactNode }) => (
    <div style={{ minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "var(--c-bg)" }}>
      <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 40, width: "100%", maxWidth: 420 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 6, textAlign: "center" }}>Cloud<span style={{ color: "var(--c-accent2)" }}>Cart</span></div>
        {children}
      </div>
    </div>
  );

  const FormInput = ({ label, type = "text", placeholder, defaultValue }: { label: string; type?: string; placeholder?: string; defaultValue?: string }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--c-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--c-border)", borderRadius: "var(--r)", fontFamily: "var(--font-body)", fontSize: 14, background: "var(--c-surface2)", color: "var(--c-text)", outline: "none" }} />
    </div>
  );

  const LoginPage = () => (
    <AuthCard>
      <div style={{ textAlign: "center", color: "var(--c-muted)", fontSize: 14, marginBottom: 32 }}>Sign in to your account</div>
      {[["G", "Continue with Google"], ["f", "Continue with Facebook"]].map(([icon, label]) => (
        <button key={label} style={{ width: "100%", padding: 10, border: "1.5px solid var(--c-border)", borderRadius: "var(--r)", background: "var(--c-surface)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}><span>{icon}</span>{label}</button>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0", color: "var(--c-muted)", fontSize: 12 }}>
        <div style={{ flex: 1, height: 1, background: "var(--c-border)" }} />or sign in with email<div style={{ flex: 1, height: 1, background: "var(--c-border)" }} />
      </div>
      <FormInput label="Email" type="email" placeholder="you@example.com" />
      <FormInput label="Password" type="password" placeholder="••••••••" />
      <button onClick={() => navigate("forgot")} style={{ display: "block", textAlign: "right", fontSize: 12, color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", background: "none", border: "none", width: "100%", marginTop: -8, marginBottom: 16 }}>Forgot password?</button>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-muted)", marginBottom: 16 }}>
        <input type="checkbox" defaultChecked style={{ accentColor: "var(--c-text)" }} /><span>Remember me for 30 days</span>
      </div>
      <button onClick={doLogin} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff" }}>Sign In →</button>
      <div style={{ fontSize: 13, color: "var(--c-muted)", textAlign: "center", marginTop: 16 }}>Don&apos;t have an account? <button onClick={() => navigate("register")} style={{ color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none", fontSize: 13 }}>Create one →</button></div>
    </AuthCard>
  );

  const RegisterPage = () => (
    <AuthCard>
      <div style={{ textAlign: "center", color: "var(--c-muted)", fontSize: 14, marginBottom: 32 }}>Create your free account</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormInput label="First Name" placeholder="John" />
        <FormInput label="Last Name" placeholder="Doe" />
      </div>
      <FormInput label="Email" type="email" placeholder="you@example.com" />
      <FormInput label="Password" type="password" placeholder="Min 8 characters" />
      <FormInput label="Confirm Password" type="password" placeholder="Repeat password" />
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--c-muted)", marginBottom: 16 }}>
        <input type="checkbox" style={{ accentColor: "var(--c-text)" }} />
        <span>I agree to the <a style={{ color: "var(--c-accent2)", cursor: "pointer" }}>Terms of Service</a> and <a style={{ color: "var(--c-accent2)", cursor: "pointer" }}>Privacy Policy</a></span>
      </div>
      <button onClick={() => { showToast("Account created!", "success"); navigate("home"); }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff" }}>Create Account →</button>
      <div style={{ fontSize: 13, color: "var(--c-muted)", textAlign: "center", marginTop: 16 }}>Already have an account? <button onClick={() => navigate("login")} style={{ color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none", fontSize: 13 }}>Sign in →</button></div>
    </AuthCard>
  );

  const ForgotPage = () => (
    <AuthCard>
      <div style={{ textAlign: "center", color: "var(--c-muted)", fontSize: 14, marginBottom: 32 }}>We&apos;ll send you a reset link</div>
      <FormInput label="Email Address" type="email" placeholder="you@example.com" />
      <button onClick={() => showToast("Reset email sent!", "success")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff", marginBottom: 16 }}>Send Reset Link →</button>
      <div style={{ fontSize: 13, color: "var(--c-muted)", textAlign: "center" }}><button onClick={() => navigate("login")} style={{ color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none", fontSize: 13 }}>← Back to Sign In</button></div>
    </AuthCard>
  );

  // ── PROFILE PAGE ──────────────────────────────────────────────────
  const ProfilePage = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, padding: "32px 48px" }}>
      <div>
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 24, textAlign: "center", marginBottom: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--c-text)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 auto 12px" }}>JD</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>John Doe</div>
          <div style={{ fontSize: 12, color: "var(--c-muted)", marginTop: 4 }}>john.doe@email.com</div>
          <div style={{ display: "inline-block", marginTop: 8, background: "var(--c-gold)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>⭐ Premium Member</div>
        </div>
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          {[["👤 Profile Settings", "profile", true], ["📦 Order History", "orders", false], ["📍 Addresses", null, false], ["♡ Wishlist", "wishlist", false], ["💳 Payment Methods", null, false], ["🔔 Notifications", null, false]].map(([label, page, active]) => (
            <div key={label as string} onClick={() => page && navigate(page as Page)} style={{ padding: "12px 16px", fontSize: 13.5, cursor: "pointer", borderBottom: "1px solid var(--c-border)", background: active ? "var(--c-surface2)" : "transparent", fontWeight: active ? 600 : 400, display: "flex", alignItems: "center", gap: 10 }}>{label as string}</div>
          ))}
          <div onClick={() => { showToast("Logged out", "warning"); navigate("login"); }} style={{ padding: "12px 16px", fontSize: 13.5, cursor: "pointer", color: "var(--c-accent2)", display: "flex", alignItems: "center", gap: 10 }}>← Sign Out</div>
        </div>
      </div>
      <div>
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Personal Information</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormInput label="First Name" defaultValue="John" />
            <FormInput label="Last Name" defaultValue="Doe" />
            <div style={{ gridColumn: "1 / -1" }}><FormInput label="Email" type="email" defaultValue="john.doe@email.com" /></div>
            <FormInput label="Phone" defaultValue="+1 (555) 123-4567" />
            <FormInput label="Date of Birth" type="date" defaultValue="1990-01-15" />
          </div>
          <button onClick={() => showToast("Profile updated!", "success")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff", marginTop: 8 }}>Save Changes</button>
        </div>
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Change Password</div>
          <FormInput label="Current Password" type="password" placeholder="••••••••" />
          <FormInput label="New Password" type="password" placeholder="••••••••" />
          <FormInput label="Confirm New Password" type="password" placeholder="••••••••" />
          <button onClick={() => showToast("Password updated!", "success")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff", marginTop: 8 }}>Update Password</button>
        </div>
      </div>
    </div>
  );

  // ── ORDERS PAGE ───────────────────────────────────────────────────
  const OrdersPage = () => (
    <div>
      <Breadcrumb items={[{ label: "Home", page: "home" }, { label: "Account", page: "profile" }, { label: "Orders" }]} />
      <div style={{ padding: 48 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>Order History</div>
        <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 24 }}>Track and manage your orders</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r)", marginBottom: 16 }}>
          <span style={{ color: "var(--c-muted)" }}>🔍</span>
          <input placeholder="Search by order number, product..." style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: 14, background: "transparent" }} />
        </div>
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Order #", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--c-muted)", fontWeight: 600, padding: "8px 12px", borderBottom: "2px solid var(--c-border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["#CM-10482", "May 10, 2026", "AirPods Pro, Nike Shoes", "₹37,985", "delivered", "Delivered"],
                ["#CM-10441", "Apr 28, 2026", "MacBook Pro Sleeve", "₹1,299", "delivered", "Delivered"],
                ["#CM-10391", "Apr 15, 2026", "Gaming Chair, Desk Mat", "₹1,36,799", "shipped", "Shipped"],
                ["#CM-10312", "Mar 30, 2026", "Protein Powder (2 items)", "₹4,499", "processing", "Processing"],
              ].map(([ord, date, items, total, statusKey, statusLabel]) => (
                <tr key={ord as string} style={{ transition: "background .15s" }}>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--c-border)", fontWeight: 600 }}>{ord as string}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--c-border)", fontSize: 13 }}>{date as string}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--c-border)", fontSize: 13 }}>{items as string}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--c-border)", fontWeight: 700 }}>{total as string}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--c-border)" }}><StatusPill status={statusKey as string} label={statusLabel as string} /></td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--c-border)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => showToast(`Order ${ord} viewed`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>View</button>
                      <button onClick={() => showToast(`Action on ${ord}`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{statusKey === "processing" ? "Cancel" : statusKey === "shipped" ? "Track" : "Reorder"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── ADMIN DASHBOARD ───────────────────────────────────────────────
  const AdminPage = () => {
    const maxRev = Math.max(...REV_DATA);
    return (
      <div style={{ display: "flex", minHeight: "calc(100vh - var(--nav-h))" }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: "var(--c-text)", padding: "24px 16px", position: "sticky", top: "var(--nav-h)", height: "calc(100vh - var(--nav-h))", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 28, paddingLeft: 8 }}>Cloud<span style={{ color: "var(--c-accent2)" }}>Cart</span> <span style={{ fontSize: 11, color: "#7a7870", fontWeight: 500 }}>Admin</span></div>
          {[
            { section: "Main", links: [{ icon: "📊", label: "Overview", tab: "overview" }, { icon: "📈", label: "Analytics", tab: "analytics" }] },
            { section: "Commerce", links: [{ icon: "📦", label: "Products", tab: "products" }, { icon: "🛒", label: "Orders", tab: "orders" }, { icon: "🏪", label: "Vendors", tab: "vendors" }] },
            { section: "Users", links: [{ icon: "👥", label: "Customers", tab: "users" }] },
            { section: "Settings", links: [{ icon: "⚙️", label: "Settings", tab: null }, { icon: "🏠", label: "View Store", tab: null }] },
          ].map(({ section, links }) => (
            <div key={section} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "#7a7870", fontWeight: 600, padding: "0 8px", marginBottom: 8 }}>{section}</div>
              {links.map(({ icon, label, tab }) => (
                <div key={label} onClick={() => tab ? setAdminTab(tab as AdminTab) : (label === "View Store" && navigate("home"))} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13.5, color: adminTab === tab ? "#fff" : "#b0ae9f", background: adminTab === tab ? "rgba(255,255,255,0.12)" : "transparent", marginBottom: 2, transition: "all .15s" }}>
                  <span style={{ fontSize: 15, opacity: adminTab === tab ? 1 : 0.7 }}>{icon}</span>{label}
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
          {/* Overview */}
          {adminTab === "overview" && (
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Dashboard Overview</div>
              <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 32 }}>Welcome back, Admin. Here&apos;s what&apos;s happening today.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[["Total Revenue", "₹84,240", "↑ 12.4% vs last month", true], ["Orders Today", "342", "↑ 8.1% vs yesterday", true], ["Active Users", "12,841", "↑ 3.2% this week", true], ["Avg Order Value", "₹246", "↓ 1.8% vs last month", false]].map(([lbl, val, chg, up]) => (
                  <div key={lbl as string} style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20 }}>
                    <div style={{ fontSize: 12, color: "var(--c-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{lbl as string}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800 }}>{val as string}</div>
                    <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600, color: up ? "var(--c-success)" : "var(--c-accent2)" }}>{chg as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
                <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>Revenue (Last 7 Days) <span style={{ fontSize: 12, color: "var(--c-muted)", fontWeight: 400 }}>₹84K total</span></div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                    {REV_DATA.map((v, i) => (
                      <div key={i} title={`₹${v}K`} style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "var(--c-surface2)", height: `${Math.round(v / maxRev * 100)}%`, minHeight: 4, cursor: "pointer", transition: "background .2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-text)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--c-surface2)")}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    {DAYS.map((d) => <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--c-muted)" }}>{d}</div>)}
                  </div>
                </div>
                <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>Orders by Category <span style={{ fontSize: 12, color: "var(--c-muted)", fontWeight: 400 }}>This month</span></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {CAT_DATA.map((c) => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 80, fontSize: 12, color: "var(--c-muted)" }}>{c.name}</div>
                        <div style={{ flex: 1, background: "var(--c-surface2)", borderRadius: 4, height: 10, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 4, transition: "width .5s" }} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, minWidth: 28 }}>{c.pct}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <AdminOrdersTable />
            </div>
          )}

          {/* Products */}
          {adminTab === "products" && (
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Product Management</div>
              <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 20 }}>Add, edit and manage your catalog</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r)" }}>
                  <span style={{ color: "var(--c-muted)" }}>🔍</span>
                  <input placeholder="Search products..." style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: 14, background: "transparent" }} />
                </div>
                <button onClick={() => showToast("Product form ready", "success")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: "var(--r)", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", border: "none", background: "var(--c-text)", color: "#fff" }}>+ Add Product</button>
              </div>
              <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map((h) => <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--c-muted)", fontWeight: 600, padding: "8px 12px", borderBottom: "2px solid var(--c-border)" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[["🎧", "AirPods Pro 2nd Gen", "APL-AIP-02", "Electronics", "₹24,990", "In Stock (48)", "active", "Active"],
                      ["👟", "Nike Air Max 270", "NK-AM270", "Fashion", "₹12,995", "In Stock (122)", "active", "Active"],
                      ["💻", "MacBook Air M3", "APL-MBA-M3", "Electronics", "₹99,900", "Low Stock (3)", "warning", "Active"],
                      ["🎮", "PS5 DualSense Controller", "SNY-DS5", "Gaming", "₹5,990", "Out of Stock", "warning", "Draft"],
                      ["🛋️", "Ergonomic Chair Pro", "HOME-EC01", "Home", "₹1,29,999", "In Stock (15)", "active", "Active"],
                    ].map(([icon, name, sku, cat, price, stock, stockType, status]) => (
                      <tr key={name as string}>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 20 }}>{icon as string}</span><span style={{ fontWeight: 600 }}>{name as string}</span></div></td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 12, color: "var(--c-muted)" }}>{sku as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 13 }}>{cat as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontWeight: 700 }}>{price as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 13, color: stockType === "active" ? "var(--c-success)" : "var(--c-accent2)" }}>{stock as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}><StatusPill status={status === "Active" ? "delivered" : "processing"} label={status as string} /></td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => showToast(`Editing ${name}`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Edit</button>
                            <button onClick={() => showToast(`Deleted ${name}`, "warning")} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fcd0c7", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "var(--c-accent2)" }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {adminTab === "orders" && (
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Order Management</div>
              <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 20 }}>Process and track all orders</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {["All Orders (1,248)", "Processing (84)", "Shipped (231)", "Delivered (889)", "Cancelled (44)"].map((f, i) => (
                  <div key={f} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${i === 0 ? "var(--c-text)" : "var(--c-border)"}`, background: i === 0 ? "var(--c-text)" : "var(--c-surface)", color: i === 0 ? "#fff" : "var(--c-text)" }}>{f}</div>
                ))}
              </div>
              <AdminOrdersTable full />
            </div>
          )}

          {/* Users */}
          {adminTab === "users" && (
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Customer Management</div>
              <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 20 }}>View and manage user accounts</div>
              <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Customer", "Email", "Joined", "Orders", "Spent", "Status", "Actions"].map((h) => <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--c-muted)", fontWeight: 600, padding: "8px 12px", borderBottom: "2px solid var(--c-border)" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[["SJ", "Sarah Johnson", "sarah.j@email.com", "Jan 2025", "12", "₹2,48,000", "Active"],
                      ["MR", "Mike Reynolds", "mike.r@email.com", "Mar 2025", "5", "₹89,000", "Active"],
                      ["EL", "Emma Liu", "emma.l@email.com", "Feb 2026", "2", "₹24,800", "Pending"],
                    ].map(([initials, name, email, joined, orders, spent, status]) => (
                      <tr key={name as string}>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--c-surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{initials as string}</div>
                            <span>{name as string}</span>
                          </div>
                        </td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 12, color: "var(--c-muted)" }}>{email as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 13 }}>{joined as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>{orders as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontWeight: 600 }}>{spent as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}><StatusPill status={status === "Active" ? "delivered" : "processing"} label={status as string} /></td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => showToast(`Viewing ${name}`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>View</button>
                            <button onClick={() => showToast(`${name} banned`, "warning")} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fcd0c7", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "var(--c-accent2)" }}>Ban</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics */}
          {adminTab === "analytics" && (
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Analytics Dashboard</div>
              <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 32 }}>Deep insights into your store performance</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[["Conversion Rate", "3.8%", "↑ 0.4% vs last month", true], ["Avg. Session", "4m 22s", "↑ 12% engagement", true], ["Cart Abandon Rate", "68%", "↑ 2% — needs work", false], ["Return Customers", "41%", "↑ 5% loyalty", true]].map(([lbl, val, chg, up]) => (
                  <div key={lbl as string} style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20 }}>
                    <div style={{ fontSize: 12, color: "var(--c-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{lbl as string}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800 }}>{val as string}</div>
                    <div style={{ fontSize: 12, marginTop: 6, fontWeight: 600, color: up ? "var(--c-success)" : "var(--c-accent2)" }}>{chg as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Products</div>
                  {TOP_PRODS.map((p) => (
                    <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 100, fontSize: 12, color: "var(--c-muted)" }}>{p.n}</div>
                      <div style={{ flex: 1, background: "var(--c-surface2)", borderRadius: 4, height: 8 }}>
                        <div style={{ height: "100%", width: `${p.v}%`, background: "var(--c-text)", borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{p.v}%</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Traffic Sources</div>
                  {TRAFFIC.map((t) => (
                    <div key={t.s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 60, fontSize: 12, color: "var(--c-muted)" }}>{t.s}</div>
                      <div style={{ flex: 1, background: "var(--c-surface2)", borderRadius: 4, height: 8 }}>
                        <div style={{ height: "100%", width: `${t.v}%`, background: "var(--c-gold)", borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{t.v}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vendors */}
          {adminTab === "vendors" && (
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Vendor Management</div>
              <div style={{ color: "var(--c-muted)", fontSize: 14, marginBottom: 20 }}>Manage your marketplace vendors</div>
              <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Vendor", "Category", "Products", "Sales", "Commission", "Status", "Actions"].map((h) => <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--c-muted)", fontWeight: 600, padding: "8px 12px", borderBottom: "2px solid var(--c-border)" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[["TechGadgets Inc.", "Electronics", "248", "₹42,800", "8%", "Verified"],
                      ["FashionHub Co.", "Fashion", "1,240", "₹28,400", "12%", "Verified"],
                      ["HomeStyle Store", "Home & Garden", "380", "₹18,200", "10%", "Pending"],
                    ].map(([name, cat, prods, sales, comm, status]) => (
                      <tr key={name as string}>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontWeight: 600 }}>{name as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 13 }}>{cat as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>{prods as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontWeight: 600 }}>{sales as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>{comm as string}</td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}><StatusPill status={status === "Verified" ? "delivered" : "processing"} label={status as string} /></td>
                        <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>
                          <div style={{ display: "flex", gap: 4 }}>
                            {status === "Pending" ? (
                              <>
                                <button onClick={() => showToast(`${name} approved`, "success")} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Approve</button>
                                <button onClick={() => showToast(`${name} rejected`, "warning")} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #fcd0c7", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "var(--c-accent2)" }}>Reject</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => showToast(`Viewing ${name}`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>View</button>
                                <button onClick={() => showToast(`Editing ${name}`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Edit</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── SHARED COMPONENTS ─────────────────────────────────────────────
  const StatusPill = ({ status, label }: { status: string; label: string }) => {
    const styles: Record<string, React.CSSProperties> = {
      delivered: { background: "#d7f0e5", color: "#1a6040" },
      processing: { background: "#fef3cd", color: "#8a6000" },
      shipped: { background: "#dbeafe", color: "#1e40af" },
      cancelled: { background: "#fde8e8", color: "#9b1c1c" },
    };
    return <span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 99, fontSize: 11, fontWeight: 600, ...(styles[status.toLowerCase()] || styles.processing) }}>{label}</span>;
  };

  const Breadcrumb = ({ items }: { items: { label: string; page?: Page }[] }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--c-muted)", padding: "16px 48px 0" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "var(--c-border)" }}>/</span>}
          <span onClick={() => item.page && navigate(item.page)} style={{ cursor: item.page ? "pointer" : "default" }}>{item.label}</span>
        </span>
      ))}
    </div>
  );

  const AdminOrdersTable = ({ full }: { full?: boolean }) => (
    <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, overflowX: "auto" }}>
      {!full && <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>Recent Orders <button onClick={() => setAdminTab("orders")} style={{ fontSize: 13, color: "var(--c-accent2)", fontWeight: 600, cursor: "pointer", border: "none", background: "none" }}>View all →</button></div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>{["Order #", "Customer", full ? "Date" : "Products", full ? "Amount" : "Amount", full ? "Payment" : "Status", full ? "Fulfillment" : "Status", "Actions"].slice(0, full ? 7 : 6).map((h, i) => <th key={i} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--c-muted)", fontWeight: 600, padding: "8px 12px", borderBottom: "2px solid var(--c-border)" }}>{h}</th>)}</tr></thead>
        <tbody>
          {[
            ["#CM-10499", "Sarah J.", "May 13", "iPhone Case, AirPods", "₹25,789", "processing", "Processing"],
            ["#CM-10498", "Mike R.", "May 12", "Nike Air Max 270", "₹12,995", "shipped", "Shipped"],
            ["#CM-10497", "Emma L.", "May 11", "Yoga Mat, Dumbbells", "₹8,290", "delivered", "Delivered"],
            ["#CM-10496", "David K.", "May 10", "Gaming Headset", "₹4,999", "cancelled", "Cancelled"],
          ].map(([ord, cust, date, prods, amt, statusKey, statusLabel]) => (
            <tr key={ord as string}>
              <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontWeight: 600 }}>{ord as string}</td>
              <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>{cust as string}</td>
              {full && <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 13 }}>{date as string}</td>}
              {!full && <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 13 }}>{prods as string}</td>}
              <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontWeight: 700 }}>{amt as string}</td>
              {full && <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)", fontSize: 13, color: statusKey === "cancelled" ? "var(--c-accent2)" : "var(--c-success)" }}>{statusKey === "cancelled" ? "↩ Refund" : "✓ Paid"}</td>}
              <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}><StatusPill status={statusKey as string} label={statusLabel as string} /></td>
              <td style={{ padding: 12, borderBottom: "1px solid var(--c-border)" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => showToast(`Order ${ord} viewed`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>View</button>
                  <button onClick={() => showToast(`Action on ${ord}`)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--c-border)", background: "var(--c-surface)", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{statusKey === "processing" ? "Ship" : statusKey === "shipped" ? "Track" : statusKey === "cancelled" ? "Refund" : "Invoice"}</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ── PAGE MAP ──────────────────────────────────────────────────────
  const pages: Record<Page, React.ReactNode> = {
    home: <HomePage />,
    products: <ProductsPage />,
    "product-detail": <ProductDetailPage />,
    categories: <CategoriesPage />,
    cart: <CartPage />,
    wishlist: <WishlistPage />,
    checkout: <CheckoutPage />,
    login: <LoginPage />,
    register: <RegisterPage />,
    forgot: <ForgotPage />,
    profile: <ProfilePage />,
    orders: <OrdersPage />,
    admin: <AdminPage />,
  };

  // ── RENDER ────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        :root {
          --c-bg: #f9f8f6;
          --c-surface: #ffffff;
          --c-surface2: #f3f2ef;
          --c-border: #e8e6e1;
          --c-text: #1a1916;
          --c-muted: #6b6963;
          --c-accent: #1a1916;
          --c-accent2: #e8533a;
          --c-gold: #c9a227;
          --c-success: #2d7a4f;
          --c-info: #1a5fa8;
          --nav-h: 58px;
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --r: 10px;
          --r-lg: 16px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-body); background: var(--c-bg); color: var(--c-text); font-size: 14px; }

        .page-enter { animation: fadeIn .25s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .toast-enter { animation: slideUp .3s ease; }

        input::placeholder { color: #b0ae9f; }
        input:focus { border-color: var(--c-text) !important; background: var(--c-surface) !important; }

        @media (max-width: 640px) {
          .admin-sidebar-mobile { display: none !important; }
        }
      `}</style>

      {/* Banner */}
      <div style={{ background: "var(--c-accent2)", color: "#fff", textAlign: "center", padding: 10, fontSize: 13, fontWeight: 600 }}>
        🎉 Free shipping on orders over ₹75 — <button onClick={() => navigate("products")} style={{ color: "rgba(255,255,255,0.85)", textDecoration: "underline", cursor: "pointer", border: "none", background: "none", fontSize: 13, fontWeight: 600 }}>Shop now →</button>
      </div>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 100, height: "var(--nav-h)", background: "rgba(249,248,246,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", padding: "0 24px", gap: 8 }}>
        <div onClick={() => navigate("home")} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, marginRight: 8, cursor: "pointer" }}>
          Cloud<span style={{ color: "var(--c-accent2)" }}>Cart</span>
        </div>
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {(["home", "products", "categories", "admin"] as Page[]).map((p) => (
            <button key={p} onClick={() => navigate(p)} style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13.5, color: currentPage === p ? "#fff" : "var(--c-muted)", transition: "all .15s", fontWeight: 500, border: "none", background: currentPage === p ? "var(--c-text)" : "none", textTransform: "capitalize" }}>{p === "admin" ? "Dashboard" : p}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => navigate("wishlist")} style={{ padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", border: "1px solid var(--c-border)", background: "var(--c-surface)" }}>♡ Wishlist</button>
          <button onClick={() => navigate("cart")} style={{ padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", border: "1px solid var(--c-border)", background: "var(--c-surface)", position: "relative" }}>
            🛒 Cart <span style={{ position: "absolute", top: -4, right: -4, background: "var(--c-accent2)", color: "#fff", fontSize: 10, borderRadius: 99, padding: "1px 5px", fontWeight: 700 }}>{cartCount}</span>
          </button>
          <button onClick={() => navigate("profile")} style={{ padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", border: "1px solid var(--c-border)", background: "var(--c-surface)" }}>👤 Account</button>
          <button onClick={() => navigate("login")} style={{ padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)", border: "1px solid var(--c-text)", background: "var(--c-text)", color: "#fff" }}>Sign in</button>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ marginTop: 0, minHeight: "calc(100vh - var(--nav-h))" }}>
        <div key={currentPage} className="page-enter">
          {pages[currentPage]}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--c-text)", color: "#b0ae9f", padding: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Cloud<span style={{ color: "var(--c-accent2)" }}>Cart</span></div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#7a7870" }}>The modern multi-vendor marketplace for the cloud era. Discover, buy, and sell with confidence.</p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#e0dcd5", marginBottom: 16 }}>Shop</div>
            {[["All Products", "products"], ["Categories", "categories"], ["New Arrivals", null], ["Deals", null]].map(([label, page]) => (
              <div key={label as string} onClick={() => page && navigate(page as Page)} style={{ display: "block", fontSize: 13, color: "#7a7870", marginBottom: 8, cursor: page ? "pointer" : "default" }}>{label as string}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#e0dcd5", marginBottom: 16 }}>Account</div>
            {[["My Profile", "profile"], ["Orders", "orders"], ["Wishlist", "wishlist"], ["Sign In", "login"]].map(([label, page]) => (
              <div key={label as string} onClick={() => navigate(page as Page)} style={{ display: "block", fontSize: 13, color: "#7a7870", marginBottom: 8, cursor: "pointer" }}>{label as string}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#e0dcd5", marginBottom: 16 }}>Company</div>
            {["About Us", "Careers", "Contact", "Privacy Policy"].map((label) => (
              <div key={label} style={{ display: "block", fontSize: 13, color: "#7a7870", marginBottom: 8 }}>{label}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2d2923", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#4a4844" }}>© 2026 CloudCart. All rights reserved.</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🔒 SSL Secured", "☁️ AWS Powered", "✅ SOC 2"].map((b) => (
              <span key={b} style={{ background: "#2d2923", border: "1px solid #3d3b35", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#7a7870" }}>{b}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* Toasts */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast-enter" style={{ background: t.type === "success" ? "#1a5a35" : t.type === "warning" ? "#8a5800" : "var(--c-text)", color: "#fff", padding: "12px 18px", borderRadius: "var(--r)", fontSize: 13.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, pointerEvents: "all", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", maxWidth: 320 }}>
            <span>{t.type === "success" ? "✓" : t.type === "warning" ? "⚠" : "ℹ"}</span>{t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
