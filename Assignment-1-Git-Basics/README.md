# Assignment 1 — Git Basics

## CO Mapped

**CO1**

## Aim

Create a GitHub repository for the Student Task Manager sample application, commit code, and demonstrate basic Git operations: clone, branch, merge, push, and pull.

## Tools Used

- Git (command line / PowerShell on Windows)
- GitHub (`https://github.com/heyy-Haarsh/Student-Task-Manager`)

## Prerequisites

- Git installed and available in PowerShell (`git --version`)
- A GitHub account with access to this repository
- This project already cloned, or permission to clone it again

## Related Files

- Application entry point: [`../app.py`](../app.py)
- Branching workflow notes: [`../BRANCHING_STRATEGY.md`](../BRANCHING_STRATEGY.md)
- Screenshots folder: [`./screenshots/`](./screenshots/)

## Git concepts

| Concept | Simple meaning |
|---------|----------------|
| Working directory | The files I edit on disk right now (my project folder). |
| Staging area | Files I marked with `git add` that will go into the next commit. |
| Local repository | The `.git` history stored on my computer (commits, branches). |
| Remote repository | The copy on GitHub (`origin`) that teammates can clone and push to. |

## Steps / Commands

### 1. Create / initialise a local repository

```powershell
git init
```

Creates a new empty Git repository in the current folder (starts the local `.git` history).

This Student Task Manager repo already has Git history. The first commit visible in the graph is `f2a0f22 Initial commit`.

### 2. Clone this repository from GitHub

```powershell
git clone https://github.com/heyy-Haarsh/Student-Task-Manager.git
cd Student-Task-Manager
```

Copies the remote GitHub project to my machine and sets `origin` to that URL.

Real remote for this repo (`git remote -v`):

```text
origin	https://github.com/heyy-Haarsh/Student-Task-Manager.git (fetch)
origin	https://github.com/heyy-Haarsh/Student-Task-Manager.git (push)
```

> 📸 **Screenshot to add:** `screenshots/01-git-clone.png`: PowerShell after a successful `git clone` of this repository

### 3. Check the working tree status

```powershell
git status
```

Shows which branch I am on and which files are modified, staged, or untracked.

### 4. Stage files

```powershell
git add .
# or stage one file:
git add app.py
```

Moves chosen changes from the working directory into the staging area.

Example from this repo history: commit `d2d0a08` (`Add delete task route and UI button`) changed `app.py` and `templates/index.html` — those files would first have been staged with `git add`.

### 5. Commit staged changes

```powershell
git commit -m "Add delete task route and UI button"
```

Saves a snapshot of the staged files into the local repository with a message.

Real recent commits on `main` (from `git log --oneline`):

```text
2ee0cca Add DevOps lab Cursor rules for assignment work.
6ce33ce Update .gitignore
e116c53 Add assignment folders
fa41019 Merge branch 'main' of https://github.com/heyy-Haarsh/Student-Task-Manager
aa036d5 Restructure repo with assignment folders
```

### 6. List branches

```powershell
git branch
git branch -a
```

`git branch` lists local branches. `git branch -a` also lists remote-tracking branches.

Real output from this repo (`git branch -a`):

```text
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/abc
  remotes/origin/addprority
  remotes/origin/copilot/feature-list
  remotes/origin/feature-delete-task
  remotes/origin/feature-modify-task
  remotes/origin/feature/add
  remotes/origin/main
```

> 📸 **Screenshot to add:** `screenshots/02-git-branch.png`: PowerShell output of `git branch -a` for this project

### 7. Create and switch to a new branch

```powershell
git checkout -b feature-delete-task
# modern equivalent:
git switch -c feature-delete-task
```

Creates a new branch from the current commit and switches to it so new commits stay off `main` until merged.

This repo has a real feature branch still on the remote: `origin/feature-delete-task` (tip commit `d2d0a08 Add delete task route and UI button`).

### 8. Merge a branch into the current branch

```powershell
git checkout main
git merge feature-delete-task
```

Combines the selected branch history into the branch I am currently on.

Real merge commits from this repo (`git log --merges --oneline`):

```text
fa41019 Merge branch 'main' of https://github.com/heyy-Haarsh/Student-Task-Manager
f01ca59 Add Node.js build and validation setup for Jenkins
f0cf59e Merge pull request #3 from heyy-Haarsh/feature-modify-task
9ad4f91 Merge pull request #2 from heyy-Haarsh/feature-delete-task
```

`9ad4f91` is the merge of PR #2 (`feature-delete-task`). `f0cf59e` is the merge of PR #3 (`feature-modify-task`).

> 📸 **Screenshot to add:** `screenshots/03-git-merge.png`: PowerShell after merging a feature branch into `main`, or the merge commit in `git log`

### 9. Push commits to GitHub

```powershell
git push -u origin main
# or push a feature branch:
git push -u origin feature-delete-task
```

Uploads local commits to the remote (`origin`) so they appear on GitHub.

> 📸 **Screenshot to add:** `screenshots/04-git-push.png`: PowerShell showing a successful `git push` to `origin`

### 10. Pull latest changes from GitHub

```powershell
git pull origin main
```

Downloads new commits from the remote and merges them into my current local branch.

A real pull/merge example in this history is `fa41019 Merge branch 'main' of https://github.com/heyy-Haarsh/Student-Task-Manager`, which combined remote `main` history with local work.

> 📸 **Screenshot to add:** `screenshots/05-git-pull.png`: PowerShell showing a successful `git pull` (Already up to date, or merge summary)

### 11. View commit history

```powershell
git log --oneline --graph --all --decorate
```

Shows a compact graph of commits, branches, and tags.

Trimmed real output from this repository:

```text
* 2ee0cca (HEAD -> main, origin/main, origin/HEAD) Add DevOps lab Cursor rules for assignment work.
* 6ce33ce Update .gitignore
* e116c53 Add assignment folders
*   fa41019 Merge branch 'main' of https://github.com/heyy-Haarsh/Student-Task-Manager
|\
| * 71aab04 Add Jenkins CI
| * 7b6d4fd Add jenkins CI demo
| * ec67e8c Restore passing automated test
| * d5ceebb Demonstrate Jenkins test failure
| * 2302211 Configure Jenkins CI environment
| * 5675bb2 Added Jenkins File
| * 8cdf982 Add Jenkins CI pipeline and automated tests
| * fc81027 Fix project structure
* | aa036d5 Restructure repo with assignment folders
|/
*   f01ca59 Add Node.js build and validation setup for Jenkins
|\
* \   9ad4f91 Merge pull request #2 from heyy-Haarsh/feature-delete-task
|\ \
| * | d2d0a08 (origin/feature-delete-task) Add delete task route and UI button
* | | 65211a5 Update project title in README.md
|/ /
* | bfb2d9c readme update
* | c63ca98 Initial Commit
```

### 12. Who contributed (optional check)

```powershell
git shortlog -sne --all
```

Real contributors recorded in this repository:

```text
     7	heyy-Haarsh <harshad08122006@gmail.com>
     6	Harshad Chavan <harshad08122006@gmail.com>
     6	Harshad Chavan <harshad@example.com>
     5	Harshad Chavan <141698528+heyy-Haarsh@users.noreply.github.com>
     2	copilot-swe-agent[bot] <198982749+Copilot@users.noreply.github.com>
     1	AsadPinjari <asadpinjari0404@gmail.com>
     1	Kalyani Gadekar <kalyanigadekar01@gmail.com>
     1	ShreyasSonawane-17 <shreyassonawane017@gmail.com>
```

## Output

### Captured command output

Remote URL, branch list, merge list, shortlog, and the trimmed `git log --graph` above were taken from this repository on the machine where the lab README was written. They are not invented examples.

### Screenshot placeholders

> 📸 **Screenshot to add:** `screenshots/01-git-clone.png`: PowerShell after a successful `git clone` of this repository

> 📸 **Screenshot to add:** `screenshots/02-git-branch.png`: PowerShell output of `git branch -a` for this project

> 📸 **Screenshot to add:** `screenshots/03-git-merge.png`: PowerShell after merging a feature branch into `main`, or the merge commit in `git log`

> 📸 **Screenshot to add:** `screenshots/04-git-push.png`: PowerShell showing a successful `git push` to `origin`

> 📸 **Screenshot to add:** `screenshots/05-git-pull.png`: PowerShell showing a successful `git pull` (Already up to date, or merge summary)

> 📸 **Screenshot to add:** `screenshots/06-github-commits.png`: GitHub repository page for `heyy-Haarsh/Student-Task-Manager` showing the Commits list

## Observations

1. This project already lives on GitHub at `https://github.com/heyy-Haarsh/Student-Task-Manager.git`, so clone, push, and pull all use that same `origin` URL.
2. Local work is currently on `main`. Extra feature history still exists on remotes such as `origin/feature-delete-task` and `origin/feature-modify-task`.
3. Real merges in the history include PR merges (`9ad4f91`, `f0cf59e`) and a local/remote `main` merge (`fa41019`).
4. `git log --graph` makes branch and merge structure easier to see than a flat commit list.

## Conclusion

Basic Git operations were demonstrated using this Student Task Manager repository: initialise / clone, status, add, commit, branch, merge, push, pull, and log. The commands above match the real remote URL, branches, merges, and commit graph of this project, which supports **CO1** for Git fundamentals.
