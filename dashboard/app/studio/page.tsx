"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, Image as ImageIcon, Download, Star, Loader2 } from 'lucide-react'

// --- API Client ---
const API_URL = "http://localhost:8000"

export default function Dashboard() {
    const [packshotId, setPackshotId] = useState<string | null>(null)
    const [packshotUrl, setPackshotUrl] = useState<string | null>(null)
    const [campaignId, setCampaignId] = useState<string | null>(null)
    const [status, setStatus] = useState('idle') // idle, uploading, generating, complete
    const [uploadProgress, setUploadProgress] = useState(0)
    const [variants, setVariants] = useState<any[]>([])
    const [top5, setTop5] = useState<any[]>([])

    // Demo Mode Effect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('demo') === 'true') {
            setCampaignId('Summer_Launch_2025')
            setPackshotUrl(`${API_URL}/data/packshots/processed_product.png`)
            setStatus('generating')
            pollStatus('Summer_Launch_2025')
        }
    }, [])

    const handleUpload = async (e: any) => {
        const file = e.target.files?.[0]
        if (!file) return

        setStatus('uploading')
        setUploadProgress(0)

        // Simulate progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const next = prev + Math.random() * 15
                return next > 90 ? 90 : next
            })
        }, 300)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('consent', 'true') // Added consent

        try {
            const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData })
            const data = await res.json()

            clearInterval(interval)
            setUploadProgress(100)

            // Short delay to show 100%
            setTimeout(() => {
                setPackshotId(data.id)
                setPackshotUrl(`${API_URL}${data.url}`)
                setStatus('ready')
                setUploadProgress(0)
            }, 500)
        } catch (err) {
            console.error(err)
            clearInterval(interval)
            setStatus('idle')
            setUploadProgress(0)
        }
    }

    const handleGenerate = async () => {
        if (!packshotId) return
        setStatus('generating')
        setVariants([])
        setTop5([])

        try {
            const res = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    packshot_id: packshotId,
                    campaign_name: "Demo_Campaign",
                    num_variants: 10
                })
            })
            const data = await res.json()
            setCampaignId(data.campaign_id)

            // Start Polling
            pollStatus(data.campaign_id)
        } catch (err) {
            console.error(err)
            setStatus('ready')
        }
    }

    const pollStatus = (id: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API_URL}/status/${id}`)
                const data = await res.json()

                if (data.status === 'complete') {
                    clearInterval(interval)
                    setStatus('complete')
                    setTop5(data.top_5)
                    setVariants(data.top_5)
                }
            } catch (err) {
                clearInterval(interval)
            }
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-transparent text-slate-100 font-sans p-4 md:p-8">
            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-blue-400" />
                            1. Upload Packshot
                        </h2>

                        <div className="relative group cursor-pointer image-modern-container bg-slate-800">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={status === 'uploading'}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            />
                            <div className="p-8 text-center transition-colors group-hover:bg-slate-700/50 h-full flex flex-col items-center justify-center min-h-[160px]">
                                {status === 'uploading' ? (
                                    <div className="w-full max-w-[200px] flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        <div className="flex justify-between w-full text-xs font-medium text-slate-300">
                                            <span>Processing...</span>
                                            <span>{Math.round(uploadProgress)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                ) : packshotUrl ? (
                                    <img src={packshotUrl} className="max-h-48 mx-auto object-contain drop-shadow-2xl" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                        <span className="font-medium">Drop product image here</span>
                                        <span className="text-xs text-slate-500">or click to browse</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="glass p-6 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            2. Generate Campaign
                        </h2>

                        <div className="mb-4">
                            <label className="text-xs text-slate-400 font-medium ml-1 mb-2 block uppercase tracking-wider">Campaign Name</label>
                            <input
                                type="text"
                                placeholder="Summer Launch 2025"
                                className="w-full rounded-xl px-4 py-3 input-modern text-sm"
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={status !== 'ready'}
                            className="w-full py-4 bg-gradient-to-r from-tesco-blue to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] hover:scale-[1.02]"
                        >
                            {status === 'generating' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Variants...
                                </span>
                            ) : 'Generate 10 Variants'}
                        </button>

                        <div className="mt-4 text-xs text-slate-500 text-center">
                            AI will generate models, apply makeup, compose layouts, and score performance.
                        </div>
                    </section>
                </div>

                {/* Right: Gallery */}
                <div className="lg:col-span-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        Top Performing Creatives
                    </h2>

                    {status === 'generating' && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                            <p>Orchestrating campaign...</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {top5.map((variant, i) => (
                                <motion.div
                                    key={variant.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="image-modern-container bg-slate-900 group"
                                >
                                    <div className="relative aspect-video bg-slate-950">
                                        <img
                                            src={`${API_URL}/data/${variant.file_path.replace(/\\/g, '/').split('data/')[1]}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-green-500/30">
                                            <span className="text-xs font-medium text-slate-300 mr-2">CTR</span>
                                            <span className="text-lg font-bold text-green-400 text-high-ctr">{variant.score}</span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-white">{variant.meta.model}</h3>
                                                <p className="text-sm text-slate-400">{variant.meta.makeup} • {variant.meta.layout}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                                                #{i + 1} Ranked
                                            </span>
                                        </div>

                                        <a
                                            href={`${API_URL}/data/${variant.file_path.replace(/\\/g, '/').split('data/')[1]}`}
                                            download
                                            className="flex w-full items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Asset
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {status === 'complete' && top5.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No variants generated. check backend logs.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
