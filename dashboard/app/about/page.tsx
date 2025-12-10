import { Code, Users, Zap, Award } from 'lucide-react'

export default function About() {
    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero */}
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                        <span className="text-white">Redefining </span>
                        <span className="text-gradient">Beauty Retail.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        TABCE is an experimental engine designed to solve the content bottleneck in personalized retail media using Generative AI.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                        <Zap className="w-8 h-8 text-yellow-400" />
                        <h3 className="text-2xl font-bold text-white">The Problem</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Personalization at scale is impossible with traditional photography. Creating thousands of variants for every demographic, skin tone, and age group is cost-prohibitive and slow.
                        </p>
                    </div>
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
                        <Award className="w-8 h-8 text-blue-400" />
                        <h3 className="text-2xl font-bold text-white">The Solution</h3>
                        <p className="text-slate-400 leading-relaxed">
                            TABCE uses FaceClone™ technology to synthesize hyper-realistic models and apply virtual makeup in milliseconds, enabling 1:1 personalization for every Tesco customer.
                        </p>
                    </div>
                </div>

                {/* Team & Tech */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-purple-400" />
                            <h4 className="font-bold text-white">Built By Antigravity</h4>
                        </div>
                        <p className="text-sm text-slate-500">
                            A team of engineers passionate about Ethical AI and Computer Vision.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Code className="w-5 h-5 text-green-400" />
                            <h4 className="font-bold text-white">The Stack</h4>
                        </div>
                        <ul className="text-sm text-slate-500 space-y-1">
                            <li>Next.js 14 & Tailwind</li>
                            <li>FastAPI & Python</li>
                            <li>MediaPipe & OpenCV</li>
                            <li>Stable Diffusion (LCM)</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <h4 className="font-bold text-white">Status</h4>
                        </div>
                        <p className="text-sm text-slate-500">
                            Internal Prototype v1.0.2<br />
                            Running on Local Host
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
