from flask import Flask, render_template, request, redirect, url_for, Response
from prometheus_client import Counter, Gauge, generate_latest, CONTENT_TYPE_LATEST
import psutil
import os

app = Flask(__name__)

tasks = ["Complete OS Assignment", "Submit IT Lab Manual"]

# -------------------------------------------------
# Prometheus Metrics
# -------------------------------------------------

# Application availability
APP_UP = Gauge(
    "student_task_manager_up",
    "Indicates whether the Student Task Manager application is running"
)

# Total HTTP requests
HTTP_REQUESTS = Counter(
    "http_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint"]
)

# Process memory usage
MEMORY_USAGE = Gauge(
    "student_task_manager_memory_bytes",
    "Memory usage of the Student Task Manager process in bytes"
)

APP_UP.set(1)


# -------------------------------------------------
# Track HTTP Requests
# -------------------------------------------------

@app.before_request
def before_request():
    HTTP_REQUESTS.labels(
        method=request.method,
        endpoint=request.path
    ).inc()


@app.after_request
def after_request(response):
    process = psutil.Process(os.getpid())
    MEMORY_USAGE.set(process.memory_info().rss)
    return response


# -------------------------------------------------
# Application Routes
# -------------------------------------------------

@app.route('/')
def index():
    return render_template('index.html', tasks=tasks)


@app.route('/add', methods=['POST'])
def add_task():
    task = request.form.get('task')

    if task:
        tasks.append(task)

    return redirect(url_for('index'))


@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    if 0 <= task_id < len(tasks):
        tasks.pop(task_id)

    return redirect(url_for('index'))


# -------------------------------------------------
# Prometheus Metrics Endpoint
# -------------------------------------------------

@app.route('/metrics')
def metrics():
    return Response(
        generate_latest(),
        mimetype=CONTENT_TYPE_LATEST
    )


# -------------------------------------------------
# Application Start
# -------------------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)