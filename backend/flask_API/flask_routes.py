from flask import Flask, json, request, jsonify, make_response, abort
from flask_cors import CORS
from datetime import datetime
from authentication import google_auth_verify, jwt_auth
from mysql_db_access import mysql_connection, jwt_authdb

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# default route
@app.route('/api/users/login', methods=['POST'])
def createUser():
    """
    Create a new user
    or sign in an existing user

    returns a json object true or false about user existance
    returns jwt token for user
    """
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

            result = mysql_connection.InsertUsers(request_body)

            google_id = google_auth_verify.GetUserID(auth_token)
            
            auth_table = {
                            'user_id': google_id, 
                            'ip_address': ip_address, 
                            'user_agent': user_agent, 
                            'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        }

            jwt_authdb.createTokenRecord(auth_table)
            jwt_token = jwt_auth.encode_auth_token(google_id)

            return jsonify({"user_exists": result, "token": jwt_token}, 200)    
        
        return jsonify({"user_exists": None, "token": jwt_token}, 401)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}, 400)

@app.route('/api/users', methods=['POST'])
def updateUsername():
    pass


@app.route('/api/users/banned-usernames', methods=['GET'])
def getBannedUsernames():

    try:
        jwt_token = request.headers['Authorization']
        auth_token = request.headers['google_auth_token']
        if  google_auth_verify.GetUserID(auth_token) == jwt_auth.decode_auth_token(jwt_token):
            banned_words = mysql_connection.bannedPhrases()
            return make_response(jsonify({'banned_words': banned_words}, 200))
        return make_response(jsonify({'banned_words': []}, 401))
    except Exception as e:
        return make_response(jsonify({'banned_words': [str(e)]}, 401))
        


    
app.run()