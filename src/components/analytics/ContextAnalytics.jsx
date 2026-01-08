// import InventoryAnalyticsPanel from "./AnalyticsPanel";
// import SalesAnalyticsPanel from "./SalesAnalyticsPanel";

// export default function ContextAnalytics({ session }) {
//   if (!session) return null;

//   // Decide by context name (simple and safe for now)
//   if (session.contextName.toLowerCase().includes("inventory")) {
//     return <InventoryAnalyticsPanel session={session} />;
//   }

//   if (session.contextName.toLowerCase().includes("sales")) {
//     return <SalesAnalyticsPanel session={session} />;
//   }

//   return (
//     <div className="text-slate-400">
//       No analytics panel available for this context.
//     </div>
//   );
// }
