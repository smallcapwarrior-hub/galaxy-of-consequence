import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/image/client";

const SYSTEM_PROMPT = `
You are the Galaxy itself. You enforce lore, memory, consequences, and difficulty scaling in a Star Wars universe.
Your goal is to be an immersive, text-based Game Master.

CORE DIRECTIVES:
1. Maintain a consistent world state.
2. Track player character details (name, species, class, skills, inventory).
3. Track factions and reputation.
4. Scale difficulty based on player actions.
5. Do not railroad. Allow free will.
6. Keep responses concise but evocative (2–4 paragraphs).
7. If the player is creating a character, guide them naturally.

OUTPUT FORMAT:
You must strictly output valid JSON and nothing else.

{
  "response": "Narrative response text",
  "worldState": { "updated": "state object" },
  "choices": ["Option A", "Option B"], 
  "isGameOver": false
}
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.game.play.path, async (req, res) => {
    try {
      const input = api.game.play.input.parse(req.body);
      let session;

      // Retrieve or create session
      if (input.sessionId) {
        session = await storage.getSession(input.sessionId);
      }

      if (!session) {
        const newSessionId =
          input.sessionId || Math.random().toString(36).substring(7);

        session = await storage.createSession({
          sessionId: newSessionId,
          worldState: {
            status: "character_creation",
            step: "init",
            inventory: [],
            factions: {},
            location: "Unknown"
          }
        });
      }

      // Call OpenAI Responses API (CORRECT USAGE)
      const responseObj = await openai.responses.create({
        model: "gpt-4.1",
        input: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `
WORLD STATE:
${JSON.stringify(session.worldState, null, 2)}

PLAYER INPUT:
${input.content || (session.worldState.step === "init" ? "Begin the game." : "")}
            `
          }
        ]
      });

      // Safely extract text
      const aiText =
        responseObj.output_text ||
        JSON.stringify(responseObj.output, null, 2);

      let aiResponse: any;

      try {
        aiResponse = JSON.parse(aiText);
      } catch (parseError) {
        console.error("AI JSON Parse Error:", parseError);
        aiResponse = {
          response:
            "The Force shudders. The simulation momentarily destabilizes.",
          worldState: session.worldState,
          choices: [],
          isGameOver: false
        };
      }

      // Persist updated world state
      await storage.updateSession(
        session.sessionId,
        aiResponse.worldState || session.worldState
      );

      // Return response to client
      res.json({
        response: aiResponse.response,
        sessionId: session.sessionId,
        choices: aiResponse.choices || [],
        isGameOver: aiResponse.isGameOver || false
      });

    } catch (err) {
      console.error(err);

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join(".")
        });
      }

      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}