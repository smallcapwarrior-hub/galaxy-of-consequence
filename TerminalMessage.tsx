import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { TypeAnimation } from "react-type-animation";
import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/use-game";

interface TerminalMessageProps {
  message: Message;
  isLast: boolean;
}

export function TerminalMessage({ message, isLast }: TerminalMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "mb-6 p-4 rounded-lg border-l-2 max-w-[90%] md:max-w-[80%]",
        isUser 
          ? "ml-auto bg-primary/5 border-primary text-right" 
          : "mr-auto bg-secondary/5 border-secondary",
        isSystem && "mx-auto bg-destructive/10 border-destructive w-full text-center border-l-0 border-b-2"
      )}
    >
      <div className={cn(
        "text-xs mb-1 font-display tracking-widest opacity-70",
        isUser ? "text-primary" : "text-secondary",
        isSystem && "text-destructive"
      )}>
        {isUser ? ">> COMMAND_INPUT" : isSystem ? "!! SYSTEM_ALERT !!" : ">> GALACTIC_CORE"}
      </div>

      <div className={cn(
        "prose prose-invert prose-p:leading-relaxed max-w-none text-sm md:text-base",
        isUser ? "text-primary-foreground font-medium" : "text-foreground",
        isSystem && "text-destructive font-bold"
      )}>
        {isUser || !isLast ? (
          // Render markdown directly for history or user messages
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : (
          // Typewriter effect only for the latest AI message
          <div className="typing-container">
            <TypeAnimation
              sequence={[
                message.content,
              ]}
              wrapper="div"
              cursor={false} // Custom cursor styling if needed, but default is ok
              speed={75}
              style={{ display: 'block' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
