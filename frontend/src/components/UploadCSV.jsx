import { useState, useRef } from "react";
import { uploadCSV, exportCSV } from "../api";

function UploadCSV({ setData, file, setFile }) {
  const [loading, setLoading]     = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError]         = useState(null);
  const [dragging, setDragging]   = useState(false);
  const [result, setResult]       = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("INVALID FORMAT — ONLY .CSV FILES ARE ACCEPTED");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
    setData(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadCSV(file);
      setResult(res);
      setData(res);
    } catch (err) {
      const detail = err?.response?.data?.detail || err?.message || "UNKNOWN ERROR";
      setError(String(detail).toUpperCase().slice(0, 300));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!file) return;
    setExporting(true);
    try {
      await exportCSV(file);
    } catch {
      setError("EXPORT FAILED — TRY AGAIN");
    } finally {
      setExporting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setData(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="panel" style={{ marginBottom: 28 }}>
      <span className="corner-deco tl" /><span className="corner-deco tr" />
      <span className="corner-deco bl" /><span className="corner-deco br" />

      <div className="panel-header">
        <span className="panel-title">// DATA INGESTION MODULE</span>
        <span className="panel-badge">CICIDS-2017 FORMAT • CSV</span>
      </div>

      <div className="panel-body">
        {/* Drop Zone */}
        <label
          className={`drop-zone${dragging ? " dragging" : ""}${file ? " has-file" : ""}`}
          htmlFor="csv-file-input"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <span className="drop-zone-icon">{file ? "📡" : "📂"}</span>
          <div className="drop-zone-title">
            {file ? "FILE LOADED — READY TO SCAN" : "DROP .CSV FILE HERE"}
          </div>
          <div className="drop-zone-sub">
            {file
              ? `${file.name}  ·  ${(file.size / 1024).toFixed(1)} KB`
              : "OR CLICK TO BROWSE — ACCEPTS CICIDS-FORMAT NETWORK TRAFFIC LOGS"}
          </div>
          {file && (
            <div className="file-name-display">&gt; {file.name} [QUEUED]</div>
          )}
        </label>
        <input
          id="csv-file-input"
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden-input"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {/* Error */}
        {error && (
          <div className="error-box">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading bar */}
        {loading && (
          <div className="loading-bar-wrap">
            <div className="loading-label">
              <span>&gt; RUNNING XGBoost INFERENCE...</span>
              <span>PROCESSING</span>
            </div>
            <div className="loading-bar"><div className="loading-bar-fill" /></div>
          </div>
        )}

        {/* Success info */}
        {result && !loading && (
          <div className="success-box">
            <span>✔</span>
            <span>
              SCAN COMPLETE — {result.total_rows.toLocaleString()} ROWS PROCESSED ·{" "}
              {result.detection_rate}% ATTACK RATE
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="upload-actions">
          <button
            id="scan-btn"
            className={`btn btn-primary${loading ? " btn-loading" : ""}`}
            onClick={handleScan}
            disabled={!file || loading}
          >
            <span>{loading ? "⟳" : "▶"}</span>
            {loading ? "SCANNING..." : "EXECUTE SCAN"}
          </button>

          {result && (
            <button
              id="export-btn"
              className="btn btn-cyan"
              onClick={handleExport}
              disabled={exporting}
            >
              <span>⬇</span>
              {exporting ? "EXPORTING..." : "EXPORT CSV"}
            </button>
          )}

          {file && (
            <button id="clear-btn" className="btn btn-danger" onClick={handleClear}>
              <span>✕</span> CLEAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadCSV;
