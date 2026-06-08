// Загрузка компонентов на страницу
function loadComponent(selector, url, callback) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    const content = iframe.contentDocument.body.innerHTML;
    document.querySelector(selector).innerHTML = content;
    document.body.removeChild(iframe);
    if (callback) callback();
  };
}


// Загрузка header и footer
function loadHeaderAndFooter() {
  loadComponent("header", "header.html", () => {
    // После загрузки header — инициализируем мобильное меню
    initMobileMenu();
    // Подсвечиваем активную страницу в меню
    highlightActivePage();
  });

  loadComponent("footer", "footer.html");
}

// Подсветка активной страницы в меню
function highlightActivePage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll(".horizontal-menu a, .vertical-menu a")
    .forEach((link) => {
      const linkPage = link.getAttribute("href");
      if (linkPage === currentPage) {
        link.classList.add("active");
      }
    });
}

// Инициализация мобильного меню (если функция есть в home.js)
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("active");
      btn.textContent = menu.classList.contains("active") ? "✕" : "☰";
    });
  }
}

// Запускаем загрузку при загрузке DOM
document.addEventListener("DOMContentLoaded", loadHeaderAndFooter);
