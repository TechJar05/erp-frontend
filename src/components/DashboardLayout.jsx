import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AIAssistant from "./AIAssistant";
import TopBar from "./TopBar";

import DashboardView from "../components/dashboard/DashboardView";




const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function DashboardLayout() {
  // Left sidebar state
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [leftMobileOpen, setLeftMobileOpen] = useState(false);

  // Right AI sidebar state
  const [aiOpen, setAiOpen] = useState(false);

  // Scroll state for TopBar blur
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ ACTIVE CONTEXT SESSION
  const [activeSession, setActiveSession] = useState(null);

  // If AI opens -> collapse left sidebar + close left mobile overlay
  useEffect(() => {
    if (aiOpen) {
      setLeftCollapsed(true);
      setLeftMobileOpen(false);
    }
  }, [aiOpen]);

  // Open Left Mobile Sidebar -> close AI
  const openLeftMobile = () => {
    setLeftMobileOpen(true);
    setAiOpen(false);
  };

  const closeLeftMobile = () => setLeftMobileOpen(false);

  const toggleAi = () => {
    setAiOpen((prev) => {
      const next = !prev;
      if (next) {
        setLeftMobileOpen(false);
        setLeftCollapsed(true);
      }
      return next;
    });
  };

  const closeAi = () => setAiOpen(false);

  // Desktop collapse toggle
  const toggleLeftCollapsed = () => {
    if (aiOpen) {
      setLeftCollapsed(true);
      return;
    }
    setLeftCollapsed((v) => !v);
  };

  // If user expands left sidebar on desktop, close AI
  useEffect(() => {
    if (!leftCollapsed) setAiOpen(false);
  }, [leftCollapsed]);

  return (
    <div className="h-screen bg-[#0b1220] text-slate-100 overflow-hidden">
      <div className="flex h-full overflow-hidden">

        {/* LEFT SIDEBAR */}
        <Sidebar
          activeModule={activeSession?.contextId}
          onModuleChange={(session) => setActiveSession(session)}
          leftCollapsed={leftCollapsed}
          setLeftCollapsed={(val) => {
            if (val === false) setAiOpen(false);
            setLeftCollapsed(val);
          }}
          leftMobileOpen={leftMobileOpen}
          setLeftMobileOpen={(val) => {
            if (val === true) setAiOpen(false);
            setLeftMobileOpen(val);
          }}
          onClose={closeLeftMobile}
        />

        {/* MAIN COLUMN */}
        <div
          className={cx(
            "flex-1 min-w-0 flex flex-col",
            aiOpen ? "lg:mr-96" : "lg:mr-0"
          )}
        >
          {/* TOP BAR */}
          <TopBar
            onOpenLeftMobile={openLeftMobile}
            leftCollapsed={leftCollapsed}
            onToggleLeftCollapsed={toggleLeftCollapsed}
            aiOpen={aiOpen}
            onToggleAi={toggleAi}
            isScrolled={isScrolled}
          />

          {/* MAIN SCROLL AREA */}
          <main
            className="flex-1 min-w-0 overflow-y-auto px-4 py-5"
            onScroll={(e) => {
              setIsScrolled(e.currentTarget.scrollTop > 4);
            }}
          >
            {/* ACTIVE SESSION HEADER */}
            {!activeSession && (
              <div className="text-slate-400 text-center mt-20">
                Select a workspace from the left
              </div>
            )}

            {activeSession && (
              <div className="mb-6">
                <h1 className="text-xl font-bold text-white">
                  {activeSession.contextName}
                </h1>
                {/* <div className="text-xs text-slate-400">
                  Session: {activeSession.sessionId}
                </div> */}
              </div>
            )}

            {/* FUTURE: Analytics / Chat / Tasks go here */}
           {activeSession && (
  <DashboardView session={activeSession} />
)}



          </main>
        </div>

        {/* RIGHT AI SIDEBAR */}
       <AIAssistant
  open={aiOpen}
  onClose={closeAi}
  session={activeSession}
/>

      </div>
    </div>
  );
}
