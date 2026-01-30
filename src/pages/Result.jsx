import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, BookOpen, TrendingUp, Sparkles, RefreshCw, ChevronRight, User, Users, Share2 } from 'lucide-react'
import { calculateFamilyFortune } from '../utils/familyFortune'
import AdBanner from '../components/AdBanner'
import ShareModal from '../components/ShareModal'

// 육각형 그래프 컴포넌트
function HexagonChart({ data }) {
    const categories = Object.entries(data)
    const centerX = 150
    const centerY = 150
    const maxRadius = 100

    // 각 점의 좌표 계산
    const getPoint = (index, value) => {
        const angle = (Math.PI / 3) * index - Math.PI / 2
        const radius = (value / 100) * maxRadius
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        }
    }

    // 배경 육각형 (눈금)
    const backgroundHexagons = [20, 40, 60, 80, 100].map(level => {
        const points = Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.PI / 3) * i - Math.PI / 2
            const radius = (level / 100) * maxRadius
            return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`
        }).join(' ')
        return <polygon key={level} points={points} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    })

    // 데이터 폴리곤
    const dataPoints = categories.map(([_, value], i) => getPoint(i, value))
    const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

    // 라벨 위치
    const labelPositions = categories.map(([name, _], i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2
        const radius = maxRadius + 30
        return {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            name
        }
    })

    return (
        <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
                {/* 배경 */}
                {backgroundHexagons}

                {/* 축선 */}
                {Array.from({ length: 6 }, (_, i) => {
                    const angle = (Math.PI / 3) * i - Math.PI / 2
                    const endX = centerX + maxRadius * Math.cos(angle)
                    const endY = centerY + maxRadius * Math.sin(angle)
                    return <line key={i} x1={centerX} y1={centerY} x2={endX} y2={endY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                })}

                {/* 데이터 영역 */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    points={dataPolygon}
                    fill="rgba(251, 191, 36, 0.3)"
                    stroke="rgb(251, 191, 36)"
                    strokeWidth="2"
                />

                {/* 데이터 포인트 */}
                {dataPoints.map((point, i) => (
                    <motion.circle
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        cx={point.x}
                        cy={point.y}
                        r="6"
                        fill="rgb(251, 191, 36)"
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}

                {/* 라벨 */}
                {labelPositions.map((label, i) => (
                    <text
                        key={i}
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                    >
                        {label.name}
                    </text>
                ))}
            </svg>

            {/* 점수 표시 */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                {categories.map(([name, value]) => (
                    <div key={name} className="text-center">
                        <p className="text-xs text-white/60">{name}</p>
                        <p className={`text-lg font-bold ${value >= 75 ? 'text-green-400' : value >= 50 ? 'text-amber-400' : 'text-orange-400'}`}>
                            {value}점
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// 탭 버튼
function TabButton({ active, onClick, children, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-3 px-2 text-center font-bold transition-all flex items-center justify-center gap-2 ${active
                ? 'bg-amber-500/30 text-amber-300 border-b-2 border-amber-400'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
        >
            <Icon size={18} />
            <span className="text-sm">{children}</span>
        </button>
    )
}

export default function Result() {
    const location = useLocation()
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('story')
    const [showShareModal, setShowShareModal] = useState(false)

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
            <div className="min-h-screen relative">
                <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/bg-mountain.png)' }} />
                <div className="fixed inset-0 bg-slate-900/70" />
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                    <p className="text-white text-xl mb-6">운세 정보를 찾을 수 없습니다.</p>
                    <Link to="/" className="px-8 py-4 bg-amber-600 text-white rounded-xl font-bold">
                        처음으로 돌아가기
                    </Link>
                </div>
            </div>
        )
    }

    const { parent, child, fortune } = result
    const score = fortune.overallScore

    const getScoreLevel = (s) => {
        if (s >= 85) return { text: '대길(大吉)', color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/20' }
        if (s >= 70) return { text: '길(吉)', color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20' }
        if (s >= 55) return { text: '평(平)', color: 'text-amber-400', bg: 'from-amber-500/20 to-yellow-500/20' }
        return { text: '주의(注意)', color: 'text-orange-400', bg: 'from-orange-500/20 to-red-500/20' }
    }

    const scoreLevel = getScoreLevel(score)

    return (
        <div className="min-h-screen relative">
            {/* 배경 */}
            <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/bg-mountain.png)' }} />
            <div className="fixed inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />

            <div className="relative z-10 max-w-lg mx-auto">
                {/* 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between px-4 py-4"
                >
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-white/70 hover:text-white transition-colors">
                            <ArrowLeft size={28} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white font-serif">오늘의 운세 풀이</h1>
                            <p className="text-white/60 text-sm">{fortune.date}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <Share2 size={20} />
                    </button>
                </motion.div>

                {/* 종합 점수 카드 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mx-4 bg-gradient-to-br ${scoreLevel.bg} backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-4`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-sm mb-1">오늘의 운세</p>
                            <p className={`text-3xl font-extrabold ${scoreLevel.color}`}>{scoreLevel.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <User size={14} className="text-white/60" />
                                <span className="text-white/80 text-sm">{parent.name}</span>
                                <Heart size={12} className="text-pink-400" />
                                <Users size={14} className="text-white/60" />
                                <span className="text-white/80 text-sm">{child.name}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="relative w-20 h-20">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                    <motion.circle
                                        initial={{ strokeDashoffset: 220 }}
                                        animate={{ strokeDashoffset: 220 - (220 * score / 100) }}
                                        transition={{ duration: 1.5, delay: 0.3 }}
                                        cx="40" cy="40" r="35"
                                        stroke="url(#scoreGradient)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="220"
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#f59e0b" />
                                            <stop offset="100%" stopColor="#ef4444" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{score}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 탭 네비게이션 */}
                <div className="flex mx-4 rounded-xl overflow-hidden mb-4">
                    <TabButton active={activeTab === 'story'} onClick={() => setActiveTab('story')} icon={BookOpen}>
                        오늘의 풀이
                    </TabButton>
                    <TabButton active={activeTab === 'chart'} onClick={() => setActiveTab('chart')} icon={TrendingUp}>
                        운세 그래프
                    </TabButton>
                    <TabButton active={activeTab === 'detail'} onClick={() => setActiveTab('detail')} icon={Sparkles}>
                        상세 분석
                    </TabButton>
                </div>

                {/* 탭 콘텐츠 */}
                <div className="px-4 pb-6">
                    {activeTab === 'story' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            {/* 오늘의 스토리 */}
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                                <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2 font-serif">
                                    <BookOpen size={20} />
                                    오늘의 운세 이야기
                                </h3>
                                <div className="space-y-4 text-white/90 text-base leading-relaxed">
                                    <p>{fortune.story.intro}</p>
                                    <p>{fortune.story.body}</p>
                                    <p className="text-amber-300/90">{fortune.story.parentEffect}</p>
                                    <p className="italic text-white/70">{fortune.story.conclusion}</p>
                                </div>
                            </div>

                            {/* 부모-자녀 관계 */}
                            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-5">
                                <h3 className="text-lg font-bold text-purple-300 mb-3 font-serif">{fortune.relation.relationName}</h3>
                                <p className="text-white/80 text-base leading-relaxed mb-4">{fortune.relation.detailedAnalysis}</p>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-amber-300 text-sm">💡 {fortune.relation.advice}</p>
                                </div>
                            </div>

                            {/* 자녀 성격 분석 */}
                            {fortune.childIlgan && (
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">{result.child.saju.ilgan}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white font-serif">{fortune.childIlgan.name}</h3>
                                            <p className="text-white/60 text-sm">{fortune.childIlgan.symbol}의 기운</p>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-base leading-relaxed mb-3">{fortune.childIlgan.strengths}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {fortune.childIlgan.characteristics.map((char, i) => (
                                            <span key={i} className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full">
                                                {char}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-amber-300/80 text-sm italic">✨ {fortune.childIlgan.advice}</p>
                                </div>
                            )}

                            {/* 특별 조언 */}
                            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 backdrop-blur-xl border border-amber-400/20 rounded-2xl p-5">
                                <h3 className="text-lg font-bold text-amber-300 mb-2 font-serif">
                                    🕐 {fortune.specialAdvice.time} 조언
                                </h3>
                                <p className="text-white/80 text-base">{fortune.specialAdvice.advice}</p>
                            </div>

                            {/* 광고 */}
                            <AdBanner className="rounded-xl overflow-hidden" />

                            {/* 행운 아이템 */}
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                                <h3 className="text-lg font-bold text-amber-300 mb-4 font-serif">🍀 오늘의 행운</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <p className="text-xs text-white/50 mb-1">행운의 색</p>
                                        <p className="text-white font-bold">{fortune.luckyItems.color}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <p className="text-xs text-white/50 mb-1">행운의 숫자</p>
                                        <p className="text-white font-bold">{fortune.luckyItems.number}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <p className="text-xs text-white/50 mb-1">행운의 방향</p>
                                        <p className="text-white font-bold">{fortune.luckyItems.direction}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center">
                                        <p className="text-xs text-white/50 mb-1">추천 음식</p>
                                        <p className="text-white font-bold">{fortune.luckyItems.food}</p>
                                    </div>
                                </div>
                                <div className="mt-3 bg-amber-500/10 rounded-xl p-3">
                                    <p className="text-xs text-white/50 mb-1">오늘 하면 좋은 활동</p>
                                    <p className="text-amber-300 font-bold">{fortune.luckyItems.activity}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'chart' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            {/* 육각형 그래프 */}
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                                <h3 className="text-lg font-bold text-amber-300 mb-4 font-serif text-center">
                                    📊 운세 육각 그래프
                                </h3>
                                <HexagonChart data={fortune.hexagonData} />
                            </div>

                            {/* 그래프 설명 */}
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                                <h3 className="text-lg font-bold text-white mb-3 font-serif">그래프 해석</h3>
                                <p className="text-white/80 text-base leading-relaxed mb-4">
                                    위 육각형 그래프는 오늘 {child.name}님에게 흐르는 6가지 운의 기운을 나타냅니다.
                                    그래프가 넓게 퍼져 있을수록 전반적으로 운이 좋은 날이며,
                                    특정 방향으로 치우쳐 있다면 해당 분야에서 특별한 기운이 흐르고 있음을 의미합니다.
                                </p>

                                {/* 가장 높은/낮은 운세 */}
                                {(() => {
                                    const entries = Object.entries(fortune.hexagonData)
                                    const highest = entries.reduce((a, b) => a[1] > b[1] ? a : b)
                                    const lowest = entries.reduce((a, b) => a[1] < b[1] ? a : b)

                                    return (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                                                <p className="text-xs text-white/50 mb-1">오늘 가장 좋은 운</p>
                                                <p className="text-xl font-bold text-green-400">{highest[0]}</p>
                                                <p className="text-sm text-white/60">{highest[1]}점</p>
                                            </div>
                                            <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                                                <p className="text-xs text-white/50 mb-1">보완이 필요한 운</p>
                                                <p className="text-xl font-bold text-orange-400">{lowest[0]}</p>
                                                <p className="text-sm text-white/60">{lowest[1]}점</p>
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>

                            <AdBanner className="rounded-xl overflow-hidden" />
                        </motion.div>
                    )}

                    {activeTab === 'detail' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            {/* 카테고리별 상세 */}
                            {Object.entries(fortune.categoryDetails).map(([category, data]) => (
                                <div key={category} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-white font-serif">{category}</h3>
                                        <span className={`text-2xl font-bold ${data.score >= 75 ? 'text-green-400' :
                                            data.score >= 50 ? 'text-amber-400' : 'text-orange-400'
                                            }`}>
                                            {data.score}점
                                        </span>
                                    </div>
                                    <div className="w-full bg-black/30 rounded-full h-2 mb-4">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data.score}%` }}
                                            transition={{ duration: 0.8 }}
                                            className={`h-full rounded-full ${data.score >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                                data.score >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                                                    'bg-gradient-to-r from-orange-500 to-red-400'
                                                }`}
                                        />
                                    </div>
                                    <p className="text-white/80 text-base leading-relaxed">{data.message}</p>
                                </div>
                            ))}

                            <AdBanner className="rounded-xl overflow-hidden" />

                            {/* 부모님 일간 분석 */}
                            {fortune.parentIlgan && (
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
                                    <h3 className="text-lg font-bold text-purple-300 mb-3 font-serif">
                                        부모님 ({parent.name}) - {fortune.parentIlgan.name}
                                    </h3>
                                    <p className="text-white/80 text-base leading-relaxed mb-3">
                                        {fortune.parentIlgan.strengths}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        {fortune.parentIlgan.weaknesses}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 하단 버튼 */}
                    <div className="mt-6 space-y-3">
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all mb-4"
                        >
                            <Share2 size={20} />
                            운세 결과 공유하기
                        </button>

                        <Link
                            to="/daily"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/20"
                        >
                            오늘의 상세 운세 보기
                            <ChevronRight size={18} />
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl"
                        >
                            <RefreshCw size={18} />
                            다시 보기
                        </Link>
                    </div>

                    {/* 푸터 */}
                    <footer className="mt-8 text-center text-white/40 text-sm pb-10">
                        <p>※ 운세는 참고용이며, 실제 삶의 결정은 본인의 판단이 가장 중요합니다.</p>
                    </footer>
                </div>
            </div>

            {/* 공유 모달 */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                childName={child.name}
                parentName={parent.name}
                score={score}
                date={fortune.date}
                relation={fortune.relation.relationName}
            />
        </div>
    )
}
