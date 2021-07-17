from authentication import google_auth_verify, jwt_auth
from mysql_db_access import mysql_connection
from mysql_db_access.jwt_authdb import AuthDB
from mysql_db_access.mysql_creds import Credentials
import resource_methods
from datetime import datetime

def AuthenticateUser(headers):
    """
    AuthenticateUser()
    This method is used to authenticate the user.
    and refreshes the token.
    """
    authDB = AuthDB(Credentials('blogoo-auth'))

    jwt_token = headers['Authorization']
    user_id = headers['user_id']
    ip_address = headers['ip']
    user_agent = headers['user_agent']

    auth_table = {"jwt_token": jwt_token, "user_id": user_id, "ip_address": ip_address, "user_agent": user_agent}

    if authDB.decode_auth_token(jwt_token) == user_id:
        record = authDB.getTokenRecord(user_id)
        # check if request ip address ans user agent is same as the one in the database
        # if true, blacklist the old token and return new token
        if ip_address == record[2] and user_agent == record[3]:
            authDB.BlacklistToken(jwt_token)
            authDB.updateTokenRecordDate(user_id)

            authDB.CloseConnection()
            return jwt_auth.encode_auth_token(user_id)
    else:
        # if token is expired
        record = authDB.getTokenRecord(user_id)
        if ip_address == record[2] and user_agent == record[3]:
            # TODO: find difference in time from the updated record and current time
            # if difference is greater than 30 minutes, make user login again
            date_diff = (datetime.now() - record[5]).total_seconds()
            date_diff = divmod(date_diff, 60)[0]

            if date_diff < 30:
                authDB.BlacklistToken(jwt_token)
                authDB.updateTokenRecordDate(user_id)

                authDB.CloseConnection()
                return jwt_auth.encode_auth_token(user_id)
            
        authDB.BlacklistToken(jwt_token)
        authDB.updateTokenRecordDate(user_id)
        authDB.setTokenInvalid(user_id)
    
    authDB.CloseConnection()
    return False

def AuthorizeUser(request):
        try:
            auth_token = request.headers['google_auth_token']
            ip_address = request.headers['ip']
            user_agent = request.headers['user_agent']
            request_body = request.json

            request_body['register_date'] = datetime.now().strftime('%Y-%m-%d')
            request_body['last_login'] = datetime.now().strftime('%Y-%m-%d')

            if google_auth_verify.AuthenticateUser(auth_token):
                google_id = google_auth_verify.GetUserID(auth_token)
                request_body['google_id'] = google_id

                result = resource_methods.InsertUser(request_body)

                google_id = google_auth_verify.GetUserID(auth_token)
                
                auth_table = {
                                'user_id': google_id, 
                                'ip_address': ip_address, 
                                'user_agent': user_agent, 
                                'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            }

                CreateTokenRecord(auth_table)
                jwt_token = jwt_auth.encode_auth_token(google_id)

                return {"user_exists": result, "token": jwt_token}  
            
            return {"user_exists": None, "token": jwt_token}
        except Exception as e:
            print(e)
            return {"error": str(e)}
        
def LogoutUser():
    pass

def CreateTokenRecord(auth_table):
    authDB = AuthDB(Credentials('blogoo-auth'))
    authDB.createTokenRecord(auth_table)
    authDB.CloseConnection()