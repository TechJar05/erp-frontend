import React from "react";
import { Menu, Sparkles, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function TopBar({
  onOpenLeftMobile,
  leftCollapsed,
  onToggleLeftCollapsed,
  aiOpen,
  onToggleAi,
}) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur border-b border-slate-800 bg-[#0b1220]/70">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left */}
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900"
            onClick={onOpenLeftMobile}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="hidden lg:inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900"
            onClick={onToggleLeftCollapsed}
            aria-label={leftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={leftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {leftCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>

          <div className="leading-tight">
            <div className="text-sm font-semibold">Production Manager Dashboard</div>
            <div className="text-xs text-slate-400">
              Real-time Manufacturing Intelligence
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
  {!aiOpen && (
    <button
      onClick={onToggleAi}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition bg-cyan-500 hover:bg-cyan-600 text-white"
    >
      <Sparkles className="w-4 h-4" />
      Ask AI
    </button>
  )}
</div>

      </div>
    </div>
  );
}
