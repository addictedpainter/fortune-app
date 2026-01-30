import { useEffect, useRef } from 'react'

export default function AdBanner({ className = "" }) {
    const isProduction = import.meta.env.PROD
    const adRef = useRef(null)

    useEffect(() => {
        if (isProduction && adRef.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense error", e);
            }
        }
    }, [isProduction]);

    if (!isProduction) {
        return (
            <div className={`w-full bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-gray-400 text-sm font-nanum p-4 ${className}`} style={{ minHeight: '100px' }}>
                <span className="font-bold text-amber-500 mb-2">AD AREA (Dev Mode)</span>
                <span>Google AdSense Banner</span>
                <span className="text-xs text-gray-500 mt-1">실제 배포 시 광고가 표시됩니다.</span>
            </div>
        )
    }

    return (
        <div className={`w-full overflow-hidden rounded-xl ${className}`}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9422161547792612"
                data-ad-slot="auto"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    )
}
