import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, RefreshCw, Check, Sparkles, TrendingUp, Heart, Briefcase, Users, Calendar } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import AdBanner from '../components/AdBanner'
import { calculateSaju, analyze2026Fortune } from '../utils/saju'

const TABS = [
    { id: 'total', label: '총운', icon: <Sparkles size={20} /> },
    { id: 'wealth', label: '재물운', icon: <TrendingUp size={20} /> },
    { id: 'health', label: '건강/가정', icon: <Heart size={20} /> },
    { id: 'love', label: '연애운', icon: <Users size={20} /> },
    { id: 'career', label: '직장운', icon: <Briefcase size={20} /> },
    { id: 'monthly', label: '월운', icon: <Calendar size={20} /> }
]

export default function Result() {
    const [activeTab, setActiveTab] = useState('total')
    const [isCopied, setIsCopied] = useState(false)
    const [saju, setSaju] = useState(null)
    const [fortune, setFortune] = useState(null)

    const location = useLocation()
    const navigate = useNavigate()

    // Retrieve user data passed from Loading
    const userData = location.state || {
        name: '홍길동',
        gender: 'male',
        birthDate: '1990-01-15',
        birthTime: 'unknown',
        calendarType: 'solar'
    }

    useEffect(() => {
        // 사주 계산
        const calculatedSaju = calculateSaju(userData.birthDate, userData.birthTime)
        setSaju(calculatedSaju)

        // 2026년 운세 분석
        const fortuneAnalysis = analyze2026Fortune(calculatedSaju, userData.gender)
        setFortune(fortuneAnalysis)
    }, [userData])

    const handleShare = async () => {
        if (!fortune) return

        const shareData = {
            title: '2026년 정통 토정비결',
            text: `[${userData.name}]님의 2026년 운세가 도착했습니다.\n\n"${fortune.analysis.total.summary}"\n\n지금 바로 나의 대운을 확인해보세요.`,
            url: 'https://fortune-app.pages.dev'
        }

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log('Share canceled', err)
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
                alert('링크가 복사되었습니다. 카카오톡 채팅방에 붙여넣기 해보세요!')
            } catch (err) {
                console.error('Failed to copy:', err)
                alert('링크 복사에 실패했습니다.')
            }
        }
    }

    if (!saju || !fortune) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'total':
                return <TotalFortune data={fortune.analysis.total} saju={saju} fortune={fortune} />
            case 'wealth':
                return <FortuneSection data={fortune.analysis.wealth} />
            case 'health':
                return <FortuneSection data={fortune.analysis.health} />
            case 'love':
                return <FortuneSection data={fortune.analysis.love} />
            case 'career':
                return <FortuneSection data={fortune.analysis.career} />
            case 'monthly':
                return <MonthlyFortune data={fortune.analysis.monthly} />
            default:
                return null
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-20"
        >
            <Helmet>
                <title>{userData.name}님의 2026년 정통 토정비결</title>
                <meta name="description" content="2026년 당신의 운세를 정통 명리학으로 분석해드립니다." />
            </Helmet>

            {/* Header with Saju Info */}
            <header className="py-8 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-md">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 font-extrabold drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                        {userData.name}
                    </span> 님의
                </h1>
                <p className="text-lg text-white/80 font-light tracking-wide">2026년 병오년 토정비결</p>

                {/* Saju Display */}
                <div className="mt-6 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-sm mx-auto">
                    <div className="text-xs text-amber-300/80 mb-2 tracking-wider">사주명식 (四柱命式)</div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-black/20 rounded-lg p-2">
                            <div className="text-xs text-gray-400 mb-1">년주</div>
                            <div className="text-lg font-bold text-amber-300">{saju.year.gan}{saju.year.ji}</div>
                            <div className="text-xs text-gray-500">{saju.year.zodiac}띠</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                            <div className="text-xs text-gray-400 mb-1">월주</div>
                            <div className="text-lg font-bold text-white">{saju.month.gan}{saju.month.ji}</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2 ring-2 ring-amber-500/50">
                            <div className="text-xs text-amber-400 mb-1">일주</div>
                            <div className="text-lg font-bold text-amber-300">{saju.day.gan}{saju.day.ji}</div>
                            <div className="text-xs text-amber-400/80">{saju.ilganOhang}기운</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-2">
                            <div className="text-xs text-gray-400 mb-1">시주</div>
                            <div className="text-lg font-bold text-white">{saju.hour.gan}{saju.hour.ji}</div>
                        </div>
                    </div>

                    {/* Fortune Level */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="text-xs text-gray-400">2026년 운세:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full ${i <= fortune.fortuneLevel ? 'bg-amber-400' : 'bg-gray-600'}`}
                                />
                            ))}
                        </div>
                        <span className="text-amber-300 font-bold text-sm">{fortune.fortuneType}</span>
                    </div>
                </div>
            </header>

            {/* Scrollable Tabs */}
            <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-lg overflow-x-auto">
                <div className="flex min-w-max px-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 px-4 py-3 text-sm font-bold transition-all relative flex flex-col items-center gap-1 ${activeTab === tab.id
                                    ? 'text-amber-300'
                                    : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`}>
                                {tab.icon}
                            </div>
                            <span className="text-xs">{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <main className="p-4 sm:p-6 space-y-6 relative z-10">
                {/* Top Ad */}
                <AdBanner className="shadow-lg border border-white/5 rounded-xl overflow-hidden" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Middle Ad */}
                <AdBanner className="shadow-lg border border-white/5 rounded-xl overflow-hidden" />

                {/* Share Buttons */}
                <div className="grid grid-cols-1 gap-4 mt-8">
                    <button
                        onClick={handleShare}
                        className="w-full relative h-[60px] rounded-full bg-[#FEE500] text-[#3c1e1e] text-lg font-extrabold shadow-[4px_4px_12px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        {isCopied ? <Check size={24} /> : <Share2 size={20} />}
                        {isCopied ? '복사 완료!' : '카카오톡으로 공유하기'}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full relative h-[60px] rounded-full bg-[#3b3b3b] text-white text-lg font-bold shadow-[4px_4px_12px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={20} /> 다른 사람 운세 보기
                    </button>
                </div>
            </main>

            <footer className="px-6 py-8 text-center text-white/30 text-sm border-t border-white/5 mt-10 backdrop-blur-sm bg-black/20 space-y-3">
                <p>&copy; 2026 정통 명리학 연구소. All rights reserved.</p>
                <p className="text-xs">※ 본 운세는 전통 명리학에 기반한 참고용이며 법적 책임이 없습니다.</p>
                <div className="flex justify-center gap-4 text-xs text-gray-400 pt-2">
                    <a href="/privacy" className="hover:text-amber-300 transition-colors">개인정보처리방침</a>
                    <span className="text-gray-600">|</span>
                    <a href="/terms" className="hover:text-amber-300 transition-colors">이용약관</a>
                    <span className="text-gray-600">|</span>
                    <a href="/contact" className="hover:text-amber-300 transition-colors">문의하기</a>
                </div>
            </footer>
        </motion.div>
    )
}

// Total Fortune Component with Saju details
function TotalFortune({ data, saju, fortune }) {
    return (
        <div className="space-y-4">
            {/* Main Fortune Card */}
            <div className="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <h3 className="text-xl font-extrabold text-amber-300 mb-4 flex items-center gap-2">
                    <Sparkles size={20} />
                    {data.title}
                </h3>

                <div className="bg-gradient-to-r from-amber-500/20 to-transparent p-4 rounded-xl mb-4 border-l-4 border-amber-500">
                    <p className="text-white font-bold text-lg">{data.summary}</p>
                </div>

                <div className="text-gray-200 leading-loose whitespace-pre-wrap text-sm sm:text-base">
                    {data.content}
                </div>
            </div>

            {/* Ohang Balance */}
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4">오행 분포 (五行 分布)</h4>
                <div className="space-y-3">
                    {Object.entries(saju.ohangCount).map(([ohang, count]) => (
                        <div key={ohang} className="flex items-center gap-3">
                            <span className={`w-8 text-center font-bold ${ohang === '목' ? 'text-green-400' :
                                    ohang === '화' ? 'text-red-400' :
                                        ohang === '토' ? 'text-yellow-400' :
                                            ohang === '금' ? 'text-gray-300' :
                                                'text-blue-400'
                                }`}>{ohang}</span>
                            <div className="flex-1 bg-black/30 rounded-full h-4 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${ohang === '목' ? 'bg-green-500' :
                                            ohang === '화' ? 'bg-red-500' :
                                                ohang === '토' ? 'bg-yellow-500' :
                                                    ohang === '금' ? 'bg-gray-400' :
                                                        'bg-blue-500'
                                        }`}
                                    style={{ width: `${(count / 8) * 100}%` }}
                                />
                            </div>
                            <span className="text-gray-400 text-sm w-6">{count}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-gray-400">
                    ▪ 가장 강한 오행: <span className="text-amber-300">{saju.maxOhang}</span> |
                    보완이 필요한 오행: <span className="text-amber-300">{saju.minOhang}</span>
                </p>
            </div>
        </div>
    )
}

// Generic Fortune Section Component
function FortuneSection({ data }) {
    return (
        <div className="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-xl font-extrabold text-amber-300 mb-4">{data.title}</h3>

            <div className="bg-gradient-to-r from-amber-500/20 to-transparent p-4 rounded-xl mb-4 border-l-4 border-amber-500">
                <p className="text-white font-bold">{data.summary}</p>
            </div>

            <div className="text-gray-200 leading-loose whitespace-pre-wrap text-sm sm:text-base">
                {data.content}
            </div>
        </div>
    )
}

// Monthly Fortune Component
function MonthlyFortune({ data }) {
    const luckColors = {
        '대길': 'bg-amber-500 text-black',
        '상': 'bg-green-500 text-white',
        '길': 'bg-blue-500 text-white',
        '중': 'bg-gray-500 text-white',
        '주의': 'bg-red-500 text-white'
    }

    return (
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <h3 className="text-xl font-extrabold text-amber-300 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                2026년 월별 운세
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.map((month, index) => (
                    <div key={index} className="bg-black/20 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white">{month.month}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${luckColors[month.luck]}`}>
                                {month.luck}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">{month.description}</p>
                        <p className="text-xs text-amber-300/80 mt-1">{month.advice}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
