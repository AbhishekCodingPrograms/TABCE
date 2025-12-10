"use client"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Zap, Shield, Sparkles, ChevronRight, Play } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center">

      {/* --- HERO SECTION --- */}
      <section className="relative w-full overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-48 lg:pb-64">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] md:w-[1000px] md:h-[500px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs md:text-sm font-medium text-blue-300 mb-8 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>The New Standard in Retail Media</span>
            </div>

            <h1 className="mb-6 md:mb-8 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
              Create Infinite <br />
              <span className="text-gradient">Beauty Campaigns</span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
              Turn a single packshot into thousands of diverse, on-brand creatives.
              <br className="hidden md:block" />
              Powered by <strong>FaceClone™ AI</strong> & Tesco Design Systems.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/studio">
                <button className="group relative flex h-14 items-center gap-3 rounded-full bg-tesco-blue px-8 text-lg font-bold text-white transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(0,83,159,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,83,159,0.7)]">
                  Launch Studio
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:rotate-45">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </Link>
              <Link href="/gallery">
                <button className="flex h-14 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-lg font-semibold text-white transition-all hover:bg-white/10 backdrop-blur-sm">
                  <Play className="h-4 w-4 fill-current opacity-70" /> View Gallery
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating UI Elements (Parallax Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-0 left-0 right-0 hidden lg:flex justify-center translate-y-1/2 pointer-events-none"
        >
          <div className="relative w-[900px] h-[500px] bg-slate-900 border border-white/10 rounded-t-3xl shadow-2xl overflow-hidden glass">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20" />
            <img src="/dashboard_mock.png" className="w-full h-full object-cover opacity-80" alt="Dashboard Preview" />

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-10 w-64 p-4 glass rounded-xl border border-white/10 shadow-xl z-30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                <div>
                  <div className="h-2 w-24 bg-white/20 rounded mb-1" />
                  <div className="h-2 w-16 bg-white/10 rounded" />
                </div>
              </div>
              <div className="h-32 rounded-lg bg-slate-800/50 w-full mb-2 border border-white/5" />
              <div className="flex justify-between text-xs text-green-400 font-mono">
                <span>CTR: 3.4%</span>
                <span>Gen ID: #8291</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- STATS --- */}
      <section className="w-full border-y border-white/5 bg-slate-900/40 backdrop-blur-sm py-12">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
          {[
            { val: "100x", label: "Faster Production" },
            { val: "<2min", label: "Turnaround Time" },
            { val: "500KB", label: "Optimized Assets" },
            { val: "100%", label: "Brand Compliant" },
          ].map((s, i) => (
            <div key={i} className="px-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.val}</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="w-full py-32 relative">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Engineered for <span className="text-blue-400">Scale</span></h2>
            <p className="text-slate-400 text-lg">
              Traditional photoshoots are linear. TABCE is exponential.
              Unlock the power of synthetic media without compromising on authenticity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant Diversity",
                desc: "Generate models of any ethnicity, age, and skin tone from a single product mesh.",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: Sparkles,
                title: "Virtual Cosmetics",
                desc: "Apply branded lipstick, blush, and eyeliner digitally with cultural preset themes.",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: Shield,
                title: "Enterprise Safe",
                desc: "Built-in consent gates, face detection safeguards, and Tesco design system compliance.",
                gradient: "from-emerald-500/20 to-green-500/20"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 border border-white/10 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white/50 group-hover:text-white transition-colors">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 text-center w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="mb-8 text-4xl md:text-5xl font-bold text-white tracking-tight">
            Ready to transform your workflow?
          </h2>
          <Link href="/studio">
            <button className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold transition-all shadow-[0_0_50px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_80px_-10px_rgba(37,99,235,0.7)] hover:scale-105 active:scale-95">
              Start Generating Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
