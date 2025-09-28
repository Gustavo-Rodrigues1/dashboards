let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
    document.body.classList.add('darkmode')
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkmode', 'true')
}

if(darkmode === 'true') enableDarkmode()

const disableDarkmode = () => {
    document.body.classList.remove('darkmode')
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('darkmode', 'false')
}

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "true" ? enableDarkmode() : disableDarkmode()
})

const hamburguerMenu = document.querySelector(".mobile-nav-list")
const sideBar = document.querySelector(".side-bar")

hamburguerMenu.addEventListener("click", () => {
    sideBar.classList.toggle("show");
})