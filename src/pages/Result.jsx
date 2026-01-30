import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Heart, BookOpen, Users, Sparkles, RefreshCw } from 'lucide-react'
import { calculateFamilyFortune } from '../utils/familyFortune'
import AdBanner from '../components/AdBanner'

export default function Result() {
    const location = useLocation()
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const data = location.state || JSON.parse(localStorage.getItem('fortuneFamilyData') || '{}')

        if (data.parent && data.child) {
            const fortune = calculateFamilyFortune(
                data.parent.birthDate,
                data.parent.birthTime,
                data.child.birthDate,
                data.child.birthTime
            )
            setResult({
                parent: data.parent,
                child: data.child,
                ...fortune
            })
        }
        setLoading(false)
    }, [location.state])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">운세를 불러오는 중...</div>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6">
                <p className="text-white text-xl mb-6">운세 정보를 찾을 수 없습니다.</p>
                <Link to="/" className="px-8 py-4 bg-amber-600 text-white rounded-xl">
                    처음으로 돌아가기
                </Link>
            </div>
        )
    }

    const { parent, child, fortune } = result
    const score = fortune.overallScore

    // 점수에 따른 색상
    const getScoreColor = (s) => {
        if (s >= 85) return 'text-green-400'
        if (s >= 70) return 'text-blue-400'
        if (s >= 60) return 'text-yellow-400'
        return 'text-orange-400'
    }

    const getScoreBarColor = (s) => {
        if (s >= 85) return 'bg-gradient-to-r from-green-500 to-emerald-400'
        if (s >= 70) return 'bg-gradient-to-r from-blue-500 to-cyan-400'
        if (s >= 60) return 'bg-gradient-to-r from-yellow-500 to-amber-400'
        return 'bg-gradient-to-r from-orange-500 to-red-400'
    }

    return (
        <div className="min-h-screen relative">
            {/* 배경 */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/bg-mountain.png)' }}
            />
            <div className="fixed inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />

            <div className="relative z-10 px-4 py-6 max-w-lg mx-auto">
                {/* 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-6"
                >
                    <Link to="/" className="text-white/70 hover:text-white transition-colors">
                        <ArrowLeft size={28} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white font-serif">오늘의 운세</h1>
                        <p className="text-white/60 text-sm">{fortune.date}</p>
                    </div>
                </motion.div>

                {/* 가족 정보 요약 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                            <p className="text-white/60 text-sm mb-1">부모님</p>
                            <p className="text-white text-lg font-bold">{parent.name}</p>
                            <p className="text-amber-400 text-sm">{result.parent.saju.ilgan} ({result.parent.saju.ilganOhang})</p>
                        </div>
                        <div className="flex-shrink-0 px-4">
                            <Heart className="text-pink-400" size={28} />
                        </div>
                        <div className="text-center flex-1">
                            <p className="text-white/60 text-sm mb-1">자녀</p>
                            <p className="text-white text-lg font-bold">{child.name}</p>
                            <p className="text-amber-400 text-sm">{result.child.saju.ilgan} ({result.child.saju.ilganOhang})</p>
                        </div>
                    </div>
                </motion.div>

                {/* 부모-자녀 관계 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-5 mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-amber-400" size={24} />
                        <h2 className="text-xl font-bold text-white font-serif">{fortune.relation.relationName}</h2>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed mb-4">
                        {fortune.relation.description}
                    </p>
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-amber-300 text-base">
                            💡 {fortune.relation.advice}
                        </p>
                    </div>
                </motion.div>

                {/* 종합 운세 점수 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 text-center"
                >
                    <h2 className="text-xl font-bold text-white mb-4 font-serif">
                        {child.name}님의 오늘 운세
                    </h2>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="12"
                                fill="none"
                            />
                            <motion.circle
                                initial={{ strokeDashoffset: 352 }}
                                animate={{ strokeDashoffset: 352 - (352 * score / 100) }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#scoreGradient)"
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray="352"
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#ef4444" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
                        </div>
                    </div>
                    <p className="text-white/70 text-base">부모님의 기운이 반영된 점수</p>
                </motion.div>

                {/* 운세 메시지 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="text-amber-400" size={24} />
                        <h2 className="text-xl font-bold text-white font-serif">오늘의 풀이</h2>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed mb-4">
                        {fortune.messages.main}
                    </p>
                    <div className="border-t border-white/10 pt-4">
                        <p className="text-amber-300/90 text-base leading-relaxed">
                            ✨ {fortune.messages.relationAdvice}
                        </p>
                    </div>
                </motion.div>

                {/* 카테고리별 운세 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <Star className="text-amber-400" size={24} />
                        <h2 className="text-xl font-bold text-white font-serif">세부 운세</h2>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(fortune.categories).map(([name, value]) => (
                            <div key={name}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white text-lg">{name}</span>
                                    <span className={`text-lg font-bold ${getScoreColor(value)}`}>{value}점</span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${value}%` }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                        className={`h-full rounded-full ${getScoreBarColor(value)}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 행운 아이템 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-amber-400" size={24} />
                        <h2 className="text-xl font-bold text-white font-serif">오늘의 행운</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/60 text-sm mb-1">행운의 색</p>
                            <p className="text-white text-lg font-bold">{fortune.luckyItems.color}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/60 text-sm mb-1">행운의 방향</p>
                            <p className="text-white text-lg font-bold">{fortune.luckyItems.direction}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/60 text-sm mb-1">행운의 숫자</p>
                            <p className="text-white text-lg font-bold">{fortune.luckyItems.number}</p>
                        </div>
                    </div>
                </motion.div>

                {/* 광고 */}
                <AdBanner className="mb-6 rounded-xl overflow-hidden" />

                {/* 버튼 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3 pb-10"
                >
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg font-bold rounded-xl"
                    >
                        <RefreshCw size={20} />
                        다시 보기
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
