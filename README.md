# Student Task Manager

A base Flask + SQLite skeleton demonstrating a full Git branching workflow
(see `BRANCHING_STRATEGY.md`).

## Setup

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Visit http://127.0.0.1:5000

## Branches

This `main` branch holds only the base skeleton (app factory, config, base
models, base template). Features are developed on:

- `feature/database-setup`
- `feature/user-authentication`
- `feature/task-crud`
- `feature/task-dashboard-ui`
- `feature/notifications-reminders`

See `BRANCHING_STRATEGY.md` for the full workflow.

##Jenkins CI Demo
This project is integraeted with jenkins CI
