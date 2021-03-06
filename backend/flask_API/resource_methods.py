from authentication import google_auth_verify, jwt_auth
from mysql_db_access import mysql_connection
from mysql_db_access.jwt_authdb import AuthDB
from mysql_db_access.mysql_connection import ResourceDB
from mysql_db_access.mysql_creds import Credentials
from datetime import datetime

class ResourceDB_API():

    def __init__(self) -> None:
        # self.resorDB  = ResourceDB(Credentials("bloggit-db"))
        self.resorDB  = ResourceDB(Credentials("BlogooDB"))

    # def getBannedUsernames(self):
    #     """
    #     gets banned usernames
    #     """
    #     # resorDb = ResourceDB(Credentials('bloggit-db'))
    #     return(self.resorDB.bannedPhrases())

    def CreateUser(self, request_body: dict):
        """
        inserts a user into the database
        """
        return(self.resorDB.CreateUser(request_body))
        
    def UpdateUser(self, updated_items: dict):
        """
        updates a user in the database
        """
        return(self.resorDB.UpdateUser(updated_items))

    def getUserProfile(self, username, requester_id):
        """
        gets a user profile
        """
        return(self.resorDB.getUserProfile(username, requester_id))

    def editUserSocials(self, user_id, socials):
        """
        updates a user's socials
        """
        return(self.resorDB.editUserSocials(user_id, socials))

    def insertPost(self, user_id, post_details):
        """
        adds a post to the database
        """
        return(self.resorDB.insertPost(user_id, post_details))

    def likePost(self, post_id, user_id, like_info):
        """
        adds a like or dislike or unlikes or undislikes to the database
        """
        return(self.resorDB.likePost(user_id, post_id, like_info))

    def followUser(self, user_id, follower_id, follow_info):
        """
        adds a follow or unfollow to the database
        """
        return(self.resorDB.followUser(user_id, follower_id, follow_info))
    def getPost(self, post_id, requester_id):
        """
        gets a post
        """
        return(self.resorDB.getPost(post_id, requester_id))

    def getPostComments(self, post_id, requester_id):
        """
        gets a post's comments
        """
        return(self.resorDB.getPostComments(post_id, requester_id))

    def getUserFollowers(self, username, requester_id):
        """
        gets a user's followers
        """
        return(self.resorDB.getUserFollowers(username, requester_id))

    def getUserFollowing(self, username, requester_id):
        """
        gets a user's followers
        """
        return(self.resorDB.getUserFollowing(username, requester_id))