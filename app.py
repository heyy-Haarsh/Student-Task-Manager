from flask import Flask, render_template, request, redirect, url_for, Response
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from time import time

app = Flask(__name__)

tasks = ["Complete OS Assignment", "Submit IT Lab Manual"]

# -------------------------------------------------
# Prometheus Metrics
# -------------------------------------------------

HTTP_REQUESTS = Counter(
    "http_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint", "status"],
)

HTTP_REQUEST_DURATION = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"],
)


# -------------------------------------------------
# Track HTTP Requests (skip /metrics itself)
# -------------------------------------------------

@app.before_request
def before_request():
    if request.path == "/metrics":
        return
    request._prom_start_time = time()


@app.after_request
def after_request(response):
    if request.path == "/metrics":
        return response

    method = request.method
    endpoint = request.path
    status = str(response.status_code)

    HTTP_REQUESTS.labels(
        method=method,
        endpoint=endpoint,
        status=status,
    ).inc()

    start = getattr(request, "_prom_start_time", None)
    if start is not None:
        HTTP_REQUEST_DURATION.labels(
            method=method,
            endpoint=endpoint,
        ).observe(time() - start)

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
