
import { Language } from '../types';

export const translations = {
  en: {
    appTitle: "Pendle YT Analyzer",
    officialApp: "Official App",
    scoreCriteriaTitle: "Investment Score Criteria",
    scoreCriteriaDesc: "Scores are calculated based on the profitability of buying YT tokens at the current moment:",
    criteria: [
        "Spread Check: Underlying APY > Implied APY? (+Score)",
        "Strong Candidate: Is the APY Spread > 3%? (Large Bonus)",
        "Trend Entry: Is 7-day Underlying APY Rising? (Immediate Entry Bonus)",
        "Maturity Safety: Is maturity < 30 days? (Avoid/Penalty)"
    ],
    tiers: {
        'Strong Buy': "Strong Buy",
        'Buy': "Buy",
        'Hold': "Hold",
        'Avoid': "Avoid",
    },
    tierDescs: {
        strongBuy: "Spread > 3% & Rising Trend",
        buy: "Positive Spread & Healthy Time",
        avoid: "Negative Spread or <30 Days"
    },
    activeOpp: "Active Opportunities",
    filterAll: "All",
    sortHigh: "Highest Score First",
    sortLow: "Lowest Score First",
    noMarkets: "No markets match the selected filter.",
    clearFilters: "Clear Filters",
    disclaimer: "Disclaimer: This tool is for informational purposes only and uses simulated data for demonstration. Trading Yield Tokens (YT) involves significant risk, including the potential loss of principal if underlying yield drops to zero.",
    card: {
        leverage: "Leverage",
        daysLeft: "days left",
        implied: "Implied APY (Cost)",
        underlying: "Underlying APY (Earn)",
        spread: "Projected Spread",
        trend7d: "7-Day Underlying APY",
        risingTrend: "Rising Trend ↗",
        analysis: "Analysis:",
        generating: "Generating insights...",
        trade: "Trade on Pendle"
    },
    logic: {
        rising: "Rising (Strong Signal)",
        falling: "Falling",
        spreadIdeal: "(>3% Ideal)",
        spread: "Spread",
        trend: "Trend",
        maturity: "Maturity"
    }
  },
  ko: {
    appTitle: "Pendle YT 분석기",
    officialApp: "공식 앱",
    scoreCriteriaTitle: "투자 점수 기준",
    scoreCriteriaDesc: "점수는 현재 시점에서 YT 토큰을 매수했을 때의 예상 수익성을 기반으로 계산됩니다:",
    criteria: [
        "스프레드 확인: 기초 APY > 내재 APY? (+점수)",
        "강력 후보: APY 차이가 3% 이상인가? (큰 보너스)",
        "진입 추세: 최근 7일 기초 APY가 상승세인가? (즉시 진입 보너스)",
        "만기 안전성: 만기가 30일 미만인가? (회피/패널티)"
    ],
    tiers: {
        'Strong Buy': "강력 매수",
        'Buy': "매수",
        'Hold': "보유",
        'Avoid': "관망",
    },
    tierDescs: {
        strongBuy: "스프레드 > 3% & 상승 추세",
        buy: "양의 스프레드 & 충분한 기간",
        avoid: "음의 스프레드 또는 30일 미만"
    },
    activeOpp: "활성 기회",
    filterAll: "전체",
    sortHigh: "높은 점수순",
    sortLow: "낮은 점수순",
    noMarkets: "선택한 필터와 일치하는 상품이 없습니다.",
    clearFilters: "필터 초기화",
    disclaimer: "면책 조항: 이 도구는 정보 제공 목적으로만 사용되며 데모용 시뮬레이션 데이터를 사용합니다. YT(Yield Token) 거래는 기초 수익률이 0으로 떨어질 경우 원금 손실을 포함한 상당한 위험을 수반합니다.",
    card: {
        leverage: "레버리지",
        daysLeft: "일 남음",
        implied: "내재 APY (비용)",
        underlying: "기초 APY (수익)",
        spread: "예상 스프레드",
        trend7d: "7일 기초 APY",
        risingTrend: "상승 추세 ↗",
        analysis: "분석:",
        generating: "인사이트 생성 중...",
        trade: "Pendle에서 거래하기"
    },
    logic: {
        rising: "상승세 (강력 신호)",
        falling: "하락세",
        spreadIdeal: "(>3% 이상적)",
        spread: "스프레드",
        trend: "추세",
        maturity: "만기"
    }
  }
};
