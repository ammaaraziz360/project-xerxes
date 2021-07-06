from flask import Flask, json, request, jsonify, make_response, abort
from flask_cors import CORS

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

# default route
@app.route('/', methods=['GET'])
def home():
    return jsonify({"data": 'This is the REST API for Project Xerxes'})

app.run()