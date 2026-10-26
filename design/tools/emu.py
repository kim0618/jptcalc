"""에뮬레이터 실기 테스트 도우미(adb). 화면 요소는 uiautomator dump(크롬 웹 내용의 접근성 노드)로 찾고 실제 터치·키 입력을 보낸다.
사용: python3 design/tools/emu.py 명령 [인자]...
  shot NAME              화면을 design/step-K/NAME.png로
  open URL               크롬에서 URL 열기
  tap X Y | tapt TEXT [N]  좌표 또는 글자(포함, N번째)로 터치
  text STR | key CODE    글자 입력(공백은 %s) / 키(BACK=4, ENTER=66)
  swipe DY               세로로 끌기(+면 아래 내용 보기)
  find TEXT              글자가 든 노드 목록(좌표)
  kb                     가상 키보드가 떠 있는지·높이
여러 명령은 ';'로 이어 한 번에: python3 emu.py "open http://10.0.2.2:8770/; shot a" """
import subprocess, sys, re, time, os, html
A = os.path.expanduser('~/Android/Sdk/platform-tools/adb')
K = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'step-K')
def sh(*a, out=False):
    r = subprocess.run([A, *a], capture_output=True)
    return r.stdout if out else r.returncode
def nodes():
    for _ in range(3):
        sh('shell', 'uiautomator', 'dump', '/sdcard/ui.xml')
        x = sh('shell', 'cat', '/sdcard/ui.xml', out=True).decode('utf-8', 'ignore')
        if '<hierarchy' in x: break
        time.sleep(1)
    res = []
    for m in re.finditer(r'<node [^>]*?text="([^"]*)"[^>]*?content-desc="([^"]*)"[^>]*?bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', x):
        t = html.unescape(m.group(1) or m.group(2)); x1, y1, x2, y2 = map(int, m.group(3, 4, 5, 6))
        if t and x2 > x1 and y2 > y1: res.append((t, (x1 + x2) // 2, (y1 + y2) // 2, (x1, y1, x2, y2)))
    return res
def find(t): return [n for n in nodes() if t in n[0]]
def run(cmd):
    p = cmd.strip().split(' ', 1); c = p[0]; arg = p[1] if len(p) > 1 else ''
    if c == 'shot':
        os.makedirs(K, exist_ok=True); open(os.path.join(K, arg + '.png'), 'wb').write(sh('exec-out', 'screencap', '-p', out=True)); print('shot', arg)
    elif c == 'open':
        sh('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', arg, 'com.android.chrome'); time.sleep(3)
    elif c == 'tap':
        x, y = arg.split(); sh('shell', 'input', 'tap', x, y); time.sleep(1)
    elif c == 'tapt':
        m = re.match(r'(.*?)(?:\s+#(\d+))?$', arg); t, n = m.group(1), int(m.group(2) or 1)
        f = find(t)
        for _ in range(2):
            if len(f) >= n: break
            time.sleep(1.5); f = find(t)
        if len(f) < n: print('못 찾음', t, [x[0] for x in nodes()][:40]); return
        _, x, y, _ = f[n - 1]; sh('shell', 'input', 'tap', str(x), str(y)); print('tap', t, x, y); time.sleep(1.2)
    elif c == 'text':
        sh('shell', 'input', 'text', arg.replace(' ', '%s')); time.sleep(0.6)
    elif c == 'key':
        sh('shell', 'input', 'keyevent', arg); time.sleep(1)
    elif c == 'swipe':
        dy = int(arg); sh('shell', 'input', 'swipe', '540', str(1500 if dy > 0 else 700), '540', str(1500 - dy if dy > 0 else 700 - dy), '400'); time.sleep(1)
    elif c == 'find':
        for n in find(arg): print(n)
    elif c == 'kb':
        d = sh('shell', 'dumpsys', 'input_method', out=True).decode('utf-8', 'ignore')
        print('키보드 보임' if 'mInputShown=true' in d else '키보드 없음', re.findall(r'mTouchableInsets=\d+|touchableRegion=SkRegion\(\(\d+,\d+,\d+,\d+\)\)|mInputShown=\w+', d)[:3])
    elif c == 'sleep':
        time.sleep(float(arg))
for c in ' '.join(sys.argv[1:]).split(';'):
    if c.strip(): run(c)
