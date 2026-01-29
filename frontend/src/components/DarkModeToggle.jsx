export default function DarkModeToggle() {
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button className="btn" onClick={toggle}>
      Toggle Dark Mode
    </button>
  );
}
