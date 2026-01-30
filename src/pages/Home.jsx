import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Clock } from 'lucide-react'

export default function Home() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: 'unknown',
        calendarType: 'solar',
        gender: 'male'
    })

    // Data Passing: Pass formData to the next page via state
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.birthDate) {
            alert('이름과 생년월일을 모두 입력해주세요.')
            return
        }
        navigate('/loading', { state: formData })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 sm:px-6 py-6 sm:py-10"
        >
            <header className="text-center mb-6 sm:mb-10">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight drop-shadow-md text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-400">2026년 정통 명리학</h1>
                <h2 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-2xl mt-3 sm:mt-4">토정비결</h2>
                <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 mx-auto mt-4 sm:mt-6 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]"></div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8 bg-white/5 backdrop-blur-[20px] p-5 sm:p-8 rounded-[30px] sm:rounded-[40px] border border-white/10 border-t-white/20 border-l-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Name Input */}
                <div className="space-y-3">
                    <label className="text-lg font-bold flex items-center gap-2 text-gray-200 pl-2">
                        <User size={20} className="text-amber-300" /> 이름
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="이름을 입력하세요"
                        className="w-full h-[60px] bg-black/20 border-none rounded-3xl px-6 outline-none text-xl text-white placeholder-white/20 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_8px_rgba(255,255,255,0.05)] focus:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.6)] transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Gender Choice - Segmented Control */}
                <div className="space-y-3">
                    <label className="text-lg font-bold text-gray-200 pl-2">성별</label>
                    <div className="flex p-1.5 bg-black/30 rounded-full shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),1px_1px_0px_rgba(255,255,255,0.1)_border-b]">
                        {['male', 'female'].map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: g })}
                                className={`flex-1 h-[50px] rounded-full text-lg font-bold transition-all duration-300 ${formData.gender === g
                                    ? 'bg-[#3b3b3b] text-white shadow-[4px_4px_10px_rgba(0,0,0,0.5),inset_1px_1px_0_rgba(255,255,255,0.2)] bg-gradient-to-br from-white/10 to-transparent'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {g === 'male' ? '남성' : '여성'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Birth Date */}
                <div className="space-y-3">
                    <label className="text-lg font-bold flex items-center gap-2 text-gray-200 pl-2">
                        <Calendar size={20} className="text-amber-300" /> 생년월일
                    </label>

                    {/* Calendar Type Segmented Control */}
                    <div className="flex p-1.5 bg-black/30 rounded-full shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),1px_1px_0px_rgba(255,255,255,0.1)_border-b] mb-3">
                        {['solar', 'lunar'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFormData({ ...formData, calendarType: t })}
                                className={`flex-1 h-[40px] rounded-full text-base font-bold transition-all duration-300 ${formData.calendarType === t
                                    ? 'bg-[#3b3b3b] text-white shadow-[3px_3px_8px_rgba(0,0,0,0.5),inset_1px_1px_0_rgba(255,255,255,0.2)] bg-gradient-to-br from-white/10 to-transparent'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {t === 'solar' ? '양력' : '음력'}
                            </button>
                        ))}
                    </div>

                    <input
                        type="date"
                        required
                        className="w-full h-[60px] bg-black/20 border-none rounded-3xl px-6 outline-none text-xl text-white shadow-[inset_2px_2px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_8px_rgba(255,255,255,0.05)] focus:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.6)] transition-all"
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        style={{ colorScheme: 'dark' }}
                    />
                </div>

                {/* Birth Time */}
                <div className="space-y-3">
                    <label className="text-lg font-bold flex items-center gap-2 text-gray-200 pl-2">
                        <Clock size={20} className="text-amber-300" /> 태어난 시간
                    </label>
                    <div className="relative">
                        <select
                            className="w-full h-[60px] bg-black/20 border-none rounded-3xl px-6 outline-none text-xl text-white appearance-none shadow-[inset_2px_2px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_8px_rgba(255,255,255,0.05)] focus:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.6)] transition-all"
                            value={formData.birthTime}
                            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                        >
                            <option value="unknown" className="text-black bg-gray-800">모름</option>
                            <option value="00:00" className="text-black bg-gray-800">자시 (23:30~01:29)</option>
                            <option value="02:00" className="text-black bg-gray-800">축시 (01:30~03:29)</option>
                            <option value="04:00" className="text-black bg-gray-800">인시 (03:30~05:29)</option>
                            <option value="06:00" className="text-black bg-gray-800">묘시 (05:30~07:29)</option>
                            <option value="08:00" className="text-black bg-gray-800">진시 (07:30~09:29)</option>
                            <option value="10:00" className="text-black bg-gray-800">사시 (09:30~11:29)</option>
                            <option value="12:00" className="text-black bg-gray-800">오시 (11:30~13:29)</option>
                            <option value="14:00" className="text-black bg-gray-800">미시 (13:30~15:29)</option>
                            <option value="16:00" className="text-black bg-gray-800">신시 (15:30~17:29)</option>
                            <option value="18:00" className="text-black bg-gray-800">유시 (17:30~19:29)</option>
                            <option value="20:00" className="text-black bg-gray-800">술시 (19:30~21:29)</option>
                            <option value="22:00" className="text-black bg-gray-800">해시 (21:30~23:29)</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">▼</div>
                    </div>
                </div>

                <div className="pt-8 mb-4">
                    <button
                        type="submit"
                        className="w-full relative h-[70px] rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white text-2xl font-bold shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        <span>내 운세 확인하기</span>
                        <span className="bg-black/20 rounded-full p-1 group-hover:bg-black/30 transition-colors">
                            <span className="block text-sm">➔</span>
                        </span>
                    </button>
                    <div className="text-center mt-6">
                        <span className="text-white/30 text-xs tracking-widest uppercase">Traditional Fortune Teller</span>
                    </div>
                </div>
            </form>

            <p className="text-center mt-8 text-gray-300/60 text-sm font-light tracking-wider">
                현직 명리학자들이 검증한 정통 데이터만을 사용합니다.
            </p>

            {/* Footer Links */}
            <footer className="mt-8 pb-10 text-center space-y-3">
                <div className="flex justify-center gap-4 text-xs text-gray-400">
                    <a href="/privacy" className="hover:text-amber-300 transition-colors">개인정보처리방침</a>
                    <span className="text-gray-600">|</span>
                    <a href="/terms" className="hover:text-amber-300 transition-colors">이용약관</a>
                    <span className="text-gray-600">|</span>
                    <a href="/contact" className="hover:text-amber-300 transition-colors">문의하기</a>
                </div>
                <p className="text-gray-500 text-xs">© 2026 토정비결. All rights reserved.</p>
            </footer>
        </motion.div>
    )
}
