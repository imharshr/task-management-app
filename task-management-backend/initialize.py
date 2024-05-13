import os
import traceback

import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import time

# Configure logging
from utils.logger import setup_logger

logger = setup_logger(__name__, 'database.log')

load_dotenv()


def initialize_database(retries=3):
    retry_count = 0
    while retry_count < retries:
        try:
            # Connect to MySQL server
            connection = mysql.connector.connect(
                host=os.getenv("MYSQL_HOST"),
                user=os.getenv("MYSQL_USER"),
                password=os.getenv("MYSQL_PASSWORD"),
                database=os.getenv("MYSQL_DATABASE")
            )

            # Create database if it doesn't exist
            cursor = connection.cursor()
            cursor.execute("CREATE DATABASE IF NOT EXISTS task_management_db;")
            connection.commit()

            # Create tasks table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS task_management_db.tasks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    status VARCHAR(50) NOT NULL
                );
            """)
            connection.commit()

            # Insert dummy values into tasks table
            cursor.execute("""
                INSERT INTO task_management_db.tasks (title, description, status)
                VALUES 
                    ('Task 1', 'Description 1', 'To Do'),
                    ('Task 2', 'Description 2', 'In Progress'),
                    ('Task 3', 'Description 3', 'Done');
            """)
            connection.commit()

            print("Database initialized successfully!")
            logger.info("Database initialized successfully!")

            if connection.is_connected():
                cursor.close()
                connection.close()
            break

        except Error as e:
            logger.error(f"Error initializing database: {e}")
            retry_count += 1
            if retry_count < retries:
                logger.info(f"Retrying database initialization ({retry_count} of {retries})")
                # logger.error(f"Stack Traceback: {traceback.format_exc()}")
                time.sleep(10)  # Wait for 10 seconds before retrying
            else:
                logger.error("Failed to initialize database after multiple retries")
                break


if __name__ == "__main__":
    initialize_database()
