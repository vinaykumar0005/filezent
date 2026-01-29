export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(../public/bg.jpg)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-6 glass rounded-xl shadow-xl">
        {children}
      </div>
    </div>
  );
}
