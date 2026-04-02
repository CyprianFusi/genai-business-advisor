import React from "react";

// Legacy component - no longer used in new GenAI analysis workflow
// Keeping as stub to avoid import errors in legacy code
interface FinalOutputProps {
    businessareaInfoList: any[];
}

export const FinalOutput: React.FC<FinalOutputProps> = ({
    businessareaInfoList,
}) => {
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold my-2">Legacy Component</h2>
            <div className="flex-grow overflow-auto border-2 border-gray-300 p-2">
                <p>This component has been replaced by GenAIAnalysisOutput.</p>
            </div>
        </div>
    );
};