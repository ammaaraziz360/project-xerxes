import mysql.connector as mysqlconnex
from mysqldb_credentials import Credentials

def CreateConnection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysqlconnex.connect(
            host = host_name,
            user = user_name,
            passwd = user_password,
            database = db_name
        )
        print(f'Connection to the {db_name} database was successful')
    except mysqlconnex.Error as e:
        print(f'Connection to the {db_name} database was unsuccessful. Error: {e}')
    
    return connection

auth = Credentials('bloggit-db')

connex = CreateConnection(auth.HOST_NAME, auth.USER_NAME, auth.USER_PASSWORD, auth.database)
connex.close()