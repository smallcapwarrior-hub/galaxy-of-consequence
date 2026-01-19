import { useEffect, useRef } from "react";
import { useGameSession } from "@/hooks/use-game";
import { TerminalMessage } from "@/components/TerminalMessage";
import { GameInput } from "@/components/GameInput";
import { HUD } from "@/components/HUD";
import { motion } from "framer-motion";

export default function Game() {
  const { messages, sendMessage, isPending, choices, initGame, resetGame, isGameOver } = useGameSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-background to-background z-0 pointer-events-none" />
      <div className="absolute inset-0 scanlines z-10 pointer-events-none opacity-20" />
      
      {/* Heads Up Display */}
      <HUD />

      {/* Main Terminal Area */}
      <main className="relative z-20 flex-1 w-full max-w-4xl mx-auto pt-24 pb-32 px-4 md:px-8 overflow-y-auto scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-primary font-mono animate-pulse">ESTABLISHING NEURAL LINK...</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <TerminalMessage 
              key={msg.id} 
              message={msg} 
              isLast={idx === messages.length - 1} 
            />
          ))}
          
          {isPending && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="flex items-center gap-2 text-secondary/50 font-mono text-xs ml-4"
             >
               <span className="w-2 h-2 bg-secondary rounded-full animate-ping" />
               PROCESSING QUANTUM DATA...
             </motion.div>
          )}
          
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-background via-background to-transparent pb-8">
        <div className="max-w-4xl mx-auto">
          {isGameOver ? (
            <div className="text-center space-y-4 p-6 border border-destructive/50 bg-destructive/10 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-display text-destructive animate-pulse">MISSION TERMINATED</h2>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-destructive text-white font-bold tracking-widest hover:bg-destructive/80 transition-all rounded-sm"
              >
                REBOOT SYSTEM
              </button>
            </div>
          ) : (
            <GameInput 
              onSend={sendMessage} 
              isLoading={isPending} 
              choices={choices} 
            />
          )}
        </div>
      </footer>
    </div>
  );
}
