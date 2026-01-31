import { calculateSaju } from './saju'
import { getTodayGanji } from './dailyFortune'

// 부모-자녀 관계 분석 (개선: 입력값에 따라 다양한 점수 생성)
export function analyzeParentChildRelation(parentSaju, childSaju, parentBirthDate, childBirthDate) {
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
    let detailedAnalysis = ''
    let baseScore = 70

    // 생년월일 기반 변동성 추가 (일관성 있는 난수 생성)
    const [childYear, childMonth, childDay] = childBirthDate.split('-').map(Number)
    const [parentYear, parentMonth, parentDay] = parentBirthDate.split('-').map(Number)

    const childBirthSum = (childYear % 100) + childMonth + childDay
    const parentBirthSum = (parentYear % 100) + parentMonth + parentDay
    const combinedSeed = childBirthSum + parentBirthSum

    // 시드 기반 변동 (-5 ~ +5)
    const variation = (combinedSeed % 11) - 5

    // 오늘 날짜 기반 일일 변동
    const today = new Date()
    const dailyVariation = ((today.getDate() + today.getMonth()) % 7) - 3

    if (parentRel.generates === childOhang) {
        relationType = 'nurturing'
        relationName = '상생(相生)의 관계'
        description = `${parentOhang}(木)의 기운이 ${childOhang}을 자연스럽게 북돋아주는 형국입니다.`
        detailedAnalysis = `부모님의 ${parentOhang} 기운은 자녀의 ${childOhang} 기운에게 마치 봄비가 새싹을 틔우듯 자연스러운 생명력을 불어넣어 줍니다. 이는 천지자연의 이치에 따른 가장 조화로운 관계 중 하나로, 부모님이 특별히 노력하지 않아도 자녀에게 긍정적인 영향을 주게 됩니다. 자녀는 부모님 곁에 있는 것만으로도 마음의 안정을 얻고, 새로운 도전에 대한 용기를 얻습니다.`
        advice = '자녀의 결정을 믿고 지켜봐 주시면 좋은 결과가 있을 것입니다.'
        baseScore = 88 + variation + dailyVariation
    } else if (parentRel.generatedBy === childOhang) {
        relationType = 'supporting'
        relationName = '역생(逆生)의 관계'
        description = `자녀의 ${childOhang} 기운이 부모님의 ${parentOhang} 기운을 도와주는 형국입니다.`
        detailedAnalysis = `흥미롭게도 자녀의 ${childOhang} 기운이 오히려 부모님의 ${parentOhang} 기운에 활력을 불어넣어 주는 관계입니다. 이는 '효도'의 기운이 사주에 이미 새겨져 있는 것과 같으며, 자녀는 성장하면서 자연스럽게 부모님께 기쁨과 위안을 드리게 됩니다. 부모님께서는 자녀와 함께할 때 마음이 편안해지고 건강도 좋아지는 것을 느끼실 것입니다.`
        advice = '자녀와 함께하는 시간이 부모님께도 활력이 될 것입니다.'
        baseScore = 83 + variation + dailyVariation
    } else if (parentRel.controls === childOhang) {
        relationType = 'guiding'
        relationName = '상극(相克) - 지도의 관계'
        description = `${parentOhang}의 기운이 ${childOhang}을 제어하는 형국입니다.`
        detailedAnalysis = `부모님의 ${parentOhang} 기운은 자녀의 ${childOhang} 기운을 다스리고 이끄는 힘을 가지고 있습니다. 이는 '엄한 스승과 제자'의 관계와 비슷하여, 자녀에게 규율과 방향을 제시해줄 수 있는 관계입니다. 다만 지나친 통제는 자녀의 기운을 위축시킬 수 있으니, 부드러운 지도가 필요합니다. 적절한 거리감을 유지할 때 오히려 자녀가 더 크게 성장할 수 있습니다.`
        advice = '자녀의 의견을 충분히 들어주신 후 조언해 주시면 좋겠습니다.'
        baseScore = 65 + variation + dailyVariation
    } else if (parentRel.controlled === childOhang) {
        relationType = 'challenging'
        relationName = '역극(逆克) - 도전의 관계'
        description = `자녀의 ${childOhang} 기운이 부모님의 ${parentOhang} 기운과 충돌할 수 있습니다.`
        detailedAnalysis = `자녀의 ${childOhang} 기운은 부모님의 ${parentOhang} 기운과 본질적으로 다른 방향성을 가지고 있습니다. 이는 마치 '두 개의 독립적인 강물'과 같아서, 각자가 자신만의 길을 가고자 하는 경향이 있습니다. 하지만 이러한 관계는 오히려 서로에게 새로운 시각을 열어주고, 다양성을 존중하는 법을 배우게 해줍니다. 갈등처럼 보이는 것이 사실은 성장의 기회가 될 수 있습니다.`
        advice = '서로의 다름을 인정하고, 대화를 통해 마음을 나누시는 것이 중요합니다.'
        baseScore = 58 + variation + dailyVariation
    } else {
        relationType = 'harmonious'
        relationName = '비화(比和)의 관계'
        description = `같은 ${parentOhang}의 기운을 공유하는 형국입니다.`
        detailedAnalysis = `부모님과 자녀가 같은 ${parentOhang}의 기운을 나누고 있습니다. 이는 '물과 물이 만나 큰 강을 이루는' 것처럼 서로의 기운이 자연스럽게 공명하는 관계입니다. 말하지 않아도 서로의 마음을 알고, 비슷한 가치관과 취향을 공유하게 됩니다. 특별히 노력하지 않아도 마음이 통하는 관계이니, 이 천생의 인연에 감사하시기 바랍니다.`
        advice = '같은 관심사를 나누며 함께하는 시간을 늘려보시기 바랍니다.'
        baseScore = 78 + variation + dailyVariation
    }

    // 점수 범위 제한 (50-98)
    const score = Math.min(98, Math.max(50, baseScore))

    return {
        relationType,
        relationName,
        description,
        advice,
        detailedAnalysis,
        score,
        parentOhang,
        childOhang
    }
}

// 일간별 상세 성격 분석
const ILGAN_DETAILED = {
    '갑': {
        name: '갑목(甲木)',
        symbol: '큰 소나무',
        nature: '양(陽)',
        characteristics: ['정직함', '리더십', '독립심', '정의감'],
        strengths: '곧고 강직한 성품으로 주변 사람들에게 신뢰를 줍니다. 어떤 어려움에도 굴하지 않는 의지력이 있으며, 목표를 향해 꾸준히 나아가는 끈기가 있습니다.',
        weaknesses: '때로는 너무 강직하여 융통성이 부족할 수 있습니다. 타인의 의견을 받아들이는 유연함을 기르면 더욱 빛날 것입니다.',
        advice: '오늘은 새로운 시작을 하기에 좋은 날입니다. 머뭇거리지 말고 첫 발을 내딛어 보세요.'
    },
    '을': {
        name: '을목(乙木)',
        symbol: '푸른 덩굴',
        nature: '음(陰)',
        characteristics: ['유연함', '적응력', '섬세함', '예술성'],
        strengths: '어떤 환경에서도 적응하는 놀라운 유연성을 가지고 있습니다. 섬세한 감각으로 다른 사람들이 놓치는 것을 발견하며, 예술적 재능이 뛰어납니다.',
        weaknesses: '너무 유연하다 보면 자기 주관이 흔들릴 수 있습니다. 때로는 단호하게 자신의 의견을 표현하는 것도 필요합니다.',
        advice: '오늘은 창의적인 아이디어가 떠오르는 날입니다. 영감을 기록해 두세요.'
    },
    '병': {
        name: '병화(丙火)',
        symbol: '빛나는 태양',
        nature: '양(陽)',
        characteristics: ['밝음', '열정', '카리스마', '낙관'],
        strengths: '태양처럼 밝고 따스한 에너지로 주변을 환하게 밝힙니다. 타고난 리더십과 카리스마로 사람들을 이끄는 능력이 있습니다.',
        weaknesses: '너무 뜨거운 열정이 때로는 타인을 지치게 할 수 있습니다. 상대방의 페이스에 맞추는 배려가 필요합니다.',
        advice: '오늘은 당신의 밝은 에너지가 주변에 좋은 영향을 줄 것입니다. 웃음을 나누세요.'
    },
    '정': {
        name: '정화(丁火)',
        symbol: '촛불',
        nature: '음(陰)',
        characteristics: ['따스함', '섬세함', '직관력', '배려'],
        strengths: '은은하게 주변을 밝히는 촛불처럼 따뜻한 마음을 가졌습니다. 뛰어난 직관력으로 상황을 파악하고, 깊은 배려심이 있습니다.',
        weaknesses: '감정 기복이 있을 수 있으며, 너무 많은 것을 혼자 감당하려 할 수 있습니다. 때로는 도움을 청해도 괜찮습니다.',
        advice: '오늘은 내면의 목소리에 귀 기울여 보세요. 직관이 정답을 알려줄 것입니다.'
    },
    '무': {
        name: '무토(戊土)',
        symbol: '큰 산',
        nature: '양(陽)',
        characteristics: ['안정감', '포용력', '신뢰', '중후함'],
        strengths: '산처럼 묵직하고 안정적인 존재감이 있습니다. 넓은 포용력으로 많은 사람들에게 의지가 되며, 한결같은 신뢰를 줍니다.',
        weaknesses: '변화에 다소 느릴 수 있으며, 고집이 있을 수 있습니다. 새로운 것을 받아들이는 열린 마음이 필요합니다.',
        advice: '오늘은 당신의 안정적인 모습이 누군가에게 큰 위안이 될 것입니다.'
    },
    '기': {
        name: '기토(己土)',
        symbol: '비옥한 논밭',
        nature: '음(陰)',
        characteristics: ['겸손', '수용성', '실용성', '꾸준함'],
        strengths: '비옥한 땅처럼 무엇이든 받아들이고 키워내는 능력이 있습니다. 겸손하고 꾸준한 노력으로 결실을 맺습니다.',
        weaknesses: '때로는 자신을 너무 낮추거나, 결정을 미루는 경향이 있습니다. 자신감을 가지고 적극적으로 표현해 보세요.',
        advice: '오늘 뿌린 씨앗이 나중에 큰 열매가 될 것입니다. 작은 것부터 시작하세요.'
    },
    '경': {
        name: '경금(庚金)',
        symbol: '쇠',
        nature: '양(陽)',
        characteristics: ['결단력', '의지력', '정의', '실행력'],
        strengths: '쇠처럼 강한 의지와 결단력을 가지고 있습니다. 한번 결심하면 반드시 해내는 실행력이 있으며, 정의로운 성품입니다.',
        weaknesses: '너무 날카로워 상대방에게 상처를 줄 수 있습니다. 부드러움도 진정한 강함임을 기억하세요.',
        advice: '오늘은 결단이 필요한 일이 있다면 과감하게 결정하세요. 후회 없을 것입니다.'
    },
    '신': {
        name: '신금(辛金)',
        symbol: '보석',
        nature: '음(陰)',
        characteristics: ['섬세함', '예리함', '완벽주의', '심미안'],
        strengths: '보석처럼 정교하고 아름다운 것을 추구합니다. 예리한 분석력과 뛰어난 심미안으로 완벽을 추구합니다.',
        weaknesses: '완벽주의가 지나치면 스스로를 지치게 할 수 있습니다. 때로는 "충분히 좋다"는 것을 인정해 주세요.',
        advice: '오늘은 세심한 관찰이 행운을 가져다 줄 것입니다. 디테일에 주목하세요.'
    },
    '임': {
        name: '임수(壬水)',
        symbol: '큰 바다',
        nature: '양(陽)',
        characteristics: ['포용력', '지혜', '야심', '통찰력'],
        strengths: '바다처럼 넓은 포용력과 깊은 지혜를 가지고 있습니다. 큰 그림을 보는 통찰력이 있으며, 원대한 꿈을 품습니다.',
        weaknesses: '너무 큰 것만 바라보다 작은 행복을 놓칠 수 있습니다. 현재의 소중함도 느껴보세요.',
        advice: '오늘은 넓은 시각으로 상황을 바라보면 새로운 해결책이 보일 것입니다.'
    },
    '계': {
        name: '계수(癸水)',
        symbol: '시냇물',
        nature: '음(陰)',
        characteristics: ['총명함', '감수성', '적응력', '순수함'],
        strengths: '시냇물처럼 맑고 총명합니다. 풍부한 감수성과 뛰어난 적응력으로 어떤 환경에서도 자신의 길을 찾아갑니다.',
        weaknesses: '감정에 너무 휘둘리거나, 방향을 잃기 쉽습니다. 중심을 잡아줄 목표를 설정해 보세요.',
        advice: '오늘은 감정의 흐름을 따라가 보세요. 직감이 좋은 기회를 알려줄 것입니다.'
    }
}

// 육각형 그래프 데이터 생성
export function generateHexagonData(saju, todayGanji, relation) {
    const baseScore = relation.score
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

    // 오행 상성에 따른 기본 점수 조정
    const ohangBonus = {
        '목': { 학업운: 15, 건강운: 5, 재물운: -5, 대인운: 10, 애정운: 5, 직장운: 0 },
        '화': { 학업운: 5, 건강운: -5, 재물운: 10, 대인운: 15, 애정운: 10, 직장운: 5 },
        '토': { 학업운: 0, 건강운: 10, 재물운: 15, 대인운: 5, 애정운: 0, 직장운: 10 },
        '금': { 학업운: 10, 건강운: 5, 재물운: 10, 대인운: -5, 애정운: -5, 직장운: 15 },
        '수': { 학업운: 15, 건강운: 0, 재물운: 5, 대인운: 5, 애정운: 15, 직장운: -5 }
    }

    const bonus = ohangBonus[saju.ilganOhang] || ohangBonus['토']

    return {
        학업운: Math.min(100, Math.max(30, baseScore + bonus.학업운 + random(-10, 10))),
        건강운: Math.min(100, Math.max(30, baseScore + bonus.건강운 + random(-10, 10))),
        재물운: Math.min(100, Math.max(30, baseScore + bonus.재물운 + random(-10, 10))),
        대인운: Math.min(100, Math.max(30, baseScore + bonus.대인운 + random(-10, 10))),
        애정운: Math.min(100, Math.max(30, baseScore + bonus.애정운 + random(-10, 10))),
        직장운: Math.min(100, Math.max(30, baseScore + bonus.직장운 + random(-10, 10)))
    }
}

// 상세 카테고리별 운세 메시지
const CATEGORY_MESSAGES = {
    학업운: {
        high: [
            "집중력이 극대화되는 시기입니다. 새로운 지식을 습득하기에 이보다 좋은 날은 없습니다. 평소 어렵게 느꼈던 내용도 오늘은 술술 이해가 될 것입니다.",
            "지적 호기심이 왕성해지는 날입니다. 관심 있던 분야의 책을 읽거나 강의를 듣기에 최적의 시간입니다.",
            "시험이나 중요한 발표가 있다면 좋은 결과를 기대해도 좋습니다. 그동안의 노력이 빛을 발할 것입니다."
        ],
        medium: [
            "꾸준히 노력하면 성과가 있을 것입니다. 급하게 결과를 바라기보다 과정에 충실하세요.",
            "복습에 좋은 날입니다. 새로운 것보다는 이미 배운 것을 다시 정리하면 효과가 클 것입니다.",
            "학습에 있어 동료나 스터디 그룹의 도움이 유용할 수 있습니다."
        ],
        low: [
            "오늘은 무리하게 공부하기보다 가벼운 복습 정도가 적당합니다. 충분한 휴식도 학습의 일부입니다.",
            "집중이 잘 안 된다면 환경을 바꿔보세요. 분위기 전환이 도움이 될 수 있습니다.",
            "중요한 시험이나 과제는 가급적 내일로 미루는 것이 좋겠습니다."
        ]
    },
    건강운: {
        high: [
            "활력이 넘치는 날입니다. 운동이나 야외 활동을 즐기기에 좋은 컨디션입니다.",
            "몸과 마음이 균형을 이루는 시기입니다. 새로운 건강 습관을 시작하기에 좋습니다.",
            "면역력이 좋은 상태입니다. 이 좋은 컨디션을 유지하도록 규칙적인 생활을 하세요."
        ],
        medium: [
            "전반적으로 양호하나 무리는 금물입니다. 적절한 휴식과 활동의 균형을 유지하세요.",
            "수분 섭취와 균형 잡힌 식사에 신경 쓰는 것이 좋겠습니다.",
            "가벼운 스트레칭이나 산책 정도의 운동이 컨디션 유지에 도움이 됩니다."
        ],
        low: [
            "오늘은 몸을 아끼는 것이 좋겠습니다. 과로나 무리한 운동은 피하세요.",
            "충분한 수면과 휴식이 필요한 날입니다. 몸이 보내는 신호에 귀 기울여 주세요.",
            "면역력이 약해질 수 있으니 체온 관리와 위생에 특히 신경 쓰세요."
        ]
    },
    재물운: {
        high: [
            "금전적으로 좋은 소식이 있을 수 있습니다. 예상치 못한 수입이나 기회가 찾아올 수 있습니다.",
            "투자나 재테크에 관심을 가져볼 만한 날입니다. 다만 욕심은 금물입니다.",
            "협상이나 거래에서 유리한 결과를 얻을 수 있습니다. 적극적으로 나서보세요."
        ],
        medium: [
            "안정적인 재정 상태가 유지됩니다. 큰 지출은 가급적 다음으로 미루세요.",
            "소비보다는 저축에 집중하는 것이 좋은 날입니다.",
            "필요한 물건은 가격을 꼼꼼히 비교한 후 구매하세요."
        ],
        low: [
            "오늘은 큰 금액의 소비나 투자를 자제하는 것이 좋겠습니다.",
            "예상치 못한 지출이 있을 수 있으니 여유 자금을 확보해 두세요.",
            "금전 관련 결정은 신중하게, 가급적 조언을 구한 후에 하세요."
        ]
    },
    대인운: {
        high: [
            "사교성이 빛나는 날입니다. 새로운 만남이 좋은 인연으로 이어질 수 있습니다.",
            "주변 사람들과의 관계가 원만해지는 시기입니다. 오래된 친구에게 연락해 보세요.",
            "협력과 팀워크가 좋은 결과를 가져오는 날입니다. 함께하는 것이 힘이 됩니다."
        ],
        medium: [
            "무난한 대인관계가 유지됩니다. 갈등 없이 평화로운 하루가 될 것입니다.",
            "경청의 자세가 관계를 더욱 깊게 만들 수 있습니다.",
            "가족이나 가까운 사람과의 시간을 소중히 여기세요."
        ],
        low: [
            "오늘은 사람들과의 마찰이 생길 수 있습니다. 말과 행동에 신중을 기하세요.",
            "오해가 생길 수 있으니 중요한 대화는 명확하게 전달하려 노력하세요.",
            "혼자만의 시간을 갖는 것도 나쁘지 않습니다. 내면을 돌아보는 시간이 될 수 있습니다."
        ]
    },
    애정운: {
        high: [
            "사랑이 꽃피는 날입니다. 연인과 함께하는 시간이 더욱 달콤해질 것입니다.",
            "매력이 빛나는 날입니다. 새로운 만남에서 좋은 인상을 남길 수 있습니다.",
            "진심 어린 대화가 관계를 더욱 깊게 만들어 줄 것입니다."
        ],
        medium: [
            "안정적인 애정 관계가 유지됩니다. 작은 배려가 관계를 더욱 단단하게 합니다.",
            "상대방의 입장에서 생각해 보는 것이 도움이 됩니다.",
            "추억을 함께 되새기며 감사함을 표현해 보세요."
        ],
        low: [
            "감정적인 충돌이 있을 수 있으니 말을 아끼는 것이 좋겠습니다.",
            "오해가 생길 수 있는 날입니다. 진심을 명확히 전달하려 노력하세요.",
            "혼자만의 시간을 통해 감정을 정리하는 것이 도움이 됩니다."
        ]
    },
    직장운: {
        high: [
            "업무 능력이 빛나는 날입니다. 중요한 프로젝트나 발표가 있다면 좋은 결과를 기대하세요.",
            "상사나 동료들에게 인정받을 수 있는 기회가 있습니다. 적극적으로 나서보세요.",
            "새로운 도전이나 제안에 열린 마음으로 임하면 좋은 기회가 될 수 있습니다."
        ],
        medium: [
            "꾸준히 맡은 바를 수행하면 좋은 평가를 받을 것입니다.",
            "동료들과의 협력이 중요한 날입니다. 팀워크에 집중하세요.",
            "급한 일보다 차근차근 진행하는 것이 효과적입니다."
        ],
        low: [
            "실수가 있을 수 있으니 중요한 결정은 한 번 더 검토하세요.",
            "동료와의 갈등을 조심하세요. 불필요한 언쟁은 피하는 것이 좋습니다.",
            "오늘은 조용히 본인의 업무에 집중하는 것이 현명합니다."
        ]
    }
}

// 카테고리별 상세 메시지 가져오기
function getCategoryDetailMessage(category, score) {
    const messages = CATEGORY_MESSAGES[category]
    if (!messages) return ''

    const level = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low'
    const options = messages[level]
    return options[Math.floor(Math.random() * options.length)]
}

// 오늘의 특별 조언
const SPECIAL_ADVICES = [
    { time: '아침', advice: '하루를 시작하며 3분간 명상을 해보세요. 하루의 흐름이 달라질 것입니다.' },
    { time: '오전', advice: '오전 중에 가장 중요한 일을 처리하세요. 집중력이 좋은 시간대입니다.' },
    { time: '정오', advice: '점심 식사 후 가벼운 산책은 오후 업무 효율을 높여줍니다.' },
    { time: '오후', advice: '잠시 창밖을 바라보며 눈의 피로를 풀어주세요.' },
    { time: '저녁', advice: '하루를 마무리하며 감사한 일 세 가지를 떠올려 보세요.' }
]

// 부모 기운이 반영된 자녀 일일 운세 (확장 버전)
export function getChildFortuneWithParent(parentSaju, childSaju, parentBirthDate, childBirthDate) {
    const today = getTodayGanji()
    const relation = analyzeParentChildRelation(parentSaju, childSaju, parentBirthDate, childBirthDate)
    const childIlgan = ILGAN_DETAILED[childSaju.ilgan]
    const parentIlgan = ILGAN_DETAILED[parentSaju.ilgan]

    // 육각형 그래프 데이터
    const hexagonData = generateHexagonData(childSaju, today, relation)

    // 각 카테고리별 상세 메시지
    const categoryDetails = {}
    for (const [cat, score] of Object.entries(hexagonData)) {
        categoryDetails[cat] = {
            score,
            message: getCategoryDetailMessage(cat, score)
        }
    }

    // 오늘의 스토리
    const story = generateDailyStory(childSaju, parentSaju, today, relation)

    // 행운 아이템
    const luckyItems = getLuckyItems(childSaju, today)

    // 특별 조언
    const hour = new Date().getHours()
    let timeIndex = 0
    if (hour >= 6 && hour < 9) timeIndex = 0
    else if (hour >= 9 && hour < 12) timeIndex = 1
    else if (hour >= 12 && hour < 14) timeIndex = 2
    else if (hour >= 14 && hour < 18) timeIndex = 3
    else timeIndex = 4

    return {
        date: today.fullName,
        todayGanji: today,
        overallScore: relation.score,
        relation,
        childIlgan,
        parentIlgan,
        hexagonData,
        categoryDetails,
        story,
        luckyItems,
        specialAdvice: SPECIAL_ADVICES[timeIndex]
    }
}

// 일일 스토리 생성
function generateDailyStory(childSaju, parentSaju, today, relation) {
    const childOhang = childSaju.ilganOhang
    const todayOhang = today.ohang

    const ohangInteraction = {
        '목': { '수': '물을 만나 더욱 푸르른', '화': '불에 기운을 나누어주는', '토': '땅을 다스리는', '금': '시련을 견디는', '목': '서로 힘을 모으는' },
        '화': { '목': '나무를 태워 더욱 밝은', '토': '대지를 따뜻하게 하는', '금': '금속을 녹이는', '수': '균형을 찾아가는', '화': '열정이 넘치는' },
        '토': { '화': '불의 기운을 받아 풍요로운', '금': '보물을 품고 있는', '수': '물길을 다스리는', '목': '생명을 키우는', '토': '안정을 더하는' },
        '금': { '토': '땅의 기운으로 단련된', '수': '물에 더욱 빛나는', '목': '결단력을 발휘하는', '화': '변화를 겪는', '금': '의지를 굳건히 하는' },
        '수': { '금': '금에서 맑아지는', '목': '나무를 키우는', '화': '균형을 찾아가는', '토': '방향을 찾는', '수': '깊어지는' }
    }

    const interaction = ohangInteraction[childOhang]?.[todayOhang] || '오늘의 기운과 조화를 이루는'

    const intro = `오늘은 ${today.fullName}, ${todayOhang}의 기운이 흐르는 날입니다.`

    const body = `자녀분의 ${childOhang} 기운이 오늘의 ${todayOhang} 기운과 만나 ${interaction} 형국이 펼쳐집니다. `

    const parentEffect = relation.score >= 75
        ? `특히 부모님의 ${parentSaju.ilganOhang} 기운이 자녀에게 든든한 버팀목이 되어주어, 어떤 어려움도 함께 헤쳐나갈 수 있는 힘이 될 것입니다.`
        : relation.score >= 60
            ? `부모님의 ${parentSaju.ilganOhang} 기운과 자녀의 기운이 서로 조화를 이루며, 안정적인 하루를 보낼 수 있을 것입니다.`
            : `오늘은 부모님과 자녀 사이에 서로를 더 깊이 이해하는 기회가 될 수 있습니다. 열린 마음으로 대화를 나눠보시기 바랍니다.`

    const conclusion = `오늘 하루도 ${childSaju.ilgan}의 고유한 기운이 빛을 발할 수 있도록, 자신만의 리듬을 유지하시기 바랍니다.`

    return {
        intro,
        body,
        parentEffect,
        conclusion,
        fullStory: `${intro}\n\n${body}${parentEffect}\n\n${conclusion}`
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
        '목': [3, 8, 13, 18],
        '화': [2, 7, 12, 17],
        '토': [5, 10, 15, 20],
        '금': [4, 9, 14, 19],
        '수': [1, 6, 11, 16]
    }

    const foods = {
        '목': ['푸른 채소', '신맛 음식', '샐러드'],
        '화': ['매운 음식', '붉은 과일', '닭볶음탕'],
        '토': ['곡류', '단맛 음식', '떡'],
        '금': ['흰 음식', '매운맛', '무국'],
        '수': ['검은콩', '짠맛', '미역국']
    }

    const activities = {
        '목': ['독서', '공원 산책', '새로운 것 배우기'],
        '화': ['운동', '사람들과 어울리기', '발표나 리더 역할'],
        '토': ['정리정돈', '계획 세우기', '맛있는 음식 먹기'],
        '금': ['결정이 필요한 일 처리', '정리하기', '중요한 약속'],
        '수': ['명상', '물가 산책', '창의적인 활동']
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
    const foodOptions = foods[beneficialOhang] || foods['토']
    const activityOptions = activities[beneficialOhang] || activities['토']

    return {
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        direction: directions[beneficialOhang] || '동쪽',
        number: numberOptions[Math.floor(Math.random() * numberOptions.length)],
        food: foodOptions[Math.floor(Math.random() * foodOptions.length)],
        activity: activityOptions[Math.floor(Math.random() * activityOptions.length)]
    }
}

export function calculateFamilyFortune(parentBirthDate, parentBirthTime, childBirthDate, childBirthTime) {
    const parentSaju = calculateSaju(parentBirthDate, parentBirthTime)
    const childSaju = calculateSaju(childBirthDate, childBirthTime)

    const fortune = getChildFortuneWithParent(parentSaju, childSaju, parentBirthDate, childBirthDate)

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
