from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import json
import sys
import os

class CORSRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        BaseHTTPRequestHandler.end_headers(self)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/models':
            try:
                # Forward the request to LM Studio
                response = urllib.request.urlopen('http://localhost:1234/v1/models')
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(response.read())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            # Serve static files
            try:
                # Convert URL path to file path
                file_path = self.path
                if file_path == '/':
                    file_path = '/index.html'
                
                # Get the file extension
                _, ext = os.path.splitext(file_path)
                
                # Set content type based on file extension
                content_types = {
                    '.html': 'text/html',
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.ico': 'image/x-icon'
                }
                
                content_type = content_types.get(ext, 'application/octet-stream')
                
                # Read and serve the file
                with open('.' + file_path, 'rb') as f:
                    self.send_response(200)
                    self.send_header('Content-type', content_type)
                    self.end_headers()
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'404 Not Found')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(str(e).encode())

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            print(f"Received request data: {post_data.decode('utf-8')}")
            
            # Forward the request to LM Studio
            req = urllib.request.Request('http://127.0.0.1:1234/v1/chat/completions',
                                      data=post_data,
                                      headers={'Content-Type': 'application/json'})
            
            try:
                with urllib.request.urlopen(req) as response:
                    response_data = response.read()
                    print(f"Received response from LM Studio: {response_data.decode('utf-8')}")
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(response_data)
            except urllib.error.URLError as e:
                print(f"Error connecting to LM Studio: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Failed to connect to LM Studio',
                    'details': str(e)
                }).encode())
            except Exception as e:
                print(f"Unexpected error: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Internal server error',
                    'details': str(e)
                }).encode())
        except Exception as e:
            print(f"Error processing request: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': 'Error processing request',
                'details': str(e)
            }).encode())

if __name__ == '__main__':
    server = HTTPServer(('localhost', 3000), CORSRequestHandler)
    print('Starting server on port 3000...')
    print('Press Ctrl+C to stop the server')
    server.serve_forever() 