# 🖋️ VeriSign AI — Signature Forgery Detection & Forensic Authentication

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-ResNet--18-EE4C2C?style=flat&logo=pytorch)](https://pytorch.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Production-000000?style=flat&logo=vercel)](https://signature-forgery-detection-delta.vercel.app)

An enterprise-grade, deep learning and computer-vision powered **Signature Forgery Detection System**. The platform leverages a **Hybrid Siamese ResNet-18 Neural Network** coupled with classical forensic feature extraction (Harris Keypoints, Stroke Geometry, Skeletonization, and Pressure Pattern Analysis) to detect skilled, unskilled, and disguised signature forgeries with high confidence.

🌐 **Live Production Demo**: [https://signature-forgery-detection-delta.vercel.app](https://signature-forgery-detection-delta.vercel.app)

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [System Architecture Flow](#-system-architecture-flow)
- [Screenshots & Modules](#-modules--pages)
- [API Reference](#-api-reference)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [Production Deployment](#-production-deployment)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Key Features

### 🔍 Forensic Verification Engine
- **Single Mode Verification**: Analyzes a suspect signature against a pre-indexed vector knowledge base of genuine and forged signatures.
- **1-to-1 Comparison Mode**: Upload a suspect signature side-by-side with a master genuine reference signature for instant differential analysis.
- **Biometric Signature Capture**: Draw or sign directly on an in-browser biometric canvas with pressure-sensitive stroke simulation.
- **Forensic Viewports**:
  - **Neural Heatmap / Saliency Map**: Visualizes anomalous strokes, suspicious tremors, or unnatural pressure concentrations.
  - **Ghost Overlay**: Semi-transparent layer-stacking view to directly inspect geometrical discrepancies between reference and suspect signatures.
- **Forensic Laboratory Filters**: Pre-process noisy or low-contrast scans with noise reduction, stroke contrast enhancement, and morphological skeletonization.
- **Audit Reports**: Export downloadable forensic audit reports containing cryptographic hashes, feature metrics, and confidence intervals.

### 📊 Real-Time Analytics & Dashboard
- **Interactive Metrics**: Real-time stats on total dataset size, genuine vs. forged distributions, and average inference latency (~1.2s).
- **Time-Series Charts**: Recharts-powered graphs for hourly query volume and weekly accuracy trends.
- **Live Activity Feed**: Instant audit trail of recent verification runs with timestamps and authenticity verdicts.

### 🧠 Incremental Retraining System
- Trigger background model calibration and feature caching directly from the UI.
- Configure epochs and batch sizes with live progress tracking and loss curve visualization.

### 📱 100% Responsive Design
- Built for mobile, tablet, and desktop screens with an accessible slide-out navigation drawer (`Sheet`) and touch-optimized controls.

---

## 🛠️ Architecture & Tech Stack

| Component | Technologies Used |
|-----------|-------------------|
| **Frontend UI** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/) |
| **Data Visualization** | [Recharts](https://recharts.org/), [Sonner](https://sonner.emilkowal.ski/) Toasts |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), Python 3.11+ |
| **Machine Learning** | [PyTorch](https://pytorch.org/) (Siamese ResNet-18), [Torchvision](https://pytorch.org/vision/) |
| **Computer Vision** | [OpenCV (opencv-python-headless)](https://opencv.org/), [scikit-image](https://scikit-image.org/), [Pillow (PIL)](https://pillow.readthedocs.io/), [NumPy](https://numpy.org/) |
| **Deployment** | [Vercel](https://vercel.com/) (Frontend), [Docker](https://www.docker.com/) & Docker Compose (Full Stack) |

---

## 📐 System Architecture Flow

```
┌────────────────────────────────────────────────────────┐
│               Client Browser / Mobile                  │
│       (Next.js 16 + React 19 + Tailwind CSS)           │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP POST (Multipart Form)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│                 (Port 8090 / Cloud)                    │
├────────────────────────────────────────────────────────┤
│  1. Image Ingestion & Validation                       │
│  2. Noise Removal & Aspect-Preserving Normalization    │
│  3. Feature Extraction:                                │
│     ├── Deep Embeddings: Siamese ResNet-18 Backbone    │
│     └── Handcrafted: Stroke Geometry, Harris Corners,  │
│                      Skeleton, Density & Pressure      │
│  4. Pairwise Distance & Confidence Calibration         │
│  5. Dynamic Heatmap Generation (Gradient Saliency)     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
        { result: "Genuine" | "Forged", confidence: 98.2%, ... }
```

---

## 💻 Modules & Pages

- **Landing Page (`/`)**: 3D interactive hero presentation with real-time parallax mouse-tracking and metric highlights.
- **Sign In (`/login`)**: Enterprise authentication portal with AES-256 session encryption UI.
- **Dashboard (`/dashboard`)**: Comprehensive command center showing verification volume, processing speed, accuracy trends, and recent audits.
- **Verify Signature (`/verify`)**: Dual-mode upload, biometric drawing pad, neural heatmap viewport, ghost overlay, forensic filters, and report export.
- **Analytics (`/analytics`)**: Deep dive into model precision, false positive rates, hourly throughput, and genuine vs. forged distributions.
- **Settings (`/settings`)**: Organization profiles, two-factor authentication, API key generation, webhooks, and threshold sensitivity controls.

---

## 📡 API Reference

The FastAPI backend exposes the following RESTful endpoints:

### Health & Diagnostics
- `GET /health`: Returns server status, loaded model weights state, PID, and port.

### Signature Verification
- `POST /api/verify`:
  - Form parameters:
    - `signature`: Target signature image file (required).
    - `reference`: Master genuine signature file (optional, for 1-to-1 compare mode).
  - Returns:
    ```json
    {
      "result": "genuine",
      "confidence": 98.2,
      "details": {
        "stroke_consistency": 95.4,
        "pressure_pattern": 94.1,
        "geometry_match": 98.7,
        "spatial_relation": 96.2,
        "forensic_hash": "a1b2c3d4..."
      },
      "heatmap": [...]
    }
    ```

### Image Filtering & Preprocessing
- `POST /api/filter`:
  - Form parameters: `image` (file), `filter_type` (`contrast` | `noise_removal`).
  - Returns base64 filtered image.

### Analytics & Training
- `GET /api/stats`: Dashboard operational metrics.
- `GET /api/analytics`: Model accuracy, precision, and historical distributions.
- `GET /api/history`: Audit log of previous verification results.
- `POST /api/train?epochs=5&batch_size=8`: Trigger background model fine-tuning.
- `GET /api/train/status`: Check current training progress and loss curves.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **Python**: v3.10, v3.11, or v3.12
- **npm** or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/signature-forgery-detection.git
cd signature-forgery-detection
```

### 2. Set Up the Python Backend
```bash
# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install backend dependencies
pip install fastapi uvicorn torch torchvision pillow numpy opencv-python-headless scikit-image scipy python-multipart
```

### 3. Set Up the Next.js Frontend
```bash
# Install frontend dependencies
npm install
# or
pnpm install
```

### 4. Configure Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8090
```

### 5. Launch Both Servers

#### On Windows (Automated Batch File):
Double-click `RESTART_SERVERS.bat` or run:
```cmd
RESTART_SERVERS.bat
```

#### Manually in Separate Terminals:
- **Terminal 1 (Backend)**:
  ```bash
  python -m uvicorn backend.main:app --reload --port 8090
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  npm run dev
  ```

Open your browser at **`http://localhost:3000`**!

---

## 🐳 Production Deployment

### Option 1: Docker Compose (Full Stack)
Deploy both the Next.js frontend and FastAPI backend containers with one command:

```bash
docker-compose up -d --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8090`

### Option 2: Vercel (Frontend) + Cloud Container (Backend)
1. **Frontend**: Deploy directly via Vercel CLI:
   ```bash
   vercel --prod
   ```
2. **Backend**: Host `Dockerfile.backend` on [Render](https://render.com/), [Railway](https://railway.app/), or [Hugging Face Spaces](https://huggingface.co/spaces).
3. Set the `NEXT_PUBLIC_API_URL` variable in your Vercel project settings to point to your cloud backend URL.

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend service | `http://localhost:8090` |
| `PYTHONIOENCODING` | Enforces UTF-8 character encoding for console output | `utf-8` |
| `PORT` | Service port for backend server | `8090` |

---

## 🔧 Troubleshooting

- **Windows Console Unicode Errors**:
  If Python fails with `UnicodeEncodeError` on Windows consoles, ensure `PYTHONIOENCODING=utf-8` is set before starting Uvicorn.
- **CORS Errors**:
  The FastAPI backend has CORS enabled for all origins (`allow_origins=["*"]`). If connecting from a custom domain, ensure `NEXT_PUBLIC_API_URL` is set without trailing slashes.
- **Model Checkpoint Missing**:
  The system automatically loads `backend/signature_model.pth` and `backend/features_cache.pth`. If these files are absent, the server will initialize with fallback ResNet-18 weights and index features dynamically.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute for personal and commercial projects.
