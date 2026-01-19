import { useMutation } from "@tanstack/react-query";
import { api, type PlayRequest } from "@shared/routes";
import { useState, useEffect } from "react";

/* =========================
   TYPES
   ========================= */

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

export type PlayerState = {
  name: string;
  health: number;
  stamina: number;
  credits: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH";
  location: string;
};

/* =========================
   DEFAULT PLAYER (TEST MODE)
   ========================= */

const DEFAULT_PLAYER: PlayerState = {
  name: "D’mir Holloràn",
  health: 80,
  stamina: 65,
  credits: 1200,
  threatLevel: "LOW",
  location: "Coruscant — Level 1313",
};

/* =========================
   STORAGE KEYS
   ========================= */

const STORAGE_KEYS = {
  session: "goc_session_id",
  messages: "goc_messages",
  player: "goc_player_state",
};

/* =========================
   GAME SESSION HOOK
   ========================= */

export function useGameSession() {
  /* ---------- Session ---------- */
  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.session);
  });

  /* ---------- Narrative ---------- */
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.messages);
    return stored ? JSON.parse(stored) : [];
  });

  const [choices, setChoices] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  /* ---------- Player / HUD ---------- */
  const [player, setPlayer] = useState<PlayerState>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.player);
    return stored ? JSON.parse(stored) : DEFAULT_PLAYER;
  });

  /* =========================
     PERSISTENCE (CRITICAL)
     ========================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.player, JSON.stringify(player));
  }, [player]);

  /* =========================
     PLAY TURN MUTATION
     ========================= */

  const playMutation = useMutation({
    mutationFn: async (content: string) => {
      const payload: PlayRequest = {
        content,
        sessionId: sessionId || undefined,
      };

      const res = await fetch(api.game.play.path, {
        method: api.game.play.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Uplink disruption");
      }

      return api.game.play.responses[200].parse(await res.json());
    },

    onSuccess: (data) => {
      /* ---------- Session ---------- */
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(STORAGE_KEYS.session, data.sessionId);
      }

      /* ---------- AI Message ---------- */
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      /* ---------- Choices ---------- */
      setChoices(data.choices || []);

      /* ---------- Player State Updates ---------- */
      if (data.playerUpdate) {
        setPlayer((prev) => {
          const updated = { ...prev };

          for (const key in data.playerUpdate) {
            const incoming = data.playerUpdate[key];
            const current = prev[key as keyof PlayerState];

            // Numeric deltas (health -5, credits +200)
            if (typeof incoming === "number" && typeof current === "number") {
              // @ts-ignore
              updated[key] = current + incoming;
            } else {
              // Direct overrides (location, threatLevel)
              // @ts-ignore
              updated[key] = incoming;
            }
          }

          return updated;
        });
      }

      if (data.isGameOver) {
        setIsGameOver(true);
      }
    },

    onError: (error: any) => {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "system",
        content: `:: SYSTEM ERROR :: ${error.message} :: LINK STABLE…`,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    },
  });

  /* =========================
     ACTIONS
     ========================= */

  const sendMessage = (content: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    playMutation.mutate(content);
  };

  const initGame = () => {
    if (!sessionId && messages.length === 0) {
      playMutation.mutate("INITIALIZE_UPLINK");
    }
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    localStorage.removeItem(STORAGE_KEYS.messages);
    localStorage.removeItem(STORAGE_KEYS.player);

    setSessionId(null);
    setMessages([]);
    setChoices([]);
    setIsGameOver(false);
    setPlayer(DEFAULT_PLAYER);

    playMutation.mutate("START_NEW_GAME");
  };

  /* =========================
     PUBLIC API
     ========================= */

  return {
    /* Narrative */
    messages,
    choices,
    isGameOver,

    /* Player / HUD */
    player,

    /* Controls */
    sendMessage,
    initGame,
    resetGame,

    /* Meta */
    isPending: playMutation.isPending,
    hasSession: !!sessionId,
  };
}