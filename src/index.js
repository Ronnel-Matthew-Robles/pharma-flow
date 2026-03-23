import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { useState, useEffect, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────
const CUSTOMERS = [
  { id: 1, name: "PhilHealth Regional Office IV-A", tin: "001-234-567-000", agent: "Maria Santos", address: "Quezon City" },
  { id: 2, name: "Ospital ng Maynila", tin: "002-345-678-000", agent: "Juan Dela Cruz", address: "Manila" },
  { id: 3, name: "Gov. Crisanta T. David Hospital", tin: "003-456-789-000", agent: "Maria Santos", address: "Taguig" },
  { id: 4, name: "Sta. Rosa Community Hospital", tin: "004-567-890-000", agent: "Pedro Reyes", address: "Sta. Rosa, Laguna" },
  { id: 5, name: "Calamba Medical Center", tin: "005-678-901-000", agent: "Juan Dela Cruz", address: "Calamba, Laguna" },
  { id: 6, name: "Batangas Provincial Hospital", tin: "006-789-012-000", agent: "Pedro Reyes", address: "Batangas City" },
];

const PRODUCTS = [
  { id: 1, name: "Amoxicillin 500mg", brand: "Amoxil", unit: "box", category: "oral", cost: 120, price: 180, qty: 450, batch: "AMX-2025-001", expiry: "2026-12-15" },
  { id: 2, name: "Paracetamol 500mg", brand: "Biogesic", unit: "box", category: "oral", cost: 45, price: 72, qty: 1200, batch: "PCM-2025-003", expiry: "2027-03-20" },
  { id: 3, name: "Losartan 50mg", brand: "Lifezar", unit: "box", category: "oral", cost: 210, price: 320, qty: 280, batch: "LSR-2025-002", expiry: "2026-08-10" },
  { id: 4, name: "Metformin 500mg", brand: "Glucophage", unit: "box", category: "oral", cost: 95, price: 155, qty: 380, batch: "MTF-2025-001", expiry: "2026-06-05" },
  { id: 5, name: "Insulin Glargine", brand: "Lantus", unit: "vial", category: "injectable", cost: 1800, price: 2400, qty: 45, batch: "INS-2025-004", expiry: "2026-04-18" },
  { id: 6, name: "Ceftriaxone 1g", brand: "Rocephin", unit: "vial", category: "injectable", cost: 380, price: 520, qty: 160, batch: "CFT-2025-002", expiry: "2026-09-25" },
  { id: 7, name: "Surgical Gloves (M)", brand: "Supermax", unit: "box", category: "medical_supply", cost: 280, price: 380, qty: 300, batch: "GLV-2025-005", expiry: "2028-01-01" },
  { id: 8, name: "IV Cannula 22G", brand: "BD", unit: "box", category: "medical_supply", cost: 450, price: 620, qty: 200, batch: "IVC-2025-003", expiry: "2027-11-30" },
  { id: 9, name: "Omeprazole 20mg", brand: "Losec", unit: "box", category: "oral", cost: 160, price: 245, qty: 520, batch: "OMP-2025-001", expiry: "2026-05-12" },
  { id: 10, name: "Salbutamol Nebule", brand: "Ventolin", unit: "box", category: "oral", cost: 85, price: 135, qty: 680, batch: "SLB-2025-002", expiry: "2026-10-08" },
];

const INVOICES = [
  { id: 1, si: "SI-2026-0001", customer: "PhilHealth Regional Office IV-A", date: "2026-02-15", total: 48600, paid: 48600, status: "paid", agent: "Maria Santos" },
  { id: 2, si: "SI-2026-0002", customer: "Ospital ng Maynila", date: "2026-02-20", total: 125400, paid: 80000, status: "partial", agent: "Juan Dela Cruz" },
  { id: 3, si: "SI-2026-0003", customer: "Gov. Crisanta T. David Hospital", date: "2026-02-01", total: 67200, paid: 0, status: "overdue", agent: "Maria Santos" },
  { id: 4, si: "SI-2026-0004", customer: "Sta. Rosa Community Hospital", date: "2026-03-05", total: 34500, paid: 0, status: "open", agent: "Pedro Reyes" },
  { id: 5, si: "SI-2026-0005", customer: "Calamba Medical Center", date: "2026-01-10", total: 89700, paid: 20000, status: "overdue", agent: "Juan Dela Cruz" },
  { id: 6, si: "SI-2026-0006", customer: "Batangas Provincial Hospital", date: "2026-03-01", total: 52300, paid: 0, status: "open", agent: "Pedro Reyes" },
  { id: 7, si: "SI-2026-0007", customer: "PhilHealth Regional Office IV-A", date: "2026-01-20", total: 178000, paid: 100000, status: "overdue", agent: "Maria Santos" },
  { id: 8, si: "SI-2026-0008", customer: "Ospital ng Maynila", date: "2026-03-10", total: 41200, paid: 0, status: "open", agent: "Juan Dela Cruz" },
];

const CONSIGNMENT = [
  { customer: "Sta. Rosa Community Hospital", items: 12, value: 86400, nearExpiry: 2 },
  { customer: "Calamba Medical Center", items: 8, value: 52100, nearExpiry: 0 },
  { customer: "Batangas Provincial Hospital", items: 15, value: 124500, nearExpiry: 4 },
];

// ─── Helpers ──────────────────────────────────────────────
const peso = (n) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 });
const daysAgo = (dateStr) => Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
const monthsUntil = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (d.getFullYear() - now.getFullYear()) * 12 + d.getMonth() - now.getMonth();
};

// ─── Icons (inline SVG) ──────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M9 22V12h6v10",
  inventory: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  invoice: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  delivery: "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z M18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  collection: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  returns: "M1 4v6h6 M3.51 15a9 9 0 1014.85-3.36L23 7",
  reports: "M18 20V10 M12 20V4 M6 20v-6",
  customers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  search: "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z M16 16l4.5 4.5",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  chevDown: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  print: "M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z",
  consignment: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  menu: "M3 12h18M3 6h18M3 18h18",
};

// ─── App ──────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animIn, setAnimIn] = useState(true);

  const navigate = (p) => {
    setAnimIn(false);
    setTimeout(() => { setPage(p); setSidebarOpen(false); setAnimIn(true); }, 150);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "inventory", label: "Inventory", icon: "inventory" },
    { id: "consignment", label: "Consignment", icon: "consignment" },
    { id: "customers", label: "Customers", icon: "customers" },
    { id: "invoices", label: "Sales Invoices", icon: "invoice" },
    { id: "deliveries", label: "Delivery Receipts", icon: "delivery" },
    { id: "collections", label: "Collections", icon: "collection" },
    { id: "returns", label: "Returns", icon: "returns" },
    { id: "reports", label: "Reports", icon: "reports" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f8f9fb", color: "#1a1a2e", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@600;700&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{
        width: 260, background: "#1a1a2e", color: "#fff", display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: sidebarOpen ? 0 : -260, bottom: 0, zIndex: 50,
        transition: "left 0.25s ease",
        ...(typeof window !== "undefined" && window.innerWidth > 860 ? { left: 0, position: "relative" } : {})
      }}>
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#4ecdc4" }}>Pharma</span>Flow
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>Distribution Management</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px",
              border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 500,
              background: page === item.id ? "rgba(78,205,196,0.15)" : "transparent",
              color: page === item.id ? "#4ecdc4" : "rgba(255,255,255,0.6)",
              transition: "all 0.15s", marginBottom: 2,
            }}>
              <Icon d={Icons[item.icon]} size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4ecdc4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#1a1a2e", fontSize: 13 }}>A</div>
            <div><div style={{ color: "#fff", fontWeight: 500 }}>Admin User</div><div>admin@pharmaflow.ph</div></div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} />}

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#fff", borderBottom: "1px solid #e8eaed", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(true)} style={{
              display: typeof window !== "undefined" && window.innerWidth > 860 ? "none" : "flex",
              border: "none", background: "none", cursor: "pointer", padding: 4,
            }}>
              <Icon d={Icons.menu} size={22} color="#1a1a2e" />
            </button>
            <h1 style={{ fontSize: 16, fontWeight: 600, margin: 0, fontFamily: "'Fraunces', serif" }}>
              {navItems.find(n => n.id === page)?.label || "Dashboard"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#ff6b6b", boxShadow: "0 0 0 3px rgba(255,107,107,0.2)" }} />
            <span style={{ fontSize: 12, color: "#888" }}>3 alerts</span>
          </div>
        </header>

        {/* Content */}
        <div style={{
          flex: 1, overflow: "auto", padding: "20px 24px",
          opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.15s, transform 0.15s",
        }}>
          {page === "dashboard" && <DashboardPage onNav={navigate} />}
          {page === "inventory" && <InventoryPage />}
          {page === "consignment" && <ConsignmentPage />}
          {page === "customers" && <CustomersPage />}
          {page === "invoices" && <InvoicesPage />}
          {page === "deliveries" && <DeliveriesPage />}
          {page === "collections" && <CollectionsPage />}
          {page === "returns" && <ReturnsPage />}
          {page === "reports" && <ReportsPage />}
        </div>
      </main>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────
const Card = ({ children, style: s, ...props }) => (
  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8eaed", padding: 20, ...s }} {...props}>{children}</div>
);

const Badge = ({ children, color = "#4ecdc4", bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
    background: bg || color + "18", color,
  }}>{children}</span>
);

const Btn = ({ children, variant = "primary", icon, style: s, ...props }) => {
  const styles = {
    primary: { background: "#4ecdc4", color: "#1a1a2e", border: "none" },
    secondary: { background: "#f0f1f3", color: "#1a1a2e", border: "1px solid #e0e2e6" },
    danger: { background: "#ff6b6b18", color: "#ff6b6b", border: "1px solid #ff6b6b30" },
  };
  return (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
      fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
      fontFamily: "'DM Sans', sans-serif", ...styles[variant], ...s,
    }} {...props}>
      {icon && <Icon d={Icons[icon]} size={15} />}
      {children}
    </button>
  );
};

const StatCard = ({ label, value, sub, accent = "#4ecdc4", icon }) => (
  <Card style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
    <div style={{
      width: 42, height: 42, borderRadius: 10, background: accent + "15",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon d={Icons[icon]} size={20} color={accent} />
    </div>
    <div>
      <div style={{ fontSize: 12, color: "#888", fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces', serif", color: "#1a1a2e", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: "#999", marginTop: 4 }}>{sub}</div>}
    </div>
  </Card>
);

const Table = ({ columns, data, onRowClick }) => (
  <div style={{ overflowX: "auto", margin: "0 -4px" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>{columns.map((c, i) => (
          <th key={i} style={{
            textAlign: "left", padding: "10px 12px", fontWeight: 600, fontSize: 11.5,
            color: "#888", textTransform: "uppercase", letterSpacing: "0.04em",
            borderBottom: "2px solid #e8eaed", whiteSpace: "nowrap",
          }}>{c.label}</th>
        ))}</tr>
      </thead>
      <tbody>{data.map((row, ri) => (
        <tr key={ri} onClick={() => onRowClick?.(row)} style={{
          cursor: onRowClick ? "pointer" : "default", transition: "background 0.1s",
        }} onMouseEnter={e => e.currentTarget.style.background = "#f8f9fb"}
           onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          {columns.map((c, ci) => (
            <td key={ci} style={{ padding: "11px 12px", borderBottom: "1px solid #f0f1f3", whiteSpace: "nowrap" }}>
              {c.render ? c.render(row) : row[c.key]}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div style={{ position: "relative", maxWidth: 320 }}>
    <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
      <Icon d={Icons.search} size={16} color="#aaa" />
    </div>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #e0e2e6", borderRadius: 8,
        fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fff",
      }} />
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    paid: { color: "#22c55e", label: "Paid" },
    partial: { color: "#f59e0b", label: "Partial" },
    open: { color: "#3b82f6", label: "Open" },
    overdue: { color: "#ff6b6b", label: "Overdue" },
  };
  const s = map[status] || map.open;
  return <Badge color={s.color}>{s.label}</Badge>;
};

const ExpiryBadge = ({ months }) => {
  if (months <= 0) return <Badge color="#1a1a2e" bg="#1a1a2e20">EXPIRED</Badge>;
  if (months <= 3) return <Badge color="#ff6b6b">Unsellable</Badge>;
  if (months <= 6) return <Badge color="#f59e0b">Warning</Badge>;
  return <Badge color="#22c55e">OK</Badge>;
};

// ─── Pages ────────────────────────────────────────────────

function DashboardPage({ onNav }) {
  const totalInventory = PRODUCTS.reduce((s, p) => s + p.qty * p.cost, 0);
  const totalReceivables = INVOICES.filter(i => i.status !== "paid").reduce((s, i) => s + (i.total - i.paid), 0);
  const overdueCount = INVOICES.filter(i => i.status === "overdue").length;
  const expiryAlerts = PRODUCTS.filter(p => monthsUntil(p.expiry) <= 6).length;

  const agingBuckets = [
    { label: "Current", count: INVOICES.filter(i => i.status === "open" && daysAgo(i.date) <= 30).length, color: "#4ecdc4" },
    { label: "1-30", count: 1, color: "#3b82f6" },
    { label: "31-60", count: 2, color: "#f59e0b" },
    { label: "61-90", count: 1, color: "#ff6b6b" },
    { label: "90+", count: 1, color: "#1a1a2e" },
  ];
  const maxBucket = Math.max(...agingBuckets.map(b => b.count), 1);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Inventory Value" value={peso(totalInventory)} sub={`${PRODUCTS.length} products in stock`} icon="inventory" accent="#4ecdc4" />
        <StatCard label="Outstanding Receivables" value={peso(totalReceivables)} sub={`${INVOICES.filter(i => i.status !== "paid").length} unpaid invoices`} icon="collection" accent="#3b82f6" />
        <StatCard label="Overdue Invoices" value={overdueCount} sub="Need immediate attention" icon="alert" accent="#ff6b6b" />
        <StatCard label="Expiry Alerts" value={expiryAlerts} sub="Items within 6 months" icon="alert" accent="#f59e0b" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Aging Chart */}
        <Card>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Receivables Aging</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
            {agingBuckets.map((b, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{b.count}</div>
                <div style={{
                  height: Math.max((b.count / maxBucket) * 100, 8), background: b.color,
                  borderRadius: "6px 6px 0 0", transition: "height 0.5s ease", opacity: 0.85,
                }} />
                <div style={{ fontSize: 10, color: "#888", marginTop: 6, fontWeight: 500 }}>{b.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#aaa", marginTop: 8 }}>Days Overdue</div>
        </Card>

        {/* Expiry Alerts */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Expiry Alerts</div>
            <Btn variant="secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => onNav("inventory")}>View All</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PRODUCTS.filter(p => monthsUntil(p.expiry) <= 6).sort((a, b) => new Date(a.expiry) - new Date(b.expiry)).slice(0, 4).map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#fafafa", borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{p.brand} · Batch {p.batch}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <ExpiryBadge months={monthsUntil(p.expiry)} />
                  <div style={{ fontSize: 10, color: "#888", marginTop: 3 }}>{p.expiry}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Debtors */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Top Client Debt</div>
          <Btn variant="secondary" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => onNav("reports")}>Full Report</Btn>
        </div>
        <Table columns={[
          { label: "Customer", key: "customer" },
          { label: "Total Debt", render: r => <span style={{ fontWeight: 600 }}>{peso(r.debt)}</span> },
          { label: "Overdue", render: r => <span style={{ color: r.overdueDays > 30 ? "#ff6b6b" : "#f59e0b" }}>{r.overdueDays} days</span> },
          { label: "Invoices", key: "count" },
        ]} data={[
          { customer: "Ospital ng Maynila", debt: 86600, overdueDays: 0, count: 2 },
          { customer: "Gov. Crisanta T. David Hospital", debt: 67200, overdueDays: 50, count: 1 },
          { customer: "PhilHealth Regional Office IV-A", debt: 78000, overdueDays: 62, count: 1 },
          { customer: "Calamba Medical Center", debt: 69700, overdueDays: 72, count: 1 },
        ]} />
      </Card>
    </div>
  );
}

function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = PRODUCTS.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "all" || (filter === "expiry" && monthsUntil(p.expiry) <= 6) || (filter === p.category))
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or brand..." />
        <div style={{ display: "flex", gap: 6 }}>
          {[["all", "All"], ["expiry", "Near Expiry"], ["oral", "Orals"], ["injectable", "Injectables"], ["medical_supply", "Supplies"]].map(([v, l]) => (
            <Btn key={v} variant={filter === v ? "primary" : "secondary"} style={{ padding: "6px 12px", fontSize: 11.5 }}
              onClick={() => setFilter(v)}>{l}</Btn>
          ))}
        </div>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table columns={[
          { label: "Product", render: r => <div><div style={{ fontWeight: 500 }}>{r.name}</div><div style={{ fontSize: 11, color: "#888" }}>{r.brand}</div></div> },
          { label: "Category", render: r => <Badge color="#6366f1">{r.category.replace("_", " ")}</Badge> },
          { label: "Qty", render: r => <span style={{ fontWeight: 600 }}>{r.qty} {r.unit}s</span> },
          { label: "Unit Cost", render: r => peso(r.cost) },
          { label: "Unit Price", render: r => peso(r.price) },
          { label: "Batch/Lot", key: "batch" },
          { label: "Expiry", render: r => <ExpiryBadge months={monthsUntil(r.expiry)} /> },
          { label: "Expiry Date", key: "expiry" },
        ]} data={filtered} />
      </Card>
    </div>
  );
}

function ConsignmentPage() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        <StatCard label="Total Consignment Value" value={peso(CONSIGNMENT.reduce((s, c) => s + c.value, 0))} icon="consignment" accent="#6366f1" />
        <StatCard label="Customers with Consignment" value={CONSIGNMENT.length} icon="customers" accent="#4ecdc4" />
        <StatCard label="Near-Expiry Items" value={CONSIGNMENT.reduce((s, c) => s + c.nearExpiry, 0)} sub="Within 6 months" icon="alert" accent="#ff6b6b" />
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table columns={[
          { label: "Customer", key: "customer" },
          { label: "Items", render: r => <span style={{ fontWeight: 600 }}>{r.items}</span> },
          { label: "Total Value", render: r => <span style={{ fontWeight: 600 }}>{peso(r.value)}</span> },
          { label: "Near Expiry", render: r => r.nearExpiry > 0 ? <Badge color="#ff6b6b">{r.nearExpiry} items</Badge> : <Badge color="#22c55e">None</Badge> },
        ]} data={CONSIGNMENT} />
      </Card>
    </div>
  );
}

function CustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = CUSTOMERS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
        <Btn icon="plus">Add Customer</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table columns={[
          { label: "Customer", render: r => <div><div style={{ fontWeight: 500 }}>{r.name}</div><div style={{ fontSize: 11, color: "#888" }}>{r.address}</div></div> },
          { label: "TIN", key: "tin" },
          { label: "Sales Agent", key: "agent" },
        ]} data={filtered} />
      </Card>
    </div>
  );
}

function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = INVOICES.filter(i =>
    (i.si.toLowerCase().includes(search.toLowerCase()) || i.customer.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "all" || filter === i.status)
  );
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search SI# or customer..." />
        <div style={{ display: "flex", gap: 6 }}>
          {[["all", "All"], ["open", "Open"], ["partial", "Partial"], ["overdue", "Overdue"], ["paid", "Paid"]].map(([v, l]) => (
            <Btn key={v} variant={filter === v ? "primary" : "secondary"} style={{ padding: "6px 12px", fontSize: 11.5 }}
              onClick={() => setFilter(v)}>{l}</Btn>
          ))}
          <Btn icon="plus">New SI</Btn>
        </div>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table columns={[
          { label: "SI #", render: r => <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{r.si}</span> },
          { label: "Customer", key: "customer" },
          { label: "Date", key: "date" },
          { label: "Total", render: r => <span style={{ fontWeight: 600 }}>{peso(r.total)}</span> },
          { label: "Paid", render: r => peso(r.paid) },
          { label: "Balance", render: r => <span style={{ fontWeight: 600, color: r.total - r.paid > 0 ? "#ff6b6b" : "#22c55e" }}>{peso(r.total - r.paid)}</span> },
          { label: "Status", render: r => <StatusBadge status={r.status} /> },
          { label: "Agent", key: "agent" },
        ]} data={filtered} />
      </Card>
    </div>
  );
}

function DeliveriesPage() {
  const drs = [
    { dr: "DR-2026-0001", customer: "Sta. Rosa Community Hospital", date: "2026-03-12", total: 34500, type: "official", purpose: "consignment" },
    { dr: "DR-2026-0002", customer: "Batangas Provincial Hospital", date: "2026-03-15", total: 52300, type: "official", purpose: "delivery" },
    { dr: "DR-2026-0003", customer: "Calamba Medical Center", date: "2026-03-18", total: 18900, type: "unofficial", purpose: "delivery" },
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn icon="plus">New DR</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table columns={[
          { label: "DR #", render: r => <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{r.dr}</span> },
          { label: "Customer", key: "customer" },
          { label: "Date", key: "date" },
          { label: "Total", render: r => <span style={{ fontWeight: 600 }}>{peso(r.total)}</span> },
          { label: "Type", render: r => <Badge color={r.type === "official" ? "#3b82f6" : "#888"}>{r.type}</Badge> },
          { label: "Purpose", render: r => <Badge color={r.purpose === "consignment" ? "#6366f1" : "#4ecdc4"}>{r.purpose}</Badge> },
        ]} data={drs} />
      </Card>
    </div>
  );
}

function CollectionsPage() {
  const cols = [
    { receipt: "CR-001", si: "SI-2026-0001", customer: "PhilHealth Regional Office IV-A", date: "2026-03-01", amount: 48600, method: "bank_deposit" },
    { receipt: "CR-002", si: "SI-2026-0002", customer: "Ospital ng Maynila", date: "2026-03-10", amount: 80000, method: "cheque" },
    { receipt: "CR-003", si: "SI-2026-0005", customer: "Calamba Medical Center", date: "2026-03-15", amount: 20000, method: "cash" },
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn icon="plus">Record Collection</Btn>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <Table columns={[
          { label: "Receipt #", render: r => <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{r.receipt}</span> },
          { label: "SI #", key: "si" },
          { label: "Customer", key: "customer" },
          { label: "Date", key: "date" },
          { label: "Amount", render: r => <span style={{ fontWeight: 600, color: "#22c55e" }}>{peso(r.amount)}</span> },
          { label: "Method", render: r => <Badge color="#3b82f6">{r.method.replace("_", " ")}</Badge> },
        ]} data={cols} />
      </Card>
    </div>
  );
}

function ReturnsPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, gap: 8 }}>
        <Btn icon="plus" variant="secondary">Return to Supplier</Btn>
        <Btn icon="plus">Return from Customer</Btn>
      </div>
      <Card style={{ textAlign: "center", padding: 48 }}>
        <Icon d={Icons.returns} size={48} color="#ccc" />
        <div style={{ fontSize: 15, fontWeight: 500, color: "#888", marginTop: 12 }}>No returns recorded yet</div>
        <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>Returns will appear here when recorded</div>
      </Card>
    </div>
  );
}

function ReportsPage() {
  const reports = [
    { name: "Sales Report", desc: "All sales invoices by month/customer/agent", icon: "invoice", color: "#4ecdc4" },
    { name: "Collections Report", desc: "Payments received by month/customer/agent", icon: "collection", color: "#22c55e" },
    { name: "Aging Report", desc: "Unpaid invoices with days overdue", icon: "alert", color: "#ff6b6b" },
    { name: "Inventory Report", desc: "Current stock with expiry status", icon: "inventory", color: "#3b82f6" },
    { name: "Consignment Report", desc: "Unsold consignment items by customer", icon: "consignment", color: "#6366f1" },
    { name: "Purchases Report", desc: "All supplier invoices by month", icon: "delivery", color: "#f59e0b" },
    { name: "Delivery Report", desc: "All DRs by month/customer/agent", icon: "delivery", color: "#ec4899" },
    { name: "Profit & Capital", desc: "Profit per SI/DR with totals", icon: "reports", color: "#8b5cf6" },
    { name: "Client Debt Summary", desc: "Total debt per client, ranked", icon: "customers", color: "#ff6b6b" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
      {reports.map((r, i) => (
        <Card key={i} style={{ cursor: "pointer", transition: "all 0.15s", border: "1px solid #e8eaed" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8eaed"; e.currentTarget.style.transform = "none"; }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: r.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={Icons[r.icon]} size={18} color={r.color} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{r.desc}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            <Btn variant="secondary" style={{ padding: "5px 10px", fontSize: 11 }}>View</Btn>
            <Btn variant="secondary" style={{ padding: "5px 10px", fontSize: 11 }}>Export Excel</Btn>
            <Btn variant="secondary" style={{ padding: "5px 10px", fontSize: 11 }}>Export PDF</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}