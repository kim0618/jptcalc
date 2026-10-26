# GA4 이벤트 4종 작업안 (운영 사이트 전 계산기, 기준선 측정용)

상태: 작업안. 운영 코드(~/jptcalc)에는 아직 넣지 않았다. 승인 후 적용.

## 넣는 곳: 파일 1개

- `assets/calc-result-tools.js` 하나만 수정한다. 계산기 104개가 전부 이 파일과 gtag를 이미 로드한다(10/15 실측 104/104).
- 이 파일은 이미 결과 카드 표시를 감시(MutationObserver)하고, 복사 버튼과 '이어서 계산하기' 박스를 만든다. 같은 자리에 이벤트를 붙인다.
- 기존 이벤트 `result_next_calc`, `result_next_guide`, `result_cta_*`는 그대로 둔다(과거 데이터와 이어보기).

## 이벤트 정의

| 이벤트 | 언제 | 파라미터 | 중복 방지 |
|---|---|---|---|
| `calc_start` | 본문(main) 안 input/select에 사용자가 처음 값을 넣을 때 | `calc_id` | 페이지뷰당 1회 |
| `calc_complete` | 결과 카드가 '안 보임 → 보임'으로 바뀔 때, 단 `calc_start` 이후만 | `calc_id` | 페이지뷰당 1회 |
| `result_copy` | 결과 '복사' 성공 시(결과공유·이미지저장은 `method`로 구분) | `calc_id`, `method`(copy/share/image) | 매번 |
| `next_calc_click` | 현재 페이지에서 다른 `/calc/…` 링크를 누를 때 | `from_calc`, `to_calc`, `prefilled`(true/false), `link_area`(result/related/body) | 매번, `transport_type: 'beacon'` |

`calc_id` = 경로에서 `/calc/`와 끝 `/`를 뗀 값. 예: `realestate/dti`.

판단 지표: 완료율 = calc_complete ÷ calc_start, 이어서 계산률 = next_calc_click ÷ calc_complete, 평균 참여 시간(GA4 기본).

## 예외 처리 (실측)

- 페이지를 열자마자 기본값으로 결과를 보여주는 계산기 6개: baby/total-support, health/calories, pension-welfare/long-term-care, realestate/pyeong, tools/char-count, tools/lunar-calendar. `calc_complete`를 `calc_start` 뒤에만 보내므로 완료율이 부풀지 않는다.
- 결과 카드 구조가 다른 2개: ai/llm-comparison(결과 카드 없음, 비교표), realestate/pyeong(카드 마크업 다름). 페이지에서 `window.jptTrack('calc_complete')`를 한 줄 호출하도록 추가.

## 코드 초안 (calc-result-tools.js 안)

```js
// ── GA4 기준선 이벤트 (calc_start / calc_complete / result_copy / next_calc_click) ──
const CALC_ID = (location.pathname.match(/^\/calc\/(.+?)\/?$/) || [,''])[1];
let started = false, completed = false;
function track(name, params){
  try { if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ calc_id: CALC_ID }, params || {})); } catch(e){}
}
window.jptTrack = function(name, params){
  if (name === 'calc_complete') { if (!started || completed) return; completed = true; }
  track(name, params);
};
document.addEventListener('input', (e)=>{
  if (started || !e.isTrusted) return;                      // 사람이 넣은 값만 (프리필·스크립트 입력 제외)
  if (!e.target.closest || !e.target.closest('main')) return;
  started = true; track('calc_start');
}, true);
// setupTarget()의 sync() 안: 보임으로 바뀌는 순간
//   if (visible && !wasVisible) window.jptTrack('calc_complete');
// copySnapshot() 성공 콜백:  track('result_copy', { method: 'copy' })
// shareSnapshot():          track('result_copy', { method: 'share' })
// saveAsImage():            track('result_copy', { method: 'image' })
document.addEventListener('click', (e)=>{
  const a = e.target.closest && e.target.closest('a[href^="/calc/"]');
  if (!a) return;
  const to = (a.getAttribute('href').match(/^\/calc\/(.+?)\/?(\?|$)/) || [,''])[1];
  if (!to || to === CALC_ID) return;
  const area = a.closest('.result-card') ? 'result' : (a.closest('.sibling-section, .mega-sidebar-right, .mobile-related, .ds-aside-row') ? 'related' : 'body');
  track('next_calc_click', { from_calc: CALC_ID, to_calc: to, prefilled: a.getAttribute('href').includes('?'), link_area: area, transport_type: 'beacon' });
}, true);
```

## GA4 관리 화면에서 할 일 (사용자 또는 Admin API)

이벤트 범위 맞춤 측정기준 5개 등록: `calc_id`, `from_calc`, `to_calc`, `prefilled`, `method`(+`link_area`). 등록 전에 쌓인 파라미터는 보고서에서 볼 수 없으므로 **배포 전에 먼저 등록**한다.

## 검증 (실전송 없이)

- Playwright에서 gtag를 스텁으로 바꿔 호출만 수집(실제 GA 전송 0, 자기 트래픽 오염 없음).
- 12개 카테고리에서 1개씩 + 자동 표시 6개 + 예외 2개 = 20페이지: 첫 입력 1회 → calc_start 1건, 결과 표시 → calc_complete 1건, 복사 → result_copy, 다른 계산기 클릭 → next_calc_click 파라미터 확인. 자동 표시 페이지는 입력 전 calc_complete 0건 확인.

## 영향 범위

- 화면 변경 0. DTI·pyeong 11/9 관측(본문 보강 효과)과 겹치지 않는다.
- 배포: 사용자 rsync 1파일. 브라우저 캐시 때문에 며칠간 일부 방문자는 옛 파일을 쓸 수 있다(기준선 첫 2~3일은 버린다).
- 기준선 기간: 배포 후 최소 2주(주중·주말 포함) 쌓은 뒤 리디자인 배포. 리디자인 페이지도 같은 이벤트명.
