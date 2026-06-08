function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const toggleBtn = document.getElementById("theme-mode");

  if (currentTheme === "dark") {
    html.removeAttribute("data-theme");
    toggleBtn.textContent = "🌙";
  } else {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  }
}
// Мобильное выпадающее меню
function initMobileDropdowns() {
    const toggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const parent = toggle.parentElement;
            const submenu = parent.querySelector('.mobile-submenu');
            
            // Закрываем другие открытые подменю
            document.querySelectorAll('.mobile-submenu').forEach(menu => {
                if (menu !== submenu) {
                    menu.classList.remove('active');
                }
            });
            
            // Переключаем текущее
            submenu.classList.toggle('active');
        });
    });
}

// Мобильное меню бургер
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuBtn.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
            
            // Закрываем все подменю при закрытии главного меню
            if (!mobileMenu.classList.contains('active')) {
                document.querySelectorAll('.mobile-submenu').forEach(menu => {
                    menu.classList.remove('active');
                });
            }
        });
    }
}

// Подсветка активного пункта меню
function highlightActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.horizontal-menu a, .vertical-menu a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'home.html')) {
            link.classList.add('active');
        }
    });
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initMobileDropdowns();
    highlightActiveMenuItem();
});