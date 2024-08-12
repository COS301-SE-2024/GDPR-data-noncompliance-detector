from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

app.conf.task_routes = {
    'tasks.*': {'queue': 'default'},
}
