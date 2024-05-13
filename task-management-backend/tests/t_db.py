from http.client import HTTPException

from database.db_utils import Database
from utils.logger import setup_logger

db = Database()
logger = setup_logger(__name__, "database.log")


def get_tasks():
    tasks = db.get_tasks()
    logger.info(f"Retrieved tasks: {tasks}")
    if tasks:
        logger.info('Retrieved tasks from the database')
        return tasks
    else:
        logger.warning('No tasks found in the database')
        raise HTTPException(status_code=404, detail="No tasks found")


get_tasks()
