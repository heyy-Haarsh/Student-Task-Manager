# Assignment 4 — Dockerization

## CO Mapped

**CO2**

## Aim

Containerize the Student Task Manager sample application using Docker so that it runs on any machine without manual Python/setup steps on the host.

## Tools Used

- Docker Desktop / Docker Engine (Windows)
- Root [`../Dockerfile`](../Dockerfile)
- Root [`../requirements.txt`](../requirements.txt)
- Root [`.dockerignore`](../.dockerignore)
- Flask app: [`../app.py`](../app.py)

## Prerequisites

- Docker Desktop installed on Windows
- Docker daemon running (Docker Desktop started)
- This repository available locally

## Related Files

- [`../Dockerfile`](../Dockerfile) — image build instructions
- [`../requirements.txt`](../requirements.txt) — Python packages installed in the image
- [`.dockerignore`](../.dockerignore) — files kept out of the build context
- [`../app.py`](../app.py) — listens on `0.0.0.0:5000`
- [`../deployment.yaml`](../deployment.yaml) — later uses image name `student-task-manager:1.0`
- Screenshots: [`./screenshots/`](./screenshots/)

## Why containers?

| Idea | Simple meaning |
|------|----------------|
| Portability | Same image runs on a classmate’s laptop, a lab PC, or a server without reinstalling Flask by hand. |
| Isolation | App dependencies live inside the container, so they do not fight with other Python versions on the host. |
| Image vs container | An **image** is the packaged recipe/snapshot. A **container** is a running instance of that image. |

## Dockerfile review (line by line)

Real file: [`../Dockerfile`](../Dockerfile)

| Instruction | Purpose |
|-------------|---------|
| `FROM python:3.12-slim` | Start from a small official Python 3.12 image. |
| `WORKDIR /app` | Set the working directory inside the image to `/app`. |
| `COPY requirements.txt .` | Copy only the dependency list first (helps Docker cache the install layer). |
| `RUN pip install --no-cache-dir -r requirements.txt` | Install Flask and other packages from [`../requirements.txt`](../requirements.txt). |
| `COPY . .` | Copy the application source into `/app`. |
| `EXPOSE 5000` | Document that the process listens on port 5000. |
| `CMD ["python", "app.py"]` | Default command: start the Flask app. |

### Checks against the real app

| Check | Result |
|-------|--------|
| Base image | `python:3.12-slim` is a sensible slim official image. |
| `WORKDIR` | Present (`/app`). |
| Requirements before full code copy | Yes — good layer caching. |
| `EXPOSE` vs app port | [`../app.py`](../app.py) uses `port=5000`; `EXPOSE 5000` matches. |
| Host binding | [`../app.py`](../app.py) uses `host='0.0.0.0'`, so the app accepts connections from outside the container. |
| `CMD` | `python app.py` matches how the app is started. |

### Problems found

1. **Missing `.dockerignore` (fixed):** without it, `COPY . .` could send `.git`, `node_modules`, assignment folders, databases, and virtualenvs into the build context (slower builds, larger/noisier context).
2. **No clear errors inside the Dockerfile text itself** — base image, `WORKDIR`, copy order, port, and `CMD` already look correct for this app. **No lines in `Dockerfile` were changed.**

### Changes made in this assignment

| Change | Why |
|--------|-----|
| Created root [`.dockerignore`](../.dockerignore) | Exclude junk from the Docker build context. |
| Created `Assignment-4-Dockerization/README.md` | Lab documentation. |
| Ensured `screenshots/.gitkeep` | Keep the screenshots folder in Git. |
| **Dockerfile** | **No edits** (no clear errors to fix). |

## `.dockerignore` entries explained

Created at the repo root because none existed.

| Entry | Why it is ignored |
|-------|-------------------|
| `.git` | Git history is not needed inside the image. |
| `node_modules` | Node packages are for local/Jenkins JS checks, not the Flask container runtime. |
| `__pycache__` / `*.pyc` | Compiled Python junk; regenerated automatically. |
| `*.db` | Local SQLite files should not be baked into the image. |
| `.env` | Secrets/local env files must not enter the image. |
| `venv` / `.venv` | Host virtualenvs are not used inside the container. |
| `Assignment-*` | Lab write-ups are not required to run the app. |
| `tests` | Image `CMD` only runs `python app.py`; Node tests are not needed in this runtime image. |

## Steps / Commands

### 1. Confirm Docker is available

```powershell
docker --version
docker info
```

**Captured on this machine:**

```text
Docker version 29.7.2, build a7dcaa6
```

`docker info` reported that the daemon was **not** running:

```text
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine;
check if the path is correct and if the daemon is running:
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

So build/run commands below were **not executed** here. Start Docker Desktop, then run them and paste your real output into the Output section.

### 2. Build the image

From the repository root (where [`../Dockerfile`](../Dockerfile) lives):

```powershell
docker build -t student-task-manager .
```

Creates a local image tagged `student-task-manager`.

> 📸 **Screenshot to add:** `screenshots/01-docker-build.png`: Terminal showing `docker build` finishing successfully

### 3. List images

```powershell
docker images
```

Confirm `student-task-manager` appears in the list.

> 📸 **Screenshot to add:** `screenshots/02-docker-images.png`: `docker images` showing `student-task-manager`

### 4. Run a container (map the real app port)

[`../app.py`](../app.py) listens on port **5000**, and the Dockerfile exposes **5000**:

```powershell
docker run -d -p 5000:5000 --name stm student-task-manager
```

- `-d` runs in the background
- `-p 5000:5000` maps host port 5000 to container port 5000
- `--name stm` names the container

### 5. Check it is running and view logs

```powershell
docker ps
docker logs stm
```

> 📸 **Screenshot to add:** `screenshots/03-docker-ps.png`: `docker ps` showing container `stm` up

### 6. Verify in a browser

Open:

```text
http://127.0.0.1:5000
```

You should see the Student Task Manager page served from the container.

> 📸 **Screenshot to add:** `screenshots/04-browser-app.png`: Browser at `http://127.0.0.1:5000` showing the running app

> 📸 **Screenshot to add:** `screenshots/05-docker-desktop.png`: Docker Desktop Containers view showing `stm`

### 7. Stop and remove the container

```powershell
docker stop stm
docker rm stm
```

Stops the running container, then deletes it. The image `student-task-manager` remains until you remove it with `docker rmi`.

### 8. Optional — push to Docker Hub

Replace `<your-dockerhub-username>` with your real Docker Hub username (do not invent one):

```powershell
docker login
docker tag student-task-manager <your-dockerhub-username>/student-task-manager:1.0
docker push <your-dockerhub-username>/student-task-manager:1.0
```

## Output

### Captured output (this machine)

Docker CLI version:

```text
Docker version 29.7.2, build a7dcaa6
```

Daemon status: **not running** (`docker info` could not connect to Docker Desktop). Therefore these outputs are **pending** until Docker Desktop is started and the commands are re-run:

| Command | Status |
|---------|--------|
| `docker build -t student-task-manager .` | Pending |
| `docker images` | Pending |
| `docker run -d -p 5000:5000 --name stm student-task-manager` | Pending |
| `docker ps` | Pending |
| `docker logs stm` | Pending |
| `docker stop stm` / `docker rm stm` | Pending |

### Screenshot placeholders

> 📸 **Screenshot to add:** `screenshots/01-docker-build.png`: Terminal showing `docker build` finishing successfully

> 📸 **Screenshot to add:** `screenshots/02-docker-images.png`: `docker images` showing `student-task-manager`

> 📸 **Screenshot to add:** `screenshots/03-docker-ps.png`: `docker ps` showing container `stm` up

> 📸 **Screenshot to add:** `screenshots/04-browser-app.png`: Browser at `http://127.0.0.1:5000` showing the running app

> 📸 **Screenshot to add:** `screenshots/05-docker-desktop.png`: Docker Desktop Containers view showing `stm`

## Observations

1. The existing [`../Dockerfile`](../Dockerfile) already follows good practice: slim base image, `WORKDIR`, requirements copied before full source, port 5000 aligned with [`../app.py`](../app.py), and `0.0.0.0` binding in the app.
2. Adding [`.dockerignore`](../.dockerignore) is the main packaging improvement for this assignment.
3. Build/run could not be demonstrated in this write-up because Docker Desktop’s engine was stopped, even though `docker --version` worked.
4. Browser check URL for a successful local run is `http://127.0.0.1:5000`.

## Conclusion

Docker packages the Flask Student Task Manager and its Python dependencies into an image so the app can start with `docker run` on any machine that has Docker, without manual host setup. That supports **CO2** for containerizing a sample application.
