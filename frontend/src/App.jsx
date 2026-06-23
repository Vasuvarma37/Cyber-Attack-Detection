import { useState, useEffect } from "react";
import UploadCSV  from "./components/UploadCSV";
import Dashboard  from "./components/Dashboard";
import ResultsTable from "./components/ResultsTable";

// ── Shared benign check ──────────────────────────────────────────────────────
const BENIGN_SET = new Set(["BENIGN","NORMAL","NORMAL.","BENIGN.","NORMAL TRAFFIC"]);
const isBenign   = (k) => BENIGN_SET.has(String(k).trim().toUpperCase());

// ── Live UTC clock ────────────────────────────────────────────────────────────
function HudClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="hud-clock">{t.toUTCString().replace("GMT","UTC")}</span>;
}

// ── Threat meter ──────────────────────────────────────────────────────────────
function ThreatMeter({ detectionRate }) {
  const ratio    = detectionRate / 100;
  const segs     = 10;
  const litCount = Math.round(ratio * segs);

  let level      = "LOW";
  let levelColor = "var(--green)";
  if      (ratio > 0.6) { level = "CRITICAL"; levelColor = "var(--red)";   }
  else if (ratio > 0.3) { level = "HIGH";     levelColor = "var(--red)";   }
  else if (ratio > 0.1) { level = "ELEVATED"; levelColor = "var(--amber)"; }

  return (
    <div className="threat-meter fade-in">
      <span className="threat-label">THREAT LEVEL</span>
      <div className="threat-bars">
        {Array.from({ length: segs }, (_, i) => {
          let cls = "";
          if (i < litCount) cls = i < 3 ? "lit-green" : i < 6 ? "lit-amber" : "lit-red";
          return <div key={i} className={`threat-seg ${cls}`} />;
        })}
      </div>
      <span className="threat-level-text" style={{ color: levelColor }}>
        {level}
      </span>
      <span className="threat-pct" style={{ color: levelColor }}>
        {detectionRate.toFixed(1)}%
      </span>
    </div>
  );
}

// ── Stats cards ───────────────────────────────────────────────────────────────
function StatsRow({ data }) {
  const { total_rows, attack_summary, benign_count, attack_count, detection_rate } = data;
  const attackTypes = Object.keys(attack_summary).filter((k) => !isBenign(k)).length;
  const accuracy    = (100 - detection_rate).toFixed(1);

  const cards = [
    { label: "TOTAL PACKETS",    value: total_rows.toLocaleString(),    sub: "ROWS ANALYZED",       cls: ""        },
    { label: "ATTACKS DETECTED", value: attack_count.toLocaleString(),  sub: "MALICIOUS TRAFFIC",   cls: "danger"  },
    { label: "BENIGN TRAFFIC",   value: benign_count.toLocaleString(),  sub: "CLEAN PACKETS",       cls: "safe"    },
    { label: "ATTACK TYPES",     value: attackTypes,                    sub: "THREAT CATEGORIES",   cls: "warning" },
    { label: "DETECTION RATE",   value: `${detection_rate}%`,           sub: "ATTACK PERCENTAGE",   cls: "danger"  },
    { label: "CLEAN RATE",       value: `${accuracy}%`,                 sub: "NORMAL PERCENTAGE",   cls: "safe"    },
  ];

  return (
    <div className="stats-grid fade-in fade-in-delay-1">
      {cards.map(({ label, value, sub, cls }) => (
        <div key={label} className={`stat-card ${cls}`}>
          <div className="stat-label">// {label}</div>
          <div className="stat-value">{value}</div>
          <div className="stat-sub">{sub}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);

  return (
    <div className="app-wrapper">

      {/* ── HUD Header ── */}
      <header className="hud-header">
        <div className="hud-top">
          <div className="logo-block">
            <div className="logo-icon">🛡</div>
            <div className="logo-text">
              <h1>CYBERGUARD</h1>
              <div className="tagline">// AI-POWERED NETWORK INTRUSION DETECTION SYSTEM</div>
            </div>
          </div>

          <div className="hud-status">
            <div className="status-badge">
              <span className="status-dot" />
              <span>ML ENGINE ONLINE</span>
            </div>
            <div className="status-badge">
              <span className="status-dot amber" />
              <span>XGBoost v2.0</span>
            </div>
            <HudClock />
          </div>
        </div>
      </header>

      {/* ── Terminal boot block ── */}
      <div className="terminal-block fade-in">
        <span className="terminal-line bright">&gt; INITIALIZING CYBERGUARD AI ENGINE...</span>
        <span className="terminal-line dim">  MODEL      : xgboost_multiclass.pkl     [LOADED]</span>
        <span className="terminal-line dim">  ENCODER    : label_encoder.pkl           [LOADED]</span>
        <span className="terminal-line dim">  FEATURES   : 52 network flow attributes  [ALIGNED]</span>
        <span className="terminal-line cyan">  API        : http://localhost:8000        [ACTIVE]</span>
        <span className="terminal-line">
          {data
            ? `> SCAN COMPLETE — ${data.total_rows.toLocaleString()} PACKETS ANALYZED`
            : "> AWAITING NETWORK TRAFFIC CSV INPUT"}
          <span className="cursor" />
        </span>
      </div>

      {/* ── Upload panel ── */}
      <UploadCSV setData={setData} file={file} setFile={setFile} />

      {/* ── Results ── */}
      {data && (
        <div className="fade-in">
          <ThreatMeter detectionRate={data.detection_rate} />
          <StatsRow data={data} />

          <div className="results-grid">
            <Dashboard summary={data.attack_summary} />
            <ResultsTable predictions={data.predictions} totalRows={data.total_rows} />
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="hud-footer">
        <span className="footer-text">
          CYBERGUARD © 2026 · CICIDS-2017 DATASET · CONFIDENTIAL SYSTEM
        </span>
        <span className="footer-brand">XGBoost + FastAPI + React</span>
      </footer>
    </div>
  );
}

export default App;