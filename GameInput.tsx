import { useState, FormEvent, useRef, useEffect } from "react";
import { Send, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GameInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  choices: string[];
  disabled?: boolean;
}

export function GameInput({ onSend, isLoading, choices, disabled }: GameInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !disabled) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isLoading, disabled]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSend(input);
    setInput("");
  };

  const handleChoice = (choice: string) => {
    onSend(choice);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Choices Area */}
      <AnimatePresence>
        {choices.length > 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mb-4 justify-center"
          >
            {choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(choice)}
                disabled={isLoading}
                className="
                  px-4 py-2 text-sm font-mono border border-secondary text-secondary
                  bg-secondary/10 hover:bg-secondary/20 hover:text-white hover:border-white
                  active:bg-secondary/30 transition-all duration-200
                  uppercase tracking-wider rounded-sm
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                [{idx + 1}] {choice}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-center gap-2 p-2 bg-black/80 border border-primary/30 rounded-md backdrop-blur-sm transition-all duration-300",
          isLoading ? "opacity-70 border-primary/10" : "border-primary hover:border-primary/80 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50"
        )}
      >
        <div className="pl-2 text-primary animate-pulse">
          <Terminal size={18} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "AWAITING RESPONSE..." : "ENTER COMMAND..."}
          disabled={isLoading || disabled}
          className="
            flex-1 bg-transparent border-none outline-none 
            text-foreground font-mono placeholder:text-muted-foreground
            focus:ring-0
          "
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="
            p-2 text-primary hover:text-white hover:bg-primary/20 rounded-sm
            disabled:opacity-30 disabled:hover:bg-transparent
            transition-colors
          "
        >
          <Send size={18} />
        </button>
      </form>

      {/* Status Line */}
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground font-mono uppercase tracking-widest px-1">
        <span>Uplink: {isLoading ? "TRANSMITTING..." : "STABLE"}</span>
        <span>Secure Protocol v9.0</span>
      </div>
    </div>
  );
}
