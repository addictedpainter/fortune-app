import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, RefreshCw, Smartphone, TrendingUp, Heart, Check } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import AdBanner from '../components/AdBanner'

const TABS = [
    { id: 'total', label: '총운', icon: <Smartphone /> },
    { id: 'wealth', label: '재물운', icon: <TrendingUp /> },
    { id: 'health', label: '건강/자녀', icon: <Heart /> }
]

const FORTUNE_DATA = {
    total: {
        title: "2026년 당신의 총체적 흐름",
        content: "올해는 '천우신조(天佑神助)'의 기운이 깃들어 있습니다. 막혔던 일들이 서서히 풀리기 시작하며, 특히 가을철 이후로는 노력했던 바가 큰 결실을 맺게 될 것입니다. 주변 사람들과의 관계에서 겸허함을 유지한다면 더 큰 복이 찾아옵니다.",
        summary: "2026년, 귀인의 도움으로 대운이 트이는 해"
    },
    wealth: {
        title: "재물과 사업의 기운",
        content: "동쪽에서 귀인이 나타나 재물운의 길을 열어줄 상입니다. 무리한 투자보다는 현재 가지고 있는 자산을 지키는 '수성(守城)'의 자세가 필요합니다. 하반기에는 뜻밖의 횡재수가 있으니 작은 기회도 놓치지 마십시오.",
        summary: "재물을 지키면 하반기에 큰 횡재수가 따를 운"
    },
    health: {
        title: "건강과 자녀의 소식",
        content: "건강상 큰 화는 없으나 소화기 계통의 관리가 필요합니다. 자녀에게는 경사스러운 소식이 들려올 수 있으니 부모로서 아낌없는 축하를 보내주십시오. 가정의 평화가 곧 운의 완성입니다.",
        summary: "가정이 화목하고 자녀에게 경사가 생길 운"
    }
}

export default function Result() {
    const [activeTab, setActiveTab] = useState('total')
    const [isCopied, setIsCopied] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    // Retrieve user data passed from Loading, fallback if missing (e.g. direct access)
    const userData = location.state || { name: '홍길동', gender: 'male' }

    const handleShare = async () => {
        const shareData = {
            title: '2026년 정통 토정비결',
            text: `[${userData.name}]님의 2026년 운세가 도착했습니다.\n\n"${FORTUNE_DATA.total.summary}"\n\n지금 바로 나의 대운을 확인해보세요.`,
            url: window.location.href
        }

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.log('Share canceled', err)
            }
        } else {
            // Fallback: Copy Link
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-20"
        >
            <Helmet>
                <title>{userData.name}님의 2026년 정통 토정비결</title>
                <meta name="description" content="2026년 당신의 운세를 정통 명리학으로 분석해드립니다." />
                <meta property="og:title" content={`${userData.name}님의 대운이 트이는 해 - 정통 토정비결`} />
                <meta property="og:description" content="신년 운세 결과가 도착했습니다. 지금 확인해보세요!" />
                <meta property="og:image" content="https://res.cloudinary.com/practicaldev/image/fetch/s--yHpR3q9c--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/123456789/placeholder_fortune_og.png" />
            </Helmet>

            <header className="py-10 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/50 mix-blend-overlay"></div>
                <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-md">
                    <span className="text-amber-400">{userData.name}</span> 님의
                </h1>
                <p className="text-xl text-white/80 font-light">2026년 정통 토정비결 분석 결과</p>
                <div className="w-12 h-1 bg-amber-500 mx-auto mt-6 rounded-full"></div>
            </header>

            {/* Tabs */}
            <div className="flex bg-white/5 backdrop-blur-md sticky top-0 z-10 border-b border-white/10 shadow-lg">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-xl font-bold transition-all relative ${activeTab === tab.id
                                ? 'text-amber-400'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-1 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <main className="p-6 space-y-8">

                {/* Top Ad */}
                <AdBanner className="mb-6 shadow-lg border border-white/5" />

                <AnimatePresence mode="wait">
                    <motion.section
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 opacity-50"></div>

                        <h3 className="text-2xl font-extrabold text-amber-300 mb-6 border-b border-white/10 pb-4 tracking-tight drop-shadow-sm">
                            {FORTUNE_DATA[activeTab].title}
                        </h3>
                        <p className="text-xl leading-loose text-white font-light whitespace-pre-wrap tracking-wide">
                            {FORTUNE_DATA[activeTab].content}
                        </p>
                    </motion.section>
                </AnimatePresence>

                {/* Middle Ad */}
                <AdBanner className="my-8 shadow-lg border border-white/5" />

                {/* Viral Buttons */}
                <div className="grid grid-cols-1 gap-4 mt-10">
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-3 bg-[#FEE500] text-[#3c1e1e] py-5 rounded-xl text-2xl font-extrabold shadow-[0_0_20px_rgba(254,229,0,0.3)] active:scale-95 transition-transform"
                    >
                        {isCopied ? <Check size={28} /> : <Share2 size={28} />}
                        {isCopied ? '링크가 복사되었습니다!' : '카카오톡으로 운세 공유하기'}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white py-5 rounded-xl text-2xl font-extrabold shadow-lg hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
                    >
                        <RefreshCw size={28} /> 자녀 운세 봐주기 (다시 하기)
                    </button>
                </div>
            </main>

            <footer className="px-6 py-10 text-center text-white/30 text-lg border-t border-white/5 mt-10">
                <p>&copy; 2026 정통 명리학 연구소. All rights reserved.</p>
                <p className="text-sm mt-2">※ 본 운세는 참고용이며 법적 책임이 없습니다.</p>
                <AdBanner className="mt-8 opacity-50 scale-90" />
            </footer>
        </motion.div>
    )
}
