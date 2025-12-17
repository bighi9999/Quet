# 🚀 GitHub Actions - Render.com Auto Deploy Setup

## 📋 Tổng quan

Đã tạo 3 GitHub Actions workflows để tự động deploy lên Render.com:

1. **render-deploy.yml** - Auto deploy khi push lên master/main
2. **render-deploy-manual.yml** - Manual deploy với workflow_dispatch
3. **ci.yml** - Build & test cho pull requests

---

## ✅ Workflows đã tạo

### 1️⃣ **Auto Deploy** (render-deploy.yml)

**Kích hoạt khi:**
- Push lên branch `master` hoặc `main`
- Hoặc manual trigger

**Làm gì:**
1. Checkout code
2. Setup Node.js 18.20.8
3. Install dependencies
4. Run tests (nếu có)
5. Deploy to Render.com
6. Notify success/failure

---

### 2️⃣ **Manual Deploy** (render-deploy-manual.yml)

**Kích hoạt:**
- Manual trigger từ GitHub Actions tab
- Chọn environment (production/staging)

**Làm gì:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build (nếu cần)
5. Deploy to Render.com
6. Health check
7. Show deployment summary

**Cách dùng:**
1. Vào GitHub repo → Actions tab
2. Chọn "Manual Deploy to Render.com"
3. Click "Run workflow"
4. Chọn environment
5. Click "Run workflow" button

---

### 3️⃣ **CI - Build & Test** (ci.yml)

**Kích hoạt khi:**
- Pull request vào master/main
- Push lên develop hoặc feature/* branches

**Làm gì:**
1. Test trên Node.js 18.x và 20.x
2. Install dependencies
3. Lint code
4. Run tests
5. Build application
6. Security audit
7. Test server startup

---

## 🔑 Setup GitHub Secrets (REQUIRED)

### Bước 1: Lấy Render.com API Key

1. **Đăng nhập Render.com:**
   - Truy cập: https://dashboard.render.com

2. **Tạo API Key:**
   - Click vào avatar (góc trên phải)
   - Chọn **"Account Settings"**
   - Tab **"API Keys"**
   - Click **"Create API Key"**
   - Copy API key (dạng: `rnd_...`)

### Bước 2: Lấy Render Service ID

1. **Vào service của bạn:**
   - Dashboard → Chọn service "ai-product-analyzer"
   
2. **Copy Service ID:**
   - URL sẽ có dạng: `https://dashboard.render.com/web/srv-xxxxx`
   - Service ID là phần `srv-xxxxx`
   
   **Hoặc:**
   - Settings tab → Service Details
   - Copy "Service ID"

### Bước 3: Add Secrets vào GitHub

1. **Vào GitHub repo:**
   - https://github.com/bighi9999/bilunmarketing

2. **Settings → Secrets and variables → Actions:**
   - Click tab **"Secrets"**
   - Click **"New repository secret"**

3. **Add 2 secrets:**

   **Secret 1:**
   ```
   Name:  RENDER_API_KEY
   Value: rnd_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **Secret 2:**
   ```
   Name:  RENDER_SERVICE_ID
   Value: srv-xxxxxxxxxxxxxxxxxxxxx
   ```

4. **Save** cả 2 secrets

---

## 🚀 Sử dụng Auto Deploy

### **Auto Deploy (Đơn giản nhất):**

Chỉ cần push code lên master:

```bash
git add .
git commit -m "feat: Add new feature"
git push origin master
```

→ GitHub Actions tự động:
1. Run tests
2. Deploy lên Render.com
3. Notify kết quả

### **Manual Deploy:**

1. Vào GitHub repo
2. Tab **"Actions"**
3. Chọn workflow **"Manual Deploy to Render.com"**
4. Click **"Run workflow"**
5. Chọn environment (production)
6. Click **"Run workflow"**
7. Đợi 3-5 phút
8. Check deployment summary

---

## 📊 Xem Deployment Logs

### **Trong GitHub:**
1. Repo → Actions tab
2. Click vào workflow run
3. Xem logs từng step

### **Trong Render.com:**
1. Dashboard → Service
2. Tab **"Logs"**
3. Xem real-time deployment logs

---

## ✅ Verify Deployment

### **1. Check GitHub Actions:**
```
✅ Green checkmark = Success
❌ Red X = Failed (xem logs)
```

### **2. Check Render.com:**
```
Dashboard → Service → Status = "Live" (green)
```

### **3. Test URLs:**
```bash
# Health check
curl https://ai-product-analyzer.onrender.com/api/health

# V2 Pro
curl -I https://ai-product-analyzer.onrender.com/v2

# V1 Classic
curl -I https://ai-product-analyzer.onrender.com/v1
```

Tất cả phải return **200 OK**

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Push to master/main                                    │
│         │                                               │
│         ▼                                               │
│  GitHub Actions Trigger                                 │
│         │                                               │
│         ▼                                               │
│  ┌─────────────────────────────┐                       │
│  │  1. Checkout code           │                       │
│  │  2. Setup Node.js 18.20.8   │                       │
│  │  3. npm ci (install deps)   │                       │
│  │  4. npm test (if present)   │                       │
│  └─────────────────────────────┘                       │
│         │                                               │
│         ▼                                               │
│  ┌─────────────────────────────┐                       │
│  │  Deploy to Render.com       │                       │
│  │  - Uses ttskch/render-deploy│                       │
│  │  - With API key & Service ID│                       │
│  │  - Wait for deploy complete │                       │
│  └─────────────────────────────┘                       │
│         │                                               │
│         ▼                                               │
│  ┌─────────────────────────────┐                       │
│  │  Render.com Build & Deploy  │                       │
│  │  - npm install              │                       │
│  │  - npm start                │                       │
│  │  - Health check             │                       │
│  └─────────────────────────────┘                       │
│         │                                               │
│         ▼                                               │
│  ✅ Deployment Complete!                                │
│  🌐 https://ai-product-analyzer.onrender.com/v2        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Deployment Flow

### **Scenario 1: Feature Development**

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... code changes ...

# 3. Commit & push
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature

# 4. Create Pull Request
# → CI workflow runs (build & test)
# → Review PR
# → Merge to master

# 5. Auto deploy triggers
# → Deploys to Render.com
# → Live in 3-5 minutes!
```

### **Scenario 2: Hotfix**

```bash
# 1. Fix bug on master
git checkout master
git pull origin master

# 2. Make fix
# ... bug fix ...

# 3. Commit & push
git add .
git commit -m "fix: Critical bug fix"
git push origin master

# 4. Auto deploy immediately
# → No PR needed
# → Deploys directly
```

### **Scenario 3: Manual Deploy**

```
1. GitHub → Actions → Manual Deploy
2. Click "Run workflow"
3. Select "production"
4. Click "Run workflow"
5. Wait 3-5 minutes
6. Check deployment summary
```

---

## 🔧 Customization

### **Change deployment branch:**

Edit `.github/workflows/render-deploy.yml`:

```yaml
on:
  push:
    branches:
      - master    # Change this
      - main      # Or this
```

### **Add environment variables:**

Edit `.github/workflows/render-deploy.yml`:

```yaml
- name: Deploy to Render.com
  uses: ttskch/render-deploy@v1.0.0
  with:
    service-id: ${{ secrets.RENDER_SERVICE_ID }}
    api-key: ${{ secrets.RENDER_API_KEY }}
    wait-deploy: true
  env:
    NODE_ENV: production
    PORT: 10000
```

### **Add Slack notifications:**

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📊 Monitoring & Notifications

### **GitHub Actions Notifications:**

GitHub sẽ tự động notify:
- ✅ Email khi deploy success
- ❌ Email khi deploy failed
- 📊 Summary trong Actions tab

### **Add Badge vào README:**

```markdown
![Deploy to Render](https://github.com/bighi9999/bilunmarketing/actions/workflows/render-deploy.yml/badge.svg)
```

---

## 🆘 Troubleshooting

### **❌ Error: "Missing RENDER_API_KEY"**

**Fix:**
1. Check GitHub Secrets đã add chưa
2. Verify secret name chính xác: `RENDER_API_KEY`
3. Re-run workflow

### **❌ Error: "Service not found"**

**Fix:**
1. Check `RENDER_SERVICE_ID` đúng không
2. Verify service tồn tại trên Render.com
3. Check API key có quyền access service

### **❌ Error: "Build failed"**

**Fix:**
1. Check logs trong GitHub Actions
2. Verify `package.json` dependencies
3. Test locally: `npm ci && npm start`
4. Check Node version (18.20.8)

### **❌ Error: "Deploy timeout"**

**Fix:**
1. Increase `wait-deploy` timeout
2. Check Render.com status
3. Verify health check endpoint

### **❌ Tests failing**

**Fix:**
1. Tests optional: `continue-on-error: true` đã set
2. Add proper test scripts in `package.json`
3. Or remove test step nếu không cần

---

## 🎯 Best Practices

### **1. Use Protected Branches:**

Settings → Branches → Add rule:
```
Branch name pattern: master
☑ Require a pull request before merging
☑ Require status checks to pass (CI workflow)
```

### **2. Use Environments:**

Settings → Environments:
```
- production (với required reviewers)
- staging (auto deploy)
```

### **3. Add Health Checks:**

Trong workflow:
```yaml
- name: Health Check
  run: |
    curl -f https://your-app.onrender.com/api/health || exit 1
```

### **4. Rollback Strategy:**

```bash
# If deployment breaks, rollback:
git revert HEAD
git push origin master
# → Auto-deploy previous version
```

---

## 📚 References

### **GitHub Actions:**
- Docs: https://docs.github.com/en/actions
- Marketplace: https://github.com/marketplace

### **Render Deploy Action:**
- Repo: https://github.com/ttskch/render-deploy
- Docs: https://github.com/ttskch/render-deploy#readme

### **Render.com API:**
- Docs: https://api-docs.render.com
- API Keys: https://dashboard.render.com/u/settings#api-keys

---

## ✅ Quick Setup Checklist

- [ ] **Step 1**: Lấy Render.com API Key
- [ ] **Step 2**: Lấy Render Service ID
- [ ] **Step 3**: Add GitHub Secrets (RENDER_API_KEY, RENDER_SERVICE_ID)
- [ ] **Step 4**: Commit workflow files (.github/workflows/*.yml)
- [ ] **Step 5**: Push to GitHub
- [ ] **Step 6**: Verify workflows appear in Actions tab
- [ ] **Step 7**: Test manual deploy
- [ ] **Step 8**: Test auto deploy (push to master)
- [ ] **Step 9**: Verify deployment on Render.com
- [ ] **Step 10**: Test live URLs

---

## 🎉 Done!

Sau khi setup xong:

1. **Push code:**
   ```bash
   git push origin master
   ```

2. **Watch GitHub Actions:**
   - Vào Actions tab
   - Xem workflow run
   - Wait 3-5 minutes

3. **Check Render.com:**
   - Dashboard → Service
   - Status = "Live" (green)

4. **Test app:**
   - https://ai-product-analyzer.onrender.com/v2

🎊 **Auto-deploy working!** 🎊

---

**Made with ❤️ and AI**  
**Version**: 2.0.0 Pro  
**Date**: 2025-12-17
