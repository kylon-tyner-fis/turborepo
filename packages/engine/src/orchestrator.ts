import OpenAI from "openai";
import {
  EvaluationRequest,
  EngineResponseSchema,
  EngineResponse,
} from "@repo/shared";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runEvaluation(
  req: EvaluationRequest,
): Promise<EngineResponse> {
  const { snapshot, node_context } = req;

  console.log("OpenAI API Key Loaded:", process.env.OPENAI_API_KEY);

  const systemMessage = `
      You are the Orchestration Engine for an interactive learning platform.
      
      CURRENT NODE DEFINITION: ${JSON.stringify(node_context, null, 2)}

      SIMULATION RULES: ${node_context.simulation_rules || "Default: Act as a helpful technical assistant."}

      EXIT CONDITIONS: ${JSON.stringify(node_context.navigation)}

      INSTRUCTIONS:
      1. Review the 'widget_states' provided by the user.
      2. If the user's input satisfies a 'validation_objective' in the 'navigation' array, 
         set 'navigation.should_transition' to true and 'target_node_id' to that target.
      3. Provide a 'feedback' message and any 'simulation_output' (like terminal logs).
      4. ALWAYS respond in the required JSON format.
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: JSON.stringify(snapshot.widget_states) },
    ],
    response_format: { type: "json_object" },
  });

  const aiContent = completion.choices[0].message.content || "{}";
  setTimeout(() => console.log("AI CONTENT:", aiContent), 5000);
  return EngineResponseSchema.parse(JSON.parse(aiContent));
}
