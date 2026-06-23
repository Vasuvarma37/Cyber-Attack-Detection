import { useEffect, useState } from "react";

const BENIGN_SET = new Set(["BENIGN", "NORMAL", "NORMAL.", "BENIGN.", "NORMAL TRAFFIC"]);

const isBenign = (k) => BENIGN_SET.has(k.trim().toUpperCase());

const BAR_COLORS = ["bar-red","bar-amber","bar-purple","bar-green","bar-cyan"];

function Dashboard({ summary }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, [summary]);

  const entries = Object.entries(summary).sort((a, b) => b[1] - a[1]);
  const max   = entries[0]?.[1] || 1;
  const total = entries.reduce((s, [, v]) => s + v, 0);

  let attackIdx = 0; // separate index for attack color cycling

  return (
    <div className="panel" style={{ height: "fit-content" }}>
      <span className="corner-deco tl" /><span className="corner-deco tr" />
      <span className="corner-deco bl" /><span className="corner-deco br" />

      <div className="panel-header">
        <span className="panel-title">// THREAT DISTRIBUTION</span>
        <span className="panel-badge">{entries.length} CLASSES</span>
      </div>

      <div className="panel-body">
        <div className="attack-list">
          {entries.map(([label, count]) => {
            const safe   = isBenign(label);
            const pct    = ((count / max) * 100).toFixed(0);
            const share  = ((count / total) * 100).toFixed(1);
            const color  = safe ? "bar-cyan" : BAR_COLORS[attackIdx++ % BAR_COLORS.length];

            return (
              <div key={label} className="attack-item">
                <div className="attack-row">
                  <span className="attack-label">
                    <span
                      className={`badge ${safe ? "badge-normal" : "badge-attack"}`}
                      style={{ marginRight: 8, fontSize: "0.58rem" }}
                    >
                      {safe ? "SAFE" : "THREAT"}
                    </span>
                    {label}
                  </span>
                  <span
                    className="attack-count"
                    style={{ color: safe ? "var(--cyan)" : "var(--red)" }}
                  >
                    {count.toLocaleString()}
                  </span>
                </div>

                <div className="attack-bar-bg">
                  <div
                    className={`attack-bar-fill ${color}`}
                    style={{ width: animated ? `${pct}%` : "0%" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--text-dim)",
                  }}>
                    {share}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;