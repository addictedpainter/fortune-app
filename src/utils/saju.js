/**
 * 정통 사주명리학 계산 유틸리티
 * 천간, 지지, 오행, 사주팔자, 토정비결을 계산합니다.
 */

// 천간 (天干) - 10개
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const CHEONGAN_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 지지 (地支) - 12개
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const JIJI_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 띠 동물
const ZODIAC_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

// 오행 (五行)
const OHANG = {
    '갑': '목', '을': '목',
    '병': '화', '정': '화',
    '무': '토', '기': '토',
    '경': '금', '신': '금',
    '임': '수', '계': '수'
};

const OHANG_JIJI = {
    '인': '목', '묘': '목',
    '사': '화', '오': '화',
    '진': '토', '술': '토', '축': '토', '미': '토',
    '신': '금', '유': '금',
    '해': '수', '자': '수'
};

// 오행 상생상극
const OHANG_PROPERTIES = {
    '목': { element: '木', color: '청색', direction: '동쪽', season: '봄', organ: '간', emotion: '분노' },
    '화': { element: '火', color: '적색', direction: '남쪽', season: '여름', organ: '심장', emotion: '기쁨' },
    '토': { element: '土', color: '황색', direction: '중앙', season: '환절기', organ: '비장', emotion: '사려' },
    '금': { element: '金', color: '백색', direction: '서쪽', season: '가을', organ: '폐', emotion: '슬픔' },
    '수': { element: '水', color: '흑색', direction: '북쪽', season: '겨울', organ: '신장', emotion: '공포' }
};

// 시간대별 시주
const TIME_JIJI = {
    '00:00': '자', '02:00': '축', '04:00': '인', '06:00': '묘',
    '08:00': '진', '10:00': '사', '12:00': '오', '14:00': '미',
    '16:00': '신', '18:00': '유', '20:00': '술', '22:00': '해',
    'unknown': null
};

/**
 * 년주 계산 (기준: 입춘)
 */
function getYearGanji(year) {
    // 갑자년 기준 (1984년이 갑자년)
    const baseYear = 1984;
    const diff = year - baseYear;
    const ganIndex = ((diff % 10) + 10) % 10;
    const jiIndex = ((diff % 12) + 12) % 12;

    return {
        gan: CHEONGAN[ganIndex],
        ji: JIJI[jiIndex],
        ganHanja: CHEONGAN_HANJA[ganIndex],
        jiHanja: JIJI_HANJA[jiIndex],
        zodiac: ZODIAC_ANIMALS[jiIndex],
        fullName: `${CHEONGAN[ganIndex]}${JIJI[jiIndex]}년`,
        fullHanja: `${CHEONGAN_HANJA[ganIndex]}${JIJI_HANJA[jiIndex]}年`
    };
}

/**
 * 월주 계산
 */
function getMonthGanji(year, month) {
    // 년간에 따른 월간 시작점
    const yearGan = getYearGanji(year).gan;
    const yearGanIndex = CHEONGAN.indexOf(yearGan);

    // 월간 산출 공식
    const monthGanStart = (yearGanIndex % 5) * 2;
    const monthGanIndex = (monthGanStart + month - 1) % 10;

    // 월지는 인(寅)월이 1월
    const monthJiIndex = (month + 1) % 12;

    return {
        gan: CHEONGAN[monthGanIndex],
        ji: JIJI[monthJiIndex],
        fullName: `${CHEONGAN[monthGanIndex]}${JIJI[monthJiIndex]}월`
    };
}

/**
 * 일주 계산 (만세력 기반 간략화)
 */
function getDayGanji(year, month, day) {
    // 기준일: 1900년 1월 1일 = 갑진일
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));

    // 1900년 1월 1일은 갑진일 (간: 갑=0, 지: 진=4)
    const ganIndex = (diffDays % 10 + 10) % 10;
    const jiIndex = ((diffDays + 4) % 12 + 12) % 12;

    return {
        gan: CHEONGAN[ganIndex],
        ji: JIJI[jiIndex],
        fullName: `${CHEONGAN[ganIndex]}${JIJI[jiIndex]}일`
    };
}

/**
 * 시주 계산
 */
function getHourGanji(dayGan, birthTime) {
    if (!birthTime || birthTime === 'unknown') {
        return { gan: '?', ji: '?', fullName: '시간 미상' };
    }

    const hourJi = TIME_JIJI[birthTime];
    if (!hourJi) return { gan: '?', ji: '?', fullName: '시간 미상' };

    const hourJiIndex = JIJI.indexOf(hourJi);
    const dayGanIndex = CHEONGAN.indexOf(dayGan);

    // 시간 계산 공식
    const hourGanStart = (dayGanIndex % 5) * 2;
    const hourGanIndex = (hourGanStart + hourJiIndex) % 10;

    return {
        gan: CHEONGAN[hourGanIndex],
        ji: hourJi,
        fullName: `${CHEONGAN[hourGanIndex]}${hourJi}시`
    };
}

/**
 * 사주팔자 전체 계산
 */
export function calculateSaju(birthDate, birthTime = 'unknown') {
    const [year, month, day] = birthDate.split('-').map(Number);

    const yearGanji = getYearGanji(year);
    const monthGanji = getMonthGanji(year, month);
    const dayGanji = getDayGanji(year, month, day);
    const hourGanji = getHourGanji(dayGanji.gan, birthTime);

    // 일간(日干)이 본인의 핵심 기운
    const ilgan = dayGanji.gan;
    const ilganOhang = OHANG[ilgan];

    // 오행 분포 계산
    const ohangCount = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };

    [yearGanji.gan, monthGanji.gan, dayGanji.gan, hourGanji.gan].forEach(gan => {
        if (OHANG[gan]) ohangCount[OHANG[gan]]++;
    });
    [yearGanji.ji, monthGanji.ji, dayGanji.ji, hourGanji.ji].forEach(ji => {
        if (OHANG_JIJI[ji]) ohangCount[OHANG_JIJI[ji]]++;
    });

    // 가장 많은/적은 오행
    const ohangEntries = Object.entries(ohangCount);
    const maxOhang = ohangEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const minOhang = ohangEntries.reduce((a, b) => a[1] < b[1] ? a : b)[0];

    return {
        year: yearGanji,
        month: monthGanji,
        day: dayGanji,
        hour: hourGanji,
        ilgan,
        ilganOhang,
        ohangCount,
        maxOhang,
        minOhang,
        ohangProperties: OHANG_PROPERTIES[ilganOhang]
    };
}

/**
 * 2026년 세운(歲運) 분석
 */
export function analyze2026Fortune(saju, gender) {
    const { ilgan, ilganOhang, maxOhang, minOhang, year, ohangCount } = saju;

    // 2026년은 병오년 (丙午年) - 화(火) 기운이 강함
    const yearOhang = '화';
    const yearGanji = getYearGanji(2026);

    // 오행 상생상극 관계 분석
    const relations = {
        '목': { generates: '화', controlled: '금', controls: '토', generatedBy: '수' },
        '화': { generates: '토', controlled: '수', controls: '금', generatedBy: '목' },
        '토': { generates: '금', controlled: '목', controls: '수', generatedBy: '화' },
        '금': { generates: '수', controlled: '화', controls: '목', generatedBy: '토' },
        '수': { generates: '목', controlled: '토', controls: '화', generatedBy: '금' }
    };

    const myRelation = relations[ilganOhang];
    let fortuneLevel = 3; // 1-5 scale
    let fortuneType = '';

    // 세운과의 관계 분석
    if (yearOhang === ilganOhang) {
        fortuneType = '비견운(比肩運)';
        fortuneLevel = 3;
    } else if (myRelation.generates === yearOhang) {
        fortuneType = '식상운(食傷運)';
        fortuneLevel = 4;
    } else if (myRelation.generatedBy === yearOhang) {
        fortuneType = '인성운(印星運)';
        fortuneLevel = 5;
    } else if (myRelation.controls === yearOhang) {
        fortuneType = '재성운(財星運)';
        fortuneLevel = 4;
    } else if (myRelation.controlled === yearOhang) {
        fortuneType = '관성운(官星運)';
        fortuneLevel = 2;
    }

    // 성별에 따른 보정
    if (gender === 'female' && fortuneType === '관성운(官星運)') {
        fortuneLevel = 4; // 여성에게 관성은 남편운, 직장운
    }

    return {
        yearGanji,
        yearOhang,
        fortuneType,
        fortuneLevel,
        myRelation,
        analysis: generateDetailedAnalysis(saju, fortuneType, fortuneLevel, gender)
    };
}

/**
 * 상세 운세 분석 생성
 */
function generateDetailedAnalysis(saju, fortuneType, fortuneLevel, gender) {
    const { ilgan, ilganOhang, year, maxOhang, minOhang, ohangProperties } = saju;

    const analyses = {
        total: generateTotalFortune(saju, fortuneType, fortuneLevel, gender),
        wealth: generateWealthFortune(saju, fortuneType, fortuneLevel),
        health: generateHealthFortune(saju, fortuneType, gender),
        love: generateLoveFortune(saju, fortuneType, fortuneLevel, gender),
        career: generateCareerFortune(saju, fortuneType, fortuneLevel),
        monthly: generateMonthlyFortune(saju)
    };

    return analyses;
}

function generateTotalFortune(saju, fortuneType, fortuneLevel, gender) {
    const { ilgan, ilganOhang, year, ohangProperties } = saju;

    const levelDescriptions = {
        5: '대길(大吉)의 해입니다. 하늘이 돕고 귀인이 나타나는 운입니다.',
        4: '길(吉)한 해입니다. 노력한 만큼 좋은 결과가 따릅니다.',
        3: '평운(平運)의 해입니다. 안정을 추구하며 기반을 다지세요.',
        2: '소흉(小凶)의 해입니다. 조심하며 내실을 다지세요.',
        1: '흉(凶)한 해입니다. 큰 결정은 미루고 몸조심하세요.'
    };

    const ohangAdvice = {
        '목': '새로운 시작과 성장의 기운이 있습니다. 봄철에 좋은 일이 시작됩니다.',
        '화': '열정과 활력이 넘치는 해입니다. 여름에 특히 운이 상승합니다.',
        '토': '안정과 신뢰를 바탕으로 기반을 다지는 해입니다.',
        '금': '결실과 수확의 기운입니다. 가을에 성과가 나타납니다.',
        '수': '지혜와 통찰력이 빛나는 해입니다. 겨울에 좋은 기회가 옵니다.'
    };

    const ilganPersonality = {
        '갑': '큰 나무처럼 곧고 강직한 성품',
        '을': '덩굴처럼 유연하고 적응력 있는 성품',
        '병': '태양처럼 밝고 활발한 성품',
        '정': '촛불처럼 따뜻하고 섬세한 성품',
        '무': '큰 산처럼 믿음직하고 안정된 성품',
        '기': '논밭처럼 겸손하고 수용적인 성품',
        '경': '바위처럼 강하고 결단력 있는 성품',
        '신': '보석처럼 섬세하고 예리한 성품',
        '임': '큰 바다처럼 포용력 있고 지혜로운 성품',
        '계': '시냇물처럼 맑고 총명한 성품'
    };

    return {
        title: `${year.zodiac}띠 ${ilgan}일간의 2026년 병오년 총운`,
        summary: levelDescriptions[fortuneLevel],
        content: `
당신은 ${ilganPersonality[ilgan]}을 가지고 태어났습니다.

2026년 병오년(丙午年)은 ${fortuneType}에 해당하는 해로, ${levelDescriptions[fortuneLevel]}

${ohangAdvice[ilganOhang]}

【사주 분석】
▪ 일간(日干): ${ilgan} - ${ilganOhang}(${OHANG_PROPERTIES[ilganOhang].element})의 기운
▪ 년지(年支): ${year.ji}(${year.zodiac}띠)
▪ 2026년 기운: 병오(丙午) - 화(火)의 기운이 강함

【2026년 핵심 키워드】
${fortuneLevel >= 4 ? '도약, 성장, 결실' : fortuneLevel === 3 ? '안정, 준비, 기반' : '인내, 수양, 절제'}

【조언】
${fortuneLevel >= 4
                ? '적극적으로 기회를 잡으세요. 귀인의 도움이 따릅니다.'
                : fortuneLevel === 3
                    ? '무리하지 말고 꾸준히 나아가세요. 때를 기다리는 지혜가 필요합니다.'
                    : '조심하고 또 조심하세요. 큰 결정은 내년으로 미루는 것이 좋습니다.'}
`.trim()
    };
}

function generateWealthFortune(saju, fortuneType, fortuneLevel) {
    const { ilganOhang, maxOhang, minOhang } = saju;

    const wealthDirection = {
        '목': '동쪽',
        '화': '남쪽',
        '토': '중앙',
        '금': '서쪽',
        '수': '북쪽'
    };

    // 재물운 방향 (일간의 극하는 오행 방향)
    const relations = {
        '목': '토', '화': '금', '토': '수', '금': '목', '수': '화'
    };
    const wealthOhang = relations[ilganOhang];

    const monthlyWealth = [
        { month: '1-2월', luck: fortuneLevel >= 3 ? '평' : '하', desc: '지출 관리 필요' },
        { month: '3-4월', luck: fortuneLevel >= 4 ? '상' : '중', desc: '새로운 수입원 기대' },
        { month: '5-6월', luck: '상', desc: '투자 기회 포착' },
        { month: '7-8월', luck: fortuneLevel >= 4 ? '대길' : '상', desc: '큰 재물운' },
        { month: '9-10월', luck: '중', desc: '안정적 수입' },
        { month: '11-12월', luck: fortuneLevel >= 3 ? '상' : '중', desc: '연말 보너스 기대' }
    ];

    return {
        title: '2026년 재물운 & 사업운',
        summary: fortuneLevel >= 4
            ? '재물이 모이고 사업이 번창하는 해'
            : fortuneLevel === 3
                ? '현상 유지하며 기반을 다지는 해'
                : '지출을 줄이고 저축에 힘쓸 해',
        content: `
【재물운 분석】
당신의 일간 ${ilganOhang}(${OHANG_PROPERTIES[ilganOhang].element})을 기준으로 
재성(財星)은 ${wealthOhang}(${OHANG_PROPERTIES[wealthOhang].element})에 해당합니다.

2026년 화(火)의 기운이 강하므로, 
${ilganOhang === '금' ? '재물 손실에 주의하세요. 보수적인 투자가 필요합니다.' :
                ilganOhang === '목' ? '재물운이 상승합니다. 적극적인 투자가 유리합니다.' :
                    ilganOhang === '화' ? '경쟁이 치열합니다. 차별화 전략이 필요합니다.' :
                        ilganOhang === '토' ? '안정적인 수입이 기대됩니다. 부동산에 관심을 가지세요.' :
                            '기회를 잘 포착하세요. 예상치 못한 수입이 있을 수 있습니다.'}

【재물 방위】
▪ 길방(吉方): ${wealthDirection[wealthOhang]} 방향
▪ 이 방향에서 사업 기회나 거래처를 찾으면 유리합니다.

【월별 재물운】
${monthlyWealth.map(m => `▪ ${m.month}: ${m.luck} - ${m.desc}`).join('\n')}

【투자 조언】
${fortuneLevel >= 4
                ? '적극적인 투자가 가능한 시기입니다. 단, 7-8월이 가장 유리합니다.'
                : fortuneLevel === 3
                    ? '안정적인 상품 위주로 투자하세요. 고위험 상품은 피하세요.'
                    : '투자보다는 저축에 집중하세요. 원금 보장 상품이 좋습니다.'}
`.trim()
    };
}

function generateHealthFortune(saju, fortuneType, gender) {
    const { ilganOhang, minOhang, ohangProperties } = saju;

    // 부족한 오행에 따른 건강 주의점
    const healthWarnings = {
        '목': { organ: '간, 담', symptom: '눈 피로, 근육 경련, 분노 조절', advice: '녹색 채소 섭취, 산책' },
        '화': { organ: '심장, 소장', symptom: '불면증, 가슴 두근거림', advice: '붉은색 음식, 명상' },
        '토': { organ: '비장, 위장', symptom: '소화불량, 식욕부진', advice: '노란색 음식, 규칙적 식사' },
        '금': { organ: '폐, 대장', symptom: '피부 트러블, 호흡기 질환', advice: '흰색 음식, 심호흡 운동' },
        '수': { organ: '신장, 방광', symptom: '부종, 허리 통증, 탈모', advice: '검은색 음식, 충분한 수분' }
    };

    const weakOrgan = healthWarnings[minOhang];
    const strongOrgan = healthWarnings[ilganOhang];

    return {
        title: '2026년 건강운 & 가정운',
        summary: `${weakOrgan.organ} 관리에 특히 신경 쓰세요`,
        content: `
【오행 건강 분석】
당신의 사주에서 ${minOhang}(${OHANG_PROPERTIES[minOhang].element})의 기운이 부족합니다.

▪ 주의할 장기: ${weakOrgan.organ}
▪ 나타날 수 있는 증상: ${weakOrgan.symptom}
▪ 보완 방법: ${weakOrgan.advice}

【2026년 건강 주의 시기】
▪ 1-2월: 감기, 호흡기 주의
▪ 5-6월: 화(火) 기운 과다로 심장, 혈압 주의
▪ 7-8월: 더위에 의한 체력 저하 주의
▪ 11-12월: 관절, 신장 기능 점검 필요

【가정운】
${gender === 'female'
                ? '가정 내 화합운이 있습니다. 자녀에게 경사스러운 일이 있을 수 있습니다.'
                : '가장으로서의 책임감이 커지는 해입니다. 가족과의 대화 시간을 늘리세요.'}

【건강 수칙】
1. ${OHANG_PROPERTIES[minOhang].color} 계열 음식 자주 섭취
2. ${OHANG_PROPERTIES[minOhang].direction} 방향으로 여행이나 산책 권장
3. ${OHANG_PROPERTIES[minOhang].season}에 특히 건강 관리 철저히
`.trim()
    };
}

function generateLoveFortune(saju, fortuneType, fortuneLevel, gender) {
    const { ilgan, ilganOhang, year } = saju;

    const loveAdvice = gender === 'female' ? {
        '갑': '강한 남성보다 부드러운 남성이 인연',
        '을': '든든하게 지켜주는 남성과 궁합',
        '병': '차분한 남성과 보완적 관계',
        '정': '열정적인 만남이 기대됨',
        '무': '성실하고 믿음직한 인연 예상',
        '기': '자상하고 배려심 많은 남성이 좋음',
        '경': '유머러스하고 밝은 남성과 궁합',
        '신': '지적이고 세련된 남성에게 끌림',
        '임': '자유로운 영혼의 남성이 인연',
        '계': '감성적이고 로맨틱한 만남 예상'
    } : {
        '갑': '자신을 따르는 순한 여성이 인연',
        '을': '당당하고 독립적인 여성과 궁합',
        '병': '조용하고 내조형 여성이 좋음',
        '정': '활발하고 사교적인 여성에게 끌림',
        '무': '가정적이고 안정적인 여성이 인연',
        '기': '지적이고 현명한 여성과 궁합',
        '경': '부드럽고 여성스러운 타입이 좋음',
        '신': '예술적 감각이 있는 여성에게 끌림',
        '임': '따뜻하고 포용력 있는 여성이 인연',
        '계': '밝고 긍정적인 여성과 궁합'
    };

    return {
        title: '2026년 연애운 & 결혼운',
        summary: fortuneLevel >= 4
            ? '좋은 인연을 만날 가능성이 높은 해'
            : fortuneLevel === 3
                ? '기존 관계가 깊어지는 해'
                : '연애보다 자기 발전에 집중할 해',
        content: `
【연애 궁합 분석】
일간 ${ilgan}의 특성상, ${loveAdvice[ilgan]}

【2026년 연애운 흐름】
▪ 봄 (3-5월): ${fortuneLevel >= 4 ? '새로운 만남의 기회가 많습니다.' : '인연이 스쳐갈 수 있으니 적극적으로 다가가세요.'}
▪ 여름 (6-8월): 화(火)의 기운으로 열정적인 로맨스 예상
▪ 가을 (9-11월): ${fortuneLevel >= 3 ? '진지한 관계로 발전 가능' : '신중한 판단이 필요한 시기'}
▪ 겨울 (12월): 연말 분위기로 로맨틱한 만남 기대

【인연 방위】
▪ 좋은 인연이 올 방향: ${gender === 'female' ? '서쪽, 북서쪽' : '동쪽, 남동쪽'}
▪ 이 방향의 사람이나 이 방향에서의 만남에 주목하세요.

${gender === 'female' ? `
【결혼운】
2026년은 ${fortuneLevel >= 4 ? '결혼하기 좋은 해입니다. 좋은 신랑감을 만날 수 있습니다.' : '결혼보다는 연애에 집중하는 것이 좋습니다.'}
` : `
【결혼운】
2026년은 ${fortuneLevel >= 4 ? '결혼을 결심하기 좋은 해입니다. 가정을 이룰 준비가 되었습니다.' : '결혼은 조금 더 신중히 생각하세요.'}
`}
`.trim()
    };
}

function generateCareerFortune(saju, fortuneType, fortuneLevel) {
    const { ilgan, ilganOhang } = saju;

    const careerSuggestions = {
        '목': ['교육', '법조', '의료', '환경', '출판', '패션'],
        '화': ['IT', '마케팅', '엔터테인먼트', '스포츠', '광고', '요식업'],
        '토': ['부동산', '건설', '농업', '공무원', '금융', '유통'],
        '금': ['제조업', '금속', '기계', '법률', '군경', '금융'],
        '수': ['무역', '운송', '여행', '수산업', '미디어', '컨설팅']
    };

    return {
        title: '2026년 직장운 & 사업운',
        summary: fortuneLevel >= 4
            ? '승진, 이직에 유리한 해'
            : fortuneLevel === 3
                ? '현 직장에서 실력을 키울 해'
                : '변화보다 안정을 추구할 해',
        content: `
【직업 적성】
일간 ${ilgan}(${ilganOhang}) 기준 적합한 분야:
${careerSuggestions[ilganOhang].map(c => `▪ ${c}`).join('\n')}

【2026년 직장운】
${fortuneLevel >= 4
                ? '▪ 승진, 이직, 창업 모두 유리한 시기입니다.\n▪ 특히 상반기에 좋은 기회가 올 수 있습니다.\n▪ 새로운 프로젝트에 적극 참여하세요.'
                : fortuneLevel === 3
                    ? '▪ 현 위치에서 실력을 쌓는 것이 중요합니다.\n▪ 무리한 이직은 피하세요.\n▪ 자격증 취득이나 스킬업에 투자하세요.'
                    : '▪ 현 직장을 지키는 것이 우선입니다.\n▪ 인간관계에 특히 신경 쓰세요.\n▪ 상사와의 갈등을 피하세요.'}

【창업/사업운】
${fortuneLevel >= 4
                ? '창업하기 좋은 해입니다. 단, 여름 이후가 더 유리합니다.'
                : fortuneLevel === 3
                    ? '창업보다는 준비 기간으로 삼으세요. 사업 계획을 다듬으세요.'
                    : '창업은 내년 이후로 미루세요. 자금 준비에 집중하세요.'}

【월별 직장운】
▪ 1-3월: 연초 목표 설정기
▪ 4-6월: ${fortuneLevel >= 4 ? '성과를 낼 수 있는 시기' : '인내가 필요한 시기'}
▪ 7-9월: ${fortuneLevel >= 3 ? '기회 포착기' : '조심해야 할 시기'}
▪ 10-12월: ${fortuneLevel >= 4 ? '수확의 시기' : '내년을 준비하는 시기'}
`.trim()
    };
}

function generateMonthlyFortune(saju) {
    const { ilganOhang, year, ilgan } = saju;

    // 각 월의 운세 (간략화)
    const months = [
        { month: 1, name: '1월', ji: '축', ohang: '토' },
        { month: 2, name: '2월', ji: '인', ohang: '목' },
        { month: 3, name: '3월', ji: '묘', ohang: '목' },
        { month: 4, name: '4월', ji: '진', ohang: '토' },
        { month: 5, name: '5월', ji: '사', ohang: '화' },
        { month: 6, name: '6월', ji: '오', ohang: '화' },
        { month: 7, name: '7월', ji: '미', ohang: '토' },
        { month: 8, name: '8월', ji: '신', ohang: '금' },
        { month: 9, name: '9월', ji: '유', ohang: '금' },
        { month: 10, name: '10월', ji: '술', ohang: '토' },
        { month: 11, name: '11월', ji: '해', ohang: '수' },
        { month: 12, name: '12월', ji: '자', ohang: '수' }
    ];

    const relations = {
        '목': { generates: '화', controlled: '금', controls: '토', generatedBy: '수' },
        '화': { generates: '토', controlled: '수', controls: '금', generatedBy: '목' },
        '토': { generates: '금', controlled: '목', controls: '수', generatedBy: '화' },
        '금': { generates: '수', controlled: '화', controls: '목', generatedBy: '토' },
        '수': { generates: '목', controlled: '토', controls: '화', generatedBy: '금' }
    };

    const myRel = relations[ilganOhang];

    return months.map(m => {
        let luck = '중';
        let description = '';

        if (m.ohang === ilganOhang) {
            luck = '상'; description = '자신감이 넘치는 달';
        } else if (m.ohang === myRel.generatedBy) {
            luck = '대길'; description = '귀인의 도움이 있는 달';
        } else if (m.ohang === myRel.generates) {
            luck = '상'; description = '노력이 결실을 맺는 달';
        } else if (m.ohang === myRel.controls) {
            luck = '길'; description = '재물운이 좋은 달';
        } else if (m.ohang === myRel.controlled) {
            luck = '주의'; description = '신중함이 필요한 달';
        }

        return {
            month: m.name,
            luck,
            description,
            advice: luck === '대길' || luck === '상'
                ? '적극적으로 행동하세요'
                : luck === '주의'
                    ? '큰 결정은 피하세요'
                    : '평소대로 꾸준히 하세요'
        };
    });
}

export default {
    calculateSaju,
    analyze2026Fortune
};
