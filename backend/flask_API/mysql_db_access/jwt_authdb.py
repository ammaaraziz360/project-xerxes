import logging
import traceback
import mysql.connector as mysqlconnex
from datetime import datetime
import os
import mysql.connector.pooling as DBPooler
import uuid
class AuthDB():
    def __init__(self):
        self.cnx_pool = None
        self.CreateConnection()

    def CreateConnection(self):
        pool = None
        try:
            pool = DBPooler.MySQLConnectionPool(
                pool_name = "auth_db_pool",
                pool_size = 5,
                host = os.getenv('DB_HOST_NAME'),
                user = os.getenv('DB_USERNAME'),
                passwd = os.getenv('DB_USER_PASSWORD'),
                database = os.getenv('AUTH_DB_NAME')
            )
            logging.getLogger().info(f'Connection to the {os.getenv("AUTH_DB_NAME")} database was successful')
        except mysqlconnex.Error as e:
            logging.getLogger().info(f'Connection to the {os.getenv("AUTH_DB_NAME")} database was unsuccessful. Error: {e}')
    
        self.cnx_pool = pool

    def createSessionRecord(self, user_id, ip_address, user_agent):
        """
        Create a token record
        :return:
        """

        connex = self.cnx_pool.get_connection()

        if connex != None:
            try:
                session_id = str(uuid.uuid4())

                cursor = connex.cursor()
                cursor.callproc('insert_jwt_session',
                                [session_id,
                                user_id,
                                ip_address,
                                user_agent, 
                                datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
                connex.commit()
                connex.close()

                return session_id
            except Exception as e:
                logging.getLogger().error(traceback.print_exc())
                connex.close()
        
        return None

    def getSessionRecord(self, session_id):
        """
        Get a token record
        :return:
        """
        connex = self.cnx_pool.get_connection()

        if connex != None:
            try:
                records = ()
                cursor = connex.cursor()
                cursor.callproc('get_jwt_session', [session_id])

                for result in cursor.stored_results():
                    for i in result.fetchall():
                        records = i
                
                connex.close()
                return records
            except Exception as e:
                logging.getLogger().error(traceback.print_exc())
                connex.close()
                return(str(e))

    def updateSessionRecordDate(self, session_id):
        """
        Update a token record date
        :return:
        """
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                cursor = connex.cursor()
                cursor.callproc('update_jwt_session_date', [session_id, date])

                connex.commit()
                connex.close()
                return True
            except Exception as e:
                logging.getLogger().error(traceback.print_exc())
                connex.close()
                return(str(e))

    def setSessionInvalid(self, session_id):
        """
        set a token invalid
        :return:
        """
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                cursor = connex.cursor()
                cursor.callproc('set_session_invalid', [session_id])

                connex.commit()
                connex.close()
                return True
            except Exception as e:
                logging.getLogger().error(traceback.print_exc())
                connex.close()
                return(str(e))