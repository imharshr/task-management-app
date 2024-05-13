import copy
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.db_utils import Database
from utils.logger import setup_logger

router = APIRouter()


# Define a Pydantic model for Task
class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    status: str


# Create an instance of the Database class
db = Database()

logger = setup_logger(__name__, 'tasks.log')
logger.info("Logger file created!")


# System health check endpoint
@router.get("/health/")
async def check_health():
    try:
        db.ping_database()
        return {"status": "ok"}
    except Exception as e:
        logger.error(f'Health check failed: {e}')
        raise HTTPException(status_code=500, detail="Health check failed")


# Routes to handle CRUD operations for tasks
@router.get("/tasks/", response_model=list[Task])
async def get_tasks():
    tasks, status = db.get_tasks()
    tasks.reverse()
    logger.info(f"Retrieved tasks: {tasks}")
    if status:
        logger.info('Retrieved tasks from the database')
        return tasks
    else:
        logger.warning('No tasks found in the database')
        raise HTTPException(status_code=404, detail="No tasks found")


@router.post("/tasks/", response_model=Task)
async def create_task(task: Task):
    created_task, status = db.add_task(task.title, task.description, task.status)
    if status:
        logger.info('Task created successfully')
        return task
    else:
        logger.error('Failed to create task')
        raise HTTPException(status_code=500, detail="Failed to create task")


@router.put("/tasks/{task_id}")
async def update_task(task_id: int, task: Task):
    updated = copy.deepcopy(task)
    logger.info(f"Task: {task}, Updated Task: {updated}")
    updated_task, status = db.update_task(task_id, task.title, task.description, task.status)
    if status:
        logger.info(f'Task {task_id} updated successfully')
        return updated
    else:
        logger.warning(f'Task {task_id} not found')
        raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int):
    deleted_task, status = db.delete_task(task_id)
    logger.info(f"Deleted task: {deleted_task}, status: {status}")
    if status:
        logger.info(f'Task {task_id} deleted successfully')
        return status
    else:
        logger.warning(f'Task {task_id} not found')
        raise HTTPException(status_code=404, detail="Task not found")
