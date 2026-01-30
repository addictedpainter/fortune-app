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
            className="px-6 py-10"
        >
            <header className="text-center mb-10">
                <h1 className="text-4xl text-amber-400 mb-2 tracking-tight drop-shadow-md">2026년 정통 명리학</h1>
                <h2 className="text-5xl font-extrabold text-white drop-shadow-lg">토정비결</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-yellow-300 mx-auto mt-4 rounded-full"></div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-xl font-bold flex items-center gap-2 text-amber-200">
                        <User size={24} className="text-amber-400" /> 이름
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="이름을 입력하세요"
                        className="w-full h-[60px] bg-white/5 border border-white/30 rounded-xl px-4 focus:border-amber-400 outline-none text-2xl text-white placeholder-gray-400 transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                {/* Gender Choice */}
                <div className="space-y-2">
                    <label className="text-xl font-bold text-amber-200">성별</label>
                    <div className="flex gap-4">
                        {['male', 'female'].map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: g })}
                                className={`flex-1 h-[60px] text-2xl rounded-xl border transition-all font-bold ${formData.gender === g
                                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                                        : 'border-white/20 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {g === 'male' ? '남성' : '여성'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                    <label className="text-xl font-bold flex items-center gap-2 text-amber-200">
                        <Calendar size={24} className="text-amber-400" /> 생년월일
                    </label>
                    <div className="flex gap-2 mb-2">
                        {['solar', 'lunar'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFormData({ ...formData, calendarType: t })}
                                className={`flex-1 h-[44px] text-lg rounded-xl border transition-all ${formData.calendarType === t
                                        ? 'border-red-400 bg-red-500/30 text-red-200 shadow-[0_0_10px_rgba(248,113,113,0.3)]'
                                        : 'border-white/20 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {t === 'solar' ? '양력' : '음력'}
                            </button>
                        ))}
                    </div>
                    <input
                        type="date"
                        required
                        className="w-full h-[60px] bg-white/5 border border-white/30 rounded-xl px-4 focus:border-amber-400 outline-none text-2xl text-white placeholder-gray-400"
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        style={{ colorScheme: 'dark' }}
                    />
                </div>

                {/* Birth Time */}
                <div className="space-y-2">
                    <label className="text-xl font-bold flex items-center gap-2 text-amber-200">
                        <Clock size={24} className="text-amber-400" /> 태어난 시간 (선택)
                    </label>
                    <select
                        className="w-full h-[60px] bg-white/5 border border-white/30 rounded-xl px-4 focus:border-amber-400 outline-none text-2xl text-white appearance-none"
                        value={formData.birthTime}
                        onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    >
                        <option value="unknown" className="text-black">모름</option>
                        <option value="00:00" className="text-black">자시 (23:30~01:29)</option>
                        <option value="02:00" className="text-black">축시 (01:30~03:29)</option>
                        <option value="04:00" className="text-black">인시 (03:30~05:29)</option>
                        <option value="06:00" className="text-black">묘시 (05:30~07:29)</option>
                        <option value="08:00" className="text-black">진시 (07:30~09:29)</option>
                        <option value="10:00" className="text-black">사시 (09:30~11:29)</option>
                        <option value="12:00" className="text-black">오시 (11:30~13:29)</option>
                        <option value="14:00" className="text-black">미시 (13:30~15:29)</option>
                        <option value="16:00" className="text-black">신시 (15:30~17:29)</option>
                        <option value="18:00" className="text-black">유시 (17:30~19:29)</option>
                        <option value="20:00" className="text-black">술시 (19:30~21:29)</option>
                        <option value="22:00" className="text-black">해시 (21:30~23:29)</option>
                    </select>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        className="btn-large bg-gradient-to-r from-red-700 to-red-900 border border-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_35px_rgba(220,38,38,0.7)] text-shadow-md"
                    >
                        내 운세 무료로 확인하기
                    </button>
                </div>
            </form>

            <p className="text-center mt-8 text-white/40 text-sm">
                현직 명리학자들이 검증한 정통 데이터만을 사용합니다.
            </p>
        </motion.div>
    )
}
