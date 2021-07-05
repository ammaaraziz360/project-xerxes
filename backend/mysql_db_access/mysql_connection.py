import mysql.connector as mysqlconnex
from mysqldb_credentials import Credentials

def CreateConnection(creds: Credentials):
    connection = None
    try:
        connection = mysqlconnex.connect(
            host = creds.HOST_NAME,
            user = creds.USER_NAME,
            passwd = creds.USER_PASSWORD,
            database = creds.database
        )
        print(f'Connection to the {creds.database} database was successful')
    except mysqlconnex.Error as e:
        print(f'Connection to the {creds.database} database was unsuccessful. Error: {e}')
    
    return connection
 

connex = CreateConnection(Credentials('bloggit-db'))
connex.close()