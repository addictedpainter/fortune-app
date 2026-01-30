import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Privacy() {
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

            <h1 className="text-3xl font-bold text-white mb-8">개인정보처리방침</h1>

            <div className="space-y-6 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">1. 개인정보의 수집 및 이용 목적</h2>
                    <p>본 서비스는 운세 조회를 위해 다음과 같은 정보를 수집합니다:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                        <li>이름 (닉네임)</li>
                        <li>생년월일</li>
                        <li>성별</li>
                        <li>태어난 시간 (선택)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">2. 개인정보의 보유 및 이용 기간</h2>
                    <p>
                        입력하신 정보는 서버에 저장되지 않으며, 운세 결과 생성 후 즉시 삭제됩니다.
                        모든 처리는 사용자의 브라우저 내에서만 이루어집니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">3. 개인정보의 제3자 제공</h2>
                    <p>
                        본 서비스는 사용자의 개인정보를 제3자에게 제공하지 않습니다.
                        다만, 광고 서비스(Google AdSense)를 통해 쿠키 기반의 광고가 표시될 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">4. 쿠키(Cookie) 사용</h2>
                    <p>
                        본 서비스는 Google AdSense 광고를 위해 쿠키를 사용합니다.
                        사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">5. 개인정보 보호책임자</h2>
                    <p>개인정보 관련 문의사항은 아래 연락처로 문의해 주시기 바랍니다.</p>
                    <p className="mt-2 text-gray-400">이메일: privacy@fortune-app.pages.dev</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-amber-300 mb-3">6. 정책 변경</h2>
                    <p>
                        본 개인정보처리방침은 2026년 1월 30일부터 적용됩니다.
                        정책이 변경될 경우 웹사이트를 통해 공지합니다.
                    </p>
                </section>
            </div>
        </motion.div>
    )
}
