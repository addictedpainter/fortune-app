import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const loadingMessages = [
    "부모님의 사주를 분석하고 있습니다...",
    "자녀의 사주를 풀이하고 있습니다...",
    "오행의 기운을 살피고 있습니다...",
    "부모와 자녀의 기운을 연결하고 있습니다...",
    "오늘의 운세를 도출하고 있습니다..."
]

export default function Loading() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/result', { state: location.state })
        }, 3500)

        return () => clearTimeout(timer)
    }, [navigate, location.state])

    return (
        <div className="min-h-screen relative flex items-center justify-center">
            {/* 배경 */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/bg-mountain.png)' }}
            />
            <div className="fixed inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />

            <div className="relative z-10 text-center px-8">
                {/* 음양 로딩 애니메이션 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-32 h-32 mx-auto mb-10"
                >
                    {/* 외곽 원 */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-amber-400/30"
                    />

                    {/* 음양 심볼 */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 flex items-center justify-center"
                    >
                        <div className="w-full h-full rounded-full bg-gradient-to-b from-white to-slate-900 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1/2 h-full bg-slate-900" />
                            <div className="absolute top-[25%] left-1/4 w-6 h-6 rounded-full bg-white" />
                            <div className="absolute bottom-[25%] right-1/4 w-6 h-6 rounded-full bg-slate-900" />
                        </div>
                    </motion.div>

                    {/* 빛나는 효과 */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"
                    />
                </motion.div>

                {/* 로딩 메시지 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-serif">
                        운세를 풀이하고 있습니다
                    </h2>

                    <div className="space-y-2">
                        {loadingMessages.map((msg, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.6 + 0.5 }}
                                className="text-lg text-white/70"
                            >
                                {msg}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>

                {/* 프로그레스 바 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 max-w-xs mx-auto"
                >
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3.2, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
