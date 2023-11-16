let theme = localStorage.getItem('theme');
if (theme == 'light' || theme == '') {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
}
const btn = document.getElementById('switch-theme');
btn.removeEventListener('click', switchTheme);
function switchTheme() {
  let theme = localStorage.getItem('theme');
  console.log(theme);
  if (theme == 'light' || theme == '') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
}