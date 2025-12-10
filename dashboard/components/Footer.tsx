export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black z-10 relative">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            TABCE <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-200 border border-blue-800">BETA</span>
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Revolutionizing Tesco's retail media with AI-powered, hyper-personalized creative generation.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">FaceClone Engine</li>
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">Virtual Makeup</li>
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">Auto Layout</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">Documentation</li>
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">API Reference</li>
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">System Status</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">Terms of Service</li>
                            <li className="hover:text-tesco-blue transition-colors cursor-pointer">Cookie Policy</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>© 2025 Tesco AI Beauty Creative Engine. Internal Prototype.</p>
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Operational
                    </p>
                </div>
            </div>
        </footer>
    )
}
