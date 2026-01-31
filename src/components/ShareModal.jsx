import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Copy, Check, MessageCircle, Send } from 'lucide-react'
import html2canvas from 'html2canvas'

// 공유 카드 컴포넌트 (이미지로 변환될 카드)
function ShareCard({ childName, parentName, score, scoreLevel, date, relation }) {
    // 이름이 없을 경우 로컬스토리지에서 다시 한 번 시도 (최종 보루)
    const storedData = JSON.parse(localStorage.getItem('fortuneFamilyData') || '{}')
    const displayParentName = parentName || storedData?.parent?.name || storedData?.parentName || '부모'
    const displayChildName = childName || storedData?.child?.name || storedData?.childName || '자녀'

    return (
        <div
            id="share-card"
            className="w-[360px] h-[480px] p-8 flex flex-col relative overflow-hidden"
            style={{
                fontFamily: '"Noto Sans KR", system-ui, sans-serif',
                backgroundImage: 'url(/share-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* 어두운 오버레이로 가독성 확보 */}
            <div className="absolute inset-0 bg-slate-900/40 z-0" />

            <div className="text-center relative z-10 pt-4">
                <p className="text-amber-400 text-[10px] font-bold tracking-[0.4em] mb-2 drop-shadow-md">FAMILY FORTUNE 2026</p>
                <p className="text-white/60 text-[11px] mb-8 font-medium drop-shadow-md">{date}</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 bg-slate-900/60 rounded-[40px] border border-white/20 backdrop-blur-lg p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-8">
                    <p className="text-white text-[20px] mb-2 leading-snug" style={{ letterSpacing: '-0.03em' }}>
                        <span className="text-amber-300 font-bold">{displayParentName}</span>
                        <span className="text-white/80"> & </span>
                        <span className="text-amber-300 font-bold">{displayChildName}</span>
                    </p>
                    <p className="text-white/40 text-sm font-medium">환상적인 오늘의 궁합</p>
                </div>

                {/* 점수 원 - 컨테이너 자체가 완벽한 정사각형 flex 박스 */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                    {/* 글로우 효과 */}
                    <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl" />

                    {/* 테두리링 */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                        <circle cx="50" cy="50" r="46" stroke="#f59e0b" strokeWidth="4" fill="none" strokeDasharray="290" strokeDashoffset={290 - (290 * score / 100)} strokeLinecap="round" />
                    </svg>

                    {/* 내부 숫자 - 베이스라인 보정 없이 순수 중앙 정렬 */}
                    <div className="flex items-center justify-center">
                        <span className="text-[72px] font-black text-white leading-none tracking-[-0.05em]" style={{
                            fontFamily: 'system-ui, sans-serif',
                            fontVariantNumeric: 'tabular-nums',
                            lineHeight: 0.9
                        }}>{score}</span>
                        <span className="text-amber-400 font-bold text-lg ml-1 mt-6">점</span>
                    </div>
                </div>

                <div className="text-center w-full">
                    <p className="text-3xl font-black text-white mb-3 tracking-tight" style={{ color: score >= 85 ? '#4ade80' : score >= 70 ? '#60a5fa' : '#fbbf24' }}>{scoreLevel}</p>
                    <div className="inline-flex px-5 py-2 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-white/80 text-sm font-bold tracking-tight">{relation}</p>
                    </div>
                </div>
            </div>

            <div className="text-center relative z-10 pt-8 mt-auto">
                <p className="text-white/60 text-[9px] tracking-[0.5em] font-bold drop-shadow-md">FORTUNE-APP.PAGES.DEV</p>
            </div>
        </div>
    )
}

export default function ShareModal({ isOpen, onClose, childName, parentName, score, date, relation }) {
    const [copied, setCopied] = useState(false)
    const [generating, setGenerating] = useState(false)
    const shareCardRef = useRef(null)

    const getScoreLevel = (s) => {
        if (s >= 85) return '대길(大吉)'
        if (s >= 70) return '길(吉)'
        if (s >= 55) return '평(平)'
        return '주의(注意)'
    }

    const storedData = JSON.parse(localStorage.getItem('fortuneFamilyData') || '{}')
    const displayParentName = parentName || storedData?.parent?.name || storedData?.parentName || '부모'
    const displayChildName = childName || storedData?.child?.name || storedData?.childName || '자녀'

    const scoreLevel = getScoreLevel(score)
    const shareUrl = 'https://fortune-app.pages.dev'
    const shareText = `${displayParentName}님과 ${displayChildName}님의 오늘 운세는 "${scoreLevel}" (${score}점)입니다! 🔮✨`

    // 링크 복사
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // 폴백
            const textArea = document.createElement('textarea')
            textArea.value = `${shareText}\n\n${shareUrl}`
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // 이미지 생성 및 다운로드
    const generateImage = async () => {
        const cardElement = document.getElementById('share-card')
        if (!cardElement) {
            console.error('share-card element not found')
            return null
        }

        setGenerating(true)

        // 폰트 로딩 대기
        try {
            await document.fonts.ready
            console.log('Fonts loaded')
        } catch (e) {
            console.warn('Font loading check failed:', e)
        }

        // 렌더링 안정화를 위한 대기
        await new Promise(resolve => setTimeout(resolve, 500))

        try {
            const canvas = await html2canvas(cardElement, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
                logging: true, // 임시로 로깅 활성화
                allowTaint: true,
                letterRendering: true,
                // onclone 제거 - 이게 문제를 일으킬 수 있음
            })
            console.log('Canvas generated successfully')
            setGenerating(false)
            return canvas
        } catch (err) {
            console.error('Image generation failed:', err)
            setGenerating(false)
            return null
        }
    }

    // 이미지 다운로드
    const downloadImage = async () => {
        const canvas = await generateImage()
        if (canvas) {
            const fileName = `운세-${displayChildName}-${new Date().toISOString().split('T')[0]}.png`
            const link = document.createElement('a')
            link.download = fileName
            link.href = canvas.toDataURL('image/png')
            link.click()
        }
    }

    // 네이티브 공유 (모바일)
    const nativeShare = async () => {
        const canvas = await generateImage()

        if (navigator.share) {
            try {
                if (canvas && navigator.canShare) {
                    canvas.toBlob(async (blob) => {
                        const file = new File([blob], 'fortune.png', { type: 'image/png' })
                        if (navigator.canShare({ files: [file] })) {
                            await navigator.share({
                                title: '오늘의 운세',
                                text: shareText,
                                files: [file]
                            })
                        } else {
                            await navigator.share({
                                title: '오늘의 운세',
                                text: shareText,
                                url: shareUrl
                            })
                        }
                    })
                } else {
                    await navigator.share({
                        title: '오늘의 운세',
                        text: shareText,
                        url: shareUrl
                    })
                }
            } catch (err) {
                console.log('Share cancelled')
            }
        }
    }

    // 카카오톡 공유
    const shareKakao = () => {
        const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        window.open(kakaoUrl, '_blank', 'width=600,height=400')
    }

    // 페이스북 공유
    const shareFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        window.open(fbUrl, '_blank', 'width=600,height=400')
    }

    // 트위터 공유
    const shareTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
    }

    // 밴드 공유
    const shareBand = () => {
        const bandUrl = `https://band.us/plugin/share?body=${encodeURIComponent(shareText + '\n' + shareUrl)}`
        window.open(bandUrl, '_blank', 'width=600,height=400')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 배경 오버레이 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 z-50"
                    />

                    {/* 모달 */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto"
                    >
                        {/* 헤더 */}
                        <div className="sticky top-0 bg-slate-900 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Share2 size={22} />
                                공유하기
                            </h2>
                            <button onClick={onClose} className="text-white/60 hover:text-white p-1">
                                <X size={24} />
                            </button>
                        </div>

                        {/* 미리보기 카드 */}
                        <div className="px-6 py-4">
                            <p className="text-white/60 text-sm mb-3">공유될 이미지 미리보기</p>
                            <div className="flex justify-center">
                                <div className="transform scale-[0.65] origin-top">
                                    <ShareCard
                                        childName={childName}
                                        parentName={parentName}
                                        score={score}
                                        scoreLevel={scoreLevel}
                                        date={date}
                                        relation={relation}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 공유 버튼들 */}
                        <div className="px-6 pb-6">
                            {/* 플랫폼 공유 */}
                            <p className="text-white/60 text-sm mb-3">소셜 미디어에 공유</p>
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {/* 카카오톡 */}
                                <button
                                    onClick={shareKakao}
                                    className="flex flex-col items-center gap-2 p-3 bg-[#FEE500] hover:bg-[#FDD800] rounded-xl transition-colors"
                                >
                                    <MessageCircle size={28} className="text-[#3C1E1E]" />
                                    <span className="text-xs text-[#3C1E1E] font-medium">카카오톡</span>
                                </button>

                                {/* 밴드 */}
                                <button
                                    onClick={shareBand}
                                    className="flex flex-col items-center gap-2 p-3 bg-[#00C73C] hover:bg-[#00B335] rounded-xl transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                    </svg>
                                    <span className="text-xs text-white font-medium">밴드</span>
                                </button>

                                {/* 페이스북 */}
                                <button
                                    onClick={shareFacebook}
                                    className="flex flex-col items-center gap-2 p-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-xs text-white font-medium">페이스북</span>
                                </button>

                                {/* 트위터/X */}
                                <button
                                    onClick={shareTwitter}
                                    className="flex flex-col items-center gap-2 p-3 bg-black hover:bg-gray-900 rounded-xl transition-colors border border-white/20"
                                >
                                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    <span className="text-xs text-white font-medium">X</span>
                                </button>
                            </div>

                            {/* 기타 옵션 */}
                            <div className="space-y-3">
                                {/* 네이티브 공유 (모바일) */}
                                {typeof navigator !== 'undefined' && navigator.share && (
                                    <button
                                        onClick={nativeShare}
                                        disabled={generating}
                                        className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Send size={20} />
                                        {generating ? '이미지 생성 중...' : '다른 앱으로 공유'}
                                    </button>
                                )}

                                {/* 이미지 저장 */}
                                <button
                                    onClick={downloadImage}
                                    disabled={generating}
                                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                                >
                                    {generating ? '이미지 생성 중...' : '📷 이미지로 저장'}
                                </button>

                                {/* 링크 복사 */}
                                <button
                                    onClick={copyLink}
                                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={20} className="text-green-400" />
                                            <span className="text-green-400">복사 완료!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={20} />
                                            링크 복사
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 하단 안전 영역 */}
                        <div className="h-6" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
