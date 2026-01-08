// import React, { useEffect, useState } from "react";
// import { fetchSalesMetric } from "../../api/analytics";

// export default function SalesAnalyticsPanel({ session }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!session) return;

//     async function load() {
//       try {
//         setLoading(true);
//         setError(null);

//         const result = await fetchSalesMetric(
//           session.sessionId,
//           "open_sales_orders"
//         );

//         setData(result);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load sales analytics");
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [session]);

//   if (!session) return null;
//   if (loading) return <div className="text-slate-400">Loading analytics...</div>;
//   if (error) return <div className="text-red-400">{error}</div>;

//   if (!data || data.length === 0) {
//     return <div className="text-slate-400">No data available</div>;
//   }

//   const columns = Object.keys(data[0]);

//   return (
//     <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
//       <div className="px-4 py-3 border-b border-slate-800 text-sm font-semibold">
//         Open Sales Orders
//       </div>

//       <table className="w-full text-sm">
//         <thead className="bg-slate-800/40">
//           <tr>
//             {columns.map((col) => (
//               <th key={col} className="text-left px-3 py-2 text-slate-300">
//                 {col}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, idx) => (
//             <tr key={idx} className="border-t border-slate-800">
//               {columns.map((col) => (
//                 <td key={col} className="px-3 py-2 text-slate-200">
//                   {String(row[col])}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
