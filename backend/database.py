import mysql.connector
from mysql.connector import Error


# =========================================================
# MySQL Database Configuration
# =========================================================

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "edugenie",
    "port": 3306,
}


# =========================================================
# Get Database Connection
# =========================================================

def get_connection():
    """
    Create and return a connection to the EduGenie MySQL database.
    """

    try:

        connection = mysql.connector.connect(**DB_CONFIG)

        if connection.is_connected():
            return connection

    except Error as error:

        print(f"MySQL connection error: {error}")

    return None


# =========================================================
# Create Tables
# =========================================================

def create_tables():
    """
    Create the required EduGenie database tables.
    """

    connection = get_connection()

    if connection is None:

        print("Could not connect to MySQL.")

        return

    cursor = connection.cursor()

    create_history_table = """
    CREATE TABLE IF NOT EXISTS learning_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        feature VARCHAR(50) NOT NULL,
        input_text TEXT NOT NULL,
        response_text LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """

    cursor.execute(create_history_table)

    connection.commit()

    cursor.close()
    connection.close()

    print("Database tables created successfully.")


# =========================================================
# Save History
# =========================================================

def save_history(feature, input_text, response_text):
    """
    Save an EduGenie request and its AI response.
    """

    connection = get_connection()

    if connection is None:

        print("Could not connect to MySQL.")

        return False

    cursor = connection.cursor()

    query = """
    INSERT INTO learning_history
    (feature, input_text, response_text)
    VALUES (%s, %s, %s)
    """

    values = (
        feature,
        input_text,
        response_text,
    )

    cursor.execute(query, values)

    connection.commit()

    cursor.close()
    connection.close()

    return True


# =========================================================
# Get Learning History
# =========================================================

def get_history():
    """
    Get saved EduGenie learning history.
    """

    connection = get_connection()

    if connection is None:

        return []

    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT
        id,
        feature,
        input_text,
        response_text,
        created_at
    FROM learning_history
    ORDER BY id DESC
    """

    cursor.execute(query)

    records = cursor.fetchall()

    cursor.close()
    connection.close()

    return records