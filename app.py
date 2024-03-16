from flask import Flask, render_template,request,jsonify,make_response,Response
import json
import requests
import socket
from flask_cors import CORS

from useyaml import FrigateYaml
frigate_yaml = FrigateYaml()
# You'll need to install PyJWT via pip 'pip install PyJWT' or your project packages file

import jwt
import time

import os # 增加 os 套件的功能

# 動態取得 IP
APISERVER = os.getenv('APISERVER')
APISERVERWEB = os.getenv('APISERVERWEB') # 前端使用
FRIGATEIP = os.getenv('FRIGATEIP')
FRIGATEIPWEB = os.getenv('FRIGATEIPWEB')
FRIGATESAVE = os.getenv('FRIGATESAVE')
FRIGATERESTART = os.getenv('FRIGATERESTART')
METABASE = os.getenv('METABASE')
METABASEWEB = os.getenv('METABASEWEB')
DEMOID = os.getenv('DEMOID') # Demo 鏡頭 id

# 圖資
# MAP = os.getenv('MAP')

app = Flask(__name__, static_folder="main/static", template_folder="main", static_url_path="/static")
CORS(app)
        
@app.route("/")
@app.route("/main")
def main():
    return render_template("index.html",APISERVERWEB=APISERVERWEB,FRIGATEIPWEB=FRIGATEIPWEB,METABASEWEB=METABASEWEB,DEMOID=DEMOID)

@app.route("/getCookieToken",methods=['GET'])
def getCookieToken():
    access_token = request.cookies.get('access_token')
    refresh_token = request.cookies.get('refresh_token')

    resp = ''
    if access_token or refresh_token:
        resp = make_response(
                jsonify({
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }))
        return resp, 200
    else:
        return {"data":"Failed"}, 400

@app.route("/setCookieToken",methods=['POST'])
def setCookieToken():
    access_token = request.values.get('access_token', None)
    # refresh_token = request.values.get('refresh_token', None)

    resp = ''
    if access_token:
        resp = make_response(
                jsonify({
                    "access_token": access_token,
                    # "refresh_token": refresh_token
                }))

        resp.set_cookie(key='access_token', value=access_token, expires=time.time() + 24 * 60, path='/', httponly=True)
        # resp.set_cookie(key='refresh_token', value=refresh_token, expires=time.time() + 30 * 24 * 60 * 60, path='/', httponly=True)

        return resp, 200
    else:
        return {"data":"Failed"}, 400

@app.route("/delCookieToken",methods=['DELETE'])
def delCookieToken():
    # 建立一個回應物件
    response = make_response('Logged out successfully')

    # 將所有 cookie 的過期時間設為過去的時間
    for cookie in request.cookies:
        response.delete_cookie(cookie)

    return response

@app.route("/userlogin",methods=['POST'])
def userlogin():
    account = request.json.get('account', None)
    pw = request.json.get('password', None)

    url = APISERVER + "/member/userlogin"
    data = {
        "account": account,
        "password": pw
    }

    response = requests.post(url,  json=data)

    if response.status_code == 200:
        access_token = response.cookies.get('access_token')
        refresh_token = response.cookies.get('refresh_token')
        resp = make_response(
            jsonify({
                "account": account,
                "access_token": access_token,
                "refresh_token": refresh_token
            }))
        
        resp.set_cookie(key='access_token', value=access_token, expires=time.time() + 24 * 60, path='/', httponly=True)
        resp.set_cookie(key='refresh_token', value=refresh_token, expires=time.time() + 30 * 24 * 60 * 60, path='/', httponly=True)
        
        return resp,200
    else:
        return response.text,response.status_code

@app.route("/aicamReport")
def aicamReport():
    # METABASE_SITE_URL = METABASE # "https://saas_metabase.intemotech.com"

    METABASE_SITE_URL = METABASEWEB
    METABASE_SECRET_KEY = "c6020f2bcef7b9aae1709db5bdd8092f0829dbe766fb471a5b0d015d224cad16"

    payload = {
    "resource": {"dashboard": 100},
    "params": {
        
    },
    "exp": round(time.time()) + (60 * 10) # 10 minute expiration
    }
    token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")

    iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#theme=night&bordered=true&titled=true"
    return iframeUrl

# object_mapping = {
#     "手機": "cell phone",
#     "小型手冊": "book",
#     "行李箱": "backpack",
#     "後背包": "backpack",
#     "側背包": "bag",
#     "手拿包": "handbag",
#     "公事包": "suitcase",
#     "箱子": "box",
#     "雨傘": "umbrella",
#     "煙霧": "smoke",
#     "火": "fire",
#     "安全帽": "Hardhat",
#     "反光背心": "Safety Vest",
# }

# # Frigate
# @app.route("/editCamConf",methods=['POST','DELETE'])
# def editCamConf():
#     if request.method == 'POST':
#         camera_name = request.values.get('cameraName')
#         inputs_path = request.values.get('inputsPath')
#         # input_args = request.values.get('inputArgs')
#         # objects_track = json.loads(request.values.get('objectsTrack')) # 陣列
#         objects_track = request.values.get('objectsTrack')
#         if objects_track:
#             # 如果 objectsTrack 存在，則解析它
#             try:
#                 objects_track = json.loads(objects_track)
#                 # 對照英文
#                 objects_track = [object_mapping.get(obj) for obj in objects_track]
#             except json.JSONDecodeError as e:
#                 # 如果解析失敗，記錄錯誤或處理它
#                 print(f"Error decoding JSON: {e}")
#                 objects_track = []  # 或設置為預設值
#         else:
#             # 如果 objectsTrack 不存在，設置為空列表或預設值
#             objects_track = []
            
#         rtn = frigate_yaml.insertYaml(camera_name,inputs_path,objects_track)
#         if rtn:
#             # 讀取 YAML 文件
#             with open('config.yaml', 'r') as file:
#                 yaml_content = file.read()

#             # 發送存 config 檔案
#             edit_url = FRIGATESAVE
#             headers = {'Content-Type': 'text/plain'}
#             response = requests.post(edit_url, data=yaml_content, headers=headers)

#             if response.status_code == 200:
#                 print(response.text)

#                 # 重整 Frigate
#                 restart_url = FRIGATERESTART
#                 restart_response = requests.post(restart_url)

#                 return {'message': json.loads(restart_response.text)}, 200
#             else:
#                 return {'message': response.text}, 400
#         else:
#             return {'message': '解析或新增修改 yaml 檔案錯誤'}, 400
#     elif request.method == 'DELETE':
#         camera_name = request.values.get('cameraName')

#         rtn = FrigateYaml.deleteYamlCam(camera_name)

#         if rtn:
#             # 讀取 YAML 文件
#             with open('config.yaml', 'r') as file:
#                 yaml_content = file.read()

#             # 發送存 config 檔案
#             edit_url = FRIGATESAVE
#             headers = {'Content-Type': 'text/plain'}
#             response = requests.post(edit_url, data=yaml_content, headers=headers)

#             if response.status_code == 200:
#                 print(response.text)

#                 # 重整 Frigate
#                 restart_url = FRIGATERESTART
#                 restart_response = requests.post(restart_url)

#                 return {'message': json.loads(restart_response.text)}, 200
#             else:
#                 return {'message': response.text}, 400
#         else:
#             return {'message': "刪除失敗，無此攝影機"}, 400

@app.route('/frigatestats')
def frigatestats():
    try:
        response = requests.get(FRIGATEIP+"api/stats")
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/frigateevents')
def frigateevents():
    # camid = request.args.get('camid')
    try:
        response = requests.get(FRIGATEIP+"api/events")
        # response = requests.get('https://iseekwebfrigate.intemotech.com/api/events?cameras=camera'+camid)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run()
