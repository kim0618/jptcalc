#!/usr/bin/env python3
"""
카테고리 index 페이지 우측 사이드바를 TOC(목차)로 전환.
- 메인 섹션에 id 앵커 부여
- 우측 사이드바 블로그/카테고리 위젯 제거
- TOC 위젯 삽입 (자주 찾는 계산기 / 상황별 / 배경지식 / FAQ / 블로그)
- TOC CSS 추가
- IntersectionObserver 기반 scroll spy 추가
"""

import re
from pathlib import Path

TARGETS = [
    ("salary", "이직/연봉"),
    ("tax", "프리랜서 세금"),
    ("finance", "금융·이자"),
    ("pension-welfare", "연금·복지"),
    ("health", "건강"),
    ("pet", "반려동물"),
]

BASE = Path("/home/tjd618/jptcalc/calc")

SECTION_IDS = {
    'hub-popular': 'sec-popular',
    'hub-guide': 'sec-guide',
    'calc-hub': 'sec-calcs',
    'hub-knowledge': 'sec-knowledge',
    'hub-faq': 'sec-faq',
    'hub-blogs': 'sec-blogs',
}

TOC_LABELS = {
    'sec-popular': '자주 찾는 계산기',
    'sec-guide': '상황별 추천',
    'sec-calcs': '전체 계산기',
    'sec-knowledge': '배경 지식',
    'sec-faq': '자주 묻는 질문',
    'sec-blogs': '함께 보면 좋은 블로그',
}

TOC_CSS = """
    /* TOC (우측 목차) */
    .msr-toc { padding: 18px 14px; }
    .msr-toc-title { font-size: 11px; font-weight: 800; color: var(--gray-500); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; padding: 0 8px; }
    .msr-toc-list { display: flex; flex-direction: column; gap: 2px; }
    .msr-toc-link { display: block; padding: 9px 12px; border-radius: 8px; text-decoration: none; font-size: 12.5px; font-weight: 600; color: var(--gray-500); transition: all 0.15s; border-left: 2px solid transparent; }
    .msr-toc-link:hover { background: var(--primary-light); color: var(--primary); border-left-color: var(--primary); }
    .msr-toc-link.active { background: var(--primary-light); color: var(--primary); border-left-color: var(--primary); }
"""

TOC_SCRIPT = """<script>
(function(){
  const links = document.querySelectorAll('.msr-toc-link');
  const sections = Array.from(links).map(a => {
    const id = a.getAttribute('href').replace('#', '');
    return { link: a, el: document.getElementById(id) };
  }).filter(x => x.el);
  if (!sections.length) return;
  let clickLock = false;
  let lockTimer = null;
  function setActive(link) {
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  }
  const io = new IntersectionObserver((entries) => {
    if (clickLock) return;
    entries.forEach(e => {
      if (e.isIntersecting) {
        const match = sections.find(s => s.el === e.target);
        if (match) setActive(match.link);
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
  sections.forEach(s => io.observe(s.el));
  window.addEventListener('scroll', () => {
    if (clickLock) return;
    if ((window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 200) {
      setActive(sections[sections.length - 1].link);
    }
  }, { passive: true });
  links.forEach(l => l.addEventListener('click', (e) => {
    const id = l.getAttribute('href').replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      setActive(l);
      clickLock = true;
      if (lockTimer) clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { clickLock = false; }, 900);
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      history.replaceState(null, '', '#' + id);
    }
  }));
})();
</script>"""


def build_toc_aside(slug):
    items = []
    # 페이지마다 섹션 유무 다름. 존재하는 섹션만 링크
    # 일단 표준 순서로 모두 포함. 없는 섹션은 링크 깨짐 방지 위해 문서 내 존재 여부 체크 후 삽입
    for sec_id in ['sec-popular', 'sec-guide', 'sec-calcs', 'sec-knowledge', 'sec-faq', 'sec-blogs']:
        label = TOC_LABELS[sec_id]
        items.append(f'      <a href="#{sec_id}" class="msr-toc-link">{label}</a>')
    items_html = '\n'.join(items)
    return f"""<aside class="mega-sidebar-right">
  <div class="msr-widget msr-toc">
    <div class="msr-toc-title">이 페이지에서</div>
    <nav class="msr-toc-list">
{items_html}
    </nav>
  </div>
</aside>"""


def process_file(slug):
    path = BASE / slug / "index.html"
    if not path.exists():
        print(f"  SKIP: {path} 없음")
        return False
    html = path.read_text(encoding='utf-8')
    original = html

    # 1) 섹션 id 앵커 삽입 (이미 있으면 skip)
    for class_name, section_id in SECTION_IDS.items():
        pattern = rf'<div class="{class_name}"(?![^>]*id=)'
        replacement = f'<div class="{class_name}" id="{section_id}"'
        html = re.sub(pattern, replacement, html, count=1)
        # style 속성 같은 거 있을 때도 처리
        pattern2 = rf'<div class="{class_name}" style='
        replacement2 = f'<div class="{class_name}" id="{section_id}" style='
        html = re.sub(pattern2, replacement2, html, count=1)

    # 2) 우측 사이드바 블록 교체
    # <aside class="mega-sidebar-right">...</aside> 전체 교체
    new_aside = build_toc_aside(slug)
    pattern = r'<aside class="mega-sidebar-right">.*?</aside>'
    html = re.sub(pattern, new_aside, html, count=1, flags=re.DOTALL)

    # 3) TOC CSS 추가 (이미 있으면 skip)
    if '.msr-toc-link' not in html:
        # </style> 바로 앞에 삽입
        html = html.replace('</style>', TOC_CSS + '\n  </style>', 1)

    # 4) TOC scroll spy 스크립트 추가 (이미 있으면 skip)
    if '.msr-toc-link' not in html or 'msr-toc-link' not in original:
        pass  # CSS 조건과 별개로 스크립트 삽입
    if 'IntersectionObserver' not in html:
        # footer-unified.js script 앞에 삽입
        html = html.replace(
            '<script src="/assets/footer-unified.js" defer></script>',
            TOC_SCRIPT + '\n<script src="/assets/footer-unified.js" defer></script>',
            1
        )

    if html == original:
        print(f"  변화 없음: {slug}")
        return False

    path.write_text(html, encoding='utf-8')
    print(f"  OK: {slug}")
    return True


def main():
    for slug, label in TARGETS:
        print(f"[{label}] {slug}")
        process_file(slug)


if __name__ == '__main__':
    main()
