"use client";

import React, { useState } from 'react';
import { GenAIRecommendationReport, GenAITool, BusinessProcess, ImplementationPhase } from '@/hooks/useCrewOutput';

interface GenAIAnalysisOutputProps {
    analysisReport: GenAIRecommendationReport | null;
    isRunning: boolean;
}

export const GenAIAnalysisOutput: React.FC<GenAIAnalysisOutputProps> = ({
    analysisReport,
    isRunning
}) => {
    const [activeTab, setActiveTab] = useState<'summary' | 'tools' | 'roadmap' | 'markdown'>('summary');

    if (isRunning && !analysisReport) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Analysis in Progress</h3>
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Our AI agents are analyzing your business and researching GenAI applications...</span>
                </div>
            </div>
        );
    }

    if (!analysisReport) {
        return null;
    }

    const tabs = [
        { id: 'summary' as const, label: 'Executive Summary', icon: '📊' },
        { id: 'tools' as const, label: 'Recommended Tools', icon: '🛠️' },
        { id: 'roadmap' as const, label: 'Implementation', icon: '🗺️' },
        { id: 'markdown' as const, label: 'Full Report', icon: '📄' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                    <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">GenAI Analysis Results</h3>
                <div className="flex justify-center space-x-6 text-sm">
                    <div className="bg-blue-50 px-4 py-2 rounded-full">
                        <span className="font-medium text-blue-700">Industry:</span>
                        <span className="text-blue-600 ml-1">{analysisReport.industry_classification}</span>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded-full">
                        <span className="font-medium text-purple-700">Domain:</span>
                        <span className="text-purple-600 ml-1">{analysisReport.business_domain}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-gray-50 rounded-xl p-2">
                <nav className="flex space-x-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-white shadow-md text-indigo-600 border-2 border-indigo-100'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-lg">{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'summary' && (
                    <SummaryTab analysisReport={analysisReport} />
                )}
                
                {activeTab === 'tools' && (
                    <ToolsTab tools={analysisReport.recommended_genai_tools} />
                )}
                
                {activeTab === 'roadmap' && (
                    <RoadmapTab roadmap={analysisReport.implementation_roadmap} />
                )}
                
                {activeTab === 'markdown' && (
                    <MarkdownTab markdownReport={analysisReport.markdown_report} />
                )}
            </div>
        </div>
    );
};

// Summary Tab Component
const SummaryTab: React.FC<{ analysisReport: GenAIRecommendationReport }> = ({ analysisReport }) => (
    <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📋</span>
                </div>
                <h4 className="text-lg font-bold text-blue-900">Executive Summary</h4>
            </div>
            <p className="text-blue-800 leading-relaxed">{analysisReport.executive_summary}</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">⚠️</span>
                    </div>
                    <h4 className="text-lg font-bold text-red-900">Key Challenges</h4>
                </div>
                <ul className="space-y-3">
                    {analysisReport.key_challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-red-600 text-xs font-bold">{index + 1}</span>
                            </div>
                            <span className="text-red-800 leading-relaxed">{challenge}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">✅</span>
                    </div>
                    <h4 className="text-lg font-bold text-green-900">Next Steps</h4>
                </div>
                <ul className="space-y-3">
                    {analysisReport.next_steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-green-600 text-xs font-bold">{index + 1}</span>
                            </div>
                            <span className="text-green-800 leading-relaxed">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">💰</span>
                </div>
                <h4 className="text-lg font-bold text-amber-900">Expected ROI</h4>
            </div>
            <p className="text-amber-800 leading-relaxed">{analysisReport.expected_roi}</p>
        </div>
    </div>
);

// Tools Tab Component
const ToolsTab: React.FC<{ tools: GenAITool[] }> = ({ tools }) => (
    <div className="space-y-6">
        <div className="text-center">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Recommended GenAI Tools</h4>
            <p className="text-gray-600">Curated AI tools specifically for your business needs</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
                <div key={index} className="group bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-lg">🛠️</span>
                            </div>
                            <h5 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{tool.name}</h5>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                            {tool.category}
                        </span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{tool.description}</p>
                    <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm"><span className="font-semibold text-gray-800">Use Case:</span> <span className="text-gray-700">{tool.use_case}</span></p>
                        </div>
                        {tool.cost_model && (
                            <div className="bg-green-50 rounded-lg p-3">
                                <p className="text-sm"><span className="font-semibold text-green-800">Cost Model:</span> <span className="text-green-700">{tool.cost_model}</span></p>
                            </div>
                        )}
                        {tool.implementation_complexity && (
                            <div className="bg-amber-50 rounded-lg p-3">
                                <p className="text-sm"><span className="font-semibold text-amber-800">Complexity:</span> <span className="text-amber-700">{tool.implementation_complexity}</span></p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Roadmap Tab Component
const RoadmapTab: React.FC<{ roadmap: ImplementationPhase[] }> = ({ roadmap }) => (
    <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Implementation Roadmap</h4>
        <div className="space-y-6">
            {roadmap.map((phase, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                            {phase.phase_number}
                        </span>
                        <h5 className="font-medium text-gray-900">{phase.phase_name}</h5>
                        <span className="text-sm text-gray-500">({phase.duration})</span>
                    </div>
                    
                    <div className="ml-11 space-y-3">
                        <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Activities:</h6>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {phase.activities.map((activity, actIndex) => (
                                    <li key={actIndex}>{activity}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Deliverables:</h6>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {phase.deliverables.map((deliverable, delIndex) => (
                                    <li key={delIndex}>{deliverable}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Markdown Tab Component
const MarkdownTab: React.FC<{ markdownReport: string }> = ({ markdownReport }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900">Complete Analysis Report</h4>
            <button
                onClick={() => {
                    const blob = new Blob([markdownReport], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'genai-analysis-report.md';
                    a.click();
                    URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
                Download Report
            </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {markdownReport}
            </pre>
        </div>
    </div>
);