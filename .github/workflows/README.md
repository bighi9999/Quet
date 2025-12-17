# GitHub Actions Workflows

## 📁 Workflows Available

### 1. `render-deploy.yml` - Auto Deploy
**Trigger:** Push to master/main  
**Purpose:** Tự động deploy lên Render.com khi có code mới

### 2. `render-deploy-manual.yml` - Manual Deploy  
**Trigger:** Manual (workflow_dispatch)  
**Purpose:** Deploy thủ công với environment selection

### 3. `ci.yml` - Continuous Integration
**Trigger:** Pull requests, push to develop/feature branches  
**Purpose:** Build, test, lint code

---

## 🔑 Required Secrets

Add these in: **Settings → Secrets and variables → Actions**

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `RENDER_API_KEY` | Render.com API key | Dashboard → Account Settings → API Keys |
| `RENDER_SERVICE_ID` | Service ID | URL: `srv-xxxxx` or Settings → Service Details |

---

## 🚀 Quick Start

### Auto Deploy:
```bash
git add .
git commit -m "feat: Your changes"
git push origin master
```
→ GitHub Actions auto-deploys to Render.com

### Manual Deploy:
1. Go to **Actions** tab
2. Select **"Manual Deploy to Render.com"**
3. Click **"Run workflow"**
4. Select environment
5. Click **"Run workflow"**

---

## 📖 Documentation

Read full guide: **GITHUB_ACTIONS_SETUP.md**

---

## ✅ Status Badges

Add to README.md:

```markdown
![Deploy to Render](https://github.com/bighi9999/bilunmarketing/actions/workflows/render-deploy.yml/badge.svg)
![CI](https://github.com/bighi9999/bilunmarketing/actions/workflows/ci.yml/badge.svg)
```

---

**Last Updated:** 2025-12-17
