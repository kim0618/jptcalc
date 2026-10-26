"""리뉴얼 작업본을 폰(같은 와이파이)에서 보기 위한 미리보기 서버.

사용: python3 -I design/phone-preview-server.py [포트=8770]
- 작업본 루트를 그대로 서빙한다(파일은 수정하지 않음).
- HTML 응답에서만: GA4 수집을 끈다(window['ga-disable-G-BRSX3F10MZ']=true, 운영 GA4에 내 접속이 섞이지 않게),
  애드센스·카카오 애드핏 스크립트 태그를 뺀다(미승인 주소에서 광고 요청이 나가지 않게).
- 캐시를 끈다(수정 후 폰에서 새로고침하면 바로 반영).
"""
import http.server, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8770
GA_OFF = b"<script>window['ga-disable-G-BRSX3F10MZ']=true;</script>"
AD_TAGS = re.compile(rb'<script[^>]*(adsbygoogle\.js|kakaocdn\.net/kas)[^>]*>\s*</script>', re.I)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            if not self.path.split('?')[0].endswith('/'):
                return super().send_head()          # 끝 슬래시 리다이렉트는 기본 동작대로
            path = os.path.join(path, 'index.html')
        if not path.endswith('.html') or not os.path.isfile(path):
            return super().send_head()
        body = open(path, 'rb').read()
        body = AD_TAGS.sub(b'', body)
        body = re.sub(rb'<head>', b'<head>' + GA_OFF, body, count=1, flags=re.I)
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        import io
        return io.BytesIO(body)


if __name__ == '__main__':
    http.server.ThreadingHTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
