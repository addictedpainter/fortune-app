import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, AlertTriangle, Check } from 'lucide-react'
import { calculateSaju } from '../utils/saju'
import { getTodayGanji } from '../utils/dailyFortune'
import AdBanner from '../components/AdBanner'

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay()
}

function analyzeDayFortune(saju, date) {
    const ganji = getTodayGanji(date)

    const relations = {
        '목': { generates: '화', controlled: '금', controls: '토', generatedBy: '수' },
        '화': { generates: '토', controlled: '수', controls: '금', generatedBy: '목' },
        '토': { generates: '금', controlled: '목', controls: '수', generatedBy: '화' },
        '금': { generates: '수', controlled: '화', controls: '목', generatedBy: '토' },
        '수': { generates: '목', controlled: '토', controls: '화', generatedBy: '금' }
    }

    const myRel = relations[saju.ilganOhang]
    const dayOhang = ganji.ohang

    if (dayOhang === myRel.generatedBy) return { type: 'excellent', label: '대길', color: 'bg-green-500' }
    if (dayOhang === myRel.generates || dayOhang === myRel.controls) return { type: 'good', label: '길', color: 'bg-blue-500' }
    if (dayOhang === saju.ilganOhang) return { type: 'neutral', label: '평', color: 'bg-gray-500' }
    if (dayOhang === myRel.controlled) return { type: 'caution', label: '주의', color: 'bg-red-500' }
    return { type: 'neutral', label: '평', color: 'bg-gray-500' }
}

export default function FortuneCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [saju, setSaju] = useState(null)
    const [userData, setUserData] = useState(null)
    const [selectedDay, setSelectedDay] = useState(null)

    useEffect(() => {
        const saved = localStorage.getItem('fortuneUserData')
        if (saved) {
            const data = JSON.parse(saved)
            setUserData(data)
            const calculatedSaju = calculateSaju(data.birthDate, data.birthTime)
            setSaju(calculatedSaju)
        }
    }, [])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const today = new Date()

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
        setSelectedDay(null)
    }

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
        setSelectedDay(null)
    }

    const handleDayClick = (day) => {
        if (!saju) return
        const date = new Date(year, month, day)
        const fortune = analyzeDayFortune(saju, date)
        const ganji = getTodayGanji(date)
        setSelectedDay({ day, fortune, ganji, date })
    }

    if (!userData || !saju) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <Sparkles className="text-amber-400 w-16 h-16 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">먼저 정보를 입력해주세요</h2>
                <Link
                    to="/"
                    className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-full font-bold text-lg"
                >
                    정보 입력하러 가기
                </Link>
            </div>
        )
    }

    // Generate calendar days
    const calendarDays = []
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const fortune = analyzeDayFortune(saju, date)
        calendarDays.push({ day, fortune })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-6 pb-20"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/" className="text-amber-300 hover:text-amber-200 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">운세 달력</h1>
                    <p className="text-gray-400 text-sm">길일과 흉일을 한눈에</p>
                </div>
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={goToPrevMonth}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <ChevronLeft className="text-white" size={24} />
                </button>
                <h2 className="text-xl font-bold text-white">
                    {year}년 {MONTH_NAMES[month]}
                </h2>
                <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <ChevronRight className="text-white" size={24} />
                </button>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-400">대길</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-400">길</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-gray-400">평</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-400">주의</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAY_NAMES.map((day, i) => (
                        <div
                            key={day}
                            className={`text-center text-xs font-bold py-2 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                                }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((dayData, index) => {
                        if (!dayData) {
                            return <div key={`empty-${index}`} className="aspect-square"></div>
                        }

                        const isToday =
                            today.getFullYear() === year &&
                            today.getMonth() === month &&
                            today.getDate() === dayData.day

                        const isSelected = selectedDay?.day === dayData.day
                        const dayOfWeek = (firstDay + dayData.day - 1) % 7

                        return (
                            <button
                                key={dayData.day}
                                onClick={() => handleDayClick(dayData.day)}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${isSelected
                                        ? 'bg-amber-500/30 ring-2 ring-amber-500'
                                        : isToday
                                            ? 'bg-white/10 ring-1 ring-white/30'
                                            : 'hover:bg-white/5'
                                    }`}
                            >
                                <span className={`text-sm font-bold ${dayOfWeek === 0 ? 'text-red-400' :
                                        dayOfWeek === 6 ? 'text-blue-400' :
                                            'text-white'
                                    }`}>
                                    {dayData.day}
                                </span>
                                <div className={`w-2 h-2 rounded-full mt-1 ${dayData.fortune.color}`}></div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDay && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-gray-400 text-sm">
                                {selectedDay.date.getFullYear()}년 {selectedDay.date.getMonth() + 1}월 {selectedDay.day}일
                            </p>
                            <p className="text-white font-bold text-lg">{selectedDay.ganji.fullName}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full ${selectedDay.fortune.color} text-white font-bold`}>
                            {selectedDay.fortune.label}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        {selectedDay.fortune.type === 'excellent' && (
                            <>
                                <Check className="text-green-400" size={16} />
                                <span>중요한 일을 처리하기 좋은 날입니다.</span>
                            </>
                        )}
                        {selectedDay.fortune.type === 'good' && (
                            <>
                                <Check className="text-blue-400" size={16} />
                                <span>순탄하게 일이 진행되는 날입니다.</span>
                            </>
                        )}
                        {selectedDay.fortune.type === 'neutral' && (
                            <>
                                <Sparkles className="text-gray-400" size={16} />
                                <span>평범하게 보내면 좋은 날입니다.</span>
                            </>
                        )}
                        {selectedDay.fortune.type === 'caution' && (
                            <>
                                <AlertTriangle className="text-red-400" size={16} />
                                <span>큰 결정은 피하는 것이 좋습니다.</span>
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Ad */}
            <AdBanner className="mb-6 rounded-xl overflow-hidden" />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <Link
                    to="/daily"
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold py-4 rounded-xl text-center transition-colors border border-amber-500/30"
                >
                    오늘의 운세
                </Link>
                <Link
                    to="/saju-analysis"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl text-center transition-colors border border-white/10"
                >
                    사주 분석
                </Link>
            </div>
        </motion.div>
    )
}
