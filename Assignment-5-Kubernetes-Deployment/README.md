# Assignment 5 — Kubernetes Deployment

## CO Mapped

**CO2**

## Aim

Deploy the Dockerized Student Task Manager on Kubernetes (using Minikube), configure scaling, and make the app accessible to users.

## Tools Used

- Minikube (`v1.39.0` on this machine)
- kubectl (`v1.36.1` client on this machine)
- Docker (driver for Minikube)
- Root manifests: [`../deployment.yaml`](../deployment.yaml), [`../service.yaml`](../service.yaml)
- Image from Assignment 4 / [`../Dockerfile`](../Dockerfile)

## Prerequisites

- Docker Desktop installed
- Minikube and kubectl installed
- Assignment 4 image available (or rebuild steps below)
- PowerShell

## Related Files

- [`../deployment.yaml`](../deployment.yaml) — Deployment (`student-task-manager`)
- [`../service.yaml`](../service.yaml) — Service (`student-task-manager-service`)
- [`../Dockerfile`](../Dockerfile) — image build
- [`../app.py`](../app.py) — listens on `0.0.0.0:5000`
- Screenshots: [`./screenshots/`](./screenshots/)

## Manifest validation

### Deployment ([`../deployment.yaml`](../deployment.yaml))

| Check | Result |
|-------|--------|
| Label / selector match | `spec.selector.matchLabels.app: student-task-manager` matches `template.metadata.labels.app: student-task-manager` |
| `containerPort` vs Flask | `containerPort: 5000` matches [`../app.py`](../app.py) `port=5000` |
| Image name | `student-task-manager:1.0` |
| `imagePullPolicy` | `IfNotPresent` — suitable for a locally built / loaded image (avoids forcing a registry pull) |
| Replicas | `2` |

### Service ([`../service.yaml`](../service.yaml))

| Check | Result |
|-------|--------|
| Selector vs Pod labels | `selector.app: student-task-manager` matches Deployment Pod labels |
| Type | `NodePort` — good for Minikube access from the host |
| `port` / `targetPort` | Both `5000`, matching the container / Flask port |
| `nodePort` | Not set — Kubernetes will assign a NodePort in the default range automatically |

### Issues found

1. **Image tag discipline (not a YAML syntax error):** Assignment 4’s primary build command was `docker build -t student-task-manager .`, which tags `:latest` by default. This Deployment expects `student-task-manager:1.0`. You must rebuild or retag as `:1.0` (commands below) before pods can start. **YAML was left as `:1.0`** because that version tag is intentional and already referenced from Assignment 4 docs.
2. **No clear errors** in labels, selectors, ports, Service type, or `imagePullPolicy`.

### Changes made

| File | Change |
|------|--------|
| [`../deployment.yaml`](../deployment.yaml) | **No edits** |
| [`../service.yaml`](../service.yaml) | **No edits** |
| `Assignment-5-Kubernetes-Deployment/README.md` | Created (this file) |

## YAML field explanations

### Deployment fields

| Field | Meaning in this project |
|-------|-------------------------|
| `apiVersion` | API group/version — `apps/v1` for Deployments. |
| `kind` | Resource type — `Deployment` (keeps Pods running to a desired count). |
| `metadata.name` | Object name — `student-task-manager`. |
| `spec.replicas` | Desired Pod count — currently `2`. |
| `spec.selector` | How the Deployment finds its Pods — must match Pod labels. |
| `spec.template` | Pod template used to create new Pods. |
| `template.metadata.labels` | Labels on each Pod — `app: student-task-manager`. |
| `spec.template.spec.containers` | Container list inside each Pod. |
| `containers[].name` | Container name — `student-task-manager`. |
| `containers[].image` | Image to run — `student-task-manager:1.0`. |
| `containers[].imagePullPolicy` | When to pull — `IfNotPresent` uses a local image if present. |
| `containers[].ports.containerPort` | Port the process listens on inside the container — `5000`. |

### Service fields

| Field | Meaning in this project |
|-------|-------------------------|
| `apiVersion` | `v1` for core Service objects. |
| `kind` | `Service` — stable network access to Pods. |
| `metadata.name` | Service name — `student-task-manager-service`. |
| `spec.selector` | Selects Pods with `app: student-task-manager`. |
| `spec.type` | `NodePort` — publishes the Service on each node’s IP at a high port. |
| `spec.ports[].port` | Port on the Service ClusterIP — `5000`. |
| `spec.ports[].targetPort` | Port on the Pod/container to forward to — `5000`. |
| `spec.ports[].nodePort` | (optional) Fixed host port; omitted here so the cluster assigns one. |
| `protocol` | `TCP`. |

## Steps / Commands (PowerShell)

Do **not** start Minikube or apply manifests until you are ready. On this machine when the README was written, **Minikube was Stopped**. Only read-only `kubectl` output from the current kubeconfig context was captured (see Output).

### 1. Start Minikube (when you choose to)

```powershell
minikube start --driver=docker
minikube status
```

> 📸 **Screenshot to add:** `screenshots/01-minikube-status.png`: `minikube status` showing host/kubelet/apiserver Running

### 2. Make the Docker image available to Minikube

**Option A — point your shell’s Docker CLI at Minikube’s Docker daemon, then rebuild:**

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
docker build -t student-task-manager:1.0 .
```

**Option B — build on the host, then load into Minikube:**

```powershell
docker build -t student-task-manager:1.0 .
minikube image load student-task-manager:1.0
```

Use tag `:1.0` so the name matches [`../deployment.yaml`](../deployment.yaml).

### 3. Apply the manifests

From the repository root:

```powershell
kubectl apply -f deployment.yaml -f service.yaml
```

### 4. Check Deployments, Pods, and Services

```powershell
kubectl get pods,svc,deploy
kubectl get pods -l app=student-task-manager
kubectl get svc student-task-manager-service
```

> 📸 **Screenshot to add:** `screenshots/02-kubectl-get-pods-svc.png`: `kubectl get pods,svc,deploy` showing the Deployment, Pods, and NodePort Service

### 5. Get a URL and open the app

Real Service name from [`../service.yaml`](../service.yaml):

```powershell
minikube service student-task-manager-service --url
```

Open the printed URL in a browser (Minikube maps the NodePort for you).

> 📸 **Screenshot to add:** `screenshots/05-browser-minikube-url.png`: Browser showing the Student Task Manager opened via the Minikube Service URL

## Scaling

Real Deployment name: `student-task-manager`.

### Scale up to 3 replicas

```powershell
kubectl scale deployment student-task-manager --replicas=3
kubectl get pods -l app=student-task-manager
kubectl get pods -w
```

`kubectl get pods -w` watches events live (new Pods moving to `Running`). Press `Ctrl+C` to stop watching.

> 📸 **Screenshot to add:** `screenshots/03-scaled-3-replicas.png`: Three Pods for `student-task-manager` in Running state

### Scale back down

```powershell
kubectl scale deployment student-task-manager --replicas=2
```

(or `--replicas=1` if you want a single Pod)

## Self-healing demo

A Deployment replaces Pods that disappear so the replica count stays correct.

```powershell
kubectl get pods -l app=student-task-manager
kubectl delete pod <pod-name>
kubectl get pods -l app=student-task-manager -w
```

Replace `<pod-name>` with a real name from `kubectl get pods` (example shape: `student-task-manager-xxxxxxxx-xxxxx`). After delete, Kubernetes creates a replacement Pod automatically.

> 📸 **Screenshot to add:** `screenshots/04-pod-self-healing.png`: After deleting one Pod, a new Pod appears and becomes Running

**Do not run the delete command until you approve destructive actions** on your cluster.

## Rolling update note

To roll out a new image version without downtime:

1. Build a new tag, for example `student-task-manager:1.1`, and load it into Minikube.
2. Update the Deployment image:

```powershell
kubectl set image deployment/student-task-manager student-task-manager=student-task-manager:1.1
kubectl rollout status deployment/student-task-manager
```

Kubernetes starts new Pods with the new image and terminates old ones gradually (rolling update). Check history with:

```powershell
kubectl rollout history deployment/student-task-manager
```

## Output

### Tools on this machine

```text
minikube version: v1.39.0
Client Version: v1.36.1
```

### Minikube status (captured)

```text
minikube
type: Control Plane
host: Stopped
kubelet: Stopped
apiserver: Stopped
kubeconfig: Stopped
```

Minikube was **not** started for this write-up (per instruction: do not start/stop/delete without asking).

### Read-only kubectl (captured; no resources applied)

`kubectl get pods,svc,deploy` against the current kubeconfig context:

```text
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   23d
```

`kubectl get nodes`:

```text
NAME                    STATUS   ROLES           AGE   VERSION
desktop-control-plane   Ready    control-plane   23d   v1.36.1
```

Notes:

- Minikube itself was Stopped.
- The active kubectl context talked to a Ready node named `desktop-control-plane` (likely Docker Desktop Kubernetes), not a running Minikube profile.
- No `student-task-manager` Deployment/Service/Pods were present, and none were created here.

Pending until you start Minikube and apply manifests: `kubectl get pods,svc,deploy` for this app, `minikube service student-task-manager-service --url`, scale, and self-healing output.

### Screenshot placeholders

> 📸 **Screenshot to add:** `screenshots/01-minikube-status.png`: `minikube status` showing host/kubelet/apiserver Running

> 📸 **Screenshot to add:** `screenshots/02-kubectl-get-pods-svc.png`: `kubectl get pods,svc,deploy` showing the Deployment, Pods, and NodePort Service

> 📸 **Screenshot to add:** `screenshots/03-scaled-3-replicas.png`: Three Pods for `student-task-manager` in Running state

> 📸 **Screenshot to add:** `screenshots/04-pod-self-healing.png`: After deleting one Pod, a new Pod appears and becomes Running

> 📸 **Screenshot to add:** `screenshots/05-browser-minikube-url.png`: Browser showing the Student Task Manager opened via the Minikube Service URL

## Observations

1. Labels and selectors already line up across Deployment and Service; ports match Flask on `5000`.
2. `imagePullPolicy: IfNotPresent` fits a locally built Minikube image.
3. Build/load the image as `student-task-manager:1.0` so it matches the Deployment.
4. Minikube was stopped during documentation; apply/scale/delete were not run without your approval.
5. Check `kubectl config current-context` before applying so you target Minikube, not another local cluster.

## Conclusion

With Minikube, a Deployment runs multiple replicas of the Dockerized Flask app, a NodePort Service makes it reachable, and kubectl scale / pod replacement demonstrate scaling and self-healing. That supports **CO2** for Kubernetes deployment of the containerized application.
