# 🖋️ VeriSign AI — Signature Forgery Detection & Forensic Authentication Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-ResNet--18-EE4C2C?style=for-the-badge&logo=pytorch)](https://pytorch.org/)
[![OpenCV](https://img.shields.io/badge/OpenCV-Computer_Vision-5C3EE8?style=for-the-badge&logo=opencv)](https://opencv.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://signature-forgery-detection-delta.vercel.app)

An enterprise-grade, hybrid deep learning and computer vision forensic platform designed to authenticate signatures and detect skilled, unskilled, and disguised signature forgeries in real time.

🌐 **Live Production Website**: [https://signature-forgery-detection-delta.vercel.app](https://signature-forgery-detection-delta.vercel.app)  
🐙 **GitHub Repository**: [https://github.com/HarishReddy-543/Signature_Forgery_Detection](https://github.com/HarishReddy-543/Signature_Forgery_Detection)

---

## 📑 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Complete 2,640 Dataset Explorer](#-complete-2640-dataset-explorer)
3. [All Interfaces & Modules](#-all-interfaces--modules)
   - [1. Landing Page (`/`)](#1-landing-page-)
   - [2. Sign In Portal (`/login`)](#2-sign-in-portal-login)
   - [3. Command Dashboard (`/dashboard`)](#3-command-dashboard-dashboard)
   - [4. Signature Verification Studio (`/verify`)](#4-signature-verification-studio-verify)
   - [5. Analytics Intelligence (`/analytics`)](#5-analytics-intelligence-analytics)
   - [6. System Settings (`/settings`)](#6-system-settings-settings)
4. [Forensic Options & Features](#-forensic-options--features)
5. [System Architecture & Hybrid AI Pipeline](#-system-architecture--hybrid-ai-pipeline)
6. [Complete REST API Specification](#-complete-rest-api-specification)
7. [Comprehensive Tech Stack](#-comprehensive-tech-stack)
8. [Local Installation & Quick Start](#-local-installation--quick-start)
9. [Production & Cloud Deployment](#-production--cloud-deployment)
10. [Troubleshooting](#-troubleshooting)
11. [License](#-license)

---

## 📌 Executive Summary

Signature verification in financial, legal, and governmental sectors faces a critical challenge: skilled forgers often replicate the macro-geometry of a name while failing subtle biomechanical patterns such as micro-tremors, stroke velocity profiles, corner distributions, and topological pressure.

**VeriSign AI** addresses this challenge through a **Dual-Stream Hybrid Architecture (v6.0)**:
1. **Deep Metric Stream**: A Siamese Convolutional Neural Network with a ResNet-18 backbone pre-trained and fine-tuned using Contrastive Loss to project signature structures into an invariant embedding metric space.
2. **Handcrafted Forensic Stream**: Classical computer vision algorithms extracting Harris corner keypoints, topological skeleton graphs, stroke density variance, and pressure gradients.

---

## 📂 Complete 2,640 Dataset Explorer

The system includes a pre-indexed dataset of **2,640 real signatures** accessible directly from the cloud UI without needing to upload files from your local disk or phone gallery:

| Metric | Value |
|--------|-------|
| **Total Signatures** | **2,640** signatures |
| **Genuine Signatures** | **1,320** authentic signatures (`original_1_1.png` to `original_55_24.png`) |
| **Forged Signatures** | **1,320** skilled & unskilled forgeries (`forgeries_1_1.png` to `forgeries_55_24.png`) |
| **Total Individual Signers** | **55 unique people** |
| **Samples per Signer** | **24 Genuine + 24 Forged** per person |
| **Delivery Mechanism** | High-speed global edge CDN with automated GitHub Raw fallback |

### Dataset Browser Capabilities:
- **Signer Dropdown Filter**: Filter immediately by any individual signer (Person 1 through Person 55).
- **Type Toggle**: View `All (2,640)`, `Genuine (1,320)`, or `Forged (1,320)`.
- **Search Bar**: Instant keyword and filename search.
- **1-Tap Assignment**: Tap **"Select Target"** to assign as the suspect signature, or tap **"Set as Reference"** in Compare Mode to assign as the gold reference.

---

## 🖥️ All Interfaces & Modules

### 1. Landing Page (`/`)
- **Interactive 3D Hero**: Parallax mouse-tracking with visual depth and responsive cards.
- **Real-Time Operational Indicators**: Live latency indicator (1.2s), dataset counter (2,640), and model accuracy readout (98.2%).
- **Feature Showcase**: Interactive cards explaining Siamese neural networks, gradient heatmaps, and tamper-proof SHA-256 audit logging.
- **Direct Navigation**: One-click access to Start Verification, View Analytics, or access Documentation.

### 2. Sign In Portal (`/login`)
- **Enterprise Authentication UI**: Secure form supporting enterprise accounts with password visibility toggle.
- **Session Protection**: Simulated AES-256 encrypted session tokens.
- **Demo Access**: Instant single-click authentication for audit demonstration.

### 3. Command Dashboard (`/dashboard`)
- **Top Metric Cards**:
  - **Total Signatures**: 2,640 dataset size with percentage tracking.
  - **Genuine Signatures**: 1,320 stored authentic baselines.
  - **Forged Signatures**: 1,320 detected fraud patterns.
  - **Processing Latency**: ~1.2s average inference speed.
- **Live Accuracy Trends**: Recharts time-series graph tracking model confidence and accuracy moving averages.
- **Recent Audit Activity Feed**: Chronological log of recent signature verifications with pass/fail verdict badges, confidence percentages, and timestamps.
- **Full History Audit Table**: Expandable table listing verification IDs, document tags, dates, confidence scores, and verifier departments.

### 4. Signature Verification Studio (`/verify`)
The primary forensic analysis laboratory containing all verification options:
- **Mode Switcher**:
  - **Single Mode**: Evaluates 1 suspect signature against pre-indexed vector embeddings across the entire 2,640-signature database.
  - **Compare Mode (1-to-1)**: Uploads or selects a Suspect Signature side-by-side with a Master Reference Signature for differential forensic examination.
- **Three Input Methods**:
  - **`Dataset` Tab**: Browse all 2,640 signatures with pagination and 1-tap load.
  - **`Upload` Tab**: Traditional file drag-and-drop or device gallery upload.
  - **`Draw` Tab (Biometric Canvas)**: In-browser canvas pad for mouse, stylus, or touch signature drawing with dynamic stroke width simulation.
- **Forensic Viewports**:
  - **Standard View**: High-resolution inspect view with clear/re-upload controls.
  - **Neural Heatmap (Saliency Map)**: Gradient visualizer overlaying red/yellow/green intensity zones highlighting anomalous tremors or unnatural stroke deviations.
  - **Ghost Overlay**: Semi-transparent layer-stacking mode to directly compare reference and suspect geometry.
- **Forensic Lab Preprocessing Filters**:
  - *Contrast Enhancement*: Increases stroke differentiation from background paper.
  - *Noise Removal*: Gaussian / bilateral filtering removing paper grain and speckles.
  - *Skeletonization*: Thins strokes to 1-pixel topological medians.
- **Audit Verification Report**:
  - Overall verdict (`Genuine` vs `Forged` or `Match` vs `No Match`).
  - Calibrated confidence percentage (e.g. 98.2%).
  - Sub-scores: Stroke Consistency, Pressure Pattern, Geometry Match, Spatial Relations.
  - Cryptographic SHA-256 Notarization Hash.
  - JSON Audit Report Download button.
- **On-Demand Model Retraining Panel**:
  - Trigger model fine-tuning directly from the UI.
  - Configurable Epochs (1–50) and Batch Sizes (4–64).
  - Live progress bar and training loss curve visualization.

### 5. Analytics Intelligence (`/analytics`)
- **Key Forensic KPIs**:
  - Model Accuracy: **98.2%**
  - Precision: **97.9%**
  - False Positive Rate: **0.4%**
  - Latency: **1.2s**
- **Hourly Verification Volume Chart**: Hourly throughput curve tracking query density.
- **Weekly Breakdown Chart**: Bar chart illustrating genuine vs. forged verifications per day.
- **Authenticity Ratio Ring**: Pie distribution showing 88.7% genuine vs. 11.3% forged detection.

### 6. System Settings (`/settings`)
- **Organization Profile**: Enterprise tenant details, contact emails, and logo configuration.
- **Security & 2FA**: Two-factor authentication toggles and session lifetime controls.
- **API Key Management**: Generate, revoke, and manage REST API keys for headless programmatic integration.
- **Webhook Subscriptions**: Configure automated HTTP callbacks on forgery detection.
- **Model Sensitivity Sliders**: Fine-tune classification thresholds between conservative and aggressive fraud rejection.

---

## 🔬 Forensic Options & Features

| Option / Feature | Location | Purpose |
|------------------|----------|---------|
| **Single Verification** | `/verify` Mode toggle | Classifies suspect against stored vector knowledge base. |
| **1-to-1 Differential Compare** | `/verify` Mode toggle | Direct pairwise metric distance between suspect and reference. |
| **Dataset Browser** | `/verify` (Dataset tab) | Access and test all 2,640 signatures without uploading files. |
| **Biometric Signature Pad** | `/verify` (Draw tab) | Sign directly on touchscreen or mouse with velocity simulation. |
| **Neural Saliency Heatmap** | `/verify` Results view | Pinpoints local regions of hesitation, tremor, or mismatch. |
| **Ghost Overlay View** | `/verify` Results view | Superimposes suspect on reference with transparency slider. |
| **Laboratory Filters** | `/verify` Lab panel | Applies contrast boost, denoising, or morphological skeletonization. |
| **SHA-256 Notarization** | `/verify` Results card | Generates immutable cryptographic audit hash for legal defense. |
| **Audit Report Export** | `/verify` Results card | Downloads machine-readable JSON forensic verification dossier. |
| **Incremental Retraining** | `/verify` Training tab | Calibrates neural weights on new signature samples from the UI. |

---

## 📐 System Architecture & Hybrid AI Pipeline

```
┌────────────────────────────────────────────────────────┐
│               Client Interface / Mobile                │
│       (Next.js 16 + React 19 + Tailwind CSS v4)        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST (Multipart Form)
                            ▼
┌────────────────────────────────────────────────────────┐
│            FastAPI Backend / Cloud Serverless          │
│                  (Port 8090 / Vercel)                  │
├────────────────────────────────────────────────────────┤
│  1. Ingestion & Validation                             │
│     ├── MIME type check, byte verification             │
│     └── Color-to-grayscale / aspect ratio preserve     │
│                                                        │
│  2. Dual Feature Extraction                            │
│     ├── Deep Siamese ResNet-18 Stream:                 │
│     │   └── 512-dimensional embedding vector           │
│     └── Classical Forensic Vision Stream:              │
│         ├── Harris Corner & Keypoint Density           │
│         ├── Stroke Geometry & Aspect Ratio             │
│         ├── Morphological Skeletonization              │
│         └── Pressure & Intensity Variance              │
│                                                        │
│  3. Metric Distance & Classification                   │
│     ├── Pairwise Euclidean Distance in metric space    │
│     ├── Weighted fusion of neural & visual features    │
│     └── Sigmoid confidence calibration                 │
│                                                        │
│  4. Artifact Generation                                │
│     ├── Gradient saliency heatmap coordinates          │
│     └── SHA-256 cryptographic notarization hash        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
     { "result": "Genuine", "confidence": 98.2, "details": {...} }
```

---

## 📡 Complete REST API Specification

### 1. Dataset & Signatures
- **`GET /api/dataset`**
  - Query params: `type` (`all` | `genuine` | `forged`), `person` (`1`-`55`), `search` (string), `page` (number), `per_page` (number).
  - Returns paginated list of signature objects with CDN URLs, signer metadata, and total counts.

### 2. Signature Verification
- **`POST /api/verify`**
  - Form data:
    - `signature`: Target suspect image file (required).
    - `reference`: Master genuine image file (optional, for 1-to-1 comparison).
  - Returns:
    ```json
    {
      "result": "Genuine",
      "confidence": 98.2,
      "heatmap": [
        { "x": 35, "y": 42, "intensity": 0.28, "radius": 24 }
      ],
      "details": {
        "stroke_consistency": 96.8,
        "pressure_pattern": 95.2,
        "geometry_match": 98.4,
        "spatial_relation": 97.1,
        "forensic_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    }
    ```

### 3. Image Filtering
- **`POST /api/filter`**
  - Form data: `image` (file), `filter_type` (`contrast` | `noise_removal`).
  - Returns: Base64 data URL of processed signature scan.

### 4. Metrics & Monitoring
- **`GET /api/stats`**: Returns overall verifications count, genuine/forged counts, and average response latency.
- **`GET /api/analytics`**: Returns model accuracy, precision, false positive rates, weekly distribution, and hourly volume.
- **`GET /api/analytics/accuracy`**: Returns time-series accuracy moving averages for dashboard charts.
- **`GET /api/history`**: Returns recent verification audit entries with timestamps and verdicts.

### 5. On-Demand Training
- **`POST /api/train`**: Initiates background retraining job with query parameters `epochs` and `batch_size`.
- **`GET /api/train/status`**: Returns current training status, percentage completion, and epoch loss curves.
- **`POST /api/train/reset`**: Resets training calibration state.

### 6. Diagnostics
- **`GET /health`**: Returns backend health, active model checkpoint status, process ID, and port.

---

## 🧰 Comprehensive Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend Framework** | [Next.js](https://nextjs.org/) | 16.0 (App Router, Turbopack) | Server-side rendering, routing, static optimization |
| **UI Library** | [React](https://react.dev/) | 19.2 | Component architecture, hooks, state management |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | v4.0 | Responsive utility-first dark-mode design |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | 12.0+ | Smooth page transitions, modals, parallax |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) | Primitives | Accessible sheets, dialogs, dropdowns, tabs |
| **Icons** | [Lucide React](https://lucide.dev/) | Latest | Clean forensic and interface iconography |
| **Charts** | [Recharts](https://recharts.org/) | 2.15 | Responsive time-series, area, and bar charts |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Latest | Interactive toast notifications |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/) | 0.100+ | Asynchronous high-performance REST API |
| **ASGI Server** | [Uvicorn](https://www.uvicorn.org/) | Latest | ASGI web server for Python backend |
| **Deep Learning** | [PyTorch](https://pytorch.org/) | 2.0+ | Siamese ResNet-18 neural architecture |
| **Computer Vision** | [OpenCV](https://opencv.org/) | 4.8+ | Harris corners, skeletonization, filtering |
| **Image Analysis** | [scikit-image](https://scikit-image.org/) / [PIL](https://pillow.readthedocs.io/) | Latest | Structural similarity, morphological operations |
| **Numerical Processing** | [NumPy](https://numpy.org/) / [SciPy](https://scipy.org/) | Latest | Matrix transformations and distance metrics |
| **Hosting (Frontend)** | [Vercel](https://vercel.com/) | Production | Edge serverless hosting with automatic SSL |
| **CDN (Signatures)** | [jsDelivr](https://www.jsdelivr.com/) + GitHub Raw | Multi-region | Global CDN delivery of all 2,640 signatures |
| **Containers** | [Docker](https://www.docker.com/) & Docker Compose | Multi-stage | Full-stack containerized deployment |

---

## 🚀 Local Installation & Quick Start

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **Python**: v3.10, v3.11, or v3.12
- **npm** or **pnpm**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/HarishReddy-543/Signature_Forgery_Detection.git
cd Signature_Forgery_Detection
```

### 2. Set Up Python Backend
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt
```

### 3. Set Up Frontend
```bash
npm install
# or
pnpm install
```

### 4. Configure Environment (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8090
```

### 5. Launch Servers

#### Option A: 1-Click Automated (Windows)
Double-click [`RESTART_SERVERS.bat`](file:///d:/project/signature-forgery-detection/RESTART_SERVERS.bat) or run:
```cmd
RESTART_SERVERS.bat
```

#### Option B: Manual Terminals
- **Terminal 1 (Backend)**:
  ```bash
  python -m uvicorn backend.main:app --reload --port 8090
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  npm run dev
  ```

Open **`http://localhost:3000`** in your browser.

---

## 🐳 Production & Cloud Deployment

### 1. Docker Compose (Full Stack)
Run both the Next.js frontend and FastAPI backend containers with one command:
```bash
docker-compose up -d --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8090`

### 2. Vercel (Frontend)
Deploy directly via Vercel CLI:
```bash
vercel --prod
```

---

## 🔧 Troubleshooting

- **Windows Console Unicode Errors**:
  If Python crashes on Windows with `UnicodeEncodeError`, ensure `PYTHONIOENCODING=utf-8` is set or run through `RESTART_SERVERS.bat` which handles console encoding automatically.
- **CORS Configuration**:
  FastAPI allows cross-origin requests by default. If using custom domains, ensure `NEXT_PUBLIC_API_URL` does not have a trailing slash.
- **Dataset Image Loading**:
  All 2,640 signatures load via jsDelivr CDN. If a regional network blocks jsDelivr, images automatically fall back to GitHub Raw CDN.

---

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software for academic, personal, and commercial purposes.
