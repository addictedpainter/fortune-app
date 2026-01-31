import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Copy, Check } from 'lucide-react'

export default function ShareModal({ isOpen, onClose, childName, parentName, score, date, relation }) {
    const [copied, setCopied] = useState(false)

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
    const fullShareText = `${shareText}\n\n${shareUrl}`

    // 링크 복사
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullShareText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // 폴백
            const textArea = document.createElement('textarea')
            textArea.value = fullShareText
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // 네이티브 공유 (모바일 & 최신 브라우저)
    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '🔮 2026 토정비결 운세',
                    text: shareText,
                    url: shareUrl
                })
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.log('Share error:', err)
                }
            }
        } else {
            // 지원하지 않는 브라우저는 링크 복사
            copyLink()
        }
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

                        {/* 공유 내용 미리보기 */}
                        <div className="px-6 py-6">
                            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6">
                                <div className="text-center mb-4">
                                    <p className="text-white text-xl mb-2">
                                        <span className="text-amber-300 font-bold">{displayParentName}</span>
                                        <span className="text-white/80"> & </span>
                                        <span className="text-amber-300 font-bold">{displayChildName}</span>
                                    </p>
                                    <p className="text-white/60 text-sm">{date}</p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mb-3">
                                        <span className="text-4xl font-black text-white">{score}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-amber-300 mb-2">{scoreLevel}</p>
                                    <p className="text-white/70 text-sm">{relation}</p>
                                </div>
                            </div>
                        </div>

                        {/* 공유 버튼들 */}
                        <div className="px-6 pb-8">
                            <div className="space-y-3">
                                {/* 메인 공유 버튼 (네이티브 공유) */}
                                <button
                                    onClick={nativeShare}
                                    className="w-full py-5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg text-lg"
                                >
                                    <Share2 size={24} />
                                    {navigator.share ? '카카오톡, 문자 등으로 공유하기' : '공유하기'}
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
                                            링크 복사하기
                                        </>
                                    )}
                                </button>

                                {/* 안내 문구 */}
                                <p className="text-white/40 text-xs text-center pt-2">
                                    {navigator.share
                                        ? '위 버튼을 누르면 카카오톡, 문자, 이메일 등 원하는 앱을 선택할 수 있습니다.'
                                        : '링크를 복사한 후 카카오톡이나 문자로 붙여넣기 해주세요.'}
                                </p>
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
