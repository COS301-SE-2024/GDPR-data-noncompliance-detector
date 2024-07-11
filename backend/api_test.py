import requests

if __name__ == "__main__":
    url = 'http://127.0.0.1:8000/read-report/'
    pars = {'path' : './Reports/dutch.txt'}
    res =  requests.get(url=url,params=pars)
    x = res.json()
    print(res)
    print(x['content'])