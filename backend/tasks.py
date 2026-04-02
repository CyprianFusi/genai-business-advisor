from crewai import Task, Agent
from textwrap import dedent
from log_manager import append_event
from models import GenAIRecommendationReport


class GenAIBusinessTasks():

    def __init__(self, input_id):
        self.input_id = input_id

    def append_event_callback(self, task_output):
        print(f"Appending event for {self.input_id} with output {task_output}")
        # task_output.expected_output is the static template text, not the actual result.
        # Use summary (a short excerpt of the actual output) or fall back to raw.
        event_data = task_output.summary or task_output.raw or str(task_output)
        append_event(self.input_id, event_data)

    def analyze_business_domain(self, agent: Agent, business_description: str):
        return Task(
            description=dedent(f"""Analyze the following business description to understand the company's domain, activities, and potential AI application areas:
                
                Business Description: {business_description}
                
                Your analysis should identify:
                1. Primary industry/domain
                2. Key business processes and activities
                3. Target customers and stakeholders
                4. Main challenges and pain points
                5. Current technology usage
                6. Areas where generative AI could provide value
                
                Provide a structured analysis that will guide the research for relevant AI applications.
                """),
            agent=agent,
            expected_output=dedent("""A comprehensive business domain analysis including:
                - Industry classification
                - Key business processes
                - Stakeholder mapping
                - Challenge identification
                - AI opportunity areas"""),
            callback=self.append_event_callback
        )

    def research_genai_applications(self, agent: Agent, domain_analysis: str):
        return Task(
            description=dedent(f"""Based on the business domain analysis, research the latest generative AI technologies 
                and applications that are relevant to this business. Focus on finding:
                
                Research Requirements:
                1. Latest generative AI tools and platforms (2024-2025)
                2. Industry-specific AI applications and use cases
                3. Success stories and case studies from similar businesses
                4. Implementation costs and ROI data
                5. Integration possibilities with existing workflows
                6. Recent blog articles and YouTube videos about AI in this industry
                
                Search for current, practical examples of how businesses in this domain are using generative AI.
                Use the business description: {domain_analysis}
                """),
            agent=agent,
            expected_output=dedent("""Comprehensive research findings including:
                - Relevant AI tools and platforms
                - Industry-specific use cases
                - Success stories and case studies
                - Cost and ROI information
                - Integration guidance
                - Resource links (articles and videos)"""),
            callback=self.append_event_callback
        )

    def map_ai_applications(self, agent: Agent, business_description: str):
        return Task(
            description=dedent(f"""Using the business domain analysis and AI research findings, create specific 
                recommendations for how generative AI can be applied to this business:
                
                Business Description: {business_description}
                
                Create detailed mappings that include:
                1. Specific AI tools for identified business challenges
                2. Integration strategies for existing workflows
                3. Expected benefits and outcomes
                4. Implementation priority and roadmap
                5. Risk assessment and mitigation strategies
                6. Resource requirements and timeline
                
                Provide actionable, specific recommendations rather than generic suggestions.
                """),
            agent=agent,
            expected_output=dedent("""Detailed AI application mapping including:
                - Specific tool recommendations
                - Integration strategies
                - Expected benefits and ROI
                - Implementation roadmap
                - Risk mitigation plans
                - Resource requirements"""),
            callback=self.append_event_callback
        )

    def create_final_report(self, agent: Agent, business_description: str):
        return Task(
            description=dedent(f"""Create a comprehensive, professional markdown report that summarizes all research 
                and recommendations for implementing generative AI in this business:
                
                Business Description: {business_description}
                
                The report should be structured as a professional consulting document with:
                1. Executive Summary (key findings and recommendations)
                2. Business Domain Analysis
                3. Relevant Generative AI Technologies
                4. Specific Application Recommendations
                5. Implementation Roadmap (phases, timeline, priorities)
                6. Expected Benefits and ROI
                7. Risk Assessment and Mitigation
                8. Next Steps and Resources
                
                Use proper markdown formatting with headers, bullet points, and tables where appropriate.
                Make it actionable and suitable for business decision-makers.
                """),
            agent=agent,
            expected_output=dedent("""A complete, well-formatted markdown report that provides:
                - Clear executive summary
                - Detailed analysis and recommendations
                - Actionable implementation guidance
                - Professional presentation suitable for stakeholders"""),
            callback=self.append_event_callback,
            output_json=GenAIRecommendationReport
        )