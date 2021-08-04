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
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.bannedPhrases()
    resorDb.CloseConnection()
    return(result)

def InsertUser(request_body: dict):
    """
    inserts a user into the database
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.InsertUser(request_body)
    resorDb.CloseConnection()
    return(result)
    
def UpdateUser(updated_items: dict):
    """
    updates a user in the database
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.UpdateUser(updated_items)
    resorDb.CloseConnection()
    return(result)

def getUserProfile(user_id):
    """
    gets a user profile
    """
    resorDb = ResourceDB(Credentials('bloggit-db'))
    result = resorDb.getUserProfile(user_id)
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