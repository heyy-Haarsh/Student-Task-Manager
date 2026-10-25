# Assignment 3 — Jenkins Build

## CO Mapped

**CO1**

## Aim

Configure Jenkins to manually pull the Student Task Manager sample application from GitHub and build it successfully.

## Tools Used

- Jenkins (Windows install)
- Git
- Node.js and npm (required by this project’s Jenkins build scripts)
- Python (runtime for the Flask app in [`../app.py`](../app.py))
- GitHub repository: `https://github.com/heyy-Haarsh/Student-Task-Manager.git`

## Prerequisites

- Windows machine with administrator rights to install Jenkins
- Java installed (Jenkins needs a JDK/JRE)
- Git installed and available on PATH (`git --version`)
- Node.js and npm installed and available on PATH (`node --version`, `npm --version`)
- Python installed and available on PATH (`python --version`) — useful for running the Flask app after a successful pull
- Network access to GitHub

## Related Files

- Root Pipeline definition (later evolution): [`../Jenkinsfile`](../Jenkinsfile)
- Node project scripts: [`../package.json`](../package.json)
- Build script run by `npm run build`: [`../build.js`](../build.js)
- Python dependencies: [`../requirements.txt`](../requirements.txt)
- Flask application: [`../app.py`](../app.py)
- Screenshots folder: [`./screenshots/`](./screenshots/)

## What “build” means in this project

This repository has two related parts:

| Part | Files | Role |
|------|-------|------|
| Flask web app | [`../app.py`](../app.py), [`../requirements.txt`](../requirements.txt) | Runtime application (Python) |
| Jenkins CI build checks | [`../package.json`](../package.json), [`../build.js`](../build.js), [`../Jenkinsfile`](../Jenkinsfile) | Install Node packages, then run validation |

For Jenkins, **build does not compile Python**. Looking at the real files:

1. **Install dependencies** — `npm install` (from [`../package.json`](../package.json); pulls `html-validate` and other Node deps).
2. **Build step** — `npm run build` runs `node build.js`. That script:
   - checks JavaScript syntax with `node --check app.js` and `node --check task-priority.js`
   - validates HTML with `npx html-validate index.html`
   - exits `0` on success, non-zero on failure

The root [`../Jenkinsfile`](../Jenkinsfile) uses the same idea in Pipeline form: `npm install` → `npm run build` → `npm test`.

Optional (app runtime, not the Node build script): `pip install -r requirements.txt` installs Flask and related packages listed in [`../requirements.txt`](../requirements.txt).

### Manual pull vs Assignment 6

**Manual pull (this assignment):** the Freestyle job only checks out and builds when you click **Build Now**. You trigger it by hand.

**Automated pipeline (Assignment 6):** Jenkins can run the declarative pipeline in [`../Jenkinsfile`](../Jenkinsfile) with stages (Checkout, Install Dependencies, Build, Test) and can be connected to automatic triggers later. That file is the later evolution of this manual Freestyle setup.

## Steps / Commands

### 1. Install Jenkins on Windows

1. Download the Windows Jenkins installer (or the generic WAR) from the official Jenkins site.
2. Run the installer and complete the setup wizard.
3. When installation finishes, open the unlock page in a browser (often `http://localhost:8080`).

> 📸 **Screenshot to add:** `screenshots/01-jenkins-dashboard.png`: Jenkins home / dashboard after login

### 2. Unlock Jenkins

1. Open the initialAdminPassword file shown on the unlock screen (path is printed by the installer, commonly under the Jenkins home directory).
2. Paste the password into the unlock page.
3. Create the first admin user when asked.

### 3. Install suggested plugins (include Git and Pipeline)

1. Choose **Install suggested plugins**.
2. Confirm that **Git** and **Pipeline** plugins are installed (add them from **Manage Jenkins → Plugins** if they are missing).
3. Restart Jenkins if the plugin page asks you to.

### 4. Make Git, Node/npm, and Python available to Jenkins

Jenkins Freestyle **Execute Windows batch command** steps use the same PATH as the Jenkins Windows service / agent environment.

In PowerShell (on the Jenkins machine), verify:

```powershell
git --version
node --version
npm --version
python --version
```

If any command fails inside Jenkins but works in your own terminal, add the install folders to the system PATH, or set tool locations under **Manage Jenkins → Tools**, then restart the Jenkins service.

### 5. Create a Freestyle project

1. From the Jenkins dashboard, click **New Item**.
2. Enter a name, for example `Student-Task-Manager-Manual-Build`.
3. Select **Freestyle project**.
4. Click **OK**.

### 6. Configure Source Code Management (manual pull from GitHub)

In the job configuration page:

1. Under **Source Code Management**, select **Git**.
2. **Repository URL:** `https://github.com/heyy-Haarsh/Student-Task-Manager.git`  
   (this is the real `origin` URL from `git remote -v` in this repo)
3. **Credentials:** add a GitHub credential only if the repo is private or rate-limited; for a public clone, anonymous HTTPS may be enough.
4. **Branches to build:** `*/main`  
   (this project’s default branch is `main`)

Save is done after the build step is added (next section).

> 📸 **Screenshot to add:** `screenshots/02-project-scm-config.png`: Freestyle job SCM section showing this GitHub URL and branch `main`

### 7. Add a Windows Batch build step

Still in the job configuration:

1. Under **Build Steps**, click **Add build step → Execute Windows batch command**.
2. Use commands that match this project’s real Node build (same idea as [`../Jenkinsfile`](../Jenkinsfile) / [`../package.json`](../package.json)):

```bat
echo === Student Task Manager Freestyle Build ===
git --version
node --version
npm --version

echo === Install Node dependencies ===
npm install

echo === Run project build (build.js checks) ===
npm run build

echo === Freestyle build commands finished ===
```

Optional extra line if you also want Python app dependencies installed in the workspace:

```bat
python -m pip install -r requirements.txt
```

That pip line prepares the Flask runtime; it is separate from `npm run build`.

3. Click **Save**.

> 📸 **Screenshot to add:** `screenshots/03-build-step-config.png`: Execute Windows batch command box containing `npm install` and `npm run build`

### 8. Click Build Now (manual pull)

1. Open the Freestyle job page.
2. Click **Build Now**.
3. Jenkins checks out branch `main` from GitHub into the job workspace, then runs the batch commands.

This is the **manual pull**: the Git checkout and build start only because you clicked the button. Nothing in this Freestyle setup polls GitHub or reacts to a webhook until you add that later.

> 📸 **Screenshot to add:** `screenshots/04-build-now.png`: Job page with Build Now clicked / a new build appearing in Build History

### 9. Read the Console Output

1. Open the build in **Build History**.
2. Click **Console Output**.
3. Look for the end of the log. A successful Node build from [`../build.js`](../build.js) prints a success banner when checks pass. Jenkins should mark the build blue/green only if every command exited with code 0.

Do not invent a build number or SUCCESS/FAILURE result here. Capture your own console when you run it.

> 📸 **Screenshot to add:** `screenshots/05-console-success.png`: Console Output ending with Jenkins SUCCESS (your real build number and log)

### 10. Inspect the Jenkins workspace

1. From the job page, open **Workspace** (or browse the job’s workspace folder on disk).
2. Confirm files from GitHub are present, for example `app.py`, `package.json`, `build.js`, `Jenkinsfile`, `requirements.txt`.

> 📸 **Screenshot to add:** `screenshots/06-workspace-listing.png`: Jenkins workspace listing showing checked-out project files

## Troubleshooting

| Issue | Likely cause | What to try |
|-------|--------------|-------------|
| `git` is not recognized in Console Output | Git not on the PATH used by the Jenkins Windows service | Install Git for Windows; add it to the system PATH; restart the Jenkins service; re-run **Build Now** |
| `python` / `pip` not found | Python not installed or not on Jenkins PATH | Install Python and enable “Add to PATH”; restart Jenkins; verify with a batch line `python --version` |
| `node` / `npm` not found | Node.js missing from Jenkins PATH | Install Node.js LTS; restart Jenkins; confirm `node --version` and `npm --version` in the batch step |
| Git clone / checkout fails with auth errors | Private repo, bad credentials, or wrong URL | Confirm URL `https://github.com/heyy-Haarsh/Student-Task-Manager.git`; add a Username/Password or token credential in Jenkins SCM if needed |
| Wrong files / empty unexpected branch | Branch specifier not `main` | Set Branches to build to `*/main` (this repo’s default branch is `main`) |
| Workspace permission / file lock errors | Jenkins user cannot write the job workspace | Run Jenkins as a user with rights to the Jenkins home folder; close programs locking workspace files; wipe workspace and rebuild |

## Output

### Captured facts (from this repo, not from a Jenkins UI run)

Real remote used for SCM:

```text
origin	https://github.com/heyy-Haarsh/Student-Task-Manager.git (fetch)
origin	https://github.com/heyy-Haarsh/Student-Task-Manager.git (push)
```

Real build scripts in [`../package.json`](../package.json):

```json
"build": "node build.js",
"test": "node tests/test.js"
```

Real Pipeline stages in [`../Jenkinsfile`](../Jenkinsfile): Checkout → Install Dependencies (`npm install`) → Build (`npm run build`) → Test (`npm test`).

No Jenkins build number or SUCCESS/FAILURE result is claimed in this README, because a Freestyle run was not captured here.

### Screenshot placeholders

> 📸 **Screenshot to add:** `screenshots/01-jenkins-dashboard.png`: Jenkins home / dashboard after login

> 📸 **Screenshot to add:** `screenshots/02-project-scm-config.png`: Freestyle job SCM section showing this GitHub URL and branch `main`

> 📸 **Screenshot to add:** `screenshots/03-build-step-config.png`: Execute Windows batch command box containing `npm install` and `npm run build`

> 📸 **Screenshot to add:** `screenshots/04-build-now.png`: Job page with Build Now clicked / a new build appearing in Build History

> 📸 **Screenshot to add:** `screenshots/05-console-success.png`: Console Output ending with Jenkins SUCCESS (your real build number and log)

> 📸 **Screenshot to add:** `screenshots/06-workspace-listing.png`: Jenkins workspace listing showing checked-out project files

## Observations

1. In this project, the Jenkins “build” path is Node-based: `npm install` then `npm run build` → [`../build.js`](../build.js).
2. The Flask app is separate: Python packages come from [`../requirements.txt`](../requirements.txt) and the container story is in Assignment 4.
3. Freestyle + **Build Now** is a manual pull. [`../Jenkinsfile`](../Jenkinsfile) is the Pipeline version used more fully in Assignment 6.
4. **Bug report (not fixed):** [`../build.js`](../build.js) runs `npx html-validate index.html`, and [`../tests/test.js`](../tests/test.js) also expects a root `index.html`. On disk, root `index.html` is missing; HTML lives under `public/index.html` and `templates/index.html`. A Freestyle build that runs `npm run build` may fail on HTML validation until that path mismatch is fixed.

## Conclusion

A Jenkins Freestyle job can manually pull `main` from `https://github.com/heyy-Haarsh/Student-Task-Manager.git` and run this repo’s real build commands (`npm install` and `npm run build`). Triggering with **Build Now** demonstrates a manual GitHub pull-and-build for **CO1**, before moving to the automated Pipeline in Assignment 6.
