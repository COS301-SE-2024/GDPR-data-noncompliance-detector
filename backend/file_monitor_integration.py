import http
import json
import subprocess
import requests

def send_to_api(path):
    url = "127.0.0.1:8000"
    endpoint = "/new-file"
    data = json.dumps({"path": path})
    headers = {
        "Content-type": "application/json",
    }

    try:
        conn = http.client.HTTPConnection(url)
        conn.request("POST", endpoint, body=data, headers=headers)
        response = conn.getresponse()
        if response.status == 200:
            print(response.read().decode())
        else:
            print(f"Error sending to API: {response.status} {response.reason}")
        conn.close()
    except Exception as e:
        print(f"Error sending to API: {e}")
    # url = "http://127.0.0.1:8000/new-file"
    # data = {"path": path}
    # try:
    #     response = requests.post(url, json=data)
    #     response.raise_for_status()
    #     print(response.json())
    # except requests.exceptions.RequestException as e:
    #     print(f"Error sending to API: {e}")

def start():
    file_watcher_script_path = './File_monitor/file_watcher.py'
    watch_locale = './Receiver'
    extensions = 'pdf,docx,xlsx'

    command = ['python',file_watcher_script_path,watch_locale,extensions]

    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())
            if(output != "Watcher is watching: ['./Receiver'] with extensions: ['pdf', 'docx', 'xlsx']"):
                send_to_api(output)






if __name__ == '__main__':
    start()