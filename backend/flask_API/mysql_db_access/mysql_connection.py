import mysql.connector as mysqlconnex
from mysql_db_access.mysql_creds import Credentials
from datetime import datetime
import traceback


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
    
    def getUserProfile(self, username, requester_id, get_posts=True):
        """
        get user profile
        :param user_id:
        :return:
        """
        # username may come in as a user_id so we need to convert it to a username
        connex = self.connection
        keys = ['user_id','username', 'first_name', 'last_name', 'pfp', 'creation_date', 'last_login', 'bio', 'location','followers','following', 'facebook_url', 'youtube_url', 'twitter_url', 'instagram_url', 'website_url']
        post_keys = ['post_id', 'author_id', 'date_posted', 'title', 'body_html', 'body_raw', 'likes', 'dislikes', 'views', 'reply_post_id','liked', 'disliked']
        if connex != None:
            try:
                results = {}
                cursor = connex.cursor(dictionary=True)
                # username may come in as a user_id so we need to convert it to a username
                cursor.callproc('get_username', [username])
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        if i[0] != None:
                            username = i[0]

                cursor.callproc('get_user_profile', [username])
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        results = dict(zip(keys, i))

                if get_posts:
                    results['Posts'] = []
                    cursor.callproc('get_user_posts', [results['user_id'], requester_id])
                    for resulter in cursor.stored_results():
                        for x in resulter.fetchall():
                            results['Posts'].append(dict(zip(post_keys, x)))

                if results['user_id'] == str(requester_id):
                    results['OwnAccount'] = True
                    results['follows'] = False
                else:
                    results['OwnAccount'] = False
                    print([requester_id, results['user_id']])
                    cursor.callproc('check_user_follows', [requester_id, results['user_id']])
                    for result in cursor.stored_results():
                        for i in result.fetchall():
                            if i[0] == 1:
                                results['follows'] = True
                            else:
                                results['follows'] = False
                return results
            except Exception as e:
                return None
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
    
    def likePost(self, user_id, post_id, like_info):
        """
        like a post
        :param user_id:
        :param post_id:
        :param like_info:
        :return:
        """
        connex = self.connection
        if connex != None:
            try:
                cursor = connex.cursor()
                if like_info['liked'] == 'true':
                    print('liked')
                    cursor.callproc('like_post', [user_id, post_id])
                    connex.commit()
                elif like_info['disliked'] == 'true':
                    print('disliked')
                    cursor.callproc('dislike_post', [user_id, post_id])
                    connex.commit()
                elif like_info['liked'] == 'false' and like_info['disliked'] == 'false':
                    print('unliked')
                    cursor.callproc('unlike_undislike', [user_id, post_id])
                    connex.commit()
                return True
            except Exception as e:
                return str(e)
        return 'Server failed to connect'

    def followUser(self, user_id, follow_id, follow_info):
        """
        follow or unfollow a user
        :param user_id:
        :param follow_id:
        :return:
        """
        connex = self.connection
        if connex != None:
            try:
                cursor = connex.cursor()
                if follow_info['following'] == True:
                    cursor.callproc('follow_user', [user_id, follow_id])
                    connex.commit()
                else:
                    cursor.callproc('unfollow_user', [user_id, follow_id])
                    connex.commit()
                return True
            except Exception as e:
                return None
        return 'Server failed to connect'
    
    def getPost(self, post_id, requester_id):
        """
        get a post
        :param post_id:
        :return:
        """
        post_keys = ['post_id', 'author_id', 'date_posted', 'title', 'body_html', 'body_raw', 'likes', 'dislikes', 'views', 'reply_post_id','liked', 'disliked', 'comments']
        user_keys = ['pfp', 'first_name', 'last_name', 'username']
        connex = self.connection
        if connex != None:
            try:
                cursor = connex.cursor()
                posts = []
                
                while True:
                    cursor.callproc('get_post', [post_id, requester_id])
                    for result in cursor.stored_results():
                        for i in result.fetchall():
                            posts.append(dict(zip(post_keys, i)))

                    posts[-1]['poster_info'] = {}
                    cursor.callproc('post_user_info', [posts[-1]['author_id']])
                    for result in cursor.stored_results():
                        for i in result.fetchall():
                            posts[-1]['poster_info'] = dict(zip(user_keys, i))

                    if posts[-1]['liked'] != None:
                        posts[-1]['liked'] = 'true'
                    else:
                        posts[-1]['liked'] = 'false'

                    if posts[-1]['disliked'] != None:
                        posts[-1]['disliked'] = 'true'
                    else:
                        posts[-1]['disliked'] = 'false'
                    
                    if posts[-1]['reply_post_id'] != None:
                        post_id = posts[-1]['reply_post_id']
                    else:
                        break
                if posts == []:
                    return None
                elif len(posts) == 1:
                    posts[0]['comments'] = []
                    
                    cursor.callproc('get_comments', [post_id, requester_id])
                    for result in cursor.stored_results():
                        for i in result.fetchall():
                            posts[0]['comments'].append(dict(zip(post_keys, i)))
                            posts[0]['comments'][-1]['comments'] = []
                            posts[0]['comments'][-1]['poster_info'] = {}
                            cursor.callproc('post_user_info', [posts[0]['comments'][-1]['author_id']])
                            for result in cursor.stored_results():
                                for i in result.fetchall():
                                    posts[0]['comments'][-1]['poster_info'] = dict(zip(post_keys, i))

                else:
                    for post in posts:
                        post['comments'] = []
                    for i in range(len(posts)-1):
                        posts[i+1]['comments'].append(posts[i])

                return posts[-1]
            except Exception as e:
                print(traceback.print_exc())
                return None
        return 'Server failed to connect'

    def CloseConnection(self):
        """
        Close the connection
        :return:
        """
        self.connection.close()
        self.connection = None