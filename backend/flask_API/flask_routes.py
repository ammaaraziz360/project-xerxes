from flask import Flask, json, request, jsonify, make_response, abort
from flask_cors import CORS
from mysql_db_access import mysql_connection
from datetime import datetime
from authentication import google_auth_verify, jwt_auth


app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# default route
@app.route('/api/users/register', methods=['POST'])
def createUser():
    try:
        
        auth_token = request.headers['auth_token']
        request_body = request.json

        request_body['register_date'] = datetime.now().strftime('%Y-%m-%d')
        request_body['last_login'] = datetime.now().strftime('%Y-%m-%d')

        if google_auth_verify.AuthenticateUser(auth_token):
            result = mysql_connection.InsertUsers(request_body)

            google_id = google_auth_verify.GetUserID(auth_token)

            jwt_token = jwt_auth.encode_auth_token(google_id)

            return jsonify({"user_exists": result, "token": jwt_token}, 200)
        
        return jsonify({"user_exists": None}, 401)
    except e as Exception:
        return e


@app.route('/api/users/banned-usernames', methods=['GET'])
def getBannedUsernames():

    try:
        auth_token = request.headers['auth_token']
        if  google_auth_verify.AuthenticateUser(auth_token):
            banned_words = mysql_connection.bannedPhrases()
            return make_response(jsonify({'banned_words': banned_words}, 200))
        return make_response(jsonify({'banned_words': []}, 401))
    except:
        return make_response(jsonify({'banned_words': []}, 401))
        


    
app.run()