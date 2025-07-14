# GitHub Branch Protection & Repository Settings Guide

## 🔒 Branch Protection Rules

### Setting Up Branch Protection for Main Branch

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click **Settings** tab
   - Click **Branches** in the left sidebar

2. **Add Branch Protection Rule for `main`**
   - Click **Add rule**
   - Branch name pattern: `main`
   - Configure the following settings:

#### ✅ Required Settings for Owner-Only Merging:

**Restrict pushes that create files:**

- ☑️ **Restrict pushes that create files larger than 100 MB**

**Protect matching branches:**

- ☑️ **Require a pull request before merging**
  - ☑️ **Require approvals**: Set to `1`
  - ☑️ **Dismiss stale PR approvals when new commits are pushed**
  - ☑️ **Require review from code owners** (if you have CODEOWNERS file)
  - ☑️ **Restrict reviews to users with write access**

- ☑️ **Require status checks to pass before merging**
  - ☑️ **Require branches to be up to date before merging**

- ☑️ **Require conversation resolution before merging**

- ☑️ **Require signed commits** (optional, for extra security)

- ☑️ **Require linear history** (optional, keeps clean history)

**Restrictions:**

- ☑️ **Restrict pushes that create files larger than specified limit**

**Rules applied to everyone including administrators:**

- ☑️ **Include administrators** ⚠️ **IMPORTANT: Check this to apply rules to yourself too**

3. **Save Changes**
   - Click **Create** to apply the protection rule

### Setting Up Branch Protection for `develop` Branch

Repeat the same process for the `develop` branch with slightly relaxed rules:

**Branch name pattern:** `develop`

- ☑️ **Require a pull request before merging**
  - ☑️ **Require approvals**: Set to `1`
- ☑️ **Require status checks to pass before merging**
- ☑️ **Include administrators** (if you want to apply rules to yourself)

## 🛡️ Additional Repository Security Settings

### 1. Collaborator Permissions

**Repository Settings > Manage access:**

- **Base permissions**: Set to `Read` (default)
- Only add collaborators with specific permissions when needed
- Use **Write** permission only for trusted contributors
- Use **Admin** permission very sparingly

### 2. General Repository Settings

**Repository Settings > General:**

**Features:**

- ☑️ **Wikis** (if you want community documentation)
- ☑️ **Issues** (for bug reports and feature requests)
- ☑️ **Sponsorships** (if you want to accept sponsorships)
- ☑️ **Discussions** (for community discussions)

**Pull Requests:**

- ☑️ **Allow merge commits**
- ☑️ **Allow squash merging**
- ☑️ **Allow rebase merging**
- ☑️ **Always suggest updating pull request branches**
- ☑️ **Allow auto-merge**
- ☑️ **Automatically delete head branches**

**Archive:**

- ⭕ Do not archive (keep active for contributions)

### 3. Security Settings

**Repository Settings > Security:**

**Security policy:**

- Create a `SECURITY.md` file with vulnerability reporting instructions

**Security advisories:**

- ☑️ Enable private vulnerability reporting

**Dependency graph:**

- ☑️ Enable dependency graph
- ☑️ Enable Dependabot alerts
- ☑️ Enable Dependabot security updates

## 📋 CODEOWNERS File (Optional but Recommended)

Create a `.github/CODEOWNERS` file to automatically request your review:

\`\`\`

# Global code owners

- @httpshahan

# Specific paths (examples)

/src/ @httpshahan
/docs/ @httpshahan
/package.json @httpshahan
/README.md @httpshahan
/.github/ @httpshahan
\`\`\`

## 🔄 Workflow for Contributors

With these settings, the workflow becomes:

1. **Contributors fork** your repository
2. **Create feature branch** from develop
3. **Submit pull request** to develop branch
4. **You review and approve** the PR
5. **Only you can merge** after approval
6. **Branch is automatically deleted** after merge

## ⚠️ Important Notes

### For Complete Control:

- **Include administrators** in branch protection rules
- This means even YOU must create PRs and cannot push directly
- You can still approve your own PRs if needed

### For Easier Development:

- **Don't include administrators** in branch protection rules
- You can push directly, but contributors must use PRs
- Less secure but more convenient for solo development

### Recommended Approach:

1. **Start with "Include administrators"** for maximum security
2. **Create develop branch protection** with same rules
3. **Use feature branches** even for your own work
4. **Review all PRs carefully** before merging

## 🚀 Quick Setup Commands

After setting up protection rules, update your workflow:

\`\`\`bash

# Your development workflow

git checkout develop
git pull origin develop
npm run branch:feature feature/my-feature

# Make changes, then:

git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature

# Create PR on GitHub, review, and merge via GitHub UI

\`\`\`

This ensures all changes go through proper review process and only you can approve merges!
