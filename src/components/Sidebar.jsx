import React, { useRef, useState } from "react";
import {
  BarChart3,
  Package,
  LogOut,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Upload,
  Factory,
  X,
} from "lucide-react";
import { toast } from "sonner";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const modules = [
  { id: "production", label: "Production", icon: BarChart3 },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "quality", label: "Quality", icon: CheckCircle },
  { id: "alerts", label: "Alerts", icon: AlertCircle },
];

export default function Sidebar({
  activeModule,
  onModuleChange,

  leftCollapsed,
  setLeftCollapsed,

  leftMobileOpen,
  setLeftMobileOpen,

  onClose,
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success(`${file.name} uploaded successfully`);
          return 0;
        }
        return Math.min(100, prev + Math.random() * 30);
      });
    }, 200);
  };

  const closeMobile = () => {
    setLeftMobileOpen(false);
    if (onClose) onClose();
  };

  const isCollapsed = !!leftCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {leftMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cx(
          "fixed lg:static top-0 left-0 h-screen z-50 flex flex-col overflow-hidden border-r border-slate-800 bg-[#0b1220]",
          "transition-all duration-300",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          leftMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className={cx("border-b border-slate-800", isCollapsed ? "p-4" : "p-6")}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <Factory className="w-5 h-5 text-white" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-100 truncate">TechJar</h2>
                  <p className="text-xs text-slate-400 truncate">ERP Platform</p>
                </div>
              )}
            </div>

            {/* Close (mobile only) */}
            <button
              onClick={closeMobile}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-200"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Collapse hint (desktop only) */}
          <div className="hidden lg:block mt-4">
            <button
              onClick={() => setLeftCollapsed((v) => !v)}
              className={cx(
                "w-full rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900 transition",
                "text-xs text-slate-300",
                isCollapsed ? "px-0 py-2" : "px-3 py-2"
              )}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? "»" : "Collapse"}
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto">
          {/* Data upload */}
          <div className={cx("space-y-3", isCollapsed ? "p-3" : "p-4")}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                Data Management
              </h3>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,.json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className={cx(
                "w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/15 transition",
                "flex items-center justify-center gap-2",
                isCollapsed ? "h-11" : "h-11 px-3",
                "text-cyan-200"
              )}
              title="Upload Data"
            >
              <Upload className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm font-semibold">Upload Data</span>}
            </button>

            {uploadProgress > 0 && uploadProgress < 100 && !isCollapsed && (
              <div className="rounded-xl bg-cyan-500/10 p-3 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-200">Uploading...</span>
                  <span className="text-xs text-slate-400">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modules */}
          <div className={cx("space-y-2", isCollapsed ? "p-3" : "p-4")}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                Modules
              </h3>
            )}

            <nav className="space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      onModuleChange(module.id);
                      closeMobile();
                    }}
                    className={cx(
                      "w-full rounded-xl transition flex items-center gap-3",
                      isCollapsed ? "justify-center h-11" : "justify-start h-11 px-3",
                      isActive
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-900/20 hover:bg-slate-900/40 text-slate-200",
                      "border border-transparent",
                      isActive && "border-cyan-400/30"
                    )}
                    title={module.label}
                  >
                    <Icon className="w-4 h-4" />
                    {!isCollapsed && <span className="text-sm font-semibold">{module.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats
          {!isCollapsed && (
            <div className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                Quick Stats
              </h3>

              <div className="space-y-2">
                <div className="rounded-xl p-3 bg-slate-900/25 border border-slate-800">
                  <p className="text-xs text-slate-400">Active Orders</p>
                  <p className="text-lg font-bold text-cyan-200">24</p>
                </div>
                <div className="rounded-xl p-3 bg-slate-900/25 border border-slate-800">
                  <p className="text-xs text-slate-400">OEE Score</p>
                  <p className="text-lg font-bold text-cyan-200">87.5%</p>
                </div>
                <div className="rounded-xl p-3 bg-slate-900/25 border border-slate-800">
                  <p className="text-xs text-slate-400">Inventory Level</p>
                  <p className="text-lg font-bold text-cyan-200">92%</p>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Footer */}
<div className={cx(
  "border-t border-slate-800",
  isCollapsed ? "p-3" : "p-4"
)}>
  <button
    className={cx(
      "w-full rounded-xl transition flex items-center gap-3",
      isCollapsed ? "justify-center h-11" : "justify-start h-11 px-3",
      "bg-red-500/10 hover:bg-red-500/20",
      "text-red-400 hover:text-red-300",
      "border border-red-500/30"
    )}
    title="Logout"
  >
    <LogOut className="w-4 h-4" />
    {!isCollapsed && <span className="text-sm font-semibold">Logout</span>}
  </button>
</div>

      </aside>
    </>
  );
}
