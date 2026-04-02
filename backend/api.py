from flask import Flask, jsonify, request, abort
from uuid import uuid4
from threading import Thread
from crews import GenAIBusinessResearchCrew
from log_manager import append_event, outputs, outputs_lock, Event
from datetime import datetime
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def kickoff_crew(input_id, business_description: str):
    print(f"Running GenAI Business Research crew for {input_id} with business description: {business_description[:100]}...")

    results = None
    try:
        genai_research_crew = GenAIBusinessResearchCrew(input_id)
        genai_research_crew.setup_crew(business_description)
        results = genai_research_crew.kickoff()

    except Exception as e:
        print(f"CREW FAILED: {str(e)}")
        append_event(input_id, f"CREW FAILED: {str(e)}")
        with outputs_lock:
            outputs[input_id].status = 'ERROR'
            outputs[input_id].result = str(e)
        return  # Early return to avoid setting COMPLETE status

    with outputs_lock:
        outputs[input_id].status = 'COMPLETE'
        outputs[input_id].result = results
        outputs[input_id].events.append(
            Event(timestamp=datetime.now(), data="GenAI Business Research complete"))

@app.route('/api/genai-analysis', methods=['POST'])
def run_genai_analysis():
    data = request.json
    if not data or 'business_description' not in data:
        abort(400, description="Invalid request. Please provide 'business_description' field.")
 
    input_id = str(uuid4())
    business_description = data['business_description']

    # Initialize output entry BEFORE starting the thread to avoid a race condition
    # where the frontend polls /api/multiagent/<id> before the thread has had a chance
    # to call append_event (which is the only other place that creates the entry).
    with outputs_lock:
        outputs[input_id] = Output(status='STARTED', events=[], result='')

    thread = Thread(target=kickoff_crew, args=(input_id, business_description))
    thread.start()
    
    return jsonify({"input_id": input_id}), 200


@app.route('/api/multiagent/<input_id>', methods=['GET'])
def get_status(input_id):
    with outputs_lock:
        output = outputs.get(input_id)
        if output is None:
            abort(404, description="Output not found")

    # DEBUG: Let's see what we're working with
    print(f"DEBUG - Output status: {output.status}")
    print(f"DEBUG - Output result type: {type(output.result)}")
    print(f"DEBUG - Output result: {output.result}")
    
    if hasattr(output.result, '__dict__'):
        print(f"DEBUG - Output result attributes: {output.result.__dict__}")
    if hasattr(output.result, 'raw'):
        print(f"DEBUG - Raw content: {output.result.raw}")
    if hasattr(output.result, 'json_dict'):
        print(f"DEBUG - JSON dict: {output.result.json_dict}")

    # Handle CrewOutput object and other result types
    result_json = None
    
    try:
        if output.result is None:
            result_json = {"message": "No result available"}
        elif hasattr(output.result, 'raw'):  # CrewOutput object
            # Extract the raw result from CrewOutput
            raw_result = output.result.raw
            print(f"DEBUG - Raw result: {raw_result}")
            print(f"DEBUG - Raw result type: {type(raw_result)}")
            
            if isinstance(raw_result, str):
                try:
                    result_json = json.loads(raw_result)
                except json.JSONDecodeError as e:
                    print(f"DEBUG - JSON decode failed: {e}")
                    result_json = {"message": raw_result}
            else:
                result_json = raw_result
        elif hasattr(output.result, 'json_dict'):  # Some CrewOutput versions
            result_json = output.result.json_dict
        elif hasattr(output.result, '__dict__'):  # Generic object
            # Convert object to dict, filtering out non-serializable items
            result_dict = {}
            for key, value in output.result.__dict__.items():
                try:
                    json.dumps(value)  # Test if serializable
                    result_dict[key] = value
                except TypeError:
                    result_dict[key] = str(value)  # Convert to string if not serializable
            result_json = result_dict
        elif isinstance(output.result, str):
            # Try to parse as JSON string
            if output.result.strip():
                try:
                    result_json = json.loads(output.result)
                except json.JSONDecodeError:
                    result_json = {"message": output.result}
            else:
                result_json = {"message": "Empty result"}
        else:
            # Try to serialize directly, fallback to string conversion
            try:
                json.dumps(output.result)  # Test if serializable
                result_json = output.result
            except TypeError:
                result_json = {"message": str(output.result)}
            
    except Exception as e:
        print(f"Error processing result: {e}")
        result_json = {"error": f"Failed to process result: {str(e)}"}

    print(f"DEBUG - Final result_json: {result_json}")

    return jsonify({
        "input_id": input_id,
        "status": output.status,
        "result": result_json,
        "events": [{"timestamp": event.timestamp.isoformat(), "data": event.data} for event in output.events]
    })

if __name__ == '__main__':
    app.run(debug=True, port=3001)