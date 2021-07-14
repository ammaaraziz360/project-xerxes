from google.oauth2 import id_token
from google.auth.transport import requests
from flask import Flask, json, request, jsonify, make_response, abort
from flask_cors import CORS
from mysql_db_access import mysql_connection
from datetime import datetime


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

        if(AuthenticateUser(auth_token)):
            result = mysql_connection.InsertUsers(request_body)
            return jsonify({"user_exists": result}, 200)
        
        return jsonify({"user_exists": None}, 401)
    except:
        return 


@app.route('/api/users/banned-usernames', methods=['GET'])
def getBannedUsernames():

    try:
        auth_token = request.headers['auth_token']
        if AuthenticateUser(auth_token):
            banned_words = mysql_connection.bannedPhrases()
            return make_response(jsonify({'banned_words': banned_words}, 200))
        return make_response(jsonify({'banned_words': []}, 401))
    except:
        return make_response(jsonify({'banned_words': []}, 401))
        

def AuthenticateUser(auth_token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(auth_token, requests.Request(), '31312193628-o29ttjk3ogu3ftvbvurt91oi8t3akt0m.apps.googleusercontent.com')

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        return True
    except ValueError:
        # Invalid token
        return False
    
app.run()