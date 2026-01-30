import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react'

export default function Contact() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 py-8 pb-20"
        >
            <Link to="/" className="inline-flex items-center gap-2 text-amber-300 mb-6 hover:text-amber-200 transition-colors">
                <ArrowLeft size={20} />
                <span>홈으로 돌아가기</span>
            </Link>

            <h1 className="text-3xl font-bold text-white mb-8">문의하기</h1>

            <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <Mail className="text-amber-300" size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">이메일 문의</h3>
                            <p className="text-gray-400 text-sm">일반 문의 및 제안</p>
                        </div>
                    </div>
                    <a
                        href="mailto:contact@fortune-app.pages.dev"
                        className="block w-full text-center py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl font-bold transition-colors"
                    >
                        contact@fortune-app.pages.dev
                    </a>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="text-blue-300" size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">피드백</h3>
                            <p className="text-gray-400 text-sm">서비스 개선 의견</p>
                        </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        2026 토정비결 서비스를 이용해 주셔서 감사합니다.
                        더 나은 서비스를 위해 여러분의 소중한 의견을 기다립니다.
                    </p>
                </div>

                <div className="text-center text-gray-500 text-sm mt-8">
                    <p>문의에 대한 답변은 영업일 기준 1-3일 이내에 드립니다.</p>
                </div>
            </div>
        </motion.div>
    )
}
