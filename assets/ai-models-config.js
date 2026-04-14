/**
 * AI 모델 공통 데이터
 * 이 파일만 수정하면 다음 페이지에 자동 반영됩니다:
 *   - /calc/ai/api-token/   (API 토큰 비용 계산기 드롭다운 + 계산 로직)
 *   - /calc/ai/llm-comparison/  (LLM 성능·가격 비교표)
 *
 * 최종 확인: 2026-03-25
 * 가격 변경 시 각 벤더 공식 사이트에서 확인 후 이 파일의 input/output 값만 업데이트하세요.
 */

window.AI_MODELS = {
  gpt4o:         { name: 'GPT-4o',            input: 2.50,  output: 10.00, ctx: '128K', coding: 88, reasoning: 88 },
  gpt4omini:     { name: 'GPT-4o-mini',        input: 0.15,  output:  0.60, ctx: '128K', coding: 78, reasoning: 75 },
  claude4opus:   { name: 'Claude Opus 4.6',    input: 15.00, output: 75.00, ctx: '200K', coding: 95, reasoning: 96 },
  claude4sonnet: { name: 'Claude Sonnet 4.6',  input:  3.00, output: 15.00, ctx: '200K', coding: 92, reasoning: 90 },
  claude4haiku:  { name: 'Claude Haiku 4.5',   input:  0.80, output:  4.00, ctx: '200K', coding: 82, reasoning: 80 },
  gemini2pro:    { name: 'Gemini 2.5 Pro',     input: 1.25,  output: 10.00, ctx: '1M',   coding: 87, reasoning: 92 },
  gemini2flash:  { name: 'Gemini 2.0 Flash',   input: 0.10,  output:  0.40, ctx: '1M',   coding: 75, reasoning: 72 },
};

// LLM 비교표 표시 순서 (llm-comparison 테이블)
window.AI_MODELS_TABLE_ORDER = [
  'claude4opus', 'claude4sonnet', 'claude4haiku',
  'gpt4o', 'gpt4omini',
  'gemini2pro', 'gemini2flash'
];

// API 토큰 계산기 드롭다운 순서
window.AI_MODELS_SELECT_ORDER = [
  'gpt4o', 'gpt4omini',
  'claude4sonnet', 'claude4haiku', 'claude4opus',
  'gemini2flash', 'gemini2pro'
];

// 기본 선택 모델 (API 토큰 계산기)
window.AI_MODELS_DEFAULT = 'claude4sonnet';

// 데이터 확인 기준일
window.AI_MODELS_UPDATED = '2026-04-14';
