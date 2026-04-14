import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggleButton from "./ThemeToggleButton";
import React from "react";
import useThemeToggle from "../hooks/ToggleTheme";

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  const base = "relative text-sm text-font/60 hover:text-font transition-colors duration-500 ease-in-out after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-red-500 after:transition-all after:duration-500 after:ease-in-out hover:after:w-full";
  const active = "text-font after:w-full";

  return (
    <>
      <NavLink to="/" onClick={onClick} className={({ isActive }) => `${base} ${isActive ? active : ""}`}>Home</NavLink>
      <NavLink to="/pilotos" onClick={onClick} className={({ isActive }) => `${base} ${isActive ? active : ""}`}>Pilotos</NavLink>
      <NavLink to="/construtores" onClick={onClick} className={({ isActive }) => `${base} ${isActive ? active : ""}`}>Construtores</NavLink>
    </>
  );
};

const Navbar = () => {
  const { theme, toggleTheme } = useThemeToggle();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Desktop */}
      <nav className="flex w-1/3">
        <div className="hidden gap-6 items-center w-full justify-between md:flex">
          <NavLinks />
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Botão mobile */}
        <div className="md:hidden flex items-center z-10">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-font/60 hover:text-font hover:bg-card transition-all duration-500 ease-in-out"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar mobile */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-card z-30 flex flex-col shadow-card md:hidden transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Topo da sidebar */}
        <div className="flex items-center justify-end px-4 h-[72px] border-b border-font/10">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-font/60 hover:text-font hover:bg-card-hover transition-all duration-500 ease-in-out"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-1 px-3 mt-4">
          <NavLinks onClick={toggleSidebar} />
        </div>

        {/* Theme toggle */}
        <div className="mt-auto px-4 pb-8">
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </>
  );
};

export default Navbar;