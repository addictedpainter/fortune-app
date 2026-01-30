import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Loading from './pages/Loading'
import Result from './pages/Result'
import { AnimatePresence } from 'framer-motion'

function App() {
    return (
        <div className="max-w-md mx-auto min-h-screen relative overflow-x-hidden text-white font-myeongjo">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/loading" element={<Loading />} />
                    <Route path="/result" element={<Result />} />
                </Routes>
            </AnimatePresence>
        </div>
    )
}

export default App
