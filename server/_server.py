"""Dev server with aggressive no-cache headers so the browser always fetches fresh files."""
import http.server, sys

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
print(f"Serving on http://127.0.0.1:{port} with NO CACHE headers")
http.server.HTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
