# VeriSign AI - Deployment Guide

This guide covers step-by-step instructions for deploying the **VeriSign AI Signature Forgery Detection Platform** (FastAPI backend + Next.js frontend).

---

## Architecture Overview

- **Frontend**: Next.js 16 (React 19 + Turbopack + Tailwind CSS) — Default Port `3000`
- **Backend**: FastAPI (PyTorch Siamese Model + OpenCV + Feature Cache) — Default Port `8090`

---

## Option 1: One-Command Docker Compose Deployment (Recommended for VPS / Cloud Server)

Prerequisites: Install **Docker** and **Docker Compose** on your server.

### Step 1: Clone Repository & Build Containers
```bash
git clone <your-repository-url>
cd signature-forgery-detection

# Build and start services in detached mode
docker-compose up -d --build
```

### Step 2: Verify Running Containers
```bash
docker-compose ps
```

- **Frontend**: Accessible at `http://your-server-ip:3000`
- **Backend Health Check**: Accessible at `http://your-server-ip:8090/health`

### Step 3: Logs & Management
```bash
# View backend logs
docker-compose logs -f backend

# View frontend logs
docker-compose logs -f frontend

# Stop all services
docker-compose down
```

---

## Option 2: Deploy Frontend on Vercel & Backend on Render / Railway

### A. Deploy Backend (Render / Railway / AWS EC2)

1. Push your code to GitHub.
2. On **Render** or **Railway**:
   - Select **New Web Service** and connect your GitHub repo.
   - Set **Build Command**: `pip install -r backend/requirements.txt` (or install FastAPI, Uvicorn, PyTorch, OpenCV, Pillow, numpy).
   - Set **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port 8090`
   - Copy the assigned HTTPS backend URL (e.g. `https://verisign-backend.onrender.com`).

### B. Deploy Frontend on Vercel

1. Import your GitHub repository to **Vercel**.
2. Under **Environment Variables**, add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://verisign-backend.onrender.com` (Your backend production URL)
3. Click **Deploy**. Vercel will build and host your responsive Next.js frontend globally.

---

## Option 3: Local Production Build

### Step 1: Build Next.js Production Bundle
```bash
npm run build
```

### Step 2: Start Production Frontend Server
```bash
npm run start
```

### Step 3: Start Backend Server
```bash
.venv_new\Scripts\python.exe -m uvicorn backend.main:app --port 8090
```

---

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL for FastAPI backend endpoints | `http://localhost:8090` |
| `PYTHONIOENCODING` | Enforces UTF-8 encoding for Python console output | `utf-8` |
| `PORT` | Backend service port | `8090` |
