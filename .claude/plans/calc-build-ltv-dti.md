# LTV · DTI 계산기 개발 계획 (realestate)

> 전 10개 카테고리 스윕의 **마지막 신규 2개**. 부동산 net-new 승자(LTV 절대트래픽 ~737 / DTI ~582, 둘 다 우리 1위 중개수수료 388보다 큼). 기존 dsr 페이지는 텍스트 언급만 → 키워드 공백.
> 카테고리 신설 불필요. realestate 기존 카테고리에 calc 2개 추가.

## 1. 산출물 (2개 계산기)

| slug | 경로 | 이름 | 아이콘 | 템플릿 |
|---|---|---|---|---|
| `ltv` | `/calc/realestate/ltv/index.html` | LTV 계산기 (주택담보인정비율) | 🏦 또는 📉 | dsr/index.html 복제 |
| `dti` | `/calc/realestate/dti/index.html` | DTI 계산기 (총부채상환비율) | 📊 또는 📈 | dsr/index.html 복제 |

dsr/index.html이 **완벽한 동일 카테고리 형제 템플릿** (같은 realestate-common.css / realestate-detail-shell.js / affiliate 배너 / trust-block / 가이드 2카드 + FAQ 구조). 이걸 복제 후 로직·문구만 교체.

## 2. 계산 로직 (핵심)

### LTV (Loan To Value = 담보인정비율)
- **기본 공식**: LTV(%) = 대출금 ÷ 주택가격 × 100
- **역산(주 용도)**: 최대 대출가능액 = 주택가격 × LTV비율 - 선순위채권(있으면)
- **입력**: ① 주택가격(만원) ② 적용 LTV 비율(세그먼트 선택) ③ (선택) 선순위 채권·임차보증금
- **세그먼트**: 규제 시나리오 토글로 비율 자동 세팅 + 직접입력 허용
  - 생애최초 80% / 무주택·서민실수요 70% / 규제지역 다주택 등 단계별
  - ⚠️ **2025.10 + 2026 정책 반영 필수**: 가격구간 한도캡(15억↓ 6억 / 15~25억 4억 / 25억↑ 2억)을 **min(주택가×LTV, 가격구간캡)** 으로 적용. 수도권/규제지역 캡 로직.
- **출력**: 최대 대출가능액, 적용 LTV, (캡 적용 시) "가격구간 한도 6억 적용" 배지, 필요 자기자본

### DTI (Debt To Income = 총부채상환비율)
- **공식**: DTI(%) = (주담대 연간 원리금 + 기타대출 연간 **이자**) ÷ 연소득 × 100
  - ⚠️ DSR과의 결정적 차이: 기타대출은 **이자만** 합산(DSR은 원금+이자 전부). 이 차이를 가이드·FAQ에서 명확히.
- **입력**: ① 연소득(만원) ② 주담대 연간 원리금 ③ 기타대출 연간 이자 ④ 기준 선택(규제지역 40% / 비규제 50~60% / 정책상품 60%)
- **출력**: DTI 비율, 판정(적격/초과), 기준 대비, 최대 가능 주담대 연 원리금 = 소득×기준 - 기타이자
- dsr 계산 함수(calcDsr) 구조 거의 그대로, 분자에서 기타대출을 "이자만"으로 바꾸는 게 핵심 차이.

> **빌드 시점 web 재검증 필수**: LTV/DTI 규제 비율·가격구간 캡은 2025.10 대책 + 2026 정책으로 유동적. 착수 직전 금융위/금감원 + 시중은행 자료 2소스 교차확인. (참고: 생애최초 LTV 80% vs 70% 자료 혼재 → 검증 필요)

## 3. 동기화 체크리스트 (SOP: project_jptcalc_calc_registry §4)

기존 추가라 카테고리 신설 작업(common.css/shell/nav 하드코딩 19곳)은 **불필요**. 좌측 사이드바·sibling은 registry 자동.

### A. registry (단일 소스)
- [ ] `assets/calc-registry.js` realestate.calcs 배열에 `ltv`, `dti` 2줄 추가 (dsr 근처, 대출 묶음으로 인접 배치 권장)

### B. sibling 재생성 (필수)
- [ ] `node scripts/inject-sibling.mjs` 실행 → 전 페이지 sibling-section 자동 갱신 (빠뜨리면 크롤러 내부링크 누락)

### C. realestate/index.html (수동 SEO)
- [ ] JSON-LD `hasPart` 에 2개 WebApplication 항목 추가 (line 52~)
- [ ] description "…15가지" → **17가지** (line 50)
- [ ] msl-calc-btn 목록에 2개 추가 (line 1346~)
- [ ] calc-hub-grid 카드 2개 추가 (대출 그룹)
- [ ] hub-guide "집 살 때 자금계획" 동선에 LTV/DTI 노출 검토 (line 1416~)

### D. 홈 index.html (자동화 안 닿음 - 수동)
- [ ] sidebar s-badge `15` → **17** (line 562 부근)
- [ ] cat-card realestate pills `more +11` → **+13** (line 652). 핵심 pill에 LTV/DTI 노출 검토
- [ ] 총 계산기 수 **80 → 82**: line 7(meta desc)·28(WebSite JSON-LD)·621(hero-sub)·851(본문, 현재 79로 stale → 82로 통일)

### E. about.html
- [ ] 80개 → **82개** (line 7, 69)

### F. 사이트 인프라
- [ ] `sitemap.xml` 에 2 URL 추가
- [ ] `llms.txt` 에 2줄 추가 (realestate 섹션)
- [ ] `data-points.md` §5 에 **5.5 LTV 규제 비율 / 5.6 DTI 규제 비율** 신규 등록 (현재값·검색패턴·영향페이지=ltv·dti index). jptcalc-refresh가 부동산 정책 발표 시 자동 흡수하게.

### G. 블로그 동반 글 (선택, SEO 강화)
- 기존 `blog/posts/mortgage-dsr-guide.html`(DSR·LTV 계산법)이 이미 키워드 일부 점유. 신규 LTV/DTI 전용 글 1편씩 or 통합 1편 → CTA로 신규 계산기 유도. `/blog` 스킬 사용. **본 빌드 후 별도 진행 권장**(계산기 우선).

## 4. 작업 순서

1. **(빌드 직전) web 재검증** — LTV/DTI 규제 비율·가격구간 캡 2소스 교차확인, data-points.md §5.5/5.6 초안
2. `dti/index.html` 먼저 (dsr와 로직 90% 동일, 분자만 변경 → 빠름) → node 검산
3. `ltv/index.html` (역산 + 가격구간 캡 로직 → 검증 더 필요) → node 검산
4. registry 2줄 → `inject-sibling.mjs` 실행
5. realestate/index.html → 홈 index.html → about → sitemap → llms (C~F)
6. 카운트 정합성 grep 검증 (80/79 혼재 → 82 통일)
7. (별도) 블로그 글

## 5. 검증 게이트
- [ ] node로 LTV 역산(가격구간 캡 경계값 15억/25억)·DTI 비율 경계값 수기 대조 PASS
- [ ] DTI 분자가 "기타대출 이자만"인지 (DSR과 구분) 코드 확인
- [ ] 카운트 82 전수 일치 (index/about/realestate index)
- [ ] sibling-section에 ltv·dti current 표기 정상
- 배포는 사용자 직접 (deploy-policy)
