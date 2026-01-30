import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const loadingMessages = [
    "생년월일 정보를 분석 중입니다...",
    "사주 명식을 대입하는 중입니다...",
    "올해의 길흉화복을 점치고 있습니다...",
    "대운과 세운의 흐름을 파악하는 중입니다...",
    "거의 다 되었습니다. 결과를 정리 중입니다..."
]

export default function Loading() {
    const navigate = useNavigate()
    const location = useLocation()
    const [messageIndex, setMessageIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    // Retrieve user data passed from Home
    const userData = location.state || { name: '방문자', gender: 'male' }

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev))
        }, 1500)

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    // Pass data to Result page
                    setTimeout(() => navigate('/result', { state: userData }), 500)
                    return 100
                }
                return prev + 1.25 // Roughly 8 seconds to reach 100
            })
        }, 100)

        return () => {
            clearInterval(messageInterval)
            clearInterval(progressInterval)
        }
    }, [navigate, userData])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-10 text-center">
            {/* Traditional Rotating Icon with Glow */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 mb-12 relative flex items-center justify-center"
            >
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full blur-sm"></div>
                <div className="absolute inset-0 border-4 border-amber-400 rounded-full border-t-transparent shadow-[0_0_20px_rgba(251,191,36,0.4)]"></div>
                <div className="text-amber-400 font-bold text-5xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">命</div>
            </motion.div>

            <div className="w-full space-y-8 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-2xl font-bold text-white h-16 flex items-center justify-center leading-relaxed drop-shadow-md"
                    >
                        {loadingMessages[messageIndex]}
                    </motion.p>
                </AnimatePresence>

                <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></motion.div>
                </div>

                <p className="text-xl text-amber-300 font-bold tracking-widest">
                    {Math.min(100, Math.floor(progress))}% 완료
                </p>
            </div>

            <div className="mt-16 text-white/50">
                <p className="animate-pulse">데이터를 정밀 분석하는 동안 잠시만 기다려주세요.</p>
                <p className="text-sm mt-2">※ 뒤로가기 버튼을 누르지 마세요.</p>
            </div>
        </div>
    )
}
