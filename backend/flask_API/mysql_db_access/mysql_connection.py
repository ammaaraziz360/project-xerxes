import mysql.connector as mysqlconnex
import mysql.connector.pooling as DBPooler
from mysql_db_access.mysql_creds import Credentials
from datetime import datetime
import traceback


class ResourceDB():
    def __init__(self, credentials: Credentials):
        self.cnx_pool = None
        self.CreateConnection(credentials)

    def CreateConnection(self, creds: Credentials):
        pool = None
        try:
            pool = DBPooler.MySQLConnectionPool(
                pool_name = "resource_db_pool",
                pool_size = 5,
                host = creds.HOST_NAME,
                user = creds.USER_NAME,
                passwd = creds.USER_PASSWORD,
                database = creds.database
            )
            print(f'Connection to the {creds.database} database was successful')
        except mysqlconnex.Error as e:
            print(f'Connection to the {creds.database} database was unsuccessful. Error: {e}')
    
        self.cnx_pool = pool
        
    # # to get all banned phrases
    # def bannedPhrases(self):
    #     banned_list = []

    #     connex = self.connection

    #     if connex != None:
    #         try:
    #             cursor = connex.cursor()
    #             cursor.callproc('banned_phrases')

    #             for result in cursor.stored_results():
    #                 for i in result.fetchall():
    #                     banned_list.append(i[0])

    #             return banned_list
    #         except Exception as e:
    #             banned_list.append(str(e))
    #             return banned_list

    # to insert users
    def CreateUser(self, user_info: dict):
        connex = self.cnx_pool.get_connection()

        if connex != None:
            try:
                cursor = connex.cursor()

                JSONcheck = [user_info['user_id'],
                                    user_info['first_name'], 
                                    user_info['last_name'], 
                                    user_info['email'], 
                                    user_info['pfp_url']]

                try:
                    cursor.callproc('CreateUser', 
                                    [user_info['user_id'],
                                    user_info['first_name'], 
                                    user_info['last_name'], 
                                    user_info['email'], 
                                    user_info['pfp_url']])
                    connex.commit()
                    connex.close()
                    return 0
                except Exception as e:
                    cursor.callproc('UpdateUserLastLogin', [user_info['user_id']])

                    result_args = cursor.callproc('UsernameNullCheck', [user_info['user_id'], '0'])
                    if result_args[1] != None:
                        return 0

                    connex.close()
                    return 1

            except Exception as e:
                pass
        return -1
    def UpdateUser(self, updated_items):
        """
        updates a user in the database
        """
        connex = self.cnx_pool.get_connection()

        if connex != None:
            try:
                cursor = connex.cursor()
                
                cursor.callproc('UpdateUser', [updated_items['user_id'],
                                                updated_items['username'],
                                                updated_items['first_name'],
                                                updated_items['last_name'],
                                                updated_items['email_address'],
                                                updated_items['pfp_url'],
                                                updated_items['location'],
                                                updated_items['bio'],
                                                updated_items['facebook_url'],
                                                updated_items['youtube_url'],
                                                updated_items['instagram_url'],
                                                updated_items['website_url']]
                                               )
                connex.commit()
                connex.close()
                return True
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return False
    
    def getUserProfile(self, user_id, requester_id, get_posts=True):
        """
        get user profile
        :param user_id:
        :return:
        """
        # username may come in as a user_id so we need to convert it to a username
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                results = {}
                cursor = connex.cursor()

                # user_id may come in as a username so we need to convert it to a user_id
                result_args = cursor.callproc('getUserID', [user_id, '0'])

                if result_args[1] is not None:
                    user_id = result_args[1]

                cursor.callproc('getUserProfile', [user_id , requester_id])
                for result in cursor.stored_results():
                    keys = result.column_names
                    [results := dict(zip(keys, x)) for x in result.fetchall()]

                if get_posts and results != {}:
                    results['Posts'] = []
                    cursor.callproc('getUserPosts', [user_id, requester_id])
                    for resulter in cursor.stored_results():
                        keys = resulter.column_names
                        [results['Posts'].append(dict(zip(keys, x))) for x in resulter.fetchall()]

                connex.close()
                return results
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return {}

    # def editUserSocials(self, user_id, social_info):
    #     """
    #     edit user socials
    #     :param user_id:
    #     :param social_info:
    #     :return:
    #     """
    #     connex = self.connection
    #     if connex != None:
    #         try:
    #             print(social_info)
    #             cursor = connex.cursor()
    #             cursor.callproc('update_user_socials', [user_id, social_info['twitter'], social_info['facebook'], social_info['youtube'],  social_info['instagram'], social_info['website']])
    #             connex.commit()
    #             return True
    #         except Exception as e:
    #             print(e)
    #             return str(e)
    #     return 'Server failed to connect'
    
    def insertPost(self, user_id, post_info: dict):
        """
        insert a post
        :param user_id:
        :param post_info:
        :return:
        """
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                cursor = connex.cursor()
                cursor.callproc('CreatePost', [user_id, 
                                                post_info['title'], 
                                                post_info['body'], 
                                                post_info['reply_post_id'],
                                                post_info['category_id']])
                connex.commit()
                connex.close()
                return True
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return False
    
    def likePost(self, user_id, post_id, interaction_type):
        """
        like a post
        :param user_id:
        :param post_id:
        :param like_info:
        :return:
        """
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                cursor = connex.cursor()
                
                # interaction_type explanation:
                # 1 for like, 0 for dislike, -1 for removing any post interaction
                cursor.callproc('AddPostInteraction', [user_id, post_id, interaction_type])
                connex.commit()

                connex.close()
                return True
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return False

    def followUser(self, user_id, follow_id, follow_info) -> bool:
        """
        follow or unfollow a user
        :param user_id:
        :param follow_id:
        :return:
        """
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                # TODO
                cursor = connex.cursor()
                if follow_info['following'] == True:
                    cursor.callproc('follow_user', [user_id, follow_id])
                    connex.commit()
                else:
                    cursor.callproc('unfollow_user', [user_id, follow_id])
                    connex.commit()
                connex.close()
                return True
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return False
    
    def getPost(self, post_id, requester_id):
        """
        get a post
        :param post_id:
        :return:
        """
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                cursor = connex.cursor()
                posts = []
                
                cursor.callproc('getPostThread', [post_id, requester_id])
                for result in cursor.stored_results():
                    keys = result.column_names
                    [posts.append(dict(zip(keys, x))) for x in result.fetchall()]

                for post in posts:
                    post["comments"] = []

                posts.reverse()
                for i in range(len(posts)-1):
                    posts[i+1]['comments'].append(posts[i])

                if len(posts) == 0:
                    return {}
                
                return posts[-1]
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return {}

    def getPostComments(self, post_id, requester_id):
        """
        get comments for a post
        :param post_id:
        :return:
        """
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                cursor = connex.cursor()
                comments = []

                cursor.callproc('getPostComments', [post_id, requester_id])

                for result in cursor.stored_results():
                    keys = result.column_names
                    [comments.append(dict(zip(keys, val))) for val in result.fetchall()]

                connex.close()
                return comments
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return {}
    
    def getUserFollowers(self, username, requester_id):
        """
        get following of a user
        :param user_id:
        :return:
        """
        user_keys =  ['user_id','username', 'first_name', 'last_name', 'pfp', 'bio', 'follows']
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                cursor = connex.cursor()
                # TODO: update 
                cursor.callproc('get_username', [username])
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        if i[0] != None:
                            username = i[0]
                followers = []
                cursor.callproc('get_followers', [username, requester_id])
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        followers.append(dict(zip(user_keys, i)))
                
                for follower in followers:
                    if follower['user_id'] == requester_id:
                        follower['OwnAccount'] = True
                    else:
                        follower['OwnAccount'] = False

                connex.close()
                return followers
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return {}
    
    def getUserFollowing(self, username, requester_id):
        """
        get followers of a user
        :param user_id:
        :return:
        """
        user_keys =  ['user_id','username', 'first_name', 'last_name', 'pfp', 'bio', 'follows']
        connex = self.cnx_pool.get_connection()
        if connex != None:
            try:
                cursor = connex.cursor()
                # TODO: update
                cursor.callproc('get_username', [username])
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        if i[0] != None:
                            username = i[0]
                followers = []
                cursor.callproc('get_following', [username, requester_id])
                for result in cursor.stored_results():
                    for i in result.fetchall():
                        followers.append(dict(zip(user_keys, i)))
                
                for follower in followers:
                    if follower['user_id'] == requester_id:
                        follower['OwnAccount'] = True
                    else:
                        follower['OwnAccount'] = False
                connex.close()
                return followers
            except Exception as e:
                print(traceback.print_exc())
                connex.close()
        return {}
