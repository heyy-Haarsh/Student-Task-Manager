"""
Student Task Management System
Base application entry point.

This is the minimal skeleton that lives on `main`. Feature branches
(user-authentication, task-crud, task-dashboard-ui, notifications-reminders)
build on top of this.
"""

from flask import Flask, render_template
from config import Config
from models import db


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    register_routes(app)
    return app


def register_routes(app):
    @app.route("/")
    def index():
        return render_template("index.html", title="Student Task Manager")

    @app.route("/health")
    def health():
        return {"status": "ok"}


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
