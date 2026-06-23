# 🛡️ CyberGuard — AI-Powered Cyber Attack Detection System

> **Explainable AI (XAI) Framework for Network Intrusion Detection**  
> Built on the CICIDS-2017 Dataset · XGBoost · FastAPI · React

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.138-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![XGBoost](https://img.shields.io/badge/XGBoost-3.2-EC6C0A?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

---

## 📖 Overview

**CyberGuard** is an end-to-end Explainable Artificial Intelligence (XAI) system that detects cyber attacks in network traffic using Machine Learning. It classifies network flows into **15 threat categories** (DDoS, DoS, Port Scan, Brute Force, Botnet, Web Attacks, etc.) and explains its predictions using SHAP values.

The system provides:
- A **trained XGBoost multiclass model** for real-time detection
- A **FastAPI REST backend** to serve predictions via HTTP
- A **React + Vite dashboard** with threat visualization and packet-level logs
- **Jupyter notebooks** covering the full ML pipeline (EDA → Preprocessing → Training → XAI)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **ML Detection** | XGBoost multiclass classifier trained on 52 CICIDS-2017 network flow features |
| 🔍 **15 Attack Classes** | Detects DDoS, DoS, Port Scan, Brute Force, Botnet, Web Attacks, Infiltration, Heartbleed, and more |
| 📊 **Live Dashboard** | React UI with threat meter, stats cards, animated bar charts, and paginated prediction log |
| 📡 **REST API** | FastAPI backend with `/predict` (JSON) and `/export` (CSV download) endpoints |
| 🧠 **Explainable AI** | SHAP-based feature importance analysis (Notebook 05) |
| 📂 **CSV Export** | Download predictions with `PREDICTED_LABEL` and `IS_ATTACK` columns appended |
| ⚡ **Fast Inference** | Processes thousands of rows in seconds using NumPy-backed XGBoost inference |

---

## 🗂️ Project Structure

```
CYBER-ATTACK-DETECTION/
│
├── backend/                          # FastAPI REST API
│   ├── main.py                       # API routes: /predict, /export
│   ├── xgboost_multiclass.pkl        # Trained XGBoost model
│   ├── label_encoder.pkl             # Scikit-learn LabelEncoder
│   └── requirements.txt             # Backend Python dependencies
│
├── frontend/                         # React + Vite web dashboard
│   ├── src/
│   │   ├── App.jsx                   # Root component (header, stats, threat meter)
│   │   ├── api.js                    # Axios API client
│   │   ├── index.css                 # Full design system (dark/cyberpunk theme)
│   │   └── components/
│   │       ├── UploadCSV.jsx         # Drag-and-drop CSV upload panel
│   │       ├── Dashboard.jsx         # Animated threat distribution bar chart
│   │       └── ResultsTable.jsx      # Paginated, searchable prediction log
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── notebooks/                        # Jupyter ML pipeline
│   ├── 01_data_understanding.ipynb   # EDA & dataset exploration
│   ├── 02_data_preprocessing.ipynb   # Cleaning, encoding, feature selection
│   ├── 03_baseline_models_ipynb.ipynb # Logistic Regression, Random Forest baselines
│   ├── 04_xgboost_training_ipynb.ipynb# XGBoost tuning, training, evaluation
│   └── 05_explainable_ai.ipynb       # SHAP feature importance & explanations
│
├── models/                           # Saved model artifacts (mirrors backend/)
│   ├── xgboost_multiclass.pkl
│   └── label_encoder.pkl
│
├── data/
│   ├── raw/                          # Original CICIDS-2017 CSV files (place here)
│   └── processed/                    # Cleaned/merged data (auto-generated)
│
├── research/                         # Research papers, references
├── requirements.txt                  # Root-level dependencies (ML/notebook stack)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Backend + notebooks |
| Node.js | 18+ | Frontend |
| npm | 8+ | Frontend package manager |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Vasuvarma37/Cyber-Attack-Detection.git
cd CYBER-ATTACK-DETECTION
```

---

### Step 2 — Set Up the Backend

```bash
# Navigate to the backend folder
cd backend

# Install Python dependencies
pip install fastapi uvicorn pandas numpy joblib xgboost python-multipart scikit-learn

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> ✅ The API will be live at **http://localhost:8000**  
> 📖 Auto-generated API docs at **http://localhost:8000/docs**

**⚠️ Important:** Always run `uvicorn` from **inside the `backend/` folder** — the server loads model files using relative paths.

---

### Step 3 — Set Up the Frontend

Open a **new terminal** (keep the backend running):

```bash
# Navigate to the frontend folder
cd frontend

# Install Node.js dependencies (first time only)
npm install

# Start the Vite dev server
npm run dev
```

> ✅ The dashboard will be live at **http://localhost:5173**

---

### Step 4 — Use the Dashboard

1. Open **http://localhost:5173** in your browser
2. **Drag & drop** or **click to browse** a CICIDS-format `.csv` file
3. Click **▶ EXECUTE SCAN** to run the XGBoost model
4. View results:
   - 🔴 **Threat Meter** — overall attack severity level
   - 📊 **Stats Cards** — total packets, attack count, benign count, detection rate
   - 📉 **Threat Distribution** — animated bar chart of all detected classes
   - 📋 **Prediction Log** — searchable, filterable, paginated per-row classification
5. Click **⬇ EXPORT CSV** to download predictions with labels appended

---

## 🌐 API Reference

The backend runs at `http://localhost:8000`. All endpoints accept multipart CSV file uploads.

### `GET /`
Health check — returns model status.

```json
{
  "status": "online",
  "message": "CyberGuard Detection API v2.0",
  "model": "XGBoost Multiclass",
  "features": 52
}
```

---

### `POST /predict`
Upload a CICIDS-format CSV and receive predictions.

**Request:**
```
Content-Type: multipart/form-data
file: <your_network_traffic.csv>
```

**Response:**
```json
{
  "total_rows": 5000,
  "attack_summary": {
    "BENIGN": 3200,
    "DoS Hulk": 900,
    "PortScan": 600,
    "DDoS": 300
  },
  "benign_count": 3200,
  "attack_count": 1800,
  "detection_rate": 36.0,
  "predictions": [
    { "row": 0, "prediction": "BENIGN" },
    { "row": 1, "prediction": "DoS Hulk" }
  ]
}
```

---

### `POST /export`
Same as `/predict` but returns a downloadable CSV with two extra columns:
- `PREDICTED_LABEL` — model prediction
- `IS_ATTACK` — `YES` or `NO`

---

## 🧬 Model Details

| Property | Value |
|---|---|
| **Algorithm** | XGBoost (multiclass softmax) |
| **Dataset** | CICIDS-2017 (Canadian Institute for Cybersecurity) |
| **Features** | 52 network flow attributes |
| **Classes** | 15 (BENIGN + 14 attack types) |
| **File** | `backend/xgboost_multiclass.pkl` |
| **Encoder** | `backend/label_encoder.pkl` (scikit-learn LabelEncoder) |

### Detected Attack Classes

| Category | Labels |
|---|---|
| ✅ Normal | BENIGN |
| 💥 DDoS | DDoS |
| 🌊 DoS | DoS Hulk, DoS GoldenEye, DoS Slowloris, DoS Slowhttptest |
| 🔍 Probe | PortScan |
| 🔑 Brute Force | FTP-Patator, SSH-Patator |
| 🤖 Bot | Bot |
| 🌐 Web Attacks | Web Attack – Brute Force, Web Attack – XSS, Web Attack – SQL Injection |
| 👻 Infiltration | Infiltration |
| 💔 Exploit | Heartbleed |

### Input Features (52 Total)

The model uses standard CICIDS-2017 flow statistics:

```
DESTINATION PORT, FLOW DURATION, TOTAL FWD PACKETS, TOTAL LENGTH OF FWD PACKETS,
FWD PACKET LENGTH MAX/MIN/MEAN/STD, BWD PACKET LENGTH MAX/MIN/MEAN/STD,
FLOW BYTES/S, FLOW PACKETS/S, FLOW IAT MEAN/STD/MAX/MIN,
FWD IAT TOTAL/MEAN/STD/MAX/MIN, BWD IAT TOTAL/MEAN/STD/MAX/MIN,
FWD/BWD HEADER LENGTH, FWD/BWD PACKETS/S, MIN/MAX PACKET LENGTH,
PACKET LENGTH MEAN/STD/VARIANCE, FIN FLAG COUNT, PSH FLAG COUNT, ACK FLAG COUNT,
AVERAGE PACKET SIZE, SUBFLOW FWD BYTES, INIT_WIN_BYTES_FORWARD/BACKWARD,
ACT_DATA_PKT_FWD, MIN_SEG_SIZE_FORWARD, ACTIVE MEAN/MAX/MIN, IDLE MEAN/MAX/MIN
```

> **Note:** Missing columns are automatically filled with `0`. Extra columns are silently dropped.

---

## 📓 Jupyter Notebooks

Run these notebooks in order to reproduce the full ML pipeline:

```bash
# Install notebook dependencies from root
pip install -r requirements.txt

# Launch Jupyter
jupyter notebook notebooks/
```

| Notebook | Description |
|---|---|
| `01_data_understanding.ipynb` | EDA: class distributions, feature statistics, visualizations |
| `02_data_preprocessing.ipynb` | Data cleaning, encoding, normalization, train/test split |
| `03_baseline_models_ipynb.ipynb` | Logistic Regression & Random Forest baselines with metrics |
| `04_xgboost_training_ipynb.ipynb` | XGBoost hyperparameter tuning, training, confusion matrix |
| `05_explainable_ai.ipynb` | SHAP summary plots, waterfall charts, feature importance |

---

## 🗄️ Dataset Setup

1. Download **CICIDS-2017** from the [UNB official page](https://www.unb.ca/cic/datasets/ids-2017.html)
2. Place the raw CSV files inside `data/raw/`
3. Run `notebooks/02_data_preprocessing.ipynb` to generate cleaned data in `data/processed/`

> The dataset contains ~2.8 million network flow records across 8 CSV files (~900 MB total).

---

## 🛠️ Tech Stack

### Backend
| Library | Purpose |
|---|---|
| **FastAPI** | REST API framework |
| **Uvicorn** | ASGI server |
| **XGBoost** | ML model inference |
| **scikit-learn** | LabelEncoder for class names |
| **Pandas / NumPy** | Data preprocessing |
| **joblib** | Model deserialization |
| **python-multipart** | File upload handling |

### Frontend
| Library | Purpose |
|---|---|
| **React 18** | UI component framework |
| **Vite 5** | Lightning-fast dev server & bundler |
| **Axios** | HTTP client for API calls |
| **Vanilla CSS** | Custom cyberpunk dark-theme design system |

### ML / Research
| Library | Purpose |
|---|---|
| **XGBoost** | Primary classifier |
| **scikit-learn** | Preprocessing, metrics, baselines |
| **SHAP** | Model explainability |
| **Pandas / NumPy** | Data manipulation |
| **Matplotlib / Seaborn** | Visualizations |
| **Jupyter** | Notebook environment |

---

## ❓ Troubleshooting

### `Could not import module "main"` on uvicorn start
**Cause:** Running uvicorn from the wrong directory.  
**Fix:** Always `cd backend` first, then run `uvicorn main:app --reload`.

### `CORS error` in browser console
**Cause:** Backend is not running or running on a different port.  
**Fix:** Ensure the FastAPI server is running on port 8000 before opening the frontend.

### `LabelEncoder version mismatch` warning
**Cause:** Model was pickled with scikit-learn 1.6.1 but you have a newer version.  
**Fix:** This is a non-critical warning. Predictions will still work correctly.

### Frontend shows blank page or component errors
**Fix:** Run `npm install` inside the `frontend/` folder, then `npm run dev`.

### CSV upload returns 500 error
**Cause:** CSV may be missing required columns.  
**Fix:** The API auto-fills missing columns with `0`. Ensure the CSV has at least some CICIDS-2017 column names (case-insensitive, with or without leading spaces).

---

## 🌍 Deploying to a Live Server

There are two main approaches — **free cloud platforms** (easiest) or a **VPS/server** (full control).

---

### ✅ Option A — Free Cloud Deployment (Recommended for Students)

#### 🔵 Backend → Render.com (Free)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "ready for deployment"
   git push origin main
   ```

2. Go to **[render.com](https://render.com)** → Sign up → **New → Web Service**

3. Connect your GitHub repo and configure:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `backend` |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

4. Click **Deploy** — Render gives you a URL like:
   ```
   https://cyberguard-api.onrender.com
   ```

5. Update `frontend/src/api.js` — replace `localhost:8000` with your Render URL:
   ```js
   const BASE = "https://cyberguard-api.onrender.com";
   ```

---

#### 🟢 Frontend → Vercel (Free)

1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub → **New Project**

2. Import your repo and configure:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | `Vite` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

3. Click **Deploy** — Vercel gives you a URL like:
   ```
   https://cyberguard.vercel.app
   ```

> 💡 **Free tier limits on Render:** The free plan spins down after 15 minutes of inactivity — the first request after sleep takes ~30 seconds. Upgrade to a paid plan to keep it always-on.

---

### 🖥️ Option B — VPS Deployment (DigitalOcean / AWS EC2 / Any Linux Server)

Use this for full control, custom domains, and always-on uptime.

#### Step 1 — Provision a Server

Get a **Ubuntu 22.04 VPS** from DigitalOcean ($6/mo), AWS EC2 (free tier), or any provider.

#### Step 2 — SSH into Your Server & Install Dependencies

```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, Node.js, Nginx
sudo apt install python3 python3-pip nodejs npm nginx -y
```

#### Step 3 — Clone & Set Up the Project

```bash
git clone https://github.com/Vasuvarma37/Cyber-Attack-Detection.git
cd CYBER-ATTACK-DETECTION

# Install backend deps
cd backend
pip3 install fastapi uvicorn pandas numpy joblib xgboost python-multipart scikit-learn

# Build frontend
cd ../frontend
npm install
npm run build          # generates frontend/dist/
```

#### Step 4 — Run Backend with PM2 (Keeps It Running 24/7)

```bash
# Install PM2 globally
npm install -g pm2

# Start the FastAPI backend
cd /root/CYBER-ATTACK-DETECTION/backend
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name cyberguard-api

# Auto-restart on server reboot
pm2 startup
pm2 save
```

#### Step 5 — Configure Nginx (Reverse Proxy + Serve Frontend)

```bash
sudo nano /etc/nginx/sites-available/cyberguard
```

Paste this config:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Serve React frontend
    location / {
        root /root/CYBER-ATTACK-DETECTION/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to FastAPI
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/cyberguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Update `frontend/src/api.js` to use the `/api/` prefix:
```js
const BASE = "/api";   // Nginx rewrites /api/* → FastAPI
```

Then rebuild: `npm run build`

#### Step 6 — Add HTTPS (Free SSL with Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

Your app is now live at `https://yourdomain.com` 🎉

---

### 📊 Platform Comparison

| Platform | Cost | Ease | Always-On | Custom Domain | Best For |
|---|---|---|---|---|---|
| **Render (backend)** | Free / $7/mo | ⭐⭐⭐⭐⭐ | ❌ free / ✅ paid | ✅ | Quick demos |
| **Vercel (frontend)** | Free | ⭐⭐⭐⭐⭐ | ✅ | ✅ | Frontend hosting |
| **DigitalOcean VPS** | $6/mo | ⭐⭐⭐ | ✅ | ✅ | Production apps |
| **AWS EC2 Free Tier** | Free 12mo | ⭐⭐ | ✅ | ✅ | AWS ecosystem |
| **Hugging Face Spaces** | Free | ⭐⭐⭐⭐ | ✅ | ❌ | ML demos |

---

## 📬 Author

**Mallepalli Vasu**  
B.Tech 3rd Year — Artificial Intelligence & Machine Learning  

[![GitHub](https://img.shields.io/badge/GitHub-Vasuvarma37-181717?style=flat-square&logo=github)](https://github.com/Vasuvarma37)

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.

---

> *"The best defense is understanding the offense."*  
> — CyberGuard v2.0 · CICIDS-2017 · XGBoost + FastAPI + React
