export default function Header() {
    return (
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl border-b border-indigo-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                            <div className="text-3xl">🤖</div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                GenAI Business Advisor
                            </h1>
                            <p className="text-indigo-100 font-medium">
                                Discover how Generative AI can transform your business
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                            <span className="text-sm text-indigo-100 font-medium">
                                Powered by CrewAI & Multi-Agent Systems
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}