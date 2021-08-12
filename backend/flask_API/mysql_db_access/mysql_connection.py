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
                print(user_info['google_id'])
                user_exists = False
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        if i[0] == 1:
                            user_exists = True
                            break
                     
                if user_exists:
                    cursor.callproc('update_lastlogin', [user_info['google_id'], datetime.now().strftime('%Y-%m-%d')])
                    connex.commit()
                    cursor.callproc('username_null_check', [user_info['google_id']])
                    for result in cursor.stored_results():
                        for i in result.fetchall():
                            if i[0] == 1:
                                return 'False'
                                break
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
                    return 'False'
            except Exception as e:
                print(e)
                return str(e)
    def UpdateUser(self, updated_items):
        """
        updates a user in the database
        """
        connex = self.connection

        if connex != None:
            try:
                cursor = connex.cursor()

                if updated_items['username'] != None:
                    cursor.callproc('username_validator', [updated_items['username']])
                    for result in cursor.stored_results():
                        for i in result.fetchall():
                            if i[0] > 0:
                                return 'Username contains a banned string, pick a new username'

                    cursor.callproc('unique_usernames', [updated_items['username']])
                    for result in cursor.stored_results():
                        for i in result.fetchall():
                            if i[0] > 0:
                                return "Username is taken, pick a new username"
                cursor.callproc('update_user', [updated_items['User_id'],
                                                updated_items['username'],
                                                updated_items['first_name'],
                                                updated_items['last_name'],
                                                updated_items['pfp_url'],
                                                updated_items['bio'],
                                                updated_items['location']])
                connex.commit()
                return True
            except Exception as e:
                return str(e)
        return 'Server failed to connect'
    
    def getUserProfile(self, user_id, requester_id):
        """
        get user profile
        :param user_id:
        :return:
        """
        connex = self.connection
        keys = ['username', 'first_name', 'last_name', 'pfp', 'creation_date', 'last_login', 'bio', 'location', 'facebook_url', 'youtube_url', 'twitter_url', 'instagram_url', 'website_url']
        post_keys = ['post_id', 'author_id', 'date_posted', 'title', 'body_html', 'body_raw', 'likes', 'dislikes', 'views', 'reply_post_id','liked', 'disliked']
        if connex != None:
            try:
                results = {}
                cursor = connex.cursor(dictionary=True)
                cursor.callproc('get_user_profile', [user_id])
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        results = dict(zip(keys, i))
                results['Posts'] = []
                cursor.callproc('get_user_posts', [user_id, requester_id])
                for resulter in cursor.stored_results():
                    for x in resulter.fetchall():
                        results['Posts'].append(dict(zip(post_keys, x)))

                print(results['Posts'][0])
                return results
            except Exception as e:
                return str(e)
        return 'Server failed to connect'

    def editUserSocials(self, user_id, social_info):
        """
        edit user socials
        :param user_id:
        :param social_info:
        :return:
        """
        connex = self.connection
        if connex != None:
            try:
                print(social_info)
                cursor = connex.cursor()
                cursor.callproc('update_user_socials', [user_id, social_info['twitter'], social_info['facebook'], social_info['youtube'],  social_info['instagram'], social_info['website']])
                connex.commit()
                return True
            except Exception as e:
                print(e)
                return str(e)
        return 'Server failed to connect'
    
    def insertPost(self, user_id, post_info: dict):
        """
        insert a post
        :param user_id:
        :param post_info:
        :return:
        """
        connex = self.connection
        if connex != None:
            try:
                cursor = connex.cursor()
                print(datetime.now())
                cursor.callproc('insert_post', [user_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), post_info['title'], post_info['body_raw'], post_info['body_html'],post_info['reply_post_id']])
                connex.commit()
                return True
            except Exception as e:
                return str(e)
        return 'Server failed to connect'
    def CloseConnection(self):
        """
        Close the connection
        :return:
        """
        self.connection.close()
        self.connection = None