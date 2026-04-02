"use client";

import { EventLog } from "@/components/EventLog";
import { GenAIAnalysisOutput } from "@/components/GenAIAnalysisOutput";
import BusinessDescriptionInput from "@/components/BusinessDescriptionInput";
import { useGenAIAnalysis } from "@/hooks/useCrewOutput";

export default function Home() {
    // Hooks
    const analysisOutput = useGenAIAnalysis();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Main Content */}
            <main className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                
                <div className="relative max-w-6xl mx-auto px-6 py-12">
                    <div className="space-y-12">
                        {/* Business Description Input */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 lg:p-12">
                            <BusinessDescriptionInput
                                businessDescription={analysisOutput.businessDescription}
                                setBusinessDescription={analysisOutput.setBusinessDescription}
                                onStartAnalysis={analysisOutput.startAnalysis}
                                isRunning={analysisOutput.running}
                            />
                        </div>

                        {/* Analysis Output */}
                        {(analysisOutput.analysisReport || analysisOutput.events.length > 0) && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                                <GenAIAnalysisOutput 
                                    analysisReport={analysisOutput.analysisReport}
                                    isRunning={analysisOutput.running}
                                />
                            </div>
                        )}

                        {/* Event Log */}
                        {analysisOutput.events.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                                <EventLog events={analysisOutput.events} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 bg-white/50 backdrop-blur-sm border-t border-gray-200">
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">🤖</span>
                                <span className="text-gray-600 font-medium">GenAI Business Advisor</span>
                                <span className="text-sm text-gray-500 text-center">&#169; Binati AInalytics, {new Date().getFullYear()}</span>
                            </div>
                            <div className="text-sm text-gray-500 text-center md:text-right">
                                <p>Powered by CrewAI & Multi-Agent Systems</p>
                                <p className="text-xs mt-1">Transforming businesses with AI-driven insights</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}