import os
import logging


def setup_logger(name, log_file, level=logging.INFO):
    # Create the logs directory if it doesn't exist
    logs_dir = os.path.join("/app", 'logs')
    os.makedirs(logs_dir, exist_ok=True)

    # Set the full path to the log file
    log_file_path = os.path.join(logs_dir, log_file)

    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s')

    handler = logging.FileHandler(log_file_path)
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger
