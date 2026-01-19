import { Activity, Radio, Shield, Wifi } from "lucide-react";

export function HUD() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        {/* Left Stats */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-secondary bg-black/50 backdrop-blur-md px-3 py-1 border border-secondary/30 rounded-sm">
            <Radio size={14} className="animate-pulse" />
            <span className="text-xs font-display tracking-widest">SIGNAL_STRENGTH: 98%</span>
          </div>
          <div className="flex items-center gap-2 text-primary bg-black/50 backdrop-blur-md px-3 py-1 border border-primary/30 rounded-sm">
            <Activity size={14} />
            <span className="text-xs font-display tracking-widest">LIFE_SUPPORT: ACTIVE</span>
          </div>
        </div>

        {/* Center Title - only visible on large screens */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4">
          <h1 className="text-xl md:text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary opacity-80 font-display tracking-[0.2em] border-b border-white/10 pb-2">
            GALAXY OF CONSEQUENCE
          </h1>
        </div>

        {/* Right Stats */}
        <div className="flex flex-col gap-2 items-end">
           <div className="flex items-center gap-2 text-accent bg-black/50 backdrop-blur-md px-3 py-1 border border-accent/30 rounded-sm">
            <span className="text-xs font-display tracking-widest">THREAT_LEVEL: LOW</span>
            <Shield size={14} />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-black/50 backdrop-blur-md px-3 py-1 border border-white/10 rounded-sm">
            <span className="text-xs font-mono">SYS_TIME: {new Date().toLocaleTimeString([], { hour12: false })}</span>
            <Wifi size={14} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
