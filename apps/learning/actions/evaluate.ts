"use server";

import { runEvaluation } from "@repo/engine";
import { EngineResponse, EvaluationRequest } from "@repo/shared";

export async function evaluateWorkAction(
  request: EvaluationRequest,
): Promise<EngineResponse> {
  try {
    return await runEvaluation(request);
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to evaluate work.");
  }
}
