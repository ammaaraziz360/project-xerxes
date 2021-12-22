from authentication import google_auth_verify, jwt_auth
from mysql_db_access import mysql_connection
from mysql_db_access.jwt_authdb import AuthDB
from mysql_db_access.mysql_connection import ResourceDB
from mysql_db_access.mysql_creds import Credentials
from datetime import datetime

def getBannedUsernames():
    """
    gets banned usernames
    """
    # resorDb = ResourceDB(Credentials('bloggit-db'))
    resorDb = ResourceDB(Credentials('BlogooDB'))
    result = resorDb.bannedPhrases()
    resorDb.CloseConnection()
    return(result)

def CreateUser(request_body: dict):
    """
    inserts a user into the database
    """
    resorDb = ResourceDB(Credentials('BlogooDB'))
    result = resorDb.CreateUser(request_body)
    resorDb.CloseConnection()
    return(result)
    
def UpdateUser(updated_items: dict):
    """
    updates a user in the database
    """
    resorDb = ResourceDB(Credentials('BlogooDB'))
    result = resorDb.UpdateUser(updated_items)
    resorDb.CloseConnection()
    return(result)

def getUserProfile(username, requester_id):
    """
    gets a user profile
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.getUserProfile(username, requester_id)
    resorDb.CloseConnection()
    return(result)

def editUserSocials(user_id, socials):
    """
    updates a user's socials
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.editUserSocials(user_id, socials)
    resorDb.CloseConnection()
    return(result)

def insertPost(user_id, post_details):
    """
    adds a post to the database
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.insertPost(user_id, post_details)
    resorDb.CloseConnection()
    return(result)

def likePost(post_id, user_id, like_info):
    """
    adds a like or dislike or unlikes or undislikes to the database
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.likePost(user_id, post_id, like_info)
    resorDb.CloseConnection()
    return(result)

def followUser(user_id, follower_id, follow_info):
    """
    adds a follow or unfollow to the database
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.followUser(user_id, follower_id, follow_info)
    resorDb.CloseConnection()
    return(result)
def getPost(post_id, requester_id):
    """
    gets a post
    """
    # post_json = {'Authors': [],'Posts': []}
    resorDb = ResourceDB(Credentials('bloggit-db'))
    post_json = resorDb.getPost(post_id, requester_id)
    # for i in post_json['Posts']:
    #     post_json['Authors'].append(resorDb.getUserProfile(i['author_id'], requester_id, False))

    # post_json['Authors'] = post_json['Authors'][::-1]
    # post_json['Posts'] = post_json['Posts'][::-1]
    resorDb.CloseConnection()
    return(post_json)

def getPostComments(post_id, requester_id):
    """
    gets a post's comments
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.getPostComments(post_id, requester_id)
    resorDb.CloseConnection()
    return(result)

def getUserFollowers(username, requester_id):
    """
    gets a user's followers
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.getUserFollowers(username, requester_id)
    resorDb.CloseConnection()
    return(result)

def getUserFollowing(username, requester_id):
    """
    gets a user's followers
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.getUserFollowing(username, requester_id)
    resorDb.CloseConnection()
    return(result)