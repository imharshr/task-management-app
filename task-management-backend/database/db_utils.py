import os
import mysql.connector.pooling
import pymysql as pymysql
from mysql.connector import Error
from dotenv import load_dotenv

from utils.logger import setup_logger

load_dotenv()

logger = setup_logger(__name__, 'tasks.log')


def close_connection(connection):
    if connection.is_connected():
        connection.close()
        logger.info("Database connection closed!")


class Database:
    def __init__(self):
        self.connection_pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="task_management_pool",
            pool_size=5,
            pool_reset_session=True,
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE")
        )

    def get_connection(self):
        try:
            connection = self.connection_pool.get_connection()
            if connection.is_connected():
                logger.info("Database connection established!")
                return connection

        except Error as e:
            logger.info(f"Error getting database connection: {e}")
            return None

    def ping_database(self):
        try:
            connection = self.get_connection()
            if connection:
                cursor = connection.cursor()
                cursor.execute("SELECT 1")
                logger.info("Database ping successful")
                if connection:
                    close_connection(connection)
        except mysql.connector.Error as e:
            logger.info(f"Error pinging database: {e}")

    def execute_query(self, query, params=None):
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        status = False
        result = None

        try:
            cursor.execute(query, params)
            result = cursor.fetchall()
            status = True
            connection.commit()

        except Error as e:
            logger.error(f"Error occurred while executing: {query} params: {params},"
                         f" error: {e}")
            logger.info(f"Error executing query: {e}")

        finally:
            close_connection(connection)
            return result, status

    def get_tasks(self):
        query = "SELECT * FROM tasks;"
        return self.execute_query(query)

    def add_task(self, title, description, status):
        query = "INSERT INTO tasks (title, description, status) VALUES (%s, %s, %s);"
        params = (title, description, status)
        return self.execute_query(query, params)

    def delete_task(self, task_id):
        query = "DELETE FROM tasks WHERE id = %s;"
        params = (task_id,)
        return self.execute_query(query, params)

    def update_task(self, task_id, title, description, status):
        query = "UPDATE tasks SET title = %s, description = %s, status = %s WHERE id = %s;"
        params = (title, description, status, task_id)
        return self.execute_query(query, params)
