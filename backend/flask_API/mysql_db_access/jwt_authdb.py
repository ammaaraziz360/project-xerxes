from mysql_db_access.mysql_creds import Credentials
import mysql.connector as mysqlconnex
from datetime import datetime

class AuthDB():
    def __init__(self, credentials: Credentials):
        self.connection = None
        self.CreateConnection(credentials)

    def CreateConnection(self, creds: Credentials):
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
    
        self.connection = connection

    def createSessionRecord(self, jwt_data: dict):
        """
        Create a token record
        :return:
        """
        connex = self.connection

        if connex != None:
            try:
                cursor = connex.cursor()
                cursor.callproc('insert_jwt_session',
                                [jwt_data['uuid'],
                                jwt_data['user_id'],
                                jwt_data['ip_address'],
                                jwt_data['user_agent'], 
                                jwt_data['createdAt'],
                                jwt_data['updatedAt']])
                connex.commit()
            except Exception as e:
                print(e)
                return(str(e))

    def getSessionRecord(self, session_id):
        """
        Get a token record
        :return:
        """
        connex = self.connection

        if connex != None:
            try:
                records = ()
                cursor = connex.cursor()
                cursor.callproc('get_jwt_session', [session_id])

                for result in cursor.stored_results():
                    for i in result.fetchall():
                        records = i
                
                return records
            except Exception as e:
                print(e)
                return(str(e))

    def updateSessionRecordDate(self, session_id):
        """
        Update a token record date
        :return:
        """
        connex = self.connection
        if connex != None:
            try:
                date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cursor = connex.cursor()
                cursor.callproc('update_jwt_session_date', [session_id, date])

                connex.commit()
                return True
            except Exception as e:
                print(e)
                return(str(e))

    def setSessionInvalid(self, session_id):
        """
        set a token invalid
        :return:
        """
        connex = self.connection
        if connex != None:
            try:
                cursor = connex.cursor()
                cursor.callproc('set_session_invalid', [session_id])

                connex.commit()
                return True
            except Exception as e:
                print(e)
                return(str(e))

    def CloseConnection(self):
        """
        Close the connection
        :return:
        """
        self.connection.close()
        self.connection = None