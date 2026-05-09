import { useState, useEffect, useCallback } from "react";

const COLORS = {
  bg: "#0a0e1a",
  card: "#111827",
  cardBorder: "#1e2d45",
  accent: "#00d4ff",
  green: "#00e676",
  red: "#ff4d6d",
  yellow: "#ffd700",
  text: "#e2e8f0",
  muted: "#64748b",
  purple: "#a78bfa",
  orange: "#fb923c",
};

const BROKERS = [
  {
    id: "zerodha",
    name: "Zerodha",
    tagline: "Kite by Zerodha",
    logo: "Z",
    color: "#387ed1",
    bg: "#0f1e3d",
    minSIP: 100,
    charges: "₹0 delivery · ₹20/order F&O",
    features: ["Coin for MF SIP", "Kite platform", "GTT orders", "Smallcase"],
    sipUrl: "https://coin.zerodha.com/mfs",
    popular: true,
    rating: 4.5,
    users: "1.3 Cr+",
  },
  {
    id: "groww",
    name: "Groww",
    tagline: "Invest in Stocks & MF",
    logo: "G",
    color: "#00d09c",
    bg: "#002b22",
    minSIP: 10,
    charges: "₹0 MF · ₹20/order equity",
    features: ["₹10 SIP via MF", "US Stocks", "FD", "Digital Gold"],
    sipUrl: "https://groww.in/mutual-funds",
    popular: true,
    rating: 4.4,
    users: "1 Cr+",
  },
  {
    id: "upstox",
    name: "Upstox",
    tagline: "Fast & Simple Trading",
    logo: "U",
    color: "#7b61ff",
    bg: "#130f2a",
    minSIP: 100,
    charges: "₹0 delivery · ₹20/order",
    features: ["Pro Charts", "Options Analytics", "MF SIP", "IPO"],
    sipUrl: "https://upstox.com/mutual-funds/",
    popular: true,
    rating: 4.3,
    users: "60 L+",
  },
  {
    id: "angelone",
    name: "Angel One",
    tagline: "Smart Broking",
    logo: "A",
    color: "#ff4c00",
    bg: "#2a0d00",
    minSIP: 500,
    charges: "₹0 delivery · Flat ₹20",
    features: ["ARQ AI Advisory", "SmartAPI", "MF", "Robo SIP"],
    sipUrl: "https://www.angelone.in/mutual-funds",
    popular: false,
    rating: 4.2,
    users: "20 L+",
  },
  {
    id: "hdfcsky",
    name: "HDFC Sky",
    tagline: "HDFC Securities",
    logo: "H",
    color: "#0070ba",
    bg: "#001833",
    minSIP: 500,
    charges: "₹0 delivery · ₹20 intraday",
    features: ["Bank Integration", "Research", "NRI Investing", "Bonds"],
    sipUrl: "https://www.hdfcsky.com/",
    popular: false,
    rating: 4.1,
    users: "50 L+",
  },
  {
    id: "paytmmoney",
    name: "Paytm Money",
    tagline: "Invest & Grow",
    logo: "P",
    color: "#00b9f5",
    bg: "#001c2e",
    minSIP: 100,
    charges: "₹0 MF · ₹15/order",
    features: ["NPS", "ETF SIP", "Stock SIP", "Wealth Basket"],
    sipUrl: "https://www.paytmmoney.com/mutual-funds",
    popular: false,
    rating: 4.0,
    users: "90 L+",
  },
  {
    id: "dhan",
    name: "Dhan",
    tagline: "Options-First Trading",
    logo: "D",
    color: "#f59e0b",
    bg: "#1c1400",
    minSIP: 100,
    charges: "₹0 delivery · ₹20/order",
    features: ["TradingView Charts", "Options Chain", "Basket Orders", "MF"],
    sipUrl: "https://dhan.co/",
    popular: false,
    rating: 4.3,
    users: "30 L+",
  },
  {
    id: "icici",
    name: "ICICIdirect",
    tagline: "3-in-1 Account",
    logo: "I",
    color: "#f97316",
    bg: "#1f0a00",
    minSIP: 500,
    charges: "₹20 delivery · ₹20 intraday",
    features: ["3-in-1 Account", "Research", "NRI", "Bonds & FD"],
    sipUrl: "https://www.icicidirect.com/mutual-fund",
    popular: false,
    rating: 3.9,
    users: "60 L+",
  },
];

function generateMarketData(days = 90) {
  const data = [];
  let price = 100;
  for (let i = 0; i < days; i++) {
    const trend = Math.sin(i / 10) * 0.3;
    const noise = (Math.random() - 0.5) * 3;
    const change = trend + noise;
    price = Math.max(60, price + change);
    data.push({ day: i + 1, price: parseFloat(price.toFixed(2)), change: parseFloat(change.toFixed(2)) });
  }
  return data;
}

function MiniChart({ data, width = 200, height = 50 }) {
  if (!data || data.length < 2) return null;
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const range = max - min || 1;
  const pts = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const c = data[data.length - 1].price >= data[0].price ? COLORS.green : COLORS.red;
  return (
    <svg width={width} height={height}>
      <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{
      background: `${color}22`, color, border: `1px solid ${color}44`,
      borderRadius: 99, padding: "2px 9px", fontSize: 10,
      fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: 0.5,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function StatBox({ label, value, sub, color }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: "14px 16px", flex: 1, minWidth: 120 }}>
      <div style={{ color: COLORS.muted, fontSize: 10, fontFamily: "'Space Mono', monospace", letterSpacing: 1, marginBottom: 5 }}>{label}</div>
      <div style={{ color: color || COLORS.text, fontSize: 18, fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ color: COLORS.yellow, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))} {rating}
    </span>
  );
}

export default function DipSIPApp() {
  const [marketData] = useState(() => generateMarketData(90));
  const [currentDay, setCurrentDay] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [selectedBroker, setSelectedBroker] = useState("zerodha");
  const [brokerFilter, setBrokerFilter] = useState("all");
  const [showBrokerModal, setShowBrokerModal] = useState(false);

  const [config, setConfig] = useState({
    dailyBase: 500,
    weeklyBase: 2000,
    monthlyBase: 8000,
    dipThreshold: 1,
    dipWindow: 7,
    enabled: { daily: true, weekly: true, monthly: true },
  });

  const broker = BROKERS.find(b => b.id === selectedBroker) || BROKERS[0];

  const slice = marketData.slice(0, currentDay + 1);
  const current = slice[slice.length - 1];
  const prev = slice[slice.length - 2] || current;
  const dayChange = ((current.price - prev.price) / prev.price) * 100;

  const isInDip = useCallback((endIdx, days) => {
    if (endIdx < days) return false;
    const start = marketData[endIdx - days].price;
    const end = marketData[endIdx].price;
    return ((end - start) / start) * 100 <= -config.dipThreshold;
  }, [marketData, config.dipThreshold]);

  const simulatedHistory = useCallback(() => {
    let units = 0, invested = 0;
    const hist = [];
    for (let i = 1; i <= currentDay; i++) {
      const price = marketData[i].price;
      const prevP = marketData[i - 1].price;
      const chg = ((price - prevP) / prevP) * 100;
      const isUp = chg > 0;
      let todayInvest = 0, actions = [];
      const isWeekly = i % 7 === 0, isMonthly = i % 30 === 0;

      if (!isUp && config.enabled.daily) {
        const inDip = isInDip(i, Math.min(7, i));
        const amt = inDip ? config.dailyBase * 7 : config.dailyBase;
        todayInvest += amt;
        actions.push({ type: "daily", amount: amt, boosted: inDip });
      }
      if (isWeekly && !isUp && config.enabled.weekly) {
        const inDip = isInDip(i, Math.min(30, i));
        const amt = inDip ? config.weeklyBase * 7 : config.weeklyBase;
        todayInvest += amt;
        actions.push({ type: "weekly", amount: amt, boosted: inDip });
      }
      if (isMonthly && !isUp && config.enabled.monthly) {
        const inDip = isInDip(i, Math.min(90, i));
        const amt = inDip ? config.monthlyBase * 7 : config.monthlyBase;
        todayInvest += amt;
        actions.push({ type: "monthly", amount: amt, boosted: inDip });
      }
      if (todayInvest > 0) { units += todayInvest / price; invested += todayInvest; }
      hist.push({ day: i, price, change: chg, invested: todayInvest, totalUnits: units, totalInvested: invested, currentValue: units * price, actions, isUp });
    }
    return { hist, units, invested };
  }, [currentDay, marketData, config, isInDip]);

  const sim = simulatedHistory();
  const currentValue = sim.units * current.price;
  const pnl = currentValue - sim.invested;
  const pnlPct = sim.invested > 0 ? (pnl / sim.invested) * 100 : 0;
  const recentHistory = sim.hist.slice(-15).reverse();
  const today = sim.hist[currentDay - 1];
  const todayTotalInvest = today?.invested || 0;
  const hasDipToday = today?.actions?.some(a => a.boosted);

  useEffect(() => {
    if (!isRunning) return;
    if (currentDay >= marketData.length - 1) { setIsRunning(false); return; }
    const t = setTimeout(() => setCurrentDay(d => d + 1), 120);
    return () => clearTimeout(t);
  }, [isRunning, currentDay, marketData.length]);

  const inputStyle = {
    background: "#0d1525", border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: 8, color: COLORS.text, padding: "8px 12px",
    fontSize: 14, fontFamily: "'Space Mono', monospace", width: "100%", outline: "none",
  };
  const labelStyle = {
    color: COLORS.muted, fontSize: 10, fontFamily: "'Space Mono', monospace",
    letterSpacing: 1, marginBottom: 4, display: "block",
  };

  const filteredBrokers = BROKERS.filter(b => {
    if (brokerFilter === "popular") return b.popular;
    if (brokerFilter === "zero-cost") return b.charges.includes("₹0");
    return true;
  });

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Syne', sans-serif",
      backgroundImage: "radial-gradient(ellipse at 20% 20%, #001a3322 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #00d4ff08 0%, transparent 60%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* BROKER MODAL */}
      {showBrokerModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setShowBrokerModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20,
            padding: 20, maxWidth: 580, width: "100%", maxHeight: "85vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>🏦 Select Broker</div>
              <button onClick={() => setShowBrokerModal(false)} style={{
                background: "transparent", border: `1px solid ${COLORS.cardBorder}`,
                color: COLORS.muted, borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                fontFamily: "'Space Mono', monospace", fontSize: 11,
              }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["all", "popular", "zero-cost"].map(f => (
                <button key={f} onClick={() => setBrokerFilter(f)} style={{
                  background: brokerFilter === f ? `${COLORS.accent}22` : "transparent",
                  border: `1px solid ${brokerFilter === f ? COLORS.accent : COLORS.cardBorder}`,
                  color: brokerFilter === f ? COLORS.accent : COLORS.muted,
                  borderRadius: 99, padding: "3px 12px", cursor: "pointer",
                  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                }}>{f.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredBrokers.map(b => (
                <div key={b.id} onClick={() => { setSelectedBroker(b.id); setShowBrokerModal(false); }}
                  style={{
                    background: selectedBroker === b.id ? b.bg : COLORS.card,
                    border: `2px solid ${selectedBroker === b.id ? b.color : COLORS.cardBorder}`,
                    borderRadius: 14, padding: 14, cursor: "pointer", transition: "all 0.15s", position: "relative",
                  }}>
                  {b.popular && (
                    <div style={{
                      position: "absolute", top: 10, right: 10,
                      background: `${COLORS.yellow}22`, color: COLORS.yellow,
                      border: `1px solid ${COLORS.yellow}44`, borderRadius: 99, padding: "1px 7px",
                      fontSize: 9, fontFamily: "'Space Mono', monospace", fontWeight: 700,
                    }}>POPULAR</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, background: b.color, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 20, color: "#fff",
                    }}>{b.logo}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{b.name}
                        {selectedBroker === b.id && <span style={{ color: b.color, fontSize: 11, marginLeft: 8, fontFamily: "'Space Mono', monospace" }}>✓ SELECTED</span>}
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{b.tagline}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 3, alignItems: "center" }}>
                        <StarRating rating={b.rating} />
                        <span style={{ color: COLORS.muted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{b.users}</span>
                        <span style={{ color: b.color, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>Min ₹{b.minSIP}</span>
                      </div>
                    </div>
                    <a href={b.sipUrl} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: b.color, color: "#fff", borderRadius: 8,
                        padding: "5px 10px", fontSize: 10, textDecoration: "none",
                        fontFamily: "'Space Mono', monospace", fontWeight: 700, whiteSpace: "nowrap",
                      }}>OPEN ↗</a>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
                    {b.features.map(f => (
                      <span key={f} style={{
                        background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}30`,
                        borderRadius: 6, padding: "2px 7px", fontSize: 9, fontFamily: "'Space Mono', monospace",
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{
        borderBottom: `1px solid ${COLORS.cardBorder}`, padding: "13px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#0d1525cc", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>📉</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.5 }}>DIP<span style={{ color: COLORS.accent }}>SIP</span></div>
            <div style={{ color: COLORS.muted, fontSize: 8, fontFamily: "'Space Mono', monospace" }}>SMART DIP INVESTING</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Broker selector pill */}
          <button onClick={() => setShowBrokerModal(true)} style={{
            background: `${broker.color}18`, border: `1px solid ${broker.color}44`,
            borderRadius: 99, padding: "5px 12px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, background: broker.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, color: "#fff",
            }}>{broker.logo}</div>
            <span style={{ color: broker.color, fontSize: 11, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>{broker.name}</span>
            <span style={{ color: COLORS.muted, fontSize: 10 }}>▾</span>
          </button>
          <Badge color={dayChange < 0 ? COLORS.red : COLORS.green}>
            {dayChange < 0 ? "▼" : "▲"} {Math.abs(dayChange).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* DIP ALERT */}
      {hasDipToday && (
        <div style={{
          background: `linear-gradient(90deg, ${COLORS.yellow}18, ${COLORS.red}18)`,
          borderBottom: `1px solid ${COLORS.yellow}33`,
          padding: "9px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
            <span style={{ color: COLORS.yellow, fontWeight: 700 }}>⚡ DIP DETECTED</span>
            <span style={{ color: COLORS.muted, marginLeft: 8 }}>7× boost active — time to invest!</span>
          </div>
          <a href={broker.sipUrl} target="_blank" rel="noopener noreferrer" style={{
            background: broker.color, color: "#fff", borderRadius: 8,
            padding: "4px 12px", fontSize: 10, textDecoration: "none",
            fontFamily: "'Space Mono', monospace", fontWeight: 700,
          }}>INVEST ON {broker.name.toUpperCase()} ↗</a>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: "flex", gap: 0, padding: "10px 18px 0", borderBottom: `1px solid ${COLORS.cardBorder}`, overflowX: "auto" }}>
        {["dashboard", "brokers", "settings", "log"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? `${COLORS.accent}18` : "transparent",
            border: "none", borderBottom: tab === t ? `2px solid ${COLORS.accent}` : "2px solid transparent",
            color: tab === t ? COLORS.accent : COLORS.muted,
            padding: "7px 14px", cursor: "pointer",
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "18px 18px", maxWidth: 860, margin: "0 auto" }}>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Market */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>NIFTY 50 (SIMULATED)</div>
                  <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>₹{current.price.toFixed(2)}</div>
                  <div style={{ color: dayChange < 0 ? COLORS.red : COLORS.green, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>
                    {dayChange < 0 ? "▼" : "▲"} {Math.abs(dayChange).toFixed(2)}%
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <MiniChart data={slice.slice(-30)} width={130} height={44} />
                  <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "'Space Mono', monospace", marginTop: 2 }}>30-DAY TREND</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <input type="range" min={1} max={89} value={currentDay}
                  onChange={e => { setIsRunning(false); setCurrentDay(+e.target.value); }}
                  style={{ flex: 1, minWidth: 100, accentColor: broker.color }} />
                <span style={{ color: COLORS.muted, fontFamily: "'Space Mono', monospace", fontSize: 10 }}>Day {currentDay}/90</span>
                <button onClick={() => setIsRunning(r => !r)} style={{
                  background: isRunning ? `${COLORS.red}22` : `${COLORS.green}22`,
                  border: `1px solid ${isRunning ? COLORS.red : COLORS.green}`,
                  color: isRunning ? COLORS.red : COLORS.green,
                  borderRadius: 8, padding: "5px 14px", cursor: "pointer",
                  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                }}>{isRunning ? "⏸ PAUSE" : "▶ SIMULATE"}</button>
                <button onClick={() => { setIsRunning(false); setCurrentDay(1); }} style={{
                  background: "transparent", border: `1px solid ${COLORS.cardBorder}`,
                  color: COLORS.muted, borderRadius: 8, padding: "5px 10px",
                  cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: 10,
                }}>↺</button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <StatBox label="INVESTED" value={`₹${sim.invested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} />
              <StatBox label="CURRENT VALUE" value={`₹${currentValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                color={currentValue >= sim.invested ? COLORS.green : COLORS.red} />
              <StatBox label="P&L" value={`${pnl >= 0 ? "+" : ""}₹${Math.abs(pnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                sub={`${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%`}
                color={pnl >= 0 ? COLORS.green : COLORS.red} />
              <StatBox label="UNITS" value={sim.units.toFixed(3)} color={COLORS.accent} />
            </div>

            {/* Today SIP Status */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 11, color: COLORS.accent, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>TODAY'S SIP — DAY {currentDay}</div>
                {todayTotalInvest > 0 && (
                  <a href={broker.sipUrl} target="_blank" rel="noopener noreferrer" style={{
                    background: broker.color, color: "#fff", borderRadius: 8,
                    padding: "4px 12px", fontSize: 10, textDecoration: "none",
                    fontFamily: "'Space Mono', monospace", fontWeight: 700,
                  }}>INVEST VIA {broker.name} ↗</a>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["daily", "weekly", "monthly"].map(type => {
                  const action = today?.actions?.find(a => a.type === type);
                  const isActive = !!action;
                  const isBoosted = action?.boosted;
                  const baseMap = { daily: config.dailyBase, weekly: config.weeklyBase, monthly: config.monthlyBase };
                  const icons = { daily: "☀️", weekly: "📅", monthly: "🗓️" };
                  const colorMap = { daily: COLORS.accent, weekly: COLORS.purple, monthly: COLORS.orange };
                  const c = colorMap[type];
                  return (
                    <div key={type} style={{
                      flex: 1, minWidth: 130,
                      background: isActive ? `${c}12` : "#0d152530",
                      border: `1px solid ${isActive ? c + "44" : COLORS.cardBorder}`,
                      borderRadius: 12, padding: "12px 14px",
                      opacity: config.enabled[type] ? 1 : 0.35,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 18 }}>{icons[type]}</span>
                        {isActive
                          ? <Badge color={isBoosted ? COLORS.yellow : c}>{isBoosted ? "7× BOOST" : "ACTIVE"}</Badge>
                          : <Badge color={COLORS.muted}>{today?.isUp ? "PAUSED ↑" : "WAITING"}</Badge>}
                      </div>
                      <div style={{ fontWeight: 700, textTransform: "uppercase", fontSize: 11, color: c }}>{type}</div>
                      <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: "'Space Mono', monospace", marginTop: 2 }}>
                        ₹{baseMap[type].toLocaleString("en-IN")} base
                      </div>
                      {isActive && (
                        <div style={{ marginTop: 6, fontWeight: 700, color: c, fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
                          ₹{action.amount.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Broker Card */}
            <div style={{
              background: broker.bg, border: `1px solid ${broker.color}44`, borderRadius: 14, padding: 14,
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11, background: broker.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 20, color: "#fff",
                }}>{broker.logo}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{broker.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{broker.charges}</div>
                  <StarRating rating={broker.rating} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setTab("brokers")} style={{
                  background: "transparent", border: `1px solid ${broker.color}44`,
                  color: broker.color, borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                }}>CHANGE</button>
                <a href={broker.sipUrl} target="_blank" rel="noopener noreferrer" style={{
                  background: broker.color, color: "#fff", borderRadius: 8,
                  padding: "5px 12px", fontSize: 10, textDecoration: "none",
                  fontFamily: "'Space Mono', monospace", fontWeight: 700,
                }}>START SIP ↗</a>
              </div>
            </div>

            {/* Logic */}
            <div style={{
              background: "#0d1525", border: `1px solid ${COLORS.cardBorder}`,
              borderRadius: 10, padding: 12,
              fontFamily: "'Space Mono', monospace", fontSize: 10, color: COLORS.muted, lineHeight: 1.9,
            }}>
              <span style={{ color: COLORS.accent, fontWeight: 700 }}>⚡ HOW IT WORKS: </span>
              SIP only when market <span style={{ color: COLORS.red }}>DOWN</span> · Pauses when <span style={{ color: COLORS.green }}>UP</span> ·
              Drop &gt;{config.dipThreshold}% over {config.dipWindow}d → <span style={{ color: COLORS.yellow }}>amount ×7</span>
            </div>
          </div>
        )}

        {/* ── BROKERS TAB ── */}
        {tab === "brokers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 20 }}>🏦 Indian Brokers</div>
              <div style={{ display: "flex", gap: 5 }}>
                {["all", "popular", "zero-cost"].map(f => (
                  <button key={f} onClick={() => setBrokerFilter(f)} style={{
                    background: brokerFilter === f ? `${COLORS.accent}22` : "transparent",
                    border: `1px solid ${brokerFilter === f ? COLORS.accent : COLORS.cardBorder}`,
                    color: brokerFilter === f ? COLORS.accent : COLORS.muted,
                    borderRadius: 99, padding: "3px 10px", cursor: "pointer",
                    fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
                  }}>{f.toUpperCase()}</button>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1.4fr 70px 70px 70px 80px",
                gap: 6, padding: "10px 14px",
                borderBottom: `1px solid ${COLORS.cardBorder}`,
                fontFamily: "'Space Mono', monospace", fontSize: 9, color: COLORS.muted, letterSpacing: 1,
              }}>
                <span>BROKER</span><span>MIN SIP</span><span>RATING</span><span>USERS</span><span>ACTION</span>
              </div>
              {filteredBrokers.map((b, i) => (
                <div key={b.id} style={{
                  display: "grid", gridTemplateColumns: "1.4fr 70px 70px 70px 80px",
                  gap: 6, padding: "10px 14px",
                  borderBottom: i < filteredBrokers.length - 1 ? `1px solid ${COLORS.cardBorder}22` : "none",
                  background: selectedBroker === b.id ? `${b.color}0a` : "transparent",
                  alignItems: "center", cursor: "pointer",
                }} onClick={() => setSelectedBroker(b.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 7, background: b.color, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: "#fff",
                    }}>{b.logo}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>{b.name}</div>
                      <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "'Space Mono', monospace" }}>{b.tagline}</div>
                    </div>
                    {b.popular && <Badge color={COLORS.yellow}>HOT</Badge>}
                  </div>
                  <span style={{ color: b.color, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>₹{b.minSIP}</span>
                  <span style={{ color: COLORS.yellow, fontFamily: "'Space Mono', monospace", fontSize: 11 }}>★{b.rating}</span>
                  <span style={{ color: COLORS.muted, fontFamily: "'Space Mono', monospace", fontSize: 10 }}>{b.users}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {selectedBroker === b.id
                      ? <span style={{ color: b.color, fontSize: 9, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>✓ ACTIVE</span>
                      : <button onClick={e => { e.stopPropagation(); setSelectedBroker(b.id); }} style={{
                          background: `${b.color}18`, border: `1px solid ${b.color}30`,
                          color: b.color, borderRadius: 6, padding: "3px 8px",
                          cursor: "pointer", fontFamily: "'Space Mono', monospace",
                          fontSize: 9, fontWeight: 700,
                        }}>SELECT</button>}
                    <a href={b.sipUrl} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: "transparent", border: `1px solid ${b.color}30`,
                        color: b.color, borderRadius: 6, padding: "2px 8px",
                        fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
                        textDecoration: "none", textAlign: "center",
                      }}>OPEN ↗</a>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected broker detail */}
            <div style={{ background: broker.bg, border: `1px solid ${broker.color}44`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 13, background: broker.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 24, color: "#fff",
                }}>{broker.logo}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{broker.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{broker.tagline}</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 2, alignItems: "center" }}>
                    <StarRating rating={broker.rating} />
                    <span style={{ color: COLORS.muted, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>{broker.users} users</span>
                  </div>
                </div>
              </div>
              <div style={{ color: broker.color, fontSize: 11, fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>
                Min SIP: ₹{broker.minSIP} · {broker.charges}
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                {broker.features.map(f => (
                  <span key={f} style={{
                    background: `${broker.color}18`, color: broker.color, border: `1px solid ${broker.color}30`,
                    borderRadius: 7, padding: "3px 8px", fontSize: 10, fontFamily: "'Space Mono', monospace",
                  }}>{f}</span>
                ))}
              </div>
              <div style={{
                background: `${broker.color}10`, border: `1px solid ${broker.color}22`,
                borderRadius: 10, padding: 12, fontFamily: "'Space Mono', monospace", fontSize: 11, lineHeight: 2, color: COLORS.muted,
              }}>
                <div style={{ color: broker.color, fontWeight: 700, marginBottom: 4 }}>📋 SIP SETUP ON {broker.name.toUpperCase()}</div>
                <div>1. Open {broker.name} → Mutual Funds → SIP</div>
                <div>2. Search: <span style={{ color: broker.color }}>Nifty 50 Index Fund / Flexi Cap</span></div>
                <div>3. Set base: ₹{config.dailyBase}/day · ₹{config.monthlyBase}/month</div>
                <div>4. <span style={{ color: COLORS.yellow }}>On dip days: manually invest ₹{(config.dailyBase * 7).toLocaleString()}</span></div>
              </div>
              <a href={broker.sipUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "block", marginTop: 12, background: broker.color, color: "#fff", borderRadius: 10,
                padding: "10px", fontSize: 13, textDecoration: "none",
                fontFamily: "'Space Mono', monospace", fontWeight: 700, textAlign: "center",
              }}>START SIP ON {broker.name.toUpperCase()} ↗</a>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 20 }}>⚙️ SIP Configuration</div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, color: COLORS.accent, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1, marginBottom: 14 }}>SIP AMOUNTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {["daily", "weekly", "monthly"].map(type => {
                  const keyMap = { daily: "dailyBase", weekly: "weeklyBase", monthly: "monthlyBase" };
                  const icons = { daily: "☀️", weekly: "📅", monthly: "🗓️" };
                  const colorMap = { daily: COLORS.accent, weekly: COLORS.purple, monthly: COLORS.orange };
                  const c = colorMap[type];
                  return (
                    <div key={type}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <label style={{ ...labelStyle, marginBottom: 0, color: c }}>{icons[type]} {type.toUpperCase()} BASE</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ color: COLORS.muted, fontSize: 9, fontFamily: "'Space Mono', monospace" }}>ON</span>
                          <div onClick={() => setConfig(cfg => ({ ...cfg, enabled: { ...cfg.enabled, [type]: !cfg.enabled[type] } }))}
                            style={{ width: 36, height: 19, borderRadius: 99, background: config.enabled[type] ? c : COLORS.cardBorder, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                            <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: config.enabled[type] ? 18 : 2, transition: "left 0.2s" }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ color: COLORS.muted, fontFamily: "'Space Mono', monospace", fontSize: 13 }}>₹</span>
                        <input type="number" value={config[keyMap[type]]}
                          onChange={e => setConfig(cfg => ({ ...cfg, [keyMap[type]]: +e.target.value }))}
                          style={inputStyle} />
                      </div>
                      <div style={{ fontSize: 9, fontFamily: "'Space Mono', monospace", marginTop: 3, color: config[keyMap[type]] < broker.minSIP ? COLORS.red : COLORS.muted }}>
                        7× dip → ₹{(config[keyMap[type]] * 7).toLocaleString("en-IN")} · {broker.name} min: ₹{broker.minSIP}
                        {config[keyMap[type]] < broker.minSIP ? " ⚠ BELOW MIN" : " ✓"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontWeight: 700, color: COLORS.red, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1, marginBottom: 12 }}>DIP TRIGGER</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 130 }}>
                  <label style={labelStyle}>THRESHOLD (%)</label>
                  <input type="number" step="0.1" min="0.1" max="10" value={config.dipThreshold}
                    onChange={e => setConfig(cfg => ({ ...cfg, dipThreshold: +e.target.value }))}
                    style={inputStyle} />
                </div>
                <div style={{ flex: 1, minWidth: 130 }}>
                  <label style={labelStyle}>WINDOW (DAYS)</label>
                  <input type="number" min="1" max="30" value={config.dipWindow}
                    onChange={e => setConfig(cfg => ({ ...cfg, dipWindow: +e.target.value }))}
                    style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{
              background: `${broker.color}10`, border: `1px solid ${broker.color}30`,
              borderRadius: 12, padding: 14, fontFamily: "'Space Mono', monospace", fontSize: 11, lineHeight: 2,
            }}>
              <div style={{ color: broker.color, fontWeight: 700, marginBottom: 4 }}>📋 YOUR STRATEGY ON {broker.name.toUpperCase()}</div>
              {config.enabled.daily && <div>☀️ Daily: ₹{config.dailyBase.toLocaleString()} → <span style={{ color: COLORS.yellow }}>₹{(config.dailyBase * 7).toLocaleString()} on dip</span></div>}
              {config.enabled.weekly && <div>📅 Weekly: ₹{config.weeklyBase.toLocaleString()} → <span style={{ color: COLORS.yellow }}>₹{(config.weeklyBase * 7).toLocaleString()} on dip</span></div>}
              {config.enabled.monthly && <div>🗓️ Monthly: ₹{config.monthlyBase.toLocaleString()} → <span style={{ color: COLORS.yellow }}>₹{(config.monthlyBase * 7).toLocaleString()} on dip</span></div>}
              <div style={{ color: COLORS.red }}>⏸ Paused when market UP</div>
            </div>
          </div>
        )}

        {/* ── LOG ── */}
        {tab === "log" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 20 }}>📋 Investment Log</div>
              <Badge color={broker.color}>{broker.name}</Badge>
            </div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "48px 76px 64px 88px 1fr",
                gap: 6, padding: "10px 13px",
                borderBottom: `1px solid ${COLORS.cardBorder}`,
                fontFamily: "'Space Mono', monospace", fontSize: 9, color: COLORS.muted, letterSpacing: 1,
              }}>
                <span>DAY</span><span>PRICE</span><span>CHG</span><span>INVESTED</span><span>ACTIONS</span>
              </div>
              {recentHistory.map((h, i) => (
                <div key={h.day} style={{
                  display: "grid", gridTemplateColumns: "48px 76px 64px 88px 1fr",
                  gap: 6, padding: "8px 13px",
                  borderBottom: i < recentHistory.length - 1 ? `1px solid ${COLORS.cardBorder}22` : "none",
                  background: h.isUp ? "transparent" : `${COLORS.red}05`,
                  alignItems: "center",
                }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: COLORS.muted }}>D{h.day}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10 }}>₹{h.price.toFixed(1)}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: h.change < 0 ? COLORS.red : COLORS.green }}>
                    {h.change < 0 ? "▼" : "▲"}{Math.abs(h.change).toFixed(1)}%
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: h.invested > 0 ? COLORS.text : COLORS.muted }}>
                    {h.invested > 0 ? `₹${h.invested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "—"}
                  </span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                    {h.isUp && <Badge color={COLORS.muted}>PAUSED</Badge>}
                    {h.actions.map((a, j) => (
                      <Badge key={j} color={a.boosted ? COLORS.yellow : { daily: COLORS.accent, weekly: COLORS.purple, monthly: COLORS.orange }[a.type]}>
                        {a.type[0].toUpperCase()}{a.boosted ? "×7" : ""}
                      </Badge>
                    ))}
                    {h.invested > 0 && (
                      <a href={broker.sipUrl} target="_blank" rel="noopener noreferrer"
                        style={{
                          color: broker.color, fontSize: 9, textDecoration: "none",
                          fontFamily: "'Space Mono', monospace", fontWeight: 700,
                          background: `${broker.color}18`, border: `1px solid ${broker.color}33`,
                          borderRadius: 6, padding: "1px 6px",
                        }}>{broker.logo}↗</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "'Space Mono', monospace", textAlign: "center" }}>
              Last 15 days · Tap {broker.logo}↗ to invest on {broker.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}