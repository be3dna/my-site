
const projectsData = [
  // ===== ПРОЕКТ №1: РЕАЛЬНЫЙ (КОММЕРЧЕСКИЙ) =====
  {
    id: 1,
    title: "Корпоративный портал DevHub",
    category: "web",
    shortDesc:
      "Внутренний портал для IT-компании с управлением задачами и документацией.",
    description:
      "Разработан корпоративный портал для компании DevSolutions, объединяющий 500+ сотрудников. Система включает управление проектами, базу знаний, корпоративный мессенджер, интеграцию с Jira и GitLab. Реализована система ролей и прав доступа. Проект выполнен с нуля под ключ, включая дизайн, фронтенд, бэкенд и деплой.",
    image:
      "img/projects/4f6090243129893.Y3JvcCwxMDIyLDgwMCwwLDA-3734337152.jpg",
    technologies: ["Vue.js", "Django", "DRF", "PostgreSQL", "Redis", "Docker"],
    year: "2024",
    client: "DevSolutions",
    features: [
      "Управление проектами и задачами",
      "База знаний (wiki)",
      "Корпоративный мессенджер",
      "Интеграция с Jira и GitLab",
      "Система ролей и прав",
    ],
  },

  // ===== ПРОЕКТ №2: УЧЕБНЫЙ (PET-PROJECT) =====
  {
    id: 2,
    title: "Weather App — прогноз погоды",
    category: "web",
    shortDesc:
      "Приложение для просмотра погоды с использованием OpenWeatherMap API.",
    description:
      "Учебный проект для демонстрации навыков работы с API, асинхронными запросами и адаптивной версткой. Приложение позволяет узнавать текущую погоду и прогноз на 5 дней в любом городе мира. Реализован поиск с подсказками, отображение температуры, влажности, скорости ветра, а также иконки погоды.",
    image: "img/projects/OIP-3817804085.jpg",
    technologies: [
      "Python",
      "OpenWeatherMap API",
      "CSS Grid",
    ],
    year: "2025",
    client: "Pet-project",
    features: [
      "Поиск города с подсказками",
      "Текущая погода",
      "Прогноз на 5 дней",
      "Отображение влажности и ветра",
      "Адаптивный дизайн",
    ],
  },
];

// Текущий выбранный фильтр
let currentFilter = "all";

// Функция рендеринга проектов
function renderProjects() {
    const container = document.getElementById("projectsContainer");
    if (!container) return;
    
    // Фильтрация проектов
    let filteredProjects = projectsData;
    if (currentFilter !== "all") {
        filteredProjects = projectsData.filter(project => project.category === currentFilter);
    }
    
    // Если проектов нет — показываем сообщение
    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <div class="no-projects">
                <p>😕 Проектов в этой категории пока нет</p>
            </div>
        `;
        return;
    }
    
    // Рендеринг карточек проектов
    container.innerHTML = filteredProjects.map(project => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <span class="project-year">${project.year}</span>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.shortDesc}</p>
                <div class="project-tags">
                    ${project.technologies.slice(0, 4).map(tech => `<span>${tech}</span>`).join('')}
                    ${project.technologies.length > 4 ? `<span>+${project.technologies.length - 4}</span>` : ''}
                </div>
                <button class="project-details-btn" data-id="${project.id}">Подробнее →</button>
            </div>
        </div>
    `).join("");
    
    // Добавляем обработчики для кнопок "Подробнее"
    document.querySelectorAll(".project-details-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            openProjectModal(id);
        });
    });
}

// Открытие модального окна с деталями проекта
function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById("projectModal");
    const modalBody = document.getElementById("modalBody");
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${project.title}</h2>
            <div class="modal-meta">
                <span>📅 ${project.year}</span>
                <span>👥 ${project.client}</span>
                <span>🏷️ ${project.category === "web" ? "Web-приложение" : project.category === "ecommerce" ? "E-commerce" : "Дашборд"}</span>
            </div>
        </div>
        <div class="modal-image">
            <img src="${project.image}" alt="${project.title}">
        </div>
        <div class="modal-body-content">
            <h3>О проекте</h3>
            <p>${project.description}</p>
            
            <h3>Технологии</h3>
            <div class="modal-tags">
                ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
            
            <h3>Ключевые возможности</h3>
            <ul class="modal-features">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `;
    
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Закрытие модального окна
function closeProjectModal() {
    const modal = document.getElementById("projectModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Инициализация фильтров
function initFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Обновляем активный класс
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // Обновляем фильтр и рендерим проекты
            currentFilter = btn.dataset.filter;
            renderProjects();
        });
    });
}

// Закрытие модального окна по клику вне контента
function initModalClose() {
    const modal = document.getElementById("projectModal");
    const closeBtn = document.querySelector(".modal-close");
    
    if (closeBtn) {
        closeBtn.addEventListener("click", closeProjectModal);
    }
    
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }
    
    // Закрытие по ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeProjectModal();
        }
    });
}

// Анимация появления карточек при скролле
function initScrollAnimation() {
    const cards = document.querySelectorAll(".project-card");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.6s ease";
        observer.observe(card);
    });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    renderProjects();
    initFilters();
    initModalClose();
    setTimeout(initScrollAnimation, 100);
});