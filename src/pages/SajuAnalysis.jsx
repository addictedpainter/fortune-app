import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { calculateSaju } from '../utils/saju'
import AdBanner from '../components/AdBanner'

const OHANG_PROPERTIES = {
    '목': { element: '木', color: '청색', direction: '동쪽', season: '봄', organ: '간/담', personality: '창의적, 진취적, 성장 지향' },
    '화': { element: '火', color: '적색', direction: '남쪽', season: '여름', organ: '심장/소장', personality: '열정적, 활발, 사교적' },
    '토': { element: '土', color: '황색', direction: '중앙', season: '환절기', organ: '비장/위장', personality: '안정적, 신뢰감, 중재자' },
    '금': { element: '金', color: '백색', direction: '서쪽', season: '가을', organ: '폐/대장', personality: '결단력, 의지력, 정의로움' },
    '수': { element: '水', color: '흑색', direction: '북쪽', season: '겨울', organ: '신장/방광', personality: '지혜로움, 유연함, 통찰력' }
}

const ILGAN_MEANINGS = {
    '갑': { name: '갑목(甲木)', symbol: '큰 나무', desc: '곧고 강직하며 리더십이 있습니다. 정의감이 강하고 독립적입니다.' },
    '을': { name: '을목(乙木)', symbol: '덩굴/꽃', desc: '유연하고 적응력이 뛰어납니다. 섬세하고 예술적 감각이 있습니다.' },
    '병': { name: '병화(丙火)', symbol: '태양', desc: '밝고 활발하며 카리스마가 있습니다. 낙천적이고 리더 기질이 있습니다.' },
    '정': { name: '정화(丁火)', symbol: '촛불', desc: '따뜻하고 섬세합니다. 직관력이 뛰어나고 배려심이 깊습니다.' },
    '무': { name: '무토(戊土)', symbol: '큰 산', desc: '믿음직하고 안정적입니다. 포용력이 크고 신뢰를 줍니다.' },
    '기': { name: '기토(己土)', symbol: '논밭', desc: '겸손하고 수용적입니다. 실용적이고 꾸준합니다.' },
    '경': { name: '경금(庚金)', symbol: '바위/광석', desc: '강하고 결단력이 있습니다. 의지가 굳고 정의로웁니다.' },
    '신': { name: '신금(辛金)', symbol: '보석', desc: '섬세하고 예리합니다. 완벽주의 성향이 있고 심미안이 뛰어납니다.' },
    '임': { name: '임수(壬水)', symbol: '큰 바다', desc: '포용력이 크고 지혜롭습니다. 통찰력이 있고 야심이 있습니다.' },
    '계': { name: '계수(癸水)', symbol: '시냇물', desc: '맑고 총명합니다. 감수성이 풍부하고 적응력이 좋습니다.' }
}

export default function SajuAnalysis() {
    const [saju, setSaju] = useState(null)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const saved = localStorage.getItem('fortuneUserData')
        if (saved) {
            const data = JSON.parse(saved)
            setUserData(data)
            const calculatedSaju = calculateSaju(data.birthDate, data.birthTime)
            setSaju(calculatedSaju)
        }
    }, [])

    if (!userData || !saju) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <Sparkles className="text-amber-400 w-16 h-16 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">먼저 정보를 입력해주세요</h2>
                <Link
                    to="/"
                    className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-full font-bold text-lg"
                >
                    정보 입력하러 가기
                </Link>
            </div>
        )
    }

    const ilganInfo = ILGAN_MEANINGS[saju.ilgan]
    const ohangProps = OHANG_PROPERTIES[saju.ilganOhang]

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
                    <h1 className="text-2xl font-bold text-white">상세 사주 분석</h1>
                    <p className="text-gray-400 text-sm">{userData.name}님의 사주팔자</p>
                </div>
            </div>

            {/* 사주팔자 Display */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-6">
                <h3 className="text-sm text-amber-300/80 mb-4 text-center tracking-wider">사주명식 (四柱命式)</h3>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: '년주(年柱)', data: saju.year, sub: saju.year.zodiac + '띠' },
                        { label: '월주(月柱)', data: saju.month, sub: '' },
                        { label: '일주(日柱)', data: saju.day, sub: '본인', highlight: true },
                        { label: '시주(時柱)', data: saju.hour, sub: '' }
                    ].map((col, i) => (
                        <div
                            key={i}
                            className={`text-center p-3 rounded-xl ${col.highlight ? 'bg-amber-500/20 ring-2 ring-amber-500/50' : 'bg-black/20'}`}
                        >
                            <p className="text-xs text-gray-400 mb-2">{col.label}</p>
                            <div className="space-y-1">
                                <p className={`text-2xl font-bold ${col.highlight ? 'text-amber-300' : 'text-white'}`}>
                                    {col.data.gan}
                                </p>
                                <p className="text-xl text-gray-300">{col.data.ji}</p>
                            </div>
                            {col.sub && <p className="text-xs text-amber-400/80 mt-2">{col.sub}</p>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Ad */}
            <AdBanner className="mb-6 rounded-xl overflow-hidden" />

            {/* 일간 분석 */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4">📌 일간(日干) 분석 - 당신의 본질</h3>
                <div className="bg-black/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl font-bold text-amber-300">{saju.ilgan}</span>
                        <div>
                            <p className="font-bold text-white">{ilganInfo.name}</p>
                            <p className="text-sm text-gray-400">{ilganInfo.symbol}의 기운</p>
                        </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{ilganInfo.desc}</p>
                </div>
            </div>

            {/* 오행 분석 */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4">🌟 오행(五行) 특성</h3>

                {/* 오행 분포 차트 */}
                <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-3">사주 내 오행 분포</p>
                    <div className="space-y-2">
                        {Object.entries(saju.ohangCount).map(([ohang, count]) => (
                            <div key={ohang} className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${ohang === '목' ? 'bg-green-500' :
                                        ohang === '화' ? 'bg-red-500' :
                                            ohang === '토' ? 'bg-yellow-500' :
                                                ohang === '금' ? 'bg-gray-300 text-gray-800' :
                                                    'bg-blue-500'
                                    }`}>{ohang}</span>
                                <div className="flex-1 bg-black/30 rounded-full h-3">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / 8) * 100}%` }}
                                        transition={{ duration: 0.8 }}
                                        className={`h-full rounded-full ${ohang === '목' ? 'bg-green-500' :
                                                ohang === '화' ? 'bg-red-500' :
                                                    ohang === '토' ? 'bg-yellow-500' :
                                                        ohang === '금' ? 'bg-gray-300' :
                                                            'bg-blue-500'
                                            }`}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm w-4">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 주요 오행 특성 */}
                <div className="bg-black/20 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">당신의 주요 오행: {saju.ilganOhang}({ohangProps.element})</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">색상:</span> <span className="text-white">{ohangProps.color}</span></div>
                        <div><span className="text-gray-500">방위:</span> <span className="text-white">{ohangProps.direction}</span></div>
                        <div><span className="text-gray-500">계절:</span> <span className="text-white">{ohangProps.season}</span></div>
                        <div><span className="text-gray-500">장기:</span> <span className="text-white">{ohangProps.organ}</span></div>
                    </div>
                    <p className="text-amber-300/80 text-sm mt-3">✨ {ohangProps.personality}</p>
                </div>
            </div>

            {/* 강약 분석 */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-6">
                <h3 className="text-lg font-bold text-amber-300 mb-4">⚖️ 오행 균형 분석</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                        <p className="text-xs text-gray-400 mb-1">가장 강한 오행</p>
                        <p className="text-xl font-bold text-green-400">{saju.maxOhang}</p>
                        <p className="text-xs text-gray-400 mt-1">이 기운이 풍부합니다</p>
                    </div>
                    <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                        <p className="text-xs text-gray-400 mb-1">보완 필요 오행</p>
                        <p className="text-xl font-bold text-red-400">{saju.minOhang}</p>
                        <p className="text-xs text-gray-400 mt-1">보완하면 좋습니다</p>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-black/20 rounded-xl">
                    <p className="text-sm text-gray-300">
                        💡 <strong className="text-amber-300">{saju.minOhang}({OHANG_PROPERTIES[saju.minOhang].element})</strong> 기운을 보완하려면{' '}
                        <strong className="text-white">{OHANG_PROPERTIES[saju.minOhang].color}</strong> 계열을 활용하고,{' '}
                        <strong className="text-white">{OHANG_PROPERTIES[saju.minOhang].direction}</strong> 방향을 염두에 두세요.
                    </p>
                </div>
            </div>

            {/* Ad */}
            <AdBanner className="mb-6 rounded-xl overflow-hidden" />

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3">
                <Link
                    to="/daily"
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold py-4 rounded-xl text-center transition-colors border border-amber-500/30"
                >
                    오늘의 운세
                </Link>
                <Link
                    to="/compatibility"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl text-center transition-colors border border-white/10"
                >
                    궁합 보기
                </Link>
            </div>
        </motion.div>
    )
}
