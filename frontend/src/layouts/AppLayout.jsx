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