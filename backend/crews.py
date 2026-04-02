import os
from dotenv import load_dotenv, find_dotenv
from log_manager import append_event
from agents import GenAIBusinessAgents
from tasks import GenAIBusinessTasks
from crewai import Crew

_ = load_dotenv(find_dotenv())


class GenAIBusinessResearchCrew:
    def __init__(self, input_id: str):
        self.input_id = input_id
        self.crew = None

    def setup_crew(self, business_description: str):
        print(f"""Setting up GenAI Business Research crew for
        {self.input_id} with business description: {business_description[:100]}...""")

        # SETUP AGENTS
        agents = GenAIBusinessAgents()

        domain_analyzer = agents.business_domain_analyzer()
        genai_researcher = agents.genai_research_agent()
        application_mapper = agents.application_mapper_agent()
        content_summarizer = agents.content_summarizer_agent()
  
        # SETUP TASKS
        tasks = GenAIBusinessTasks(input_id=self.input_id)

        # Create task sequence
        domain_analysis_task = tasks.analyze_business_domain(domain_analyzer, business_description)
        
        genai_research_task = tasks.research_genai_applications(genai_researcher, business_description)
        
        application_mapping_task = tasks.map_ai_applications(application_mapper, business_description)
        
        final_report_task = tasks.create_final_report(content_summarizer, business_description)
        
        # CREATE CREW
        self.crew = Crew(
            agents=[domain_analyzer, genai_researcher, application_mapper, content_summarizer],
            tasks=[domain_analysis_task, genai_research_task, application_mapping_task, final_report_task],
            verbose=True,
            )

    def kickoff(self):
        if not self.crew:
            print(f"""Crew not found for {self.input_id}""")
            return
        
        append_event(self.input_id, "GenAI Business Research CREW STARTED")
        
        try:
            print(f"""Running GenAI Business Research crew for {self.input_id}""")
            results = self.crew.kickoff()
            append_event(self.input_id, "GenAI Business Research CREW COMPLETED")
            return results

        except Exception as e:
            append_event(self.input_id, f"GenAI Business Research CREW FAILED: {str(e)}")
            return str(e)