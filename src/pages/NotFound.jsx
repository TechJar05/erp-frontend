import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-3xl font-bold">404</div>
        <div className="text-slate-400">Page not found</div>
        <Link to="/production" className="inline-block mt-2 px-4 py-2 rounded-xl bg-cyan-600 text-white">
          Go to Production
        </Link>
      </div>
    </div>
  );
}
