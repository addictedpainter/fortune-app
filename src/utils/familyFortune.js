import { calculateSaju } from './saju'
import { getTodayGanji } from './dailyFortune'

// 부모-자녀 관계 분석
export function analyzeParentChildRelation(parentSaju, childSaju) {
    const parentOhang = parentSaju.ilganOhang
    const childOhang = childSaju.ilganOhang

    const relations = {
        '목': { generates: '화', controlled: '금', controls: '토', generatedBy: '수' },
        '화': { generates: '토', controlled: '수', controls: '금', generatedBy: '목' },
        '토': { generates: '금', controlled: '목', controls: '수', generatedBy: '화' },
        '금': { generates: '수', controlled: '화', controls: '목', generatedBy: '토' },
        '수': { generates: '목', controlled: '토', controls: '화', generatedBy: '금' }
    }

    const parentRel = relations[parentOhang]
    let relationType = 'neutral'
    let relationName = '평화로운 관계'
    let description = ''
    let advice = ''
    let score = 70

    if (parentRel.generates === childOhang) {
        relationType = 'nurturing'
        relationName = '상생(相生)의 관계'
        description = `${parentOhang}(木)의 기운이 ${childOhang}을 자연스럽게 북돋아주는 형국입니다. 부모님의 기운이 자녀에게 긍정적인 영향을 주어, 자녀가 성장하는 데 큰 힘이 되어주십니다.`
        advice = '자녀의 결정을 믿고 지켜봐 주시면 좋은 결과가 있을 것입니다.'
        score = 90
    } else if (parentRel.generatedBy === childOhang) {
        relationType = 'supporting'
        relationName = '역생(逆生)의 관계'
        description = `자녀의 ${childOhang} 기운이 부모님의 ${parentOhang} 기운을 도와주는 형국입니다. 자녀가 부모님께 기쁨과 활력을 드리는 관계이며, 서로에게 힘이 되어줍니다.`
        advice = '자녀와 함께하는 시간이 부모님께도 활력이 될 것입니다.'
        score = 85
    } else if (parentRel.controls === childOhang) {
        relationType = 'guiding'
        relationName = '상극(相克)의 관계'
        description = `${parentOhang}의 기운이 ${childOhang}을 제어하는 형국입니다. 이는 부모님이 자녀를 올바른 길로 이끌 수 있는 관계이나, 때로는 갈등이 생길 수 있습니다.`
        advice = '자녀의 의견을 충분히 들어주신 후 조언해 주시면 좋겠습니다.'
        score = 65
    } else if (parentRel.controlled === childOhang) {
        relationType = 'challenging'
        relationName = '역극(逆克)의 관계'
        description = `자녀의 ${childOhang} 기운이 부모님의 ${parentOhang} 기운과 충돌할 수 있는 형국입니다. 서로 다른 성향으로 인해 이해가 필요한 관계입니다.`
        advice = '서로의 다름을 인정하고, 대화를 통해 마음을 나누시는 것이 중요합니다.'
        score = 60
    } else {
        relationType = 'harmonious'
        relationName = '비화(比和)의 관계'
        description = `같은 ${parentOhang}의 기운을 공유하는 형국입니다. 서로를 잘 이해하며, 뜻이 통하는 관계입니다.`
        advice = '같은 관심사를 나누며 함께하는 시간을 늘려보시기 바랍니다.'
        score = 80
    }

    return {
        relationType,
        relationName,
        description,
        advice,
        score,
        parentOhang,
        childOhang
    }
}

// 부모 기운이 반영된 자녀 일일 운세
export function getChildFortuneWithParent(parentSaju, childSaju) {
    const today = getTodayGanji()
    const relation = analyzeParentChildRelation(parentSaju, childSaju)

    // 기본 운세 점수 계산
    const childRel = {
        '목': { generates: '화', controlled: '금', controls: '토', generatedBy: '수' },
        '화': { generates: '토', controlled: '수', controls: '금', generatedBy: '목' },
        '토': { generates: '금', controlled: '목', controls: '수', generatedBy: '화' },
        '금': { generates: '수', controlled: '화', controls: '목', generatedBy: '토' },
        '수': { generates: '목', controlled: '토', controls: '화', generatedBy: '금' }
    }[childSaju.ilganOhang]

    // 오늘의 기본 점수
    let todayScoreBase = 70
    if (today.ohang === childRel.generatedBy) todayScoreBase = 90
    else if (today.ohang === childRel.generates) todayScoreBase = 80
    else if (today.ohang === childSaju.ilganOhang) todayScoreBase = 75
    else if (today.ohang === childRel.controlled) todayScoreBase = 55

    // 부모 영향 반영 (최대 ±10점)
    const parentInfluence = (relation.score - 70) / 3
    const finalScore = Math.min(100, Math.max(0, Math.round(todayScoreBase + parentInfluence)))

    // 카테고리별 점수
    const categories = {
        학업운: Math.min(100, Math.max(30, finalScore + Math.floor(Math.random() * 20) - 10)),
        건강운: Math.min(100, Math.max(30, finalScore + Math.floor(Math.random() * 15) - 7)),
        대인관계: Math.min(100, Math.max(30, finalScore + Math.floor(Math.random() * 20) - 10)),
        행운운: Math.min(100, Math.max(30, finalScore + Math.floor(Math.random() * 25) - 12))
    }

    // 운세 메시지 생성
    const messages = getFortuneMessages(finalScore, relation.relationType, childSaju)

    // 행운 아이템
    const luckyItems = getLuckyItems(childSaju, today)

    return {
        date: today.fullName,
        todayGanji: today,
        overallScore: finalScore,
        categories,
        relation,
        messages,
        luckyItems
    }
}

// 운세 메시지 (점잖고 따뜻한 톤)
function getFortuneMessages(score, relationType, saju) {
    const mainMessages = {
        excellent: [
            "오늘은 부모님의 따스한 기운이 자녀에게 고스란히 전해지는 형국입니다. 하고자 하는 일에 순풍이 불 것이니, 자신감을 갖고 나아가시길 바랍니다.",
            "부모님과 자녀 사이에 좋은 기운이 흐르는 날입니다. 가족 간의 대화가 자녀에게 큰 힘이 되어줄 것입니다.",
            "오늘 자녀에게 흐르는 기운이 매우 맑고 밝습니다. 새로운 시도를 하기에 좋은 날이니, 격려의 말씀을 건네주시면 좋겠습니다."
        ],
        good: [
            "오늘은 평온하고 안정적인 기운이 흐르는 형국입니다. 무리하지 않는 선에서 꾸준히 나아가면 좋은 결실을 맺을 것입니다.",
            "부모님의 격려가 자녀에게 특히 힘이 되는 날입니다. 작은 칭찬 한마디가 큰 용기가 되어줄 것입니다.",
            "자녀에게 잔잔한 행운이 찾아오는 날입니다. 평소 하던 일을 성실히 해나가면 좋은 결과가 있을 것입니다."
        ],
        neutral: [
            "오늘은 큰 변화보다는 안정을 추구하는 것이 좋겠습니다. 무리한 결정은 피하고, 차분히 하루를 보내시길 권합니다.",
            "평범한 듯하지만 내실을 다지기 좋은 날입니다. 급하게 서두르기보다 한 걸음씩 나아가는 것이 현명하겠습니다.",
            "마음을 편히 갖고 순리대로 흘러가는 것이 좋겠습니다. 가족과 함께하는 시간이 마음의 안정을 줄 것입니다."
        ],
        caution: [
            "오늘은 다소 조심해야 할 기운이 흐르는 형국입니다. 중요한 결정은 하루 미루시고, 충분히 생각한 후 행동하시길 권합니다.",
            "자녀가 힘들어할 수 있는 날이니, 따뜻한 말씀으로 감싸주시면 좋겠습니다. 부모님의 위로가 큰 힘이 될 것입니다.",
            "잠시 쉬어가는 것도 현명한 선택입니다. 무리하지 말고 내일을 기약하시는 것이 좋겠습니다."
        ]
    }

    let level = 'neutral'
    if (score >= 85) level = 'excellent'
    else if (score >= 70) level = 'good'
    else if (score < 60) level = 'caution'

    const messages = mainMessages[level]
    const mainMessage = messages[Math.floor(Math.random() * messages.length)]

    // 관계 유형에 따른 추가 조언
    const relationAdvice = {
        nurturing: "부모님의 지지가 자녀에게 특히 큰 힘이 되는 관계이니, 응원의 말씀을 아끼지 마시길 바랍니다.",
        supporting: "자녀가 부모님께 기쁨을 드리고 싶어하는 마음이 있으니, 자녀의 작은 노력도 알아봐 주시면 좋겠습니다.",
        guiding: "때로는 한 발 물러서서 지켜봐 주시는 것도 좋은 방법입니다. 자녀 스스로 깨달을 시간을 주시기 바랍니다.",
        challenging: "서로의 마음을 이해하려는 노력이 필요한 날입니다. 대화를 통해 마음을 나누시면 좋겠습니다.",
        harmonious: "마음이 잘 통하는 사이이니, 함께하는 시간을 통해 더 깊은 유대를 쌓아가시기 바랍니다."
    }

    return {
        main: mainMessage,
        relationAdvice: relationAdvice[relationType] || relationAdvice.harmonious
    }
}

// 행운 아이템
function getLuckyItems(saju, today) {
    const colors = {
        '목': ['초록색', '청색', '연두색'],
        '화': ['빨간색', '주황색', '분홍색'],
        '토': ['노란색', '황금색', '갈색'],
        '금': ['흰색', '은색', '회색'],
        '수': ['검정색', '남색', '보라색']
    }

    const directions = {
        '목': '동쪽',
        '화': '남쪽',
        '토': '중앙',
        '금': '서쪽',
        '수': '북쪽'
    }

    const numbers = {
        '목': [3, 8],
        '화': [2, 7],
        '토': [5, 10],
        '금': [4, 9],
        '수': [1, 6]
    }

    const beneficialOhang = {
        '목': '수',
        '화': '목',
        '토': '화',
        '금': '토',
        '수': '금'
    }[saju.ilganOhang]

    const colorOptions = colors[beneficialOhang] || colors['토']
    const numberOptions = numbers[beneficialOhang] || numbers['토']

    return {
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        direction: directions[beneficialOhang] || '동쪽',
        number: numberOptions[Math.floor(Math.random() * numberOptions.length)]
    }
}

export function calculateFamilyFortune(parentBirthDate, parentBirthTime, childBirthDate, childBirthTime) {
    const parentSaju = calculateSaju(parentBirthDate, parentBirthTime)
    const childSaju = calculateSaju(childBirthDate, childBirthTime)

    const fortune = getChildFortuneWithParent(parentSaju, childSaju)

    return {
        parent: {
            saju: parentSaju
        },
        child: {
            saju: childSaju
        },
        fortune
    }
}
