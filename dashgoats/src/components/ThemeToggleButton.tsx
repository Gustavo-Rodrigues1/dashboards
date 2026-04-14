interface ThemeToggleButtonProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggleButton = ({ theme, toggleTheme }: ThemeToggleButtonProps) => {
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Alternar tema"
      className="relative flex items-center justify-center w-9 h-9 rounded-full border border-font/10 bg-card hover:bg-card-hover text-font/60 hover:text-font transition-all duration-500 ease-in-out"
    >
      {/* Sol */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute h-4 w-4 transition-all duration-500 ease-in-out ${isLight ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>

      {/* Lua */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`absolute h-4 w-4 transition-all duration-500 ease-in-out ${!isLight ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  );
};

export default ThemeToggleButton;