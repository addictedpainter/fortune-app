// 확장된 운세 생성 시스템 - 100개 이상의 다양한 패턴
// AdSense 승인을 위한 고품질 콘텐츠

import { DETAILED_ILGAN_FORTUNES } from '../data/expandedFortuneData'

// 1. 생년월일 기반 고유 시드 생성
function generateSeed(birthDate, birthTime) {
    const [year, month, day] = birthDate.split('-').map(Number)
    const [hour, minute] = (birthTime || '12:00').split(':').map(Number)

    return (year % 100) * 1000 + month * 100 + day * 10 + hour + minute
}

// 2. 시드 기반 난수 생성기 (일관된 결과 보장)
function seededRandom(seed, min, max) {
    const x = Math.sin(seed) * 10000
    const rand = x - Math.floor(x)
    return Math.floor(rand * (max - min + 1)) + min
}

// 3. 100가지 이상의 운세 스토리 템플릿
const FORTUNE_STORY_TEMPLATES = [
    // 매우 좋은 운세 (85-98점)
    {
        scoreRange: [85, 98],
        intros: [
            '오늘은 하늘의 별들이 특별히 {child}님을 위해 빛나는 날입니다.',
            '{parent}님의 따뜻한 기운이 {child}님의 운을 한층 더 높여주고 있습니다.',
            '천지의 기운이 조화를 이루며 {child}님에게 행운을 가져다주는 날입니다.',
            '오늘 {child}님의 사주팔자에는 대길(大吉)의 징조가 나타나고 있습니다.',
            '천간지지가 완벽한 조화를 이루어, 모든 일이 순조롭게 진행될 것입니다.',
        ],
        bodies: [
            '{childIlgan}의 기운과 {parentIlgan}의 기운이 만나 시너지를 발휘합니다. 두 기운이 서로를 북돋아주며, 평소보다 더 큰 성과를 이루실 수 있을 것입니다.',
            '오행의 흐름이 원활하여, 하고자 하는 일마다 물 흐르듯 자연스럽게 이루어질 것입니다. 특히 대인관계에서 귀인의 도움을 받을 수 있습니다.',
            '오늘은 {child}님의 타고난 재능이 빛을 발하는 날입니다. 자신감을 가지고 적극적으로 행동하시면 예상치 못한 기쁜 일이 생길 것입니다.',
            '사주의 삼합(三合)이 이루어져, 귀인의 도움과 행운이 동시에 찾아옵니다. 중요한 결정을 내리기에 최적의 시기입니다.',
            '천을귀인(天乙貴人)의 기운이 함께하여, 어려운 일도 쉽게 해결될 것입니다.',
        ],
        parentEffects: [
            '{parent}님의 {parentIlgan} 기운이 {child}님에게 든든한 보호막이 되어줍니다. 오늘은 부모님과 함께하는 시간이 특별한 행운을 가져올 것입니다.',
            '부모님의 따뜻한 관심이 자녀의 운을 몇 배로 증폭시킵니다. 감사한 마음을 표현하면 더욱 큰 복이 찾아올 것입니다.',
            '가족의 화목한 기운이 모든 장애물을 녹여줍니다. 집안의 평화가 곧 행운의 근원입니다.',
            '{parent}님의 축복이 하늘에 닿아, {child}님에게 특별한 은총이 내려집니다.',
            '부모자식 간의 깊은 정이 천지신명을 감동시켜, 온 우주가 {child}님을 돕고 있습니다.',
        ],
        conclusions: [
            '오늘 하루를 감사한 마음으로 시작하시면, 기쁜 소식이 연이어 들려올 것입니다.',
            '긍정적인 마음가짐이 행운을 더욱 크게 만들 것입니다. 자신감을 가지세요!',
            '오늘의 좋은 기운을 주변 사람들과 나누면, 복이 배가 될 것입니다.',
            '하늘이 {child}님의 편입니다. 망설이지 말고 과감하게 도전하세요.',
            '오늘은 꿈을 현실로 만드는 날입니다. 당신이 원하는 것을 이룰 수 있습니다.',
        ],
    },
    // 좋은 운세 (70-84점)
    {
        scoreRange: [70, 84],
        intros: [
            '오늘은 전반적으로 안정되고 평화로운 하루가 될 것입니다.',
            '{child}님에게 조용하지만 확실한 행운이 찾아오는 날입니다.',
            '차분하게 하루를 보내면서도 작은 기쁨들을 발견하실 수 있을 것입니다.',
            '오늘의 운세는 고요한 호수와 같습니다. 평온 속에서 내면의 힘을 발견하세요.',
            '특별히 큰 변화는 없지만, 일상의 소소한 행복을 누리기 좋은 날입니다.',
        ],
        bodies: [
            '{childIlgan}의 안정적인 기운이 하루를 평온하게 이끌어갑니다. 급하게 서두르기보다는 자신의 페이스대로 움직이는 것이 좋습니다.',
            '오늘은 새로운 시작보다는 지금 하고 있는 일을 착실히 마무리하는 것이 중요합니다. 꾸준함이 성공의 열쇠입니다.',
            '대인관계에서 작은 오해가 있을 수 있으나, 성실한 태도로 풀어나갈 수 있습니다.',
            '오행의 균형이 안정적이어서, 큰 위험이나 문제는 없을 것입니다.',
            '평범해 보이는 오늘이지만, 그 속에 작지만 소중한 기회들이 숨어 있습니다.',
        ],
        parentEffects: [
            '{parent}님의 조언에 귀 기울이면 올바른 방향을 찾을 수 있습니다.',
            '부모님과의 대화 속에서 문제 해결의 실마리를 찾을 수 있습니다.',
            '가족의 지지가 {child}님에게 힘이 되는 날입니다.',
            '부모님의 경험이 담긴 조언이 특별히 도움이 될 것입니다.',
            '집안의 평화로운 분위기가 {child}님의 마음을 안정시켜 줍니다.',
        ],
        conclusions: [
            '평범한 하루에도 작은 행복은 숨어 있습니다. 그것을 발견하는 것이 오늘의 과제입니다.',
            '조급해하지 마세요. 인생은 마라톤이지 단거리 달리기가 아닙니다.',
            '오늘 하루를 성실히 보내는 것 자체가 큰 성공입니다.',
            '작은 것에 감사하면, 큰 복이 찾아옵니다.',
            '평온한 하루를 즐기세요. 그것도 축복입니다.',
        ],
    },
    // 보통 운세 (55-69점)
    {
        scoreRange: [55, 69],
        intros: [
            '오늘은 주의가 필요한 하루입니다. 하지만 너무 걱정하지 마세요.',
            '{child}님에게 작은 시련이 있을 수 있지만, 이는 성장의 기회입니다.',
            '오늘은 조금 더 신중하게 행동해야 하는 날입니다.',
            '도전과 기회가 공존하는 날입니다. 지혜롭게 대처하세요.',
            '순탄치만은 않은 하루이지만, 그만큼 배울 것도 많은 날입니다.',
        ],
        bodies: [
            '{childIlgan}의 기운이 다소 약해진 상태입니다. 무리한 일정은 피하고 건강 관리에 신경 쓰세요.',
            '감정 기복이 있을 수 있습니다. 중요한 결정은 좀 더 신중하게 내리는 것이 좋습니다.',
            '대인관계에서 오해가 생길 수 있으니, 말과 행동에 조심하세요.',
            '계획했던 일이 예상대로 풀리지 않을 수 있지만, 당황하지 말고 차분히 대처하세요.',
            '작은 장애물들이 나타날 수 있지만, 이를 극복하면 더 강해질 것입니다.',
        ],
        parentEffects: [
            '{parent}님의 도움과 조언이 절실히 필요한 시기입니다. 부모님께 조언을 구하세요.',
            '부모님과의 대화가 문제 해결의 열쇠가 될 수 있습니다.',
            '혼자 고민하지 말고 가족의 지혜를 빌리세요.',
            '{parent}님의 경험이 {child}님에게 큰 도움이 될 것입니다.',
            '가족의 응원이 {child}님에게 힘을 줄 것입니다.',
        ],
        conclusions: [
            '어려움은 일시적입니다. 인내하면 반드시 좋은 날이 올 것입니다.',
            '시련은 성장의 기회입니다. 포기하지 마세요.',
            '오늘의 경험이 내일의 지혜가 될 것입니다.',
            '힘든 시기일수록 긍정적인 마인드를 유지하세요.',
            '모든 구름 뒤에는 태양이 있습니다. 희망을 잃지 마세요.',
        ],
    },
    // 주의 필요 운세 (50-54점)
    {
        scoreRange: [50, 54],
        intros: [
            '오늘은 특별히 조심해야 하는 날입니다.',
            '{child}님, 오늘은 평소보다 더 신중하게 행동하세요.',
            '시련의 시기이지만, 이를 지혜롭게 넘기면 큰 성장이 있을 것입니다.',
            '오늘은 휴식과 재충전이 필요한 날입니다.',
            '급한 일은 미루고, 몸과 마음을 돌보는 시간을 가지세요.',
        ],
        bodies: [
            '{childIlgan}의 기운이 많이 약해진 상태입니다. 무리하지 말고 충분한 휴식을 취하세요.',
            '오늘은 새로운 일을 시작하기보다는 현상 유지에 집중하세요.',
            '감정적으로 예민해질 수 있으니, 중요한 대화나 결정은 미루는 것이 좋습니다.',
            '건강 관리에 특별히 신경 쓰세요. 작은 징후를 무시하지 마세요.',
            '대인관계에서 갈등이 생길 수 있으니, 말과 행동을 조심하세요.',
        ],
        parentEffects: [
            '{parent}님의 보호와 도움이 절대적으로 필요한 시기입니다.',
            '부모님께 의지하는 것이 부끄러운 일이 아닙니다. 도움을 요청하세요.',
            '가족의 사랑과 지지가 {child}님을 지켜줄 것입니다.',
            '{parent}님과 함께 있으면 마음이 편안해질 것입니다.',
            '부모님의 기도와 축복이 {child}님을 보호합니다.',
        ],
        conclusions: [
            '폭풍도 언젠가는 잦아듭니다. 조금만 더 힘내세요.',
            '오늘의 어려움은 내일의 축복을 위한 준비입니다.',
            '쉬는 것도 용기입니다. 잠시 멈추고 재충전하세요.',
            '어두운 밤이 길수록 새벽은 더욱 찬란합니다.',
            '이 또한 지나갈 것입니다. 희망을 잃지 마세요.',
        ],
    },
];

// 4. 계절별 추가 보정
const SEASONAL_ADJUSTMENTS = {
    spring: { // 봄 (3-5월)
        목: +5, 화: +3, 토: -2, 금: -3, 수: +2
    },
    summer: { // 여름 (6-8월)
        목: -2, 화: +5, 토: +3, 금: -3, 수: -2
    },
    autumn: { // 가을 (9-11월)
        목: -3, 화: -2, 토: +2, 금: +5, 수: +3
    },
    winter: { // 겨울 (12-2월)
        목: +2, 화: -3, 토: -2, 금: +3, 수: +5
    }
};

function getCurrentSeason() {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 5) return 'spring'
    if (month >= 6 && month <= 8) return 'summer'
    if (month >= 9 && month <= 11) return 'autumn'
    return 'winter'
}

// 5. 확장된 운세 생성 메인 함수
export function generateExpandedFortune(parentSaju, childSaju, parentBirthDate, childBirthDate, relation) {
    const seed = generateSeed(childBirthDate, childSaju.birthTime || '12:00')
    const parentSeed = generateSeed(parentBirthDate, parentSaju.birthTime || '12:00')
    const combinedSeed = seed + parentSeed

    // 기본 점수에 다양한 요소 반영
    let finalScore = relation.score

    // 계절 보정
    const season = getCurrentSeason()
    const seasonalAdj = SEASONAL_ADJUSTMENTS[season][childSaju.ilganOhang] || 0
    finalScore += seasonalAdj

    // 요일 보정
    const dayOfWeek = new Date().getDay()
    const weekdayAdj = seededRandom(combinedSeed + dayOfWeek, -3, 3)
    finalScore += weekdayAdj

    // 시간대 보정
    const hour = new Date().getHours()
    const timeAdj = hour >= 6 && hour <= 18 ? 2 : -1 // 낮 시간대 보너스
    finalScore += timeAdj

    // 최종 점수 범위 제한
    finalScore = Math.min(98, Math.max(50, finalScore))

    // 점수 범위에 맞는 템플릿 선택
    const template = FORTUNE_STORY_TEMPLATES.find(t =>
        finalScore >= t.scoreRange[0] && finalScore <= t.scoreRange[1]
    ) || FORTUNE_STORY_TEMPLATES[1]

    // 랜덤하게 문장 선택 (하지만 시드 기반으로 일관성 유지)
    const intro = template.intros[seededRandom(seed, 0, template.intros.length - 1)]
    const body = template.bodies[seededRandom(combinedSeed, 0, template.bodies.length - 1)]
    const parentEffect = template.parentEffects[seededRandom(parentSeed, 0, template.parentEffects.length - 1)]
    const conclusion = template.conclusions[seededRandom(seed + 100, 0, template.conclusions.length - 1)]

    // 변수 치환
    const replacements = {
        '{parent}': '부모',
        '{child}': '자녀',
        '{parentIlgan}': parentSaju.ilgan,
        '{childIlgan}': childSaju.ilgan,
    }

    const replaceVars = (text) => {
        let result = text
        for (const [key, value] of Object.entries(replacements)) {
            result = result.replace(new RegExp(key, 'g'), value)
        }
        return result
    }

    return {
        score: finalScore,
        story: {
            intro: replaceVars(intro),
            body: replaceVars(body),
            parentEffect: replaceVars(parentEffect),
            conclusion: replaceVars(conclusion),
        },
        season: {
            name: {
                spring: '봄',
                summer: '여름',
                autumn: '가을',
                winter: '겨울'
            }[season],
            effect: `${season === 'spring' ? '만물이 소생하는' : season === 'summer' ? '활기찬' : season === 'autumn' ? '결실의' : '차분한'} ${seasonalAdj >= 0 ? '긍정적인' : '주의가 필요한'} 영향을 주고 있습니다.`
        }
    }
}

export default {
    generateExpandedFortune,
    FORTUNE_STORY_TEMPLATES,
};
