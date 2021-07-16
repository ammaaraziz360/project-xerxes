import mysql.connector as mysqlconnex
from mysql_db_access.mysql_creds import Credentials
from datetime import datetime
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
 
# to get all banned phrases
def bannedPhrases():
    banned_list = []

    connex = CreateConnection(Credentials('bloggit-db'))

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

    connex.close()   

# to insert users
def InsertUsers(user_info: dict):
    connex = CreateConnection(Credentials('bloggit-db'))

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
                connex.close()
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

    connex.close()
