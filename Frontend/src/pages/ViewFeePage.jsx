// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function ViewFeePage() {
//   const [fees, setFees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFees = async () => {
//       try {
//         const response = await axios.get("/fees", {
//           timeout: 5000 // 5 seconds timeout
//         });
//         setFees(response.data.fees || []);
//         setLoading(false);
//       } catch (err) {
//         const errorMessage = err.code === 'ECONNABORTED' || !navigator.onLine 
//           ? 'Network error - Please check your internet connection'
//           : 'Failed to load fees details. Please try again.';
//         setError(errorMessage);
//         setLoading(false);
//       }
//     };
//     fetchFees();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fees Details</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {Array.from({ length: 8 }).map((_, index) => (
//             <div key={index} className="bg-white rounded-lg shadow-lg p-4 animate-pulse">
//               <div className="w-full h-36 bg-gray-300 rounded-t-lg"></div>
//               <div className="p-4">
//                 <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
//                 <div className="h-5 bg-gray-300 rounded w-1/2"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mt-10 text-center">
//         <h2 className="text-xl font-medium text-red-600 mb-2">{error}</h2>
//         <p className="text-gray-600">Please refresh the page or try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fees Details</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {fees.map((fee) => (
//           <div key={fee._id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">{fee.title}</h2>
//             <a
//               href={fee.description}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 underline"
//             >
//               View / Download
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ViewFeePage;
