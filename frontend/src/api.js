import axios from "axios";

const BASE = "http://localhost:8000";

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${BASE}/predict`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });
  return res.data;
};

export const exportCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  // Use native fetch so we can handle blob download
  return fetch(`${BASE}/export`, { method: "POST", body: formData })
    .then((res) => {
      if (!res.ok) throw new Error("Export failed");
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cyberguard_predictions.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
};