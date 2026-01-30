import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Loading from './pages/Loading'
import Result from './pages/Result'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import { AnimatePresence } from 'framer-motion'

function App() {
    return (
        <div className="relative min-h-screen overflow-x-hidden text-white font-myeongjo bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#1a103c] to-black selection:bg-amber-500/30">
            {/* Ambient Background Auras */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-gold-500/20 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl opacity-40"></div>
            </div>

            <div className="relative z-10 max-w-md mx-auto min-h-screen">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/loading" element={<Loading />} />
                        <Route path="/result" element={<Result />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default App
