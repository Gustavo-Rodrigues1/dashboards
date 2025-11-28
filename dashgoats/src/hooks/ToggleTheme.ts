import { useState, useEffect } from 'react';

const useThemeToggle = () => {
  //Inicializa o estado lendo do localStorage ou assume 'light'
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      return 'dark';
    }
    return 'light';
  });

  //Efeito para aplicar a classe e salvar no localStorage
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]); // Roda sempre que o estado 'theme' mudar

  //Função de alternância
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export default useThemeToggle;