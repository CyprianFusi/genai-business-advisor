"use client";

import React from 'react';

interface BusinessDescriptionInputProps {
    businessDescription: string;
    setBusinessDescription: (description: string) => void;
    onStartAnalysis: () => void;
    isRunning: boolean;
}

const BusinessDescriptionInput: React.FC<BusinessDescriptionInputProps> = ({
    businessDescription,
    setBusinessDescription,
    onStartAnalysis,
    isRunning
}) => {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                    <span className="text-2xl">🚀</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    GenAI Business Analysis
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Describe your company&apos;s activities, challenges, and processes. Our AI agents will analyze your business and recommend specific generative AI applications that can help improve your operations.
                </p>
            </div>
            
            {/* Input Section */}
            <div className="space-y-6">
                <div>
                    <label htmlFor="business-description" className="block text-lg font-semibold text-gray-800 mb-3">
                        🏢 Tell us about your business
                    </label>
                    <div className="relative">
                        <textarea
                            id="business-description"
                            value={businessDescription}
                            onChange={(e) => setBusinessDescription(e.target.value)}
                            placeholder="Example: We are a mid-sized marketing agency that helps small businesses create digital marketing campaigns. Our main challenges include creating content for social media, writing compelling ad copy, designing graphics for campaigns, and managing client communications. We currently use basic tools like Canva and MailChimp, but struggle with content creation efficiency and personalization at scale..."
                            className="w-full h-48 px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 resize-vertical placeholder-gray-400"
                            disabled={isRunning}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {businessDescription.length} characters
                        </div>
                    </div>
                    <div className="mt-3 flex items-start space-x-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                            <span className="text-indigo-600 text-xs">💡</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Include details about your industry, main activities, current challenges, tools you use, and areas where you think AI might help.
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pt-4">
                    <button
                        onClick={onStartAnalysis}
                        disabled={isRunning || !businessDescription.trim()}
                        className={`group relative px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                            isRunning || !businessDescription.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-200'
                        }`}
                    >
                        {isRunning ? (
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Analyzing Your Business...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <span>🤖</span>
                                <span>Start GenAI Analysis</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Features Preview */}
            {!isRunning && businessDescription.trim() && (
                <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                            <span className="text-xl">🔍</span>
                        </div>
                        <h3 className="font-semibold text-gray-800">Domain Analysis</h3>
                        <p className="text-sm text-gray-600">Identify your industry and key processes</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto flex items-center justify-center">
                            <span className="text-xl">🛠️</span>
                        </div>
                        <h3 className="font-semibold text-gray-800">AI Tool Recommendations</h3>
                        <p className="text-sm text-gray-600">Get specific GenAI tools for your needs</p>
                    </div>
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
                            <span className="text-xl">📋</span>
                        </div>
                        <h3 className="font-semibold text-gray-800">Implementation Roadmap</h3>
                        <p className="text-sm text-gray-600">Step-by-step implementation plan</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessDescriptionInput;