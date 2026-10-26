"""변환 후 스타일을 잃은 클래스 찾기: 페이지 HTML(스크립트가 만드는 마크업 포함)에 쓰인 클래스 중
base.css·페이지 <style>에 규칙이 없고, 원본이 불러오던 카테고리 공용 CSS(assets/*.css)에만 규칙이 있던 것.
사용: python3 -I design/tools/lost_css.py CAT...  (원본은 design/tools/orig/CAT/SLUG.html)"""
import re, sys, glob, os
T = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(os.path.dirname(T))
def classes_in_css(css): return set(re.findall(r'\.([A-Za-z_][\w-]*)', re.sub(r'url\([^)]*\)', '', css)))
base = classes_in_css(open(os.path.join(SITE, 'assets/ds/base.css'), encoding='utf-8').read())
for cat in sys.argv[1:]:
    for f in sorted(glob.glob(os.path.join(T, 'orig', cat, '*.html'))):
        slug = os.path.basename(f)[:-5]
        if slug.startswith('_'): continue
        o = open(f, encoding='utf-8').read()
        old = set()
        for href in re.findall(r'<link rel="stylesheet" href="(/assets/[^"]+\.css)"', o):
            pth = os.path.join(SITE, href.lstrip('/'))
            if os.path.exists(pth): old |= classes_in_css(open(pth, encoding='utf-8').read())
        n = open(os.path.join(SITE, 'calc', cat, slug, 'index.html'), encoding='utf-8').read()
        page = classes_in_css(' '.join(re.findall(r'<style[^>]*>(.*?)</style>', n, re.S)))
        used = set()
        for m in re.findall(r'class(?:Name)?\s*=\s*["\'`]([^"\'`]+)["\'`]', n) + re.findall(r'classList\.(?:add|toggle)\(\s*[\'"]([\w-]+)', n):
            used |= set(x for x in re.split(r'\s+', m) if re.fullmatch(r'[A-Za-z_][\w-]*', x))
        lost = sorted(c for c in used if c in old and c not in base and c not in page and not c.startswith('ds-'))
        if lost: print(f'{cat}/{slug}:', ' '.join(lost))
