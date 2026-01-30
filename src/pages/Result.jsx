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
                {/* Header Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/50 mix-blend-overlay"></div>

                <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-md">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 text-3xl font-extrabold drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{userData.name}</span> 님의
                </h1>
                <p className="text-xl text-white/80 font-light tracking-wide">2026년 정통 토정비결 분석 결과</p>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]"></div>
            </header>

            {/* Sticky Glass Tabs */}
            <div className="flex bg-white/5 backdrop-blur-[20px] sticky top-0 z-50 border-b border-white/10 shadow-lg items-center justify-around px-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-lg font-bold transition-all relative flex flex-col items-center gap-1 ${activeTab === tab.id
                            ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.6)]'
                            : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`}>
                            {tab.icon}
                        </div>
                        <span className="text-sm">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <main className="p-6 space-y-8 relative z-10">

                {/* Top Ad */}
                <AdBanner className="mb-6 shadow-lg border border-white/5 rounded-xl overflow-hidden" />

                <AnimatePresence mode="wait">
                    <motion.section
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white/5 backdrop-blur-[20px] p-8 rounded-3xl border border-white/10 border-t-white/20 border-l-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden"
                    >
                        {/* Inner Card Glow */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-400 mb-6 border-b border-white/10 pb-4 tracking-tight drop-shadow-sm flex items-center gap-2">
                            {TABS.find(t => t.id === activeTab).icon}
                            {FORTUNE_DATA[activeTab].title}
                        </h3>
                        <p className="text-lg leading-loose text-gray-100/90 font-light whitespace-pre-wrap tracking-wide drop-shadow-sm">
                            {FORTUNE_DATA[activeTab].content}
                        </p>

                        <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/5 text-center">
                            <p className="text-amber-300 font-bold text-sm mb-1">💡 핵심 요약</p>
                            <p className="text-white/80 font-medium">"{FORTUNE_DATA[activeTab].summary}"</p>
                        </div>
                    </motion.section>
                </AnimatePresence>

                {/* Middle Ad */}
                <AdBanner className="my-8 shadow-lg border border-white/5 rounded-xl overflow-hidden" />

                {/* Viral Buttons */}
                <div className="grid grid-cols-1 gap-5 mt-10">
                    <button
                        onClick={handleShare}
                        className="w-full relative h-[70px] rounded-full bg-[#FEE500] text-[#3c1e1e] text-xl font-extrabold shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        {isCopied ? <Check size={28} /> : <Share2 size={24} />}
                        {isCopied ? '복사 완료!' : '카카오톡으로 공유하기'}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full relative h-[70px] rounded-full bg-[#3b3b3b] text-white text-xl font-bold shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.2)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={24} /> 처음으로 돌아가기
                    </button>
                </div>
            </main>

            <footer className="px-6 py-8 text-center text-white/30 text-base border-t border-white/5 mt-10 backdrop-blur-sm bg-black/20 space-y-3">
                <p>&copy; 2026 정통 명리학 연구소. All rights reserved.</p>
                <p className="text-sm">※ 본 운세는 참고용이며 법적 책임이 없습니다.</p>
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
