
import SimpleHTTPServer
import SocketServer
import os
 
os.chdir('../')
PORT = 8000
 
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)
print "serving at port", PORT
httpd.serve_forever()
