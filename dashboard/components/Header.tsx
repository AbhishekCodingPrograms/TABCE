"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const navs = [
        { name: 'Home', path: '/' },
        { name: 'Studio', path: '/studio' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'About', path: '/about' },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        TABCE
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navs.map((nav) => {
                        const isActive = pathname === nav.path
                        return (
                            <Link
                                key={nav.path}
                                href={nav.path}
                                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                                    }`}
                            >
                                {nav.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 -z-10 rounded-full bg-white/10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Action */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/studio">
                        <button className="group relative overflow-hidden rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-transform active:scale-95">
                            <span className="relative z-10 flex items-center gap-2">
                                Get Creating <Sparkles className="w-4 h-4" />
                            </span>
                            <div className="absolute inset-0 -z-0 translate-y-[100%] bg-gradient-to-r from-indigo-500 to-purple-500 transition-transform duration-300 group-hover:translate-y-0" />
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <motion.div
                initial={false}
                animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                className="overflow-hidden bg-slate-900 border-b border-white/5 md:hidden"
            >
                <div className="flex flex-col p-4 gap-2">
                    {navs.map((nav) => (
                        <Link
                            key={nav.path}
                            href={nav.path}
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 rounded-lg"
                        >
                            {nav.name}
                        </Link>
                    ))}
                </div>
            </motion.div>
        </header>
    )
}
