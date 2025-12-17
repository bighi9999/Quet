# 🔑 GITHUB PERMISSIONS SETUP - GenSpark Auto Access

## 🎯 Mục đích

Cấp quyền cho GenSpark có thể:
- ✅ Push code tự động
- ✅ Tạo/update Pull Requests
- ✅ Trigger GitHub Actions
- ✅ Quản lý branches
- ✅ Commit & deploy tự động

---

## 🔐 OPTION 1: Personal Access Token (PAT) - RECOMMENDED

### **Bước 1: Tạo Fine-grained Personal Access Token**

1. **Truy cập GitHub Settings:**
   ```
   https://github.com/settings/tokens
   ```

2. **Click "Generate new token" → "Generate new token (fine-grained)"**
   
   **⭐ Fine-grained tokens tốt hơn vì:**
   - Chỉ cấp quyền cho specific repo
   - Bảo mật cao hơn
   - Expire date tùy chọn
   - Audit logs chi tiết

3. **Configure Token:**

   ```
   Token name:           GenSpark Auto Deploy
   Description:          Token for GenSpark to auto-push code and deploy
   Expiration:           Custom → 1 year (hoặc No expiration)
   
   Repository access:    Only select repositories
   Selected:             ✅ bighi9999/Quet
   ```

4. **Repository permissions (Quan trọng!):**

   **⭐ PERMISSIONS CẦN THIẾT:**

   ```
   Repository permissions:
   
   ✅ Actions:           Read and write
      → Trigger workflows, view runs
   
   ✅ Contents:          Read and write  
      → Push code, create branches, commits
   
   ✅ Metadata:          Read-only (required)
      → Basic repo info
   
   ✅ Pull requests:     Read and write
      → Create/update PRs, merge
   
   ✅ Workflows:         Read and write
      → Update workflow files
   
   ✅ Commit statuses:   Read and write (optional)
      → Update commit status
   
   ✅ Deployments:       Read and write (optional)
      → Manage deployments
   ```

5. **Click "Generate token"**

6. **📋 COPY TOKEN:**
   ```
   Token: github_pat_11XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
   
   ⚠️ **QUAN TRỌNG**: Save token ngay! Chỉ hiển thị 1 lần!

---

## 🔐 OPTION 2: Classic Personal Access Token (Easier but less secure)

### **Bước 1: Tạo Classic Token**

1. **Truy cập:**
   ```
   https://github.com/settings/tokens
   ```

2. **Click "Generate new token" → "Generate new token (classic)"**

3. **Configure:**
   ```
   Note:        GenSpark Auto Deploy
   Expiration:  No expiration (hoặc 1 year)
   ```

4. **Select scopes (Permissions):**

   **⭐ SCOPES CẦN THIẾT:**
   ```
   ✅ repo                    (Full control of private repositories)
      ✅ repo:status          → Access commit status
      ✅ repo_deployment      → Access deployment status
      ✅ public_repo          → Access public repositories
      ✅ repo:invite          → Access repository invitations
      ✅ security_events      → Read/write security events
   
   ✅ workflow                (Update GitHub Action workflows)
   
   ✅ write:packages          (Upload packages to GitHub Package Registry)
      ✅ read:packages        → Download packages
   
   ✅ delete:packages         (Delete packages - optional)
   
   ✅ admin:repo_hook         (Full control of repository hooks - optional)
      ✅ write:repo_hook      → Write repository hooks
      ✅ read:repo_hook       → Read repository hooks
   
   ✅ admin:org_hook          (Full control of organization hooks - optional)
   
   ✅ gist                    (Create gists - optional)
   
   ✅ notifications           (Access notifications - optional)
   
   ✅ user:email              (Access user email - optional)
   
   ✅ read:discussion         (Read discussions - optional)
   ✅ write:discussion        (Write discussions - optional)
   
   ✅ read:enterprise         (Read enterprise data - optional)
   ✅ manage_runners:org      (Manage organization runners - optional)
   ```

5. **Generate token → Copy:**
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## 🔧 OPTION 3: GitHub App (Advanced - Best for Organizations)

### **Tạo GitHub App với full permissions:**

1. **Settings → Developer settings → GitHub Apps → New GitHub App**

2. **Configure:**
   ```
   App name:              GenSpark Deploy Bot
   Homepage URL:          https://genspark.ai
   Webhook:               Not required (uncheck)
   ```

3. **Permissions:**
   ```
   Repository permissions:
   ✅ Actions:                Read & write
   ✅ Administration:         Read & write
   ✅ Checks:                 Read & write
   ✅ Contents:               Read & write
   ✅ Deployments:            Read & write
   ✅ Environments:           Read & write
   ✅ Metadata:               Read-only
   ✅ Pull requests:          Read & write
   ✅ Workflows:              Read & write
   ```

4. **Generate private key → Download → Convert to token**

---

## 📋 MINIMUM PERMISSIONS REQUIRED (Essential)

Nếu muốn tối giản nhất:

```
✅ repo              (Full control - MUST HAVE)
✅ workflow          (Update workflows - MUST HAVE)

Optional but recommended:
⭐ write:packages    (If using packages)
⭐ admin:repo_hook   (If need webhooks)
```

---

## 🚀 SỬ DỤNG TOKEN VỚI GENSPARK

### **Method 1: Environment Variable (Recommended)**

```bash
# Set token as environment variable
export GITHUB_TOKEN="github_pat_11XXXXX..."

# Or add to ~/.bashrc or ~/.zshrc
echo 'export GITHUB_TOKEN="github_pat_11XXXXX..."' >> ~/.bashrc
source ~/.bashrc
```

### **Method 2: Git Credential Store**

```bash
# Store token in git credentials
git config --global credential.helper store

# Push once with token
git remote set-url origin https://bighi9999:TOKEN@github.com/bighi9999/Quet.git
git push

# Token now stored in ~/.git-credentials
```

### **Method 3: Git Config**

```bash
# Set token in git config
git config --global user.token "github_pat_11XXXXX..."

# Or for specific repo
cd /home/root/webapp
git config user.token "github_pat_11XXXXX..."
```

---

## ✅ VERIFY PERMISSIONS

### **Test token với GitHub API:**

```bash
# Test token
curl -H "Authorization: token github_pat_11XXXXX..." \
     https://api.github.com/user

# Should return your user info

# Test repo access
curl -H "Authorization: token github_pat_11XXXXX..." \
     https://api.github.com/repos/bighi9999/Quet

# Should return repo info

# Test push permission
curl -H "Authorization: token github_pat_11XXXXX..." \
     -X GET https://api.github.com/repos/bighi9999/Quet/collaborators/bighi9999/permission

# Should show "admin" or "write"
```

---

## 🔐 SECURITY BEST PRACTICES

### **1. Token Security:**
```
✅ Never commit token to code
✅ Use environment variables
✅ Set expiration date (recommend 90 days)
✅ Rotate tokens regularly
✅ Use fine-grained tokens when possible
✅ Limit scope to minimum needed
```

### **2. Repository Settings:**
```
✅ Enable branch protection (optional)
✅ Require pull request reviews (optional)
✅ Enable status checks (optional)
✅ Allow auto-merge (for GenSpark PRs)
```

### **3. Audit:**
```
✅ Check Settings → Developer settings → Personal access tokens
✅ Review token usage logs
✅ Revoke unused tokens
```

---

## 🎯 RECOMMENDED SETUP FOR GENSPARK

### **Best Configuration:**

**1. Create Fine-grained Token:**
- Repository: `bighi9999/Quet`
- Permissions:
  - ✅ Actions: Read & write
  - ✅ Contents: Read & write
  - ✅ Pull requests: Read & write
  - ✅ Workflows: Read & write
- Expiration: 1 year

**2. Store Token:**
```bash
# In GenSpark environment
export GITHUB_TOKEN="github_pat_11XXXXX..."
```

**3. Configure Git:**
```bash
git config --global credential.helper store
git config --global user.name "bighi9999"
git config --global user.email "your-email@example.com"
```

**4. Test Push:**
```bash
cd /home/root/webapp
git remote set-url origin https://bighi9999:$GITHUB_TOKEN@github.com/bighi9999/Quet.git
git push -u origin master
```

---

## 🔄 AUTO-PUSH WORKFLOW

### **Script for GenSpark Auto Push:**

```bash
#!/bin/bash
# auto-push.sh

# Set variables
GITHUB_TOKEN="github_pat_11XXXXX..."
REPO_URL="https://bighi9999:${GITHUB_TOKEN}@github.com/bighi9999/Quet.git"

# Configure git
git config user.name "bighi9999"
git config user.email "your-email@example.com"

# Set remote with token
git remote set-url origin "$REPO_URL"

# Add all changes
git add .

# Commit with message
git commit -m "feat: Auto-commit from GenSpark - $(date +%Y-%m-%d)"

# Push to GitHub
git push -u origin master

# Check status
if [ $? -eq 0 ]; then
    echo "✅ Push successful!"
else
    echo "❌ Push failed!"
    exit 1
fi
```

**Make executable:**
```bash
chmod +x auto-push.sh
./auto-push.sh
```

---

## 📊 TOKEN COMPARISON

| Feature | Classic Token | Fine-grained Token | GitHub App |
|---------|--------------|-------------------|------------|
| Granular permissions | ❌ | ✅ | ✅ |
| Repo-specific | ❌ | ✅ | ✅ |
| Expiration required | ❌ | ✅ | ✅ |
| Audit logs | Basic | Detailed | Detailed |
| Setup complexity | Easy | Medium | Hard |
| **Recommended for** | Quick setup | Production | Enterprise |

---

## 🆘 TROUBLESHOOTING

### **❌ Error: "Permission denied"**
**Fix:**
- Verify token has `repo` and `workflow` scopes
- Check token not expired
- Verify repo URL correct

### **❌ Error: "Authentication failed"**
**Fix:**
- Use token as password (not GitHub password)
- Format: `https://username:TOKEN@github.com/repo.git`
- Check token copied correctly

### **❌ Error: "Resource not accessible by integration"**
**Fix:**
- Token missing required permissions
- Add `Actions: write`, `Contents: write`, `Workflows: write`

### **❌ Token revoked unexpectedly**
**Fix:**
- GitHub auto-revokes leaked tokens
- Never commit tokens to code
- Use environment variables

---

## ✅ CHECKLIST

- [ ] **Step 1:** Create GitHub token (fine-grained recommended)
- [ ] **Step 2:** Select permissions:
  - [ ] Actions: Read & write
  - [ ] Contents: Read & write
  - [ ] Pull requests: Read & write
  - [ ] Workflows: Read & write
- [ ] **Step 3:** Set expiration (1 year recommended)
- [ ] **Step 4:** Generate & copy token
- [ ] **Step 5:** Save token securely
- [ ] **Step 6:** Set as environment variable
- [ ] **Step 7:** Configure git credentials
- [ ] **Step 8:** Test push
- [ ] **Step 9:** Verify on GitHub
- [ ] **Step 10:** Document for team

---

## 📚 REFERENCES

### **GitHub Docs:**
- Personal Access Tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- Fine-grained tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token
- GitHub Apps: https://docs.github.com/en/developers/apps/building-github-apps

### **Token Scopes:**
- https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps

### **Security:**
- https://docs.github.com/en/code-security/secret-scanning

---

## 🎉 SUMMARY

**Để GenSpark tự động làm việc:**

1. ✅ Tạo Fine-grained Token:
   - https://github.com/settings/tokens
   - Permissions: Actions, Contents, PRs, Workflows (all Read & write)

2. ✅ Copy token: `github_pat_11XXXXX...`

3. ✅ Set environment:
   ```bash
   export GITHUB_TOKEN="github_pat_11XXXXX..."
   ```

4. ✅ Configure git:
   ```bash
   git remote set-url origin https://bighi9999:$GITHUB_TOKEN@github.com/bighi9999/Quet.git
   ```

5. ✅ Test:
   ```bash
   git push -u origin master
   ```

**🎊 Done! GenSpark can now auto-push! 🎊**

---

**Made with ❤️ and AI**  
**Date**: 2025-12-17  
**Repository**: https://github.com/bighi9999/Quet  
**Status**: Ready for Auto-Deploy ✅
