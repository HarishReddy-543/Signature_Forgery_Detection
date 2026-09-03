# Troubleshooting Guide - Backend Server Issues

## 🔧 Common Problems & Solutions

### Problem 1: Backend Server Crashes Immediately

**Cause:** Multiple instances running or port conflict

**Solution:**
```powershell
# Kill all old processes
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# Wait 2 seconds, then restart
.\RESTART_SERVERS.bat
```

---

### Problem 2: "Failed to fetch" Error

**Cause:** Backend server not running or wrong port

**Solution:**
1. Check if backend is running:
   - Open http://localhost:8000 in browser
   - Should see: `{"status":"ok","message":"Signature Detection API is running"}`

2. If not running, restart:
   ```powershell
   .\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
   ```

---

### Problem 3: "Port Already in Use"

**Cause:** Old server still running

**Solution:**
```powershell
# For Port 8000 (Backend)
netstat -ano | findstr :8000
taskkill /F /PID [PID_NUMBER]

# For Port 3000 (Frontend)
netstat -ano | findstr :3000
taskkill /F /PID [PID_NUMBER]

# Or just kill all:
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

---

### Problem 4: "Unable to acquire lock" (Next.js)

**Cause:** Old npm dev server still running

**Solution:**
```powershell
taskkill /F /IM node.exe
npm run dev
```

---

### Problem 5: Model Initialization Fails

**Error:** `Error during model initialization`

**Solution:**
1. Check if PyTorch is installed:
   ```powershell
   .\.venv\Scripts\python.exe -c "import torch; print(torch.__version__)"
   ```

2. If error, reinstall:
   ```powershell
   cd backend
   .\.venv\Scripts\pip install -r requirements.txt
   ```

---

### Problem 6: Training Fails - Dataset Missing

**Error:** `Dataset directories empty or missing`

**Solution:**
1. Create folders:
   ```powershell
   mkdir backend\dataset\genuine
   mkdir backend\dataset\forged
   ```

2. Add signature images:
   - Place genuine signatures in `backend/dataset/genuine/`
   - Place forged signatures in `backend/dataset/forged/`

---

## 🚀 **BEST PRACTICE - Always Use This:**

### **Never manually start servers - Use the script:**

```powershell
# Double-click this file:
RESTART_SERVERS.bat
```

This script:
- ✅ Kills all old processes first
- ✅ Waits for cleanup
- ✅ Starts fresh servers
- ✅ Opens in separate windows with titles
- ✅ Prevents conflicts

---

## 🔍 **Quick Health Check:**

Run these commands to verify everything:

```powershell
# 1. Check Backend
curl http://localhost:8000

# 2. Check Frontend
curl http://localhost:3000

# 3. Check running processes
tasklist | findstr "python.exe"
tasklist | findstr "node.exe"
```

Expected:
- Backend should return JSON with `"status":"ok"`
- Frontend should return HTML
- Should see 1 python.exe and 1 node.exe process

---

## 📞 **Still Having Issues?**

Check the terminal output for specific errors:
- **Backend terminal:** Shows model loading and request logs
- **Frontend terminal:** Shows compilation and page requests

Common error patterns:
- `ModuleNotFoundError` → Reinstall dependencies
- `Port already in use` → Kill old processes
- `Cannot find module` → Check file paths
- `CUDA error` → Ignore (will use CPU)

---

## ✅ **Prevention Tips:**

1. **Always close old terminals** before starting new ones
2. **Use RESTART_SERVERS.bat** instead of manual commands
3. **Don't run multiple instances** of the same server
4. **Check ports** before starting: `netstat -ano | findstr :8000`
5. **Keep terminals open** while using the app
