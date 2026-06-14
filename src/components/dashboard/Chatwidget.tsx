// "use client";

// import { MessageSquareText, X } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";

// export default function ChatWidget() {
//   const [open, setOpen] = useState(true);

//   if (!open) {
//     return (
//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         aria-label="Buka chat"
//         className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition-transform hover:scale-105"
//       >
//         <MessageSquareText className="h-5 w-5" />
//       </button>
//     );
//   }

//   return (
//     <div className="fixed bottom-6 right-6 z-50 w-72 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
//       <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
//         <div className="flex items-center gap-2">
//           <span className="h-2 w-2 rounded-full bg-emerald-400" />
//           <span className="text-sm font-semibold text-slate-700">
//             Sesi Aktif
//           </span>
//         </div>
//         <button
//           type="button"
//           onClick={() => setOpen(false)}
//           aria-label="Tutup chat"
//           className="text-slate-400 transition-colors hover:text-slate-600"
//         >
//           <X className="h-4 w-4" />
//         </button>
//       </div>

//       <div className="flex items-center gap-3 px-4 py-3">
//         <Image
//           src="https://i.pravatar.cc/40?img=47"
//           alt="Dr. Sarah Anindita"
//           width={36}
//           height={36}
//           className="h-9 w-9 rounded-full object-cover"
//         />
//         <div className="flex-1">
//           <p className="text-sm font-semibold text-slate-800">
//             Dr. Sarah Anindita
//           </p>
//           <p className="text-xs text-slate-400">Menunggu balasan Anda...</p>
//         </div>
//         <span className="rounded-full bg-teal-50 p-1.5 text-teal-500">
//           <MessageSquareText className="h-3.5 w-3.5" />
//         </span>
//       </div>
//     </div>
//   );
// }