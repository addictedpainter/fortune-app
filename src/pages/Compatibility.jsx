import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Users, Calendar, User } from 'lucide-react'
import { calculateSaju } from '../utils/saju'
import AdBanner from '../components/AdBanner'

const COMPATIBILITY_RESULTS = {
    perfect: {
        level: '천생연분',
        score: 95,
        color: 'from-pink-500 to-rose-500',
        description: '하늘이 맺어준 인연입니다. 서로를 완벽하게 보완하며 함께할 때 더욱 빛나는 관계입니다.',
        advice: '이 인연을 소중히 여기세요. 서로에 대한 믿음을 잃지 마세요.'
    },
    great: {
        level: '상생궁합',
        score: 85,
        color: 'from-amber-500 to-orange-500',
        description: '서로에게 좋은 기운을 주는 관계입니다. 함께하면 성장하고 발전할 수 있습니다.',
        advice: '서로의 장점을 인정하고 칭찬하세요. 시너지 효과가 큽니다.'
    },
    good: {
        level: '길한 인연',
        score: 75,
        color: 'from-green-500 to-emerald-500',
        description: '무난하고 안정적인 관계입니다. 노력하면 좋은 결과를 얻을 수 있습니다.',
        advice: '소통에 더 노력을 기울이면 관계가 더욱 깊어집니다.'
    },
    neutral: {
        level: '평범한 인연',
        score: 60,
        color: 'from-blue-500 to-indigo-500',
        description: '특별히 좋거나 나쁘지 않은 관계입니다. 서로의 노력 여하에 따라 달라집니다.',
        advice: '서로 다른 점을 이해하고 존중하는 자세가 필요합니다.'
    },
    challenging: {
        level: '노력형 인연',
        score: 45,
        color: 'from-orange-500 to-red-500',
        description: '서로 다른 기질로 인해 갈등이 있을 수 있습니다. 많은 노력과 이해가 필요합니다.',
        advice: '감정적 충돌을 피하고 이성적인 대화를 나누세요.'
    }
}

function analyzeCompatibility(saju1, saju2) {
    const relations = {
        '목': { generates: '화', controlled: '금', controls: '토', generatedBy: '수' },
        '화': { generates: '토', controlled: '수', controls: '금', generatedBy: '목' },
        '토': { generates: '금', controlled: '목', controls: '수', generatedBy: '화' },
        '금': { generates: '수', controlled: '화', controls: '목', generatedBy: '토' },
        '수': { generates: '목', controlled: '토', controls: '화', generatedBy: '금' }
    };

    const ohang1 = saju1.ilganOhang;
    const ohang2 = saju2.ilganOhang;
    const rel1 = relations[ohang1];

    // 상생/상극 관계 분석
    if (ohang2 === rel1.generatedBy || ohang1 === relations[ohang2].generatedBy) {
        return 'perfect';
    }
    if (ohang2 === rel1.generates || ohang1 === relations[ohang2].generates) {
        return 'great';
    }
    if (ohang1 === ohang2) {
        return 'good';
    }
    if (ohang2 === rel1.controlled || ohang1 === relations[ohang2].controlled) {
        return 'challenging';
    }
    return 'neutral';
}

export default function Compatibility() {
    const [person1, setPerson1] = useState({ name: '', birthDate: '', gender: 'male' })
    const [person2, setPerson2] = useState({ name: '', birthDate: '', gender: 'female' })
    const [result, setResult] = useState(null)
    const [showResult, setShowResult] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!person1.birthDate || !person2.birthDate) {
            alert('두 사람의 생년월일을 모두 입력해주세요.')
            return
        }

        const saju1 = calculateSaju(person1.birthDate)
        const saju2 = calculateSaju(person2.birthDate)
        const compatibilityType = analyzeCompatibility(saju1, saju2)

        setResult({
            ...COMPATIBILITY_RESULTS[compatibilityType],
            saju1,
            saju2,
            person1: { ...person1, saju: saju1 },
            person2: { ...person2, saju: saju2 }
        })
        setShowResult(true)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-6 pb-20"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/" className="text-amber-300 hover:text-amber-200 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">사주 궁합</h1>
                    <p className="text-gray-400 text-sm">두 사람의 오행 궁합을 분석합니다</p>
                </div>
            </div>

            {!showResult ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Person 1 */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="text-blue-400" size={20} />
                            <span className="font-bold text-white">첫 번째 사람</span>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="이름"
                                className="w-full h-12 bg-black/20 rounded-xl px-4 text-white placeholder-gray-500 border-none outline-none focus:ring-2 focus:ring-blue-500/50"
                                value={person1.name}
                                onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                            />
                            <input
                                type="date"
                                required
                                className="w-full h-12 bg-black/20 rounded-xl px-4 text-white border-none outline-none focus:ring-2 focus:ring-blue-500/50"
                                style={{ colorScheme: 'dark' }}
                                value={person1.birthDate}
                                onChange={(e) => setPerson1({ ...person1, birthDate: e.target.value })}
                            />
                            <div className="flex gap-2">
                                {['male', 'female'].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setPerson1({ ...person1, gender: g })}
                                        className={`flex-1 py-2 rounded-xl font-bold transition-colors ${person1.gender === g
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-black/20 text-gray-400'
                                            }`}
                                    >
                                        {g === 'male' ? '남성' : '여성'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Heart Icon */}
                    <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                            <Heart className="text-white" size={24} />
                        </div>
                    </div>

                    {/* Person 2 */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-pink-400" size={20} />
                            <span className="font-bold text-white">두 번째 사람</span>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="이름"
                                className="w-full h-12 bg-black/20 rounded-xl px-4 text-white placeholder-gray-500 border-none outline-none focus:ring-2 focus:ring-pink-500/50"
                                value={person2.name}
                                onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                            />
                            <input
                                type="date"
                                required
                                className="w-full h-12 bg-black/20 rounded-xl px-4 text-white border-none outline-none focus:ring-2 focus:ring-pink-500/50"
                                style={{ colorScheme: 'dark' }}
                                value={person2.birthDate}
                                onChange={(e) => setPerson2({ ...person2, birthDate: e.target.value })}
                            />
                            <div className="flex gap-2">
                                {['male', 'female'].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setPerson2({ ...person2, gender: g })}
                                        className={`flex-1 py-2 rounded-xl font-bold transition-colors ${person2.gender === g
                                                ? 'bg-pink-500 text-white'
                                                : 'bg-black/20 text-gray-400'
                                            }`}
                                    >
                                        {g === 'male' ? '남성' : '여성'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ad */}
                    <AdBanner className="rounded-xl overflow-hidden" />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                        궁합 분석하기 💕
                    </button>
                </form>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    {/* Result Card */}
                    <div className={`bg-gradient-to-br ${result.color} rounded-2xl p-6 text-center shadow-xl`}>
                        <div className="text-6xl mb-4">💕</div>
                        <p className="text-white/80 text-sm mb-2">궁합 결과</p>
                        <h2 className="text-3xl font-extrabold text-white mb-2">{result.level}</h2>
                        <div className="text-5xl font-black text-white drop-shadow-lg">{result.score}점</div>
                    </div>

                    {/* Two People Saju */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 text-center">
                            <p className="text-xs text-gray-400 mb-1">{person1.name || '첫 번째 사람'}</p>
                            <p className="text-2xl font-bold text-blue-400">{result.saju1.ilgan}</p>
                            <p className="text-sm text-gray-400">{result.saju1.ilganOhang} 기운</p>
                            <p className="text-xs text-gray-500 mt-1">{result.saju1.year.zodiac}띠</p>
                        </div>
                        <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/20 text-center">
                            <p className="text-xs text-gray-400 mb-1">{person2.name || '두 번째 사람'}</p>
                            <p className="text-2xl font-bold text-pink-400">{result.saju2.ilgan}</p>
                            <p className="text-sm text-gray-400">{result.saju2.ilganOhang} 기운</p>
                            <p className="text-xs text-gray-500 mt-1">{result.saju2.year.zodiac}띠</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                        <h3 className="font-bold text-white mb-3">📖 궁합 해석</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{result.description}</p>
                        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                            <p className="text-amber-300 text-sm">💡 조언: {result.advice}</p>
                        </div>
                    </div>

                    {/* Ad */}
                    <AdBanner className="rounded-xl overflow-hidden" />

                    {/* Retry Button */}
                    <button
                        onClick={() => {
                            setShowResult(false)
                            setResult(null)
                            setPerson1({ name: '', birthDate: '', gender: 'male' })
                            setPerson2({ name: '', birthDate: '', gender: 'female' })
                        }}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors"
                    >
                        다시 분석하기
                    </button>
                </motion.div>
            )}
        </motion.div>
    )
}
