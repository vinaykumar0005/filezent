import Header from "../components/Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container-app py-8">
        <div className="glass rounded-xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}


//old frontend
// import { logout } from "../utils/auth";

// export default function AppLayout({ children }) {
//     const user = JSON.parse(localStorage.getItem("user"));

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <header className="bg-black text-white px-4 py-3 flex justify-between items-center">
//                 <div>
//                     <h1 className="font-bold text-lg">Filezent</h1>
//                     <p className="text-xs text-gray-300">
//                         Welcome, {user?.name}
//                     </p>
//                 </div>

//                 <button
//                     onClick={logout}
//                     className="text-sm bg-white text-black px-3 py-1 rounded"
//                 >
//                     Logout
//                 </button>
//             </header>

//             <main className="p-4 max-w-6xl mx-auto">{children}</main>
//         </div>
//     );
// }
