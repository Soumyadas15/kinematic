export const THEME_STORAGE_KEY = "theme"

export const themeScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`
