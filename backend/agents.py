import os
from dotenv import load_dotenv, find_dotenv
from crewai import Agent, LLM
from crewai_tools import SerperDevTool
from tools.youtube_search_tools import YoutubeVideoSearchTool

_ = load_dotenv(find_dotenv())

class GenAIBusinessAgents():

    def __init__(self):
        self.searchInternetTool = SerperDevTool()
        self.youtubeSearchTool = YoutubeVideoSearchTool()
        # Use crewai.LLM (backed by litellm) so that base_url/api_key are forwarded
        # correctly to OpenRouter. langchain_openai.ChatOpenAI stored the base URL in
        # openai_api_base, but crewai 0.100+ extracts it via getattr("base_url") which
        # is a different attribute — causing the base URL to be silently dropped.
        self.llm = LLM(
            model="gpt-4-turbo-preview",
            api_key=os.environ.get("OPENROUTER_API_KEY"),
            base_url=os.environ.get("OPENAI_API_BASE"),
        )

    def business_domain_analyzer(self) -> Agent:
        return Agent(
            role="Business Domain Analyzer",
            goal="""Analyze the provided business description to identify:
                1. Primary business domain/industry
                2. Key business activities and processes
                3. Target customers and stakeholders
                4. Main challenges and pain points
                5. Current technology usage patterns
                
                Your analysis will help determine the most relevant generative AI applications for this business.""",
            backstory="""You are an expert business analyst with deep knowledge of various industries and business models. 
                You excel at understanding business operations, identifying process inefficiencies, and recognizing opportunities 
                for technological enhancement. Your insights help bridge the gap between business needs and technology solutions.""",
            llm=self.llm,
            verbose=True
        )

    def genai_research_agent(self) -> Agent:
        return Agent(
            role="Generative AI Research Specialist",
            goal="""Research the latest generative AI technologies, tools, and applications that are relevant to the identified business domain.
                Focus on:
                1. Latest generative AI tools and platforms (ChatGPT, Claude, Midjourney, etc.)
                2. Industry-specific AI applications and use cases
                3. Recent success stories and case studies
                4. Implementation costs and ROI data
                5. Integration possibilities with existing business processes
                
                Stay updated with 2024-2025 developments in generative AI.""",
            backstory="""You are a cutting-edge AI researcher who stays current with the latest developments in generative AI. 
                You have deep knowledge of various AI models, tools, and their practical applications across different industries. 
                You understand both the technical capabilities and business implications of generative AI technologies.""",
            tools=[self.searchInternetTool, self.youtubeSearchTool],
            llm=self.llm,
            verbose=True
        )

    def application_mapper_agent(self) -> Agent:
        return Agent(
            role="AI Application Mapper",
            goal="""Map specific generative AI technologies to the business's processes and activities. Create detailed recommendations for:
                1. Which AI tools can address specific business challenges
                2. How to integrate AI into existing workflows
                3. Expected benefits and outcomes
                4. Implementation roadmap and priorities
                5. Potential risks and mitigation strategies""",
            backstory="""You are a strategic technology consultant specializing in AI implementation. 
                You excel at understanding how emerging technologies can be practically applied to solve real business problems. 
                You have experience across multiple industries and understand both the opportunities and challenges of AI adoption.""",
            llm=self.llm,
            verbose=True
        )

    def content_summarizer_agent(self) -> Agent:
        return Agent(
            role="Technical Content Summarizer",
            goal="""Create a comprehensive, well-structured markdown report that summarizes all research findings. The report should include:
                1. Executive Summary
                2. Business Domain Analysis
                3. Relevant Generative AI Technologies
                4. Specific Application Recommendations
                5. Implementation Roadmap
                6. Expected Benefits and ROI
                7. Next Steps and Resources
                
                The report should be actionable, professional, and easy to understand for business stakeholders.""",
            backstory="""You are a skilled technical writer and consultant who specializes in translating complex AI research 
                into clear, actionable business recommendations. You excel at creating professional reports that help executives 
                and decision-makers understand the practical implications of new technologies.""",
            llm=self.llm,
            verbose=True
        )