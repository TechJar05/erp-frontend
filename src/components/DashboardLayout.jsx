import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AIAssistant from "./AIAssistant";
import TopBar from "./TopBar";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Left sidebar state
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [leftMobileOpen, setLeftMobileOpen] = useState(false);

  // Right AI sidebar state
  const [aiOpen, setAiOpen] = useState(false);

  // ✅ Scroll state for TopBar blur
  const [isScrolled, setIsScrolled] = useState(false);

  const activeModule = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/inventory")) return "inventory";
    if (path.startsWith("/sales")) return "sales";
    if (path.startsWith("/quality")) return "quality";
    if (path.startsWith("/alerts")) return "alerts";
    return "production";
  }, [location.pathname]);

  // ✅ If AI opens -> collapse left sidebar + close left mobile overlay
  useEffect(() => {
    if (aiOpen) {
      setLeftCollapsed(true);
      setLeftMobileOpen(false);
    }
  }, [aiOpen]);

  // ✅ Open Left Mobile Sidebar -> close AI
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

  // ✅ Desktop collapse toggle:
  const toggleLeftCollapsed = () => {
    if (aiOpen) {
      setLeftCollapsed(true);
      return;
    }
    setLeftCollapsed((v) => !v);
  };

  // ✅ If user expands left sidebar on desktop, close AI
  useEffect(() => {
    if (!leftCollapsed) setAiOpen(false);
  }, [leftCollapsed]);

  const handleModuleChange = (moduleId) => {
    if (moduleId === "production") navigate("/production");
    if (moduleId === "inventory") navigate("/inventory");
    if (moduleId === "sales") navigate("/sales");
    if (moduleId === "quality") navigate("/quality");
    if (moduleId === "alerts") navigate("/alerts");

    setLeftMobileOpen(false);
  };

  return (
    <div className="h-screen bg-[#0b1220] text-slate-100 overflow-hidden">
      <div className="flex h-full overflow-hidden">

        {/* LEFT SIDEBAR */}
        <Sidebar
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
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
            isScrolled={isScrolled}   // ✅ PASS SCROLL STATE
          />

          {/* MAIN SCROLL AREA */}
          <main
            className="flex-1 min-w-0 overflow-y-auto px-4 py-5"
            onScroll={(e) => {
              setIsScrolled(e.currentTarget.scrollTop > 4);
            }}
          >
            <Outlet />
          </main>
        </div>

        {/* RIGHT AI SIDEBAR */}
        <AIAssistant open={aiOpen} onClose={closeAi} />
      </div>
    </div>
  );
}
