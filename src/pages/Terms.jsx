import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
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

            <h1 className="text-3xl font-bold text-white mb-8">이용약관</h1>

            <div className="space-y-6 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">제1조 (목적)</h2>
                    <p>
                        본 약관은 "2026 토정비결" 서비스(이하 "서비스")의 이용조건 및 절차,
                        이용자와 서비스 제공자의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">제2조 (서비스의 내용)</h2>
                    <p>본 서비스는 전통 명리학에 기반한 운세 정보를 제공합니다:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                        <li>토정비결 운세</li>
                        <li>월별 운세</li>
                        <li>세부 운세 (재물, 건강, 연애 등)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">제3조 (면책조항)</h2>
                    <p>
                        본 서비스에서 제공하는 운세 정보는 오락 및 참고 목적으로만 제공됩니다.
                        운세 결과에 대한 맹신은 권장하지 않으며, 중요한 결정은 전문가와 상담하시기 바랍니다.
                    </p>
                    <p className="mt-2">
                        서비스 제공자는 운세 결과로 인한 어떠한 직간접적 손해에 대해서도 책임지지 않습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">제4조 (서비스 이용)</h2>
                    <p>
                        본 서비스는 무료로 제공되며, 별도의 회원가입 없이 이용 가능합니다.
                        서비스 내 광고가 표시될 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">제5조 (지식재산권)</h2>
                    <p>
                        본 서비스에서 제공하는 콘텐츠, 디자인, 로고 등 모든 지적재산권은
                        서비스 제공자에게 귀속됩니다. 무단 복제 및 배포를 금지합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">제6조 (약관의 변경)</h2>
                    <p>
                        본 약관은 2026년 1월 30일부터 시행됩니다.
                        약관이 변경될 경우 웹사이트를 통해 공지합니다.
                    </p>
                </section>
            </div>
        </motion.div>
    )
}
