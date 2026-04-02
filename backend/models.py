from typing_extensions import List, Optional
from pydantic import BaseModel, ConfigDict


class GenAITool(BaseModel):
    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True
    )
    name: str
    category: str
    description: str
    use_case: str
    cost_model: Optional[str] = None
    implementation_complexity: Optional[str] = None


class BusinessProcess(BaseModel):
    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True
    )
    process_name: str
    current_challenges: List[str]
    ai_opportunities: List[str]
    recommended_tools: List[str]
    expected_benefits: List[str]


class ImplementationPhase(BaseModel):
    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True
    )
    phase_number: int
    phase_name: str
    duration: str
    activities: List[str]
    deliverables: List[str]
    success_metrics: List[str]


class GenAIRecommendationReport(BaseModel):
    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True
    )
    executive_summary: str
    business_domain: str
    industry_classification: str
    key_challenges: List[str]
    recommended_genai_tools: List[GenAITool]
    business_processes: List[BusinessProcess]
    implementation_roadmap: List[ImplementationPhase]
    expected_roi: str
    risk_assessment: str
    next_steps: List[str]
    resources_and_references: List[str]
    markdown_report: str