# Student Task Management System — Git Branching Strategy

This document defines how work is split across branches, how commits should be
structured, and when/how branches get merged. The project intentionally uses
multiple feature branches to demonstrate real-world Git workflow: branching,
committing, pull requests, code review, and merging.

---

## 1. Branch Model

We use a simplified **Git Flow** with two permanent branches and short-lived
feature branches.

| Branch | Purpose | Lifetime |
|---|---|---|
| `main` | Always stable, deployable code. Only receives merges from `develop` (or hotfixes). | Permanent |
| `develop` | Integration branch. All feature branches merge here first. | Permanent |
| `feature/*` | One branch per feature, branched off `develop`. | Temporary — deleted after merge |
| `bugfix/*` | Fixes found during integration/testing on `develop`. | Temporary |
| `hotfix/*` | Urgent fixes branched from `main`, merged into both `main` and `develop`. | Temporary |

```
main        ──●───────────────────●───────────────●──→  (releases only)
               \                 /               /
develop     ────●───●───●───●───●───●───●───●───●──→  (integration)
                 \       \       \       \
feature/...       ●───●   ●───●   ●───●   ●───●
```

---

## 2. Feature Branches (5 required)

Each branch owns one clearly scoped feature, so it maps to one part of the
CRUD/system and can be reviewed and merged independently.

### 1. `feature/database-setup`
- Design and implement the database schema (Students, Tasks, Categories, Deadlines).
- Set up ORM models / migrations.
- Seed data for local testing.
- **Depends on:** nothing (do this first).
- **Merge target:** `develop`

### 2. `feature/user-authentication`
- Student registration, login, logout.
- Password hashing, session/JWT handling.
- Route protection / middleware for authenticated pages.
- **Depends on:** `feature/database-setup` (needs the Student model).
- **Merge target:** `develop`

### 3. `feature/task-crud`
- Create, read, update, delete tasks.
- Mark task complete/incomplete.
- Input validation and API endpoints (or form handling).
- **Depends on:** `feature/database-setup`.
- **Merge target:** `develop`

### 4. `feature/task-dashboard-ui`
- Dashboard page listing tasks with filters (status, due date, category).
- Sorting, search bar, basic stats (e.g., tasks completed this week).
- **Depends on:** `feature/task-crud` (needs task data to render).
- **Merge target:** `develop`

### 5. `feature/notifications-reminders`
- Deadline reminders (email or in-app banner) for tasks due soon/overdue.
- Simple scheduler/cron-style check.
- **Depends on:** `feature/task-crud`.
- **Merge target:** `develop`

> Optional 6th branch if you want to extend the demo further:
> `feature/task-categories-tags` — add categories/labels and priority levels to tasks.

---

## 3. Recommended Build Order

Because some features depend on others, follow this sequence so each branch
can be created off an up-to-date `develop`:

1. `feature/database-setup` → merge to `develop`
2. `feature/user-authentication` → merge to `develop`
3. `feature/task-crud` → merge to `develop`
4. `feature/task-dashboard-ui` → merge to `develop`
5. `feature/notifications-reminders` → merge to `develop`
6. Once all features are merged and tested on `develop` → merge `develop` into `main` and tag a release.

Branches 4 and 5 can technically be worked on in parallel by different
teammates since they both only depend on `feature/task-crud` being merged
into `develop` first.

---

## 4. Naming Conventions

- Branches: `feature/short-description`, `bugfix/short-description`, `hotfix/short-description` (lowercase, hyphens).
- Commits: use [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add task creation endpoint`
  - `fix: correct due-date timezone bug`
  - `chore: update dependencies`
  - `docs: add API usage notes`
  - `refactor: simplify task filter logic`
  - `test: add unit tests for auth middleware`

Commit often, in small logical chunks — this is part of what you're
demonstrating, so avoid single giant "final commit" dumps.

---

## 5. Workflow Per Feature

```bash
# 1. Start from the latest develop
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/task-crud

# 3. Work + commit incrementally
git add .
git commit -m "feat: add create-task API endpoint"
git commit -m "feat: add update and delete task endpoints"
git commit -m "test: add tests for task CRUD"

# 4. Push and open a Pull Request into develop
git push -u origin feature/task-crud
```

Open a PR: `feature/task-crud` → `develop`.

---

## 6. Pull Request & Merge Rules

- **Never commit directly to `main` or `develop`.** All changes go through a PR.
- Every PR must:
  - Have a clear title/description of what it adds.
  - Pass any tests/build checks before merge.
  - Be reviewed (self-review is fine for a solo/demo project, but leave PR comments to show the review step).
- Use **"Squash and merge"** or **"Merge commit"** consistently — pick one for the whole project (merge commit is better here since the goal is to *show* branching history clearly).
- Delete the feature branch after it's merged (keep history clean).
- `develop → main` merges only happen when all planned features for that release are merged and manually tested end-to-end. Tag the release, e.g. `v1.0.0`.

---

## 7. Handling Bugs Found During Integration

If a bug is found on `develop` after merging a feature:
```bash
git checkout develop
git pull origin develop
git checkout -b bugfix/fix-task-date-validation
# fix, commit, push, PR back into develop
```

If a critical bug is found on `main` (production) after release:
```bash
git checkout main
git checkout -b hotfix/fix-login-crash
# fix, commit, push
# PR into main AND cherry-pick / PR into develop
```

---

## 8. Suggested Branch Protection Settings (GitHub)

For `main` and `develop`:
- Require pull request before merging.
- Require at least 1 approval (or self-approve with a comment for demo purposes).
- Require status checks to pass (if CI is set up).
- Disallow force-push and branch deletion.

---

## 9. Summary Table

| Branch | Off of | Merges into | Feature |
|---|---|---|---|
| `feature/database-setup` | `develop` | `develop` | Schema & models |
| `feature/user-authentication` | `develop` | `develop` | Register/login/auth |
| `feature/task-crud` | `develop` | `develop` | Create/read/update/delete tasks |
| `feature/task-dashboard-ui` | `develop` | `develop` | Task list, filters, stats UI |
| `feature/notifications-reminders` | `develop` | `develop` | Deadline reminders |
| `develop` | `main` | `main` | Integration → release |

This structure gives you a clean, demonstrable Git history: independent
feature branches, incremental commits, pull requests, reviews, and a
controlled merge path from feature → develop → main.
