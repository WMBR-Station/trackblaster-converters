
import SimpleHTTPServer
import SocketServer
import os

cwd = os.getcwd() 
os.chdir('../')
PORT = 8000

import BaseHTTPServer, SimpleHTTPServer
import ssl



httpd = BaseHTTPServer.HTTPServer(('curious-cube.csail.mit.edu', 8000),
	SimpleHTTPServer.SimpleHTTPRequestHandler)


httpd.socket = ssl.wrap_socket (httpd.socket,
	keyfile=cwd+"/key.pem",
	certfile=cwd+'/cert.pem', server_side=True)

print("=== Server ===")
httpd.serve_forever()

