import mysql.connector as mysqlconnex
from mysql_db_access.mysql_creds import Credentials
from datetime import datetime

class ResourceDB():
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
        
    # to get all banned phrases
    def bannedPhrases(self):
        banned_list = []

        connex = self.connection

        if connex != None:
            try:
                cursor = connex.cursor(dictionary=True)
                cursor.callproc('banned_phrases')

                for result in cursor.stored_results():
                    for i in result.fetchall():
                        banned_list.append(i[0])

                return banned_list
            except Exception as e:
                banned_list.append(str(e))
                return banned_list

    # to insert users
    def InsertUser(self, user_info: dict):
        connex = self.connection

        if connex != None:
            try:
                cursor = connex.cursor()

                cursor.callproc('user_exists', [user_info['google_id']])
                
                user_exists = False
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        if i[0] == 1:
                            user_exists = True
                            break
                     
                if user_exists:
                    cursor.callproc('update_lastlogin', [user_info['google_id'], datetime.now().strftime('%Y-%m-%d')])
                    return 'True'
                else:
                    cursor.callproc('create_user', 
                                    [user_info['google_id'],
                                    None, 
                                    user_info['first_name'], 
                                    user_info['last_name'], 
                                    user_info['email'], 
                                    user_info['pfp_url'], 
                                    user_info['register_date'], 
                                    user_info['last_login'], 
                                    None, 
                                    None, 
                                    user_info['login_type']])
                    connex.commit()
                    connex.close()
                    return 'False'
            except Exception as e:
                print(e)
                return e

    def CloseConnection(self):
        """
        Close the connection
        :return:
        """
        self.connection.close()
        self.connection = None