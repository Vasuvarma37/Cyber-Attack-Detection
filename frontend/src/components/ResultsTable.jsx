import { useState, useMemo } from "react";

const BENIGN_SET = new Set(["BENIGN", "NORMAL", "NORMAL.", "BENIGN.", "NORMAL TRAFFIC"]);
const isBenign = (l) => BENIGN_SET.has(String(l).trim().toUpperCase());

const PAGE_SIZE = 20;

function classifyBadge(label) {
  const u = String(label).toUpperCase();
  if (isBenign(label))                                          return { cls: "badge-normal",  text: "NORMAL"  };
  if (u.includes("DDOS") || u.includes("DOS"))                  return { cls: "badge-attack",  text: "DDoS"    };
  if (u.includes("PORTSCAN") || u.includes("PORT SCAN"))        return { cls: "badge-warning", text: "PROBE"   };
  if (u.includes("BRUTE") || u.includes("FTP") || u.includes("SSH")) return { cls: "badge-info", text: "BRUTE" };
  if (u.includes("BOT"))                                        return { cls: "badge-attack",  text: "BOT"     };
  if (u.includes("INFILTRATION"))                               return { cls: "badge-attack",  text: "INFILTR" };
  if (u.includes("HEARTBLEED"))                                 return { cls: "badge-attack",  text: "EXPLOIT" };
  if (u.includes("WEB") || u.includes("XSS") || u.includes("SQL")) return { cls: "badge-attack", text: "WEB"  };
  return { cls: "badge-attack", text: "ATTACK" };
}

function ResultsTable({ predictions, totalRows }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("ALL");
  const [page, setPage]       = useState(1);

  const allLabels = useMemo(() => {
    const s = new Set(predictions.map((p) => p.prediction));
    return ["ALL", ...s];
  }, [predictions]);

  const filtered = useMemo(() => {
    return predictions.filter((p) => {
      const matchF = filter === "ALL" || p.prediction === filter;
      const matchS =
        search === "" ||
        p.prediction.toLowerCase().includes(search.toLowerCase()) ||
        String(p.row).includes(search);
      return matchF && matchS;
    });
  }, [predictions, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const onSearch = (v) => { setSearch(v); setPage(1); };
  const onFilter = (v) => { setFilter(v); setPage(1); };

  // Page window
  const windowStart = Math.max(1, Math.min(safePage - 2, totalPages - 4));
  const pageWindow  = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => windowStart + i
  ).filter((p) => p >= 1 && p <= totalPages);

  return (
    <div className="panel">
      <span className="corner-deco tl" /><span className="corner-deco tr" />
      <span className="corner-deco bl" /><span className="corner-deco br" />

      <div className="panel-header">
        <span className="panel-title">// PREDICTION LOG</span>
        <span className="panel-badge">
          {filtered.length.toLocaleString()} / {(totalRows || predictions.length).toLocaleString()} ENTRIES
        </span>
      </div>

      <div className="panel-body" style={{ paddingBottom: 0 }}>
        {/* Controls */}
        <div className="table-controls">
          <input
            id="table-search"
            className="search-input"
            placeholder="> SEARCH LABEL OR ROW #..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <select
            id="table-filter"
            className="filter-select"
            value={filter}
            onChange={(e) => onFilter(e.target.value)}
          >
            {allLabels.map((l) => (
              <option key={l} value={l}>
                {l === "ALL" ? "ALL CATEGORIES" : l}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>PKT #</th>
                <th>CLASSIFICATION</th>
                <th>TYPE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      color: "var(--text-dim)",
                      padding: "40px",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "2px",
                      fontSize: "0.75rem",
                    }}
                  >
                    NO MATCHING RECORDS FOUND
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const safe  = isBenign(item.prediction);
                  const badge = classifyBadge(item.prediction);
                  return (
                    <tr key={item.row}>
                      <td className="row-id">#{String(item.row).padStart(6, "0")}</td>
                      <td>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.76rem",
                            color: safe ? "var(--cyan)" : "var(--red)",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {item.prediction}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${badge.cls}`}>{badge.text}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            color: safe ? "var(--text-dim)" : "var(--red)",
                            letterSpacing: "1px",
                          }}
                        >
                          <span
                            style={{
                              width: 6, height: 6,
                              borderRadius: "50%",
                              background: safe ? "var(--cyan)" : "var(--red)",
                              boxShadow: safe
                                ? "0 0 6px var(--cyan)"
                                : "0 0 6px var(--red)",
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          {safe ? "CLEAR" : "FLAGGED"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            id="page-first"
            className="page-btn"
            onClick={() => setPage(1)}
            disabled={safePage === 1}
          >
            «
          </button>
          <button
            id="page-prev"
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            ‹ PREV
          </button>

          {pageWindow.map((pg) => (
            <button
              key={pg}
              id={`page-${pg}`}
              className={`page-btn${safePage === pg ? " active" : ""}`}
              onClick={() => setPage(pg)}
            >
              {pg}
            </button>
          ))}

          <span className="page-info">
            {safePage} / {totalPages} · {filtered.length.toLocaleString()} rows
          </span>

          <button
            id="page-next"
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            NEXT ›
          </button>
          <button
            id="page-last"
            className="page-btn"
            onClick={() => setPage(totalPages)}
            disabled={safePage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsTable;