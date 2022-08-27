from backend.flask_API.authentication import google_auth_verify, jwt_auth
from backend.flask_API.mysql_db_access.jwt_authdb import AuthDB
from backend.flask_API.mysql_db_access.mysql_creds import Credentials
from datetime import datetime
import uuid
import logging
import traceback

authDB = AuthDB()

def AuthenticateUser(headers):
    """
    AuthenticateUser()
    This method is used to authenticate the user.
    and refreshes the token.
    """
    
    response = {"Valid": False, "JWT": None}

    try:    
        jwt_token = headers['Authorization'].split()[1]
        user_id = headers['user_id']
        ip_address = headers['X-Real-Ip']
        user_agent = headers['User_Agent']
        session_id = headers['SID']


        if jwt_auth.decode_auth_token(jwt_token) == user_id:
            record = authDB.getSessionRecord(session_id)
            # check if request ip address ans user agent is same as the one in the database
            # if true, blacklist the old token and return new token
            if record != ():
                if record[4] == 1:
                    if ip_address == record[2] and user_agent == record[3]:
                        authDB.updateSessionRecordDate(session_id)
                        print("Authenticated")

                        response["Valid"] = True
                    else:
                        authDB.updateSessionRecordDate(session_id)
                        authDB.setSessionInvalid(user_id)
                        print("Info not matching not Authenticated")
                else:
                    print("session not valid not Authenticated")
        else:
            # if token is expired
            record = authDB.getSessionRecord(session_id)
            if record != ():
                if record[4] == 1:
                    if ip_address == record[2] and user_agent == record[3]:
                        # TODO: find difference in time from the updated record and current time
                        # if difference is greater than 5 minutes, make user login again
                        date_diff = (datetime.now() - record[5]).total_seconds()
                        date_diff = divmod(date_diff, 60)[0]

                        if date_diff < 30:
                            authDB.updateSessionRecordDate(session_id)
                            print("TIME WITHIN LIMIT, TOKEN AUTHENTICATED")

                            response["Valid"] = True
                            response["JWT"] = jwt_auth.encode_auth_token(user_id)
                        else:
                            authDB.updateSessionRecordDate(session_id)
                            authDB.setSessionInvalid(session_id)
                            print("TIME NOT WITHIN LIMIT, NOT AUTHENTICATED")
                    else:
                        authDB.updateSessionRecordDate(session_id)
                        authDB.setSessionInvalid(session_id)
                        print("IP ADDRESS OR USER AGENT NOT MATCHING, NOT AUTHENTICATED")
                else:
                    print("SESSION NOT VALID")

        return response
    except:
        return response

def AuthorizeUser(request, ResourceDBObj):
    try:
        auth_token = request.headers['google_auth_token']
        ip_address = request.headers['X-Real-Ip']
        user_agent = request.headers['User-Agent']
        request_body = request.json

        if google_auth_verify.AuthenticateUser(auth_token):
            google_id = google_auth_verify.GetUserID(auth_token)
            request_body['user_id'] = google_id
            

            result = ResourceDBObj.CreateUser(request_body)

            google_id = google_auth_verify.GetUserID(auth_token)
            
            session_id = str(uuid.uuid4())
            auth_table = {
                            'uuid': session_id,
                            'user_id': google_id, 
                            'ip_address': ip_address, 
                            'user_agent': user_agent, 
                            'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        }

            CreateTokenRecord(auth_table)
            jwt_token = jwt_auth.encode_auth_token(google_id)

            return {"user_exists": result, "token": jwt_token, "user_id": google_id, "session_id": session_id}  
        
        return {"user_exists": -1}
    except Exception as e:
        logging.getLogger().error(f'{traceback.print_exc()}')
        return {"user_exists": -1}
        
def LogoutUser(headers):
    try:
        session_id = headers['SID']
        authDB = AuthDB()
        authDB.setSessionInvalid(session_id)
        return True
    except Exception as e:
        logging.getLogger().error(f'{traceback.print_exc()}')
        return {"error": str(e)}

def CreateTokenRecord(auth_table):
    authDB.createSessionRecord(auth_table)
