from database import get_connection, create_tables


print("Testing MySQL connection...")

connection = get_connection()


if connection:

    print("MySQL connection successful!")

    connection.close()

    print("Creating EduGenie tables...")

    create_tables()

    print("Database setup completed successfully.")

else:

    print("MySQL connection failed.")