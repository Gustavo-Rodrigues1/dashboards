import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggleButton from "./ThemeToggleButton";
import React from "react";
import useThemeToggle from "../hooks/ToggleTheme";


const NavLinks = () => {
  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/pilotos">Pilotos</NavLink>
      <NavLink to="/construtores">Construtores</NavLink>
    </>
  );
};

const Navbar = () => {
  const { theme, toggleTheme } = useThemeToggle();

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
    <nav className="flex w-1/3">
      <div className="hidden gap-4 items-center w-full justify-between md:flex">
      <NavLinks />
      <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </div>
      <div className="md:hidden flex flex-col justify-center z-10">
        <button onClick={toggleSidebar}>{isOpen ? <X/> : <Menu/>}</button>
      </div>
    </nav>
    {isOpen && (
      <div className="flex flex-col items-center justify-center bg-card fixed w-60 h-screen md:hidden">
        <NavLinks />
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </div>
    )}
    </>
  );
};

export default Navbar;