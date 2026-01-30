import { useState, useEffect, memo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Users, Clock, ChevronDown, Sparkles, Heart, CalendarDays, UserCircle } from 'lucide-react'

// 연도 생성 (1930 ~ 현재)
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1930 + 1 }, (_, i) => currentYear - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

// 시간 옵션 (12지시)
const birthTimeOptions = [
    { value: 'unknown', label: '모름' },
    { value: '00:00', label: '자시 (23:30~01:29)' },
    { value: '02:00', label: '축시 (01:30~03:29)' },
    { value: '04:00', label: '인시 (03:30~05:29)' },
    { value: '06:00', label: '묘시 (05:30~07:29)' },
    { value: '08:00', label: '진시 (07:30~09:29)' },
    { value: '10:00', label: '사시 (09:30~11:29)' },
    { value: '12:00', label: '오시 (11:30~13:29)' },
    { value: '14:00', label: '미시 (13:30~15:29)' },
    { value: '16:00', label: '신시 (15:30~17:29)' },
    { value: '18:00', label: '유시 (17:30~19:29)' },
    { value: '20:00', label: '술시 (19:30~21:29)' },
    { value: '22:00', label: '해시 (21:30~23:29)' },
]

// Select 컴포넌트 (외부 정의)
const SelectField = memo(({ value, onChange, options, className = '' }) => (
    <div className="relative">
        <select
            value={value}
            onChange={onChange}
            className={`w-full h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 pr-10 text-lg text-white appearance-none cursor-pointer transition-all hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400/50 ${className}`}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                    {opt.label}
                </option>
            ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={20} />
    </div>
))
SelectField.displayName = 'SelectField'

// 입력 섹션 컴포넌트 (외부 정의, memo 적용)
const PersonSection = memo(({ title, icon: Icon, data, setData, isChild = false }) => {
    const handleNameChange = (e) => {
        setData(prev => ({ ...prev, name: e.target.value }))
    }

    const handleGenderChange = (gender) => {
        setData(prev => ({ ...prev, gender }))
    }

    const handleYearChange = (e) => {
        setData(prev => ({ ...prev, year: e.target.value }))
    }

    const handleMonthChange = (e) => {
        setData(prev => ({ ...prev, month: e.target.value }))
    }

    const handleDayChange = (e) => {
        setData(prev => ({ ...prev, day: e.target.value }))
    }

    const handleTimeChange = (e) => {
        setData(prev => ({ ...prev, birthTime: e.target.value }))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isChild ? 0.2 : 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Icon className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>

            {/* 이름 입력 */}
            <div className="mb-5">
                <label className="block text-lg text-white/80 mb-2 font-medium">이름</label>
                <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={data.name}
                    onChange={handleNameChange}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 text-lg text-white placeholder-white/40 transition-all hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
            </div>

            {/* 성별 선택 */}
            <div className="mb-5">
                <label className="block text-lg text-white/80 mb-2 font-medium">성별</label>
                <div className="flex gap-3">
                    {[{ value: 'male', label: '남성' }, { value: 'female', label: '여성' }].map(g => (
                        <button
                            key={g.value}
                            type="button"
                            onClick={() => handleGenderChange(g.value)}
                            className={`flex-1 h-14 rounded-xl text-lg font-bold transition-all ${data.gender === g.value
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                }`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 생년월일 */}
            <div className="mb-5">
                <label className="block text-lg text-white/80 mb-2 font-medium">생년월일</label>
                <div className="grid grid-cols-3 gap-3">
                    <SelectField
                        value={data.year}
                        onChange={handleYearChange}
                        options={years.map(y => ({ value: String(y), label: `${y}년` }))}
                    />
                    <SelectField
                        value={data.month}
                        onChange={handleMonthChange}
                        options={months.map(m => ({ value: String(m).padStart(2, '0'), label: `${m}월` }))}
                    />
                    <SelectField
                        value={data.day}
                        onChange={handleDayChange}
                        options={days.map(d => ({ value: String(d).padStart(2, '0'), label: `${d}일` }))}
                    />
                </div>
            </div>

            {/* 태어난 시간 */}
            <div>
                <label className="block text-lg text-white/80 mb-2 font-medium">
                    <Clock size={18} className="inline mr-2 text-amber-400" />
                    태어난 시간
                </label>
                <SelectField
                    value={data.birthTime}
                    onChange={handleTimeChange}
                    options={birthTimeOptions}
                />
            </div>
        </motion.div>
    )
})
PersonSection.displayName = 'PersonSection'

export default function Home() {
    const navigate = useNavigate()

    // 부모 정보
    const [parentData, setParentData] = useState({
        name: '',
        year: '1970',
        month: '01',
        day: '01',
        birthTime: 'unknown',
        gender: 'male'
    })

    // 자녀 정보
    const [childData, setChildData] = useState({
        name: '',
        year: '2010',
        month: '01',
        day: '01',
        birthTime: 'unknown',
        gender: 'male'
    })

    const [hasSavedData, setHasSavedData] = useState(false)

    // 로컬 스토리지에서 불러오기
    useEffect(() => {
        const saved = localStorage.getItem('fortuneFamilyData')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                if (data.parent) {
                    const [py, pm, pd] = (data.parent.birthDate || '').split('-')
                    setParentData({
                        ...data.parent,
                        year: py || '1970',
                        month: pm || '01',
                        day: pd || '01'
                    })
                }
                if (data.child) {
                    const [cy, cm, cd] = (data.child.birthDate || '').split('-')
                    setChildData({
                        ...data.child,
                        year: cy || '2010',
                        month: cm || '01',
                        day: cd || '01'
                    })
                }
                setHasSavedData(true)
            } catch (e) {
                console.error('Failed to parse saved data', e)
            }
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!parentData.name) {
            alert('부모님 이름을 입력해주세요.')
            return
        }
        if (!childData.name) {
            alert('자녀 이름을 입력해주세요.')
            return
        }

        // 날짜 형식 변환
        const parentBirthDate = `${parentData.year}-${String(parentData.month).padStart(2, '0')}-${String(parentData.day).padStart(2, '0')}`
        const childBirthDate = `${childData.year}-${String(childData.month).padStart(2, '0')}-${String(childData.day).padStart(2, '0')}`

        const submissionData = {
            parent: { ...parentData, birthDate: parentBirthDate },
            child: { ...childData, birthDate: childBirthDate }
        }

        localStorage.setItem('fortuneFamilyData', JSON.stringify(submissionData))
        navigate('/loading', { state: submissionData })
    }

    return (
        <div className="min-h-screen relative">
            {/* 배경 이미지 */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/bg-mountain.png)' }}
            />
            <div className="fixed inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />

            {/* 콘텐츠 */}
            <div className="relative z-10 px-4 py-8 max-w-lg mx-auto">
                {/* 헤더 */}
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 mb-2 font-serif">
                        2026년 병오년
                    </h1>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-2xl font-serif">
                        부모와 자녀 운세
                    </h2>
                    <p className="mt-4 text-lg text-white/70">
                        부모님의 기운과 자녀의 사주를 함께 풀이합니다
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 부모 입력 섹션 */}
                    <PersonSection
                        title="부모님 정보"
                        icon={User}
                        data={parentData}
                        setData={setParentData}
                    />

                    {/* 자녀 입력 섹션 */}
                    <PersonSection
                        title="자녀 정보"
                        icon={Users}
                        data={childData}
                        setData={setChildData}
                        isChild={true}
                    />

                    {/* 제출 버튼 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            type="submit"
                            className="w-full h-16 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white text-xl font-bold shadow-2xl hover:from-red-600 hover:to-red-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <span>운세 확인하기</span>
                            <span className="text-2xl">→</span>
                        </button>
                    </motion.div>
                </form>

                {/* 안내 문구 */}
                <p className="text-center mt-8 text-white/50 text-base">
                    정통 명리학 데이터를 기반으로 풀이합니다
                </p>

                {/* 빠른 메뉴 - 저장된 정보가 있을 때만 표시 */}
                {hasSavedData && (
                    <div className="mt-8 space-y-3">
                        <p className="text-center text-sm text-white/50 uppercase tracking-wider">다른 운세 보기</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/daily"
                                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20 transition-colors"
                            >
                                <Sparkles className="text-amber-400" size={20} />
                                <span className="text-white font-medium">오늘의 운세</span>
                            </Link>
                            <Link
                                to="/saju-analysis"
                                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20 transition-colors"
                            >
                                <UserCircle className="text-purple-400" size={20} />
                                <span className="text-white font-medium">사주 분석</span>
                            </Link>
                            <Link
                                to="/compatibility"
                                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20 transition-colors"
                            >
                                <Heart className="text-pink-400" size={20} />
                                <span className="text-white font-medium">궁합 보기</span>
                            </Link>
                            <Link
                                to="/calendar"
                                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/20 transition-colors"
                            >
                                <CalendarDays className="text-blue-400" size={20} />
                                <span className="text-white font-medium">운세 달력</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* 푸터 */}
                <footer className="mt-10 pb-8 text-center space-y-4">
                    <div className="flex justify-center gap-6 text-sm text-white/40">
                        <Link to="/privacy" className="hover:text-amber-300 transition-colors">개인정보처리방침</Link>
                        <Link to="/terms" className="hover:text-amber-300 transition-colors">이용약관</Link>
                        <Link to="/contact" className="hover:text-amber-300 transition-colors">문의</Link>
                    </div>
                    <p className="text-white/30 text-sm">© 2026 토정비결. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}
