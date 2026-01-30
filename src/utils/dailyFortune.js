/**
 * 오늘의 운세 계산 유틸리티
 * 매일 다른 운세를 생성합니다.
 */

import { calculateSaju } from './saju';

// 일진 (日辰) 계산을 위한 데이터
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const OHANG = {
    '갑': '목', '을': '목', '병': '화', '정': '화',
    '무': '토', '기': '토', '경': '금', '신': '금',
    '임': '수', '계': '수'
};

const OHANG_JIJI = {
    '인': '목', '묘': '목', '사': '화', '오': '화',
    '진': '토', '술': '토', '축': '토', '미': '토',
    '신': '금', '유': '금', '해': '수', '자': '수'
};

/**
 * 오늘의 일진 계산
 */
export function getTodayGanji(date = new Date()) {
    const baseDate = new Date(1900, 0, 1);
    const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));

    const ganIndex = (diffDays % 10 + 10) % 10;
    const jiIndex = ((diffDays + 4) % 12 + 12) % 12;

    return {
        gan: CHEONGAN[ganIndex],
        ji: JIJI[jiIndex],
        ohang: OHANG[CHEONGAN[ganIndex]],
        fullName: `${CHEONGAN[ganIndex]}${JIJI[jiIndex]}일`,
        dateString: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    };
}

/**
 * 일간과 오늘 일진의 관계 분석
 */
function analyzeRelation(myOhang, todayOhang) {
    const relations = {
        '목': { generates: '화', controlled: '금', controls: '토', generatedBy: '수' },
        '화': { generates: '토', controlled: '수', controls: '금', generatedBy: '목' },
        '토': { generates: '금', controlled: '목', controls: '수', generatedBy: '화' },
        '금': { generates: '수', controlled: '화', controls: '목', generatedBy: '토' },
        '수': { generates: '목', controlled: '토', controls: '화', generatedBy: '금' }
    };

    const myRel = relations[myOhang];

    if (todayOhang === myOhang) return { type: '비화', score: 70, desc: '평온한 하루' };
    if (todayOhang === myRel.generatedBy) return { type: '생부', score: 95, desc: '대길일' };
    if (todayOhang === myRel.generates) return { type: '설기', score: 75, desc: '순탄한 하루' };
    if (todayOhang === myRel.controls) return { type: '극재', score: 85, desc: '재물운 상승' };
    if (todayOhang === myRel.controlled) return { type: '극살', score: 45, desc: '조심할 하루' };

    return { type: '평', score: 60, desc: '무난한 하루' };
}

/**
 * 오늘의 운세 카테고리별 생성
 */
function generateDailyCategories(saju, todayGanji, relation) {
    const { ilgan, ilganOhang, year } = saju;
    const seed = todayGanji.gan.charCodeAt(0) + todayGanji.ji.charCodeAt(0) + ilgan.charCodeAt(0);

    // 시드 기반 의사난수 생성
    const random = (min, max) => {
        const x = Math.sin(seed * (min + 1)) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    const adjustScore = (base) => Math.min(100, Math.max(20, base + random(-15, 15)));

    return {
        overall: {
            score: relation.score,
            title: '종합운',
            description: relation.desc,
            advice: getOverallAdvice(relation, ilganOhang, todayGanji)
        },
        love: {
            score: adjustScore(relation.score),
            title: '연애운',
            description: getLoveDescription(relation.score, seed),
            advice: getLoveAdvice(relation.score, seed)
        },
        money: {
            score: adjustScore(relation.score + 5),
            title: '금전운',
            description: getMoneyDescription(relation.score, seed),
            advice: getMoneyAdvice(relation.score, seed)
        },
        work: {
            score: adjustScore(relation.score - 5),
            title: '직장/학업운',
            description: getWorkDescription(relation.score, seed),
            advice: getWorkAdvice(relation.score, seed)
        },
        health: {
            score: adjustScore(relation.score),
            title: '건강운',
            description: getHealthDescription(saju.minOhang, seed),
            advice: getHealthAdvice(saju.minOhang)
        }
    };
}

function getOverallAdvice(relation, ilganOhang, todayGanji) {
    const advices = {
        '생부': [
            '오늘은 귀인의 도움이 있는 날입니다. 중요한 결정을 내리기 좋습니다.',
            '에너지가 충만한 날입니다. 새로운 일을 시작하기에 좋습니다.',
            '운이 따르는 하루입니다. 적극적으로 행동하세요.'
        ],
        '설기': [
            '마음이 편안한 하루입니다. 여유를 즐기세요.',
            '창의력이 높아지는 날입니다. 아이디어를 정리해보세요.',
            '순탄한 흐름이 예상됩니다. 계획대로 진행하세요.'
        ],
        '극재': [
            '재물운이 상승하는 날입니다. 거래나 계약에 유리합니다.',
            '금전적 기회가 올 수 있습니다. 눈을 크게 뜨세요.',
            '투자에 관심을 가져볼 만한 날입니다.'
        ],
        '비화': [
            '평온하게 자신을 돌아보는 하루가 좋겠습니다.',
            '경쟁보다는 협력이 유리한 날입니다.',
            '무리하지 말고 꾸준히 나아가세요.'
        ],
        '극살': [
            '조심스럽게 행동하는 것이 좋겠습니다.',
            '큰 결정은 내일로 미루세요.',
            '감정 조절에 신경 쓰세요. 충돌을 피하세요.'
        ]
    };

    const list = advices[relation.type] || advices['비화'];
    return list[Math.abs(todayGanji.gan.charCodeAt(0)) % list.length];
}

function getLoveDescription(score, seed) {
    if (score >= 85) {
        const options = [
            '로맨틱한 만남이 기대되는 하루입니다.',
            '연인과의 관계가 더욱 깊어지는 날입니다.',
            '새로운 인연이 다가올 수 있습니다.'
        ];
        return options[seed % options.length];
    } else if (score >= 60) {
        const options = [
            '평온한 관계가 유지되는 하루입니다.',
            '소소한 데이트가 즐거울 날입니다.',
            '서로를 이해하는 대화를 나눠보세요.'
        ];
        return options[seed % options.length];
    } else {
        const options = [
            '오해가 생기기 쉬운 날입니다. 말조심하세요.',
            '감정적인 대화는 피하는 것이 좋겠습니다.',
            '혼자만의 시간이 필요할 수 있습니다.'
        ];
        return options[seed % options.length];
    }
}

function getLoveAdvice(score, seed) {
    if (score >= 85) return '적극적으로 마음을 표현하세요.';
    if (score >= 60) return '상대방의 이야기에 귀 기울이세요.';
    return '차분하게 감정을 정리하는 시간을 가지세요.';
}

function getMoneyDescription(score, seed) {
    if (score >= 85) {
        const options = [
            '뜻밖의 수입이 있을 수 있습니다.',
            '투자에 좋은 기회가 보입니다.',
            '금전적 협상에서 유리한 위치에 있습니다.'
        ];
        return options[seed % options.length];
    } else if (score >= 60) {
        const options = [
            '계획된 지출은 무방합니다.',
            '안정적인 재정 상태가 유지됩니다.',
            '작은 행운이 따를 수 있습니다.'
        ];
        return options[seed % options.length];
    } else {
        const options = [
            '충동구매를 자제하세요.',
            '예상치 못한 지출에 주의하세요.',
            '금전 거래는 신중하게 하세요.'
        ];
        return options[seed % options.length];
    }
}

function getMoneyAdvice(score, seed) {
    if (score >= 85) return '기회를 놓치지 마세요.';
    if (score >= 60) return '현재 상태를 유지하세요.';
    return '지출을 줄이고 저축에 집중하세요.';
}

function getWorkDescription(score, seed) {
    if (score >= 85) {
        const options = [
            '업무 능력이 인정받는 날입니다.',
            '중요한 프로젝트에서 성과를 낼 수 있습니다.',
            '상사나 동료와의 관계가 좋아집니다.'
        ];
        return options[seed % options.length];
    } else if (score >= 60) {
        const options = [
            '묵묵히 할 일을 하면 됩니다.',
            '팀워크가 중요한 하루입니다.',
            '학습에 집중하기 좋은 날입니다.'
        ];
        return options[seed % options.length];
    } else {
        const options = [
            '업무 실수에 주의하세요.',
            '동료와의 갈등을 피하세요.',
            '무리한 야근은 피하는 것이 좋습니다.'
        ];
        return options[seed % options.length];
    }
}

function getWorkAdvice(score, seed) {
    if (score >= 85) return '자신감을 가지고 임하세요.';
    if (score >= 60) return '꾸준함이 답입니다.';
    return '한 발 물러서서 상황을 살피세요.';
}

function getHealthDescription(minOhang, seed) {
    const warnings = {
        '목': '간, 눈의 피로에 주의하세요.',
        '화': '심장, 혈압 관리에 신경 쓰세요.',
        '토': '소화기 건강에 주의하세요.',
        '금': '호흡기, 피부 관리에 신경 쓰세요.',
        '수': '신장, 허리 건강에 주의하세요.'
    };
    return warnings[minOhang] || '전반적인 건강 관리에 신경 쓰세요.';
}

function getHealthAdvice(minOhang) {
    const advices = {
        '목': '녹색 채소를 섭취하고 눈 휴식을 취하세요.',
        '화': '가벼운 운동과 명상을 추천합니다.',
        '토': '규칙적인 식사와 소화가 잘 되는 음식을 드세요.',
        '금': '심호흡 운동을 하고 피부 보습에 신경 쓰세요.',
        '수': '충분한 수분 섭취와 허리 스트레칭을 하세요.'
    };
    return advices[minOhang] || '충분한 휴식을 취하세요.';
}

/**
 * 오늘의 행운 아이템 생성
 */
function getLuckyItems(saju, todayGanji, seed) {
    const colors = {
        '목': ['초록색', '연두색', '청록색'],
        '화': ['빨간색', '주황색', '보라색'],
        '토': ['노란색', '갈색', '베이지색'],
        '금': ['흰색', '은색', '금색'],
        '수': ['검정색', '파란색', '남색']
    };

    const numbers = {
        '목': [3, 8], '화': [2, 7], '토': [5, 10], '금': [4, 9], '수': [1, 6]
    };

    const directions = {
        '목': '동쪽', '화': '남쪽', '토': '중앙', '금': '서쪽', '수': '북쪽'
    };

    const foods = {
        '목': ['채소 샐러드', '녹즙', '브로콜리'],
        '화': ['매운 음식', '토마토', '고추'],
        '토': ['현미밥', '감자', '고구마'],
        '금': ['흰 쌀밥', '두부', '배'],
        '수': ['미역국', '해산물', '콩나물']
    };

    const myOhang = saju.ilganOhang;

    return {
        color: colors[myOhang][seed % colors[myOhang].length],
        number: numbers[myOhang][seed % numbers[myOhang].length],
        direction: directions[myOhang],
        food: foods[myOhang][seed % foods[myOhang].length]
    };
}

/**
 * 오늘의 조언 명언 생성
 */
function getDailyQuote(relation, seed) {
    const quotes = {
        positive: [
            { text: '천리길도 한 걸음부터', meaning: '큰 일도 작은 시작에서 비롯됩니다.' },
            { text: '우공이산(愚公移山)', meaning: '꾸준한 노력은 결국 산도 옮깁니다.' },
            { text: '호시우행(虎視牛行)', meaning: '호랑이처럼 살피고 소처럼 꾸준히 나아가세요.' },
            { text: '일취월장(日就月將)', meaning: '날로 달로 발전하고 있습니다.' }
        ],
        neutral: [
            { text: '화이부동(和而不同)', meaning: '조화를 이루되 자기 색깔을 잃지 마세요.' },
            { text: '중용지도(中庸之道)', meaning: '극단을 피하고 균형을 유지하세요.' },
            { text: '안분지족(安分知足)', meaning: '분수를 알고 만족할 줄 알아야 합니다.' },
            { text: '삼사일언(三思一言)', meaning: '세 번 생각하고 한 번 말하세요.' }
        ],
        negative: [
            { text: '지피지기(知彼知己)', meaning: '상대와 자신을 알면 위태롭지 않습니다.' },
            { text: '인내무적(忍耐無敵)', meaning: '참고 견디면 적이 없습니다.' },
            { text: '유비무환(有備無患)', meaning: '준비가 있으면 걱정이 없습니다.' },
            { text: '전화위복(轉禍爲福)', meaning: '화가 바뀌어 복이 됩니다.' }
        ]
    };

    let list;
    if (relation.score >= 80) list = quotes.positive;
    else if (relation.score >= 55) list = quotes.neutral;
    else list = quotes.negative;

    return list[seed % list.length];
}

/**
 * 메인 함수: 오늘의 운세 생성
 */
export function getDailyFortune(birthDate, birthTime = 'unknown', gender = 'male', date = new Date()) {
    const saju = calculateSaju(birthDate, birthTime);
    const todayGanji = getTodayGanji(date);
    const relation = analyzeRelation(saju.ilganOhang, todayGanji.ohang);

    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate() + saju.ilgan.charCodeAt(0);

    return {
        date: todayGanji.dateString,
        todayGanji,
        saju,
        relation,
        categories: generateDailyCategories(saju, todayGanji, relation),
        luckyItems: getLuckyItems(saju, todayGanji, seed),
        quote: getDailyQuote(relation, seed)
    };
}

export default { getDailyFortune, getTodayGanji };
