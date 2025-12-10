"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Download } from 'lucide-react'

const API_URL = "http://localhost:8000"

export default function Gallery() {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_URL}/history`)
            .then(res => res.json())
            .then(data => {
                setHistory(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                        Asset Gallery
                    </h1>
                    <p className="text-slate-400">
                        Archive of generated media campaigns and creatives.
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{history.length}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Campaigns</div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse">
                    Loading archive...
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                    <p className="text-slate-500">No campaigns found.</p>
                    <a href="/studio" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                        Start your first campaign &rarr;
                    </a>
                </div>
            ) : (
                <div className="space-y-16">
                    {history.map((campaign, cIdx) => (
                        <motion.div
                            key={cIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: cIdx * 0.1 }}
                        >
                            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-semibold text-white">
                                    {campaign.campaign.split('_').slice(0, -1).join(' ')}
                                    <span className="text-slate-500 text-sm font-normal ml-2">
                                        {(() => {
                                            const parts = campaign.campaign.split('_');
                                            const lastPart = parts.pop();
                                            const date = new Date(parseInt(lastPart) * 1000);
                                            return !isNaN(date.getTime()) ? date.toLocaleDateString() : 'Demo';
                                        })()}
                                    </span>
                                </h2>
                                <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-400">
                                    {campaign.total_generated} generated
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {campaign.all_variants.map((variant: any, vIdx: number) => (
                                    <div key={vIdx} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-colors">
                                        <div className="aspect-[4/5] relative">
                                            <img
                                                src={`${API_URL}/data/${variant.file_path.replace(/\\/g, '/').split('data/')[1]}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{variant.meta.model}</p>
                                                        <p className="text-slate-400 text-xs">{variant.meta.makeup}</p>
                                                    </div>
                                                    <a
                                                        href={`${API_URL}/data/${variant.file_path.replace(/\\/g, '/').split('data/')[1]}`}
                                                        download
                                                        className="p-2 bg-white text-slate-950 rounded-full hover:bg-blue-400 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-white">
                                                {variant.score} CTR
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
