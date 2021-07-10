from google.oauth2 import id_token
from google.auth.transport import requests
from flask import Flask, json, request, jsonify, make_response, abort
from flask_cors import CORS

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# default route
@app.route('/api/users', methods=['POST'])
def home():
    try:
        request_body = request.json

        if(AuthenticateUser(request_body["auth_token"])):
            return make_response(jsonify({"staus": "Authentication Success"}), 200)
        return make_response(jsonify({"status": "Authentication Failuire"}), 401)
    except:
        return 



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
        print(userid)
        return True
    except ValueError:
        # Invalid token
        return False
    
app.run()