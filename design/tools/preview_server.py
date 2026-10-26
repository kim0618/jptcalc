"""미리보기 서버(검수용, 배포 제외, 2026-10-21): 작업본을 캐시 없이(Cache-Control: no-store) 보내고, HTML 응답에서
광고·GA 외부 스크립트(googletagmanager·googlesyndication·kakaocdn·adfit·daumcdn) <script src> 태그만 빼고 보낸다.
파일은 바꾸지 않는다(응답만). 광고 칸(<ins>·.ds-ad)은 원래 크기 빈 자리로 남고, 인라인 gtag 정의는 남아 사이트의 GA 호출은 그냥 넘어간다.
사용: python3 design/tools/preview_server.py [포트=8770]   (작업본 루트 기준, 0.0.0.0에 연다)"""
import http.server, functools, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8770
DROP = re.compile(rb'<script\b[^>]*\bsrc="[^"]*(?:googletagmanager|googlesyndication|kakaocdn|adfit|daumcdn)[^"]*"[^>]*>\s*</script>\s*', re.I)


class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store'); super().end_headers()

    def log_message(self, *a): pass

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            if not self.path.split('?')[0].endswith('/'): return super().send_head()   # 슬래시 붙이기 리다이렉트는 기본 처리
            path = os.path.join(path, 'index.html')
        if not path.endswith('.html') or not os.path.isfile(path): return super().send_head()
        body = DROP.sub(b'', open(path, 'rb').read())
        self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(body))); self.end_headers()
        import io
        return io.BytesIO(body)


if __name__ == '__main__':
    print(f'미리보기 http://localhost:{PORT}/  (캐시 끔, 광고·GA 스크립트 제외)', flush=True)
    http.server.ThreadingHTTPServer(('0.0.0.0', PORT), functools.partial(H, directory=ROOT)).serve_forever()
