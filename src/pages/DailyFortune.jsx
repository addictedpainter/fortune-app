import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Heart, Briefcase, DollarSign, Activity, Sparkles, Quote } from 'lucide-react'
import { getDailyFortune } from '../utils/dailyFortune'
import AdBanner from '../components/AdBanner'

export default function DailyFortune() {
    const [fortune, setFortune] = useState(null)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기 (새/구 형식 모두 지원)
        let data = null
        const familyData = localStorage.getItem('fortuneFamilyData')
        const oldData = localStorage.getItem('fortuneUserData')

        if (familyData) {
            const parsed = JSON.parse(familyData)
            // 자녀 정보를 우선 사용
            data = parsed.child || parsed.parent
        } else if (oldData) {
            data = JSON.parse(oldData)
        }

        if (data && data.birthDate) {
            setUserData(data)
            const dailyFortune = getDailyFortune(data.birthDate, data.birthTime, data.gender)
            setFortune(dailyFortune)
        }
    }, [])

    if (!userData || !fortune) {
        return (
            <div className="min-h-screen relative">
                <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/bg-mountain.png)' }} />
                <div className="fixed inset-0 bg-slate-900/70" />
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
                    <Sparkles className="text-amber-400 w-16 h-16 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">먼저 정보를 입력해주세요</h2>
                    <p className="text-white/60 mb-8 text-lg">오늘의 운세를 보려면 생년월일 정보가 필요합니다.</p>
                    <Link
                        to="/"
                        className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        정보 입력하러 가기
                    </Link>
                </div>
            </div>
        )
    }

    const { categories, luckyItems, quote, todayGanji, saju, relation } = fortune

    const categoryIcons = {
        overall: <Star size={20} />,
        love: <Heart size={20} />,
        money: <DollarSign size={20} />,
        work: <Briefcase size={20} />,
        health: <Activity size={20} />
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-amber-400'
        if (score >= 40) return 'text-orange-400'
        return 'text-red-400'
    }

    const getScoreBarColor = (score) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-amber-500'
        if (score >= 40) return 'bg-orange-500'
        return 'bg-red-500'
    }

    return (
        <div className="min-h-screen relative">
            {/* 배경 */}
            <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/bg-mountain.png)' }} />
            <div className="fixed inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 px-4 py-6 pb-20 max-w-lg mx-auto"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/" className="text-amber-300 hover:text-amber-200 transition-colors">
                        <ArrowLeft size={28} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white font-serif">오늘의 운세</h1>
                        <p className="text-white/60 text-sm">{fortune.date}</p>
                    </div>
                </div>

                {/* Today's Ganji & Score */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/60 mb-1">오늘의 일진</p>
                            <p className="text-3xl font-bold text-amber-300">{todayGanji.fullName}</p>
                            <p className="text-sm text-white/60 mt-1">{todayGanji.ohang}(五行) 기운</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-white/60 mb-1">종합 점수</p>
                            <p className={`text-5xl font-extrabold ${getScoreColor(relation.score)}`}>
                                {relation.score}
                            </p>
                            <p className="text-sm text-white/80 mt-1">{relation.desc}</p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-white/60">나의 일간:</span>
                        <span className="text-amber-300 font-bold">{saju.ilgan}({saju.ilganOhang})</span>
                        <span className="text-white/40">→</span>
                        <span className="text-white font-bold">{relation.type}</span>
                    </div>
                </div>

                {/* Ad */}
                <AdBanner className="mb-6 rounded-xl overflow-hidden" />

                {/* Fortune Categories */}
                <div className="space-y-4 mb-6">
                    {Object.entries(categories).map(([key, data]) => (
                        <div
                            key={key}
                            className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400">{categoryIcons[key]}</span>
                                    <span className="font-bold text-white text-lg">{data.title}</span>
                                </div>
                                <span className={`text-2xl font-extrabold ${getScoreColor(data.score)}`}>
                                    {data.score}점
                                </span>
                            </div>

                            {/* Score Bar */}
                            <div className="w-full bg-black/30 rounded-full h-2 mb-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.score}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className={`h-full rounded-full ${getScoreBarColor(data.score)}`}
                                />
                            </div>

                            <p className="text-white/80 text-base leading-relaxed">{data.description}</p>
                            <p className="text-amber-300/80 text-sm mt-2">💡 {data.advice}</p>
                        </div>
                    ))}
                </div>

                {/* Lucky Items */}
                <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/20 mb-6">
                    <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2 font-serif">
                        <Sparkles size={22} />
                        오늘의 행운 아이템
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/20 rounded-xl p-4 text-center">
                            <p className="text-sm text-white/60 mb-1">행운의 색</p>
                            <p className="font-bold text-white text-lg">{luckyItems.color}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 text-center">
                            <p className="text-sm text-white/60 mb-1">행운의 숫자</p>
                            <p className="font-bold text-white text-lg">{luckyItems.number}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 text-center">
                            <p className="text-sm text-white/60 mb-1">행운의 방향</p>
                            <p className="font-bold text-white text-lg">{luckyItems.direction}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 text-center">
                            <p className="text-sm text-white/60 mb-1">추천 음식</p>
                            <p className="font-bold text-white text-lg">{luckyItems.food}</p>
                        </div>
                    </div>
                </div>

                {/* Daily Quote */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 mb-6">
                    <div className="flex items-start gap-3">
                        <Quote className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <p className="text-xl font-bold text-white mb-2 font-serif">{quote.text}</p>
                            <p className="text-white/70 text-base">{quote.meaning}</p>
                        </div>
                    </div>
                </div>

                {/* Ad */}
                <AdBanner className="mb-6 rounded-xl overflow-hidden" />

                {/* Navigation Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        to="/saju-analysis"
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl text-center transition-colors border border-white/20 text-lg"
                    >
                        상세 사주 분석
                    </Link>
                    <Link
                        to="/compatibility"
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl text-center transition-colors border border-white/20 text-lg"
                    >
                        궁합 보기
                    </Link>
                </div>

                {/* Footer */}
                <footer className="mt-10 text-center text-white/40 text-sm">
                    <p>※ 운세는 참고용이며 매일 자정 갱신됩니다.</p>
                </footer>
            </motion.div>
        </div>
    )
}
