import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Loading from './pages/Loading'
import Result from './pages/Result'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import DailyFortune from './pages/DailyFortune'
import SajuAnalysis from './pages/SajuAnalysis'
import Compatibility from './pages/Compatibility'
import FortuneCalendar from './pages/FortuneCalendar'
import { AnimatePresence } from 'framer-motion'

function App() {
    return (
        <div className="relative min-h-screen overflow-x-hidden text-white font-sans selection:bg-amber-500/30">
            <AnimatePresence mode="wait">
                <Routes>
                    {/* Main Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/loading" element={<Loading />} />
                    <Route path="/result" element={<Result />} />

                    {/* Fortune Pages */}
                    <Route path="/daily" element={<DailyFortune />} />
                    <Route path="/saju-analysis" element={<SajuAnalysis />} />
                    <Route path="/compatibility" element={<Compatibility />} />
                    <Route path="/calendar" element={<FortuneCalendar />} />

                    {/* Legal Pages */}
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </AnimatePresence>
        </div>
    )
}

export default App
