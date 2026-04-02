"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type EventType = {
    data: string;
    timestamp: string;
};

export interface GenAITool {
    name: string;
    category: string;
    description: string;
    use_case: string;
    cost_model?: string;
    implementation_complexity?: string;
}

export interface BusinessProcess {
    process_name: string;
    current_challenges: string[];
    ai_opportunities: string[];
    recommended_tools: string[];
    expected_benefits: string[];
}

export interface ImplementationPhase {
    phase_number: number;
    phase_name: string;
    duration: string;
    activities: string[];
    deliverables: string[];
    success_metrics: string[];
}

export interface GenAIRecommendationReport {
    executive_summary: string;
    business_domain: string;
    industry_classification: string;
    key_challenges: string[];
    recommended_genai_tools: GenAITool[];
    business_processes: BusinessProcess[];
    implementation_roadmap: ImplementationPhase[];
    expected_roi: string;
    risk_assessment: string;
    next_steps: string[];
    resources_and_references: string[];
    markdown_report: string;
}

export const useGenAIAnalysis = () => {
    // State
    const [running, setRunning] = useState<boolean>(false);
    const [businessDescription, setBusinessDescription] = useState<string>("");
    const [events, setEvents] = useState<EventType[]>([]);
    const [analysisReport, setAnalysisReport] = useState<GenAIRecommendationReport | null>(null);
    const [currentInputId, setCurrentInputId] = useState<string>("");

    // useEffects
    useEffect(() => {
        let intervalId: number;
        console.log("currentInputId", currentInputId);

        const fetchAnalysisStatus = async () => {
            try {
                console.log("calling fetchAnalysisStatus");
                const response = await axios.get<{
                    status: string;
                    result: any;
                    events: EventType[];
                }>(`http://localhost:3001/api/multiagent/${currentInputId}`);

                const { status, events: fetchedEvents, result } = response.data;

                console.log("=== FULL API RESPONSE ===");
                console.log("Full response:", response.data);
                console.log("Status:", status);
                console.log("Result:", result);
                console.log("Result type:", typeof result);

                setEvents(fetchedEvents);

                if (result) {
                    console.log("=== PROCESSING RESULT ===");

                    // Handle GenAI recommendation report
                    let reportData: GenAIRecommendationReport | null = null;

                    if (result.markdown_report || result.executive_summary) {
                        console.log("Found GenAI recommendation report structure");
                        reportData = result as GenAIRecommendationReport;
                    } else if (result.message) {
                        console.log("Result has message:", result.message);
                        // Handle error or message cases
                    } else {
                        console.log("Unknown result structure, trying to extract data...");
                        console.log("All result properties:", Object.keys(result));

                        // Try to find markdown report or other relevant data
                        if (typeof result === 'string') {
                            // If result is a string, treat it as markdown report
                            reportData = {
                                executive_summary: "Analysis completed",
                                business_domain: "Unknown",
                                industry_classification: "Unknown",
                                key_challenges: [],
                                recommended_genai_tools: [],
                                business_processes: [],
                                implementation_roadmap: [],
                                expected_roi: "TBD",
                                risk_assessment: "TBD",
                                next_steps: [],
                                resources_and_references: [],
                                markdown_report: result
                            };
                        }
                    }

                    console.log("Final reportData:", reportData);
                    setAnalysisReport(reportData);
                }

                if (status === "COMPLETE" || status === "ERROR") {
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                    setRunning(false);
                    toast.success(`Analysis ${status.toLowerCase()}.`);
                }
            } catch (error) {
                console.error("=== FETCH ERROR ===");
                console.error("Error details:", error);
                if (intervalId) {
                    clearInterval(intervalId);
                }
                setRunning(false);
                toast.error("Failed to get analysis status.");
            }
        };

        if (currentInputId !== "") {
            intervalId = setInterval(fetchAnalysisStatus, 1000) as unknown as number;
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [currentInputId]);

    const startAnalysis = async () => {
        if (!businessDescription.trim()) {
            toast.error("Please provide a business description");
            return;
        }

        // Clear previous output data
        setEvents([]);
        setAnalysisReport(null);
        setRunning(true);

        try {
            const response = await axios.post<{ input_id: string }>(
                "http://localhost:3001/api/genai-analysis",
                {
                    business_description: businessDescription,
                }
            );

            toast.success("Analysis started");

            console.log("inputId", response.data.input_id);
            setCurrentInputId(response.data.input_id);
        } catch (error) {
            toast.error("Failed to start analysis");
            console.error(error);
            setCurrentInputId("");
            setRunning(false);
        }
    };

    return {
        running,
        events,
        setEvents,
        analysisReport,
        setAnalysisReport,
        currentInputId,
        setCurrentInputId,
        businessDescription,
        setBusinessDescription,
        startAnalysis,
    };
};