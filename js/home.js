/* =========================================================
   THEME SWITCHER
   Переключение светлой / тёмной темы
========================================================= */

function toggleTheme() {
  const html = document.documentElement;
  const themeButton = document.getElementById("theme-mode");

  const isDarkTheme = html.getAttribute("data-theme") === "dark";

  // Если тема уже тёмная → переключаем на светлую
  if (isDarkTheme) {
    html.removeAttribute("data-theme");

    localStorage.removeItem("theme");

    // Меняем иконку кнопки
    themeButton.textContent = "🌙";

    return;
  }

  // Включаем тёмную тему
  html.setAttribute("data-theme", "dark");

  // Сохраняем тему
  localStorage.setItem("theme", "dark");

  // Меняем иконку кнопки
  themeButton.textContent = "☀️";
}

/* =========================================================
   DATE & TIME
   Отображение даты и времени на русском языке
========================================================= */

// Названия месяцев
const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Названия дней недели
const WEEKDAYS = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

/**
 * Склонение слов по числу
 *
 * @param {number} number
 * @param {string} one   - 1 час
 * @param {string} two   - 2 часа
 * @param {string} five  - 5 часов
 *
 * @returns {string}
 */
function getDeclension(number, one, two, five) {
  let value = Math.abs(number) % 100;

  if (value > 10 && value < 20) {
    return five;
  }

  value %= 10;

  if (value > 1 && value < 5) {
    return two;
  }

  if (value === 1) {
    return one;
  }

  return five;
}

/**
 * Обновление времени на странице
 */
function updateTime() {
  const now = new Date();

  const day = now.getDate();
  const month = MONTHS[now.getMonth()];
  const year = now.getFullYear();

  const weekday = WEEKDAYS[now.getDay()];

  const hours = now.getHours();

  // Добавляем ведущий 0 → 09
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // Склонения
  const hourLabel = getDeclension(hours, "час", "часа", "часов");

  const minuteLabel = getDeclension(
    Number(minutes),
    "минута",
    "минуты",
    "минут",
  );

  // Элемент вывода времени
  const timeElement = document.getElementById("current-time");

  // HTML-шаблон
  timeElement.innerHTML = `
    ${weekday}, ${day} ${month} ${year} г.
    <br>
    ${hours} ${hourLabel} ${minutes} ${minuteLabel}
  `;
}

/* =========================================================
   INITIALIZATION
========================================================= */

// Первичное обновление
updateTime();

// Обновление каждую минуту
setInterval(updateTime, 60_000);

// ============================================
// ДАННЫЕ ДЛЯ КАРУСЕЛИ ФОТОГРАФИЙ
// ============================================
const carouselData = [
  {
    id: 1,
    image: "img/photo/compressed/20260409-DSC_0043.jpg",
    title: "Тоннель",
    description: "горы",
  },
  {
    id: 2,
    image: "img/photo/compressed/20260409-DSC_0095.jpg",
    title: "Состав",
    description: "станция",
  },
  {
    id: 3,
    image: "img/photo/compressed/20260409-DSC_0186.jpg",
    title: "Лесница",
    description: "Деревня в горах",
  },
  {
    id: 4,
    image: "img/photo/compressed/PXL_20260411_160528712.jpg",
    title: "Арт-объект",
    description: "Стрит фото",
  },
  {
    id: 5,
    image: "img/photo/compressed/PXL_20260412_074523773.jpg",
    title: "Народный музей",
    description: "Площадь в центре",
  },
];

// ============================================
// КЛАСС КАРУСЕЛИ ФОТОГРАФИЙ
// ============================================
class PhotoCarousel {
  constructor(data, trackElement, prevBtn, nextBtn, dotsContainer) {
    this.data = data;
    this.track = trackElement;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.dotsContainer = dotsContainer;
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.autoplayInterval = null;

    this.init();
  }

  init() {
    this.renderSlides();
    this.renderDots();
    this.updateSlideWidth();
    this.goToSlide(0);
    this.startAutoplay();
    this.addEventListeners();
    window.addEventListener("resize", () => this.updateSlideWidth());
  }

  renderSlides() {
    this.track.innerHTML = "";
    this.data.forEach((slide, index) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = "carousel-slide";
      slideDiv.innerHTML = `
                <img src="${slide.image}" alt="${slide.title}" loading="${index < 2 ? "eager" : "lazy"}">
                <div class="slide-caption">
                    <h4>${slide.title}</h4>
                    <p>${slide.description}</p>
                </div>
            `;
      this.track.appendChild(slideDiv);
    });
  }

  renderDots() {
    this.dotsContainer.innerHTML = "";
    this.data.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.addEventListener("click", () => {
        this.stopAutoplay();
        this.goToSlide(index);
        this.startAutoplay();
      });
      this.dotsContainer.appendChild(dot);
    });
  }

  updateSlideWidth() {
    const container = this.track.parentElement;
    this.slideWidth = container.clientWidth;
    this.goToSlide(this.currentIndex);
  }

  goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= this.data.length) index = this.data.length - 1;

    this.currentIndex = index;
    const translateX = -this.currentIndex * this.slideWidth;
    this.track.style.transform = `translateX(${translateX}px)`;

    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === this.currentIndex);
    });
  }

  nextSlide() {
    this.stopAutoplay();
    if (this.currentIndex < this.data.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    } else {
      this.goToSlide(0);
    }
    this.startAutoplay();
  }

  prevSlide() {
    this.stopAutoplay();
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    } else {
      this.goToSlide(this.data.length - 1);
    }
    this.startAutoplay();
  }

  startAutoplay() {
    if (this.autoplayInterval) clearInterval(this.autoplayInterval);
    this.autoplayInterval = setInterval(() => {
      if (this.currentIndex < this.data.length - 1) {
        this.nextSlide();
      } else {
        this.goToSlide(0);
      }
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  addEventListeners() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    const container = this.track.parentElement.parentElement;
    container.addEventListener("mouseenter", () => this.stopAutoplay());
    container.addEventListener("mouseleave", () => this.startAutoplay());

    let touchStartX = 0;
    let touchEndX = 0;

    this.track.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      this.stopAutoplay();
    });

    this.track.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
      this.startAutoplay();
    });
  }
}

// ============================================
// ЗАГРУЗКА ДАННЫХ ДЛЯ КАРУСЕЛИ
// ============================================
async function loadCarouselData() {
  try {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("carouselDots");

    new PhotoCarousel(carouselData, track, prevBtn, nextBtn, dotsContainer);
  } catch (error) {
    console.error("Ошибка загрузки фото:", error);
  }
}

// Инициализация карусели при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
  await loadCarouselData();
});

// ============================================
// ВАЛИДАЦИЯ ФОРМЫ ОБРАТНОЙ СВЯЗИ
// ============================================

const bannedWords = [
  "спам",
  "реклама",
  "магазин",
  "казино",
  "скидка",
  "заработок",
  "кредит",
  "плохое",
];

const urlPattern =
  "/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[^\s]*|(?:[a-zA0-9-]+\.)+(?:ru|com|net|org|рф)[^\s]*)/gi";

function sendMessage() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const resultDiv = document.getElementById("form-result");

  let name = nameInput.value.trim();
  let email = emailInput.value.trim();
  let message = messageInput.value.trim();

  if (!name || !email || !message) {
    resultDiv.innerHTML = "Пожалуйста, заполните все поля!";
    resultDiv.style.color = "red";
    resultDiv.style.background = "#ffe0e0";
    resultDiv.style.padding = "12px";
    resultDiv.style.borderRadius = "8px";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    resultDiv.innerHTML = "Пожалуйста, введите корректный email адрес!";
    resultDiv.style.color = "red";
    resultDiv.style.background = "#ffe0e0";
    resultDiv.style.padding = "12px";
    resultDiv.style.borderRadius = "8px";
    return;
  }

  let originalMessage = message;
  let warnings = [];

  const hasUrls = urlPattern.test(message);
  if (hasUrls) {
    const cleanMessage = message.replace(urlPattern, "");
    if (cleanMessage.trim().length === 0) {
      resultDiv.innerHTML =
        "Сообщение содержит только ссылки. Пожалуйста, напишите текстовое сообщение.";
      resultDiv.style.color = "red";
      resultDiv.style.background = "#ffe0e0";
      resultDiv.style.padding = "12px";
      resultDiv.style.borderRadius = "8px";
      return;
    }
    message = cleanMessage;
    warnings.push("обнаружены ссылки (удалены)");
  }

  let foundBannedWords = [];
  for (let word of bannedWords) {
    const wordPattern = new RegExp("\\b" + word + "\\b", "i");
    if (wordPattern.test(message)) {
      foundBannedWords.push(word);
    }
  }

  if (foundBannedWords.length >= 2) {
    resultDiv.innerHTML = `Ошибка! Ваше сообщение содержит ${foundBannedWords.length} запрещённых слова: <strong>${foundBannedWords.join(", ")}</strong>.<br>Сообщение не может быть отправлено.`;
    resultDiv.style.color = "red";
    resultDiv.style.background = "#ffe0e0";
    resultDiv.style.padding = "12px";
    resultDiv.style.borderRadius = "8px";
    return;
  }

  if (foundBannedWords.length === 1) {
    const bannedWord = foundBannedWords[0];
    const regex = new RegExp("\\b" + bannedWord + "\\b", "gi");
    message = message.replace(regex, "[ЗАБЛОКИРОВАНО]");
    warnings.push(`запрещённое слово "${bannedWord}" заменено`);
  }

  function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const processedName = capitalizeFirstLetter(name);
  let processedMessage =
    message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();
  processedMessage = processedMessage.replace(/\s+/g, " ").trim();

  let resultHtml = "";
  if (warnings.length > 0) {
    resultHtml += `⚠️ <strong>Предупреждения:</strong> ${warnings.join(", ")}<br><br>`;
  }

  resultHtml += `
        ✅ <strong>Сообщение успешно обработано!</strong><br><br>
        📝 <strong>Отправитель:</strong> ${processedName}<br>
        📧 <strong>Email:</strong> ${email}<br>
        💬 <strong>Сообщение:</strong><br>${processedMessage}
    `;

  resultDiv.innerHTML = resultHtml;
  resultDiv.style.color = "#2d5016";
  resultDiv.style.background = "#e8f5e9";
  resultDiv.style.padding = "15px";
  resultDiv.style.borderRadius = "8px";
  resultDiv.style.border = "1px solid #4caf50";

}

function checkMessageLength() {
  const messageInput = document.getElementById("message");
  const resultDiv = document.getElementById("form-result");
  const length = messageInput.value.length;

  if (length > 0 && length < 10) {
    resultDiv.innerHTML =
      "💡 Совет: Напишите чуть подробнее (минимум 10 символов)";
    resultDiv.style.color = "#856404";
    resultDiv.style.background = "#fff3cd";
    resultDiv.style.padding = "8px";
    resultDiv.style.borderRadius = "8px";
    resultDiv.style.fontSize = "0.85rem";
  } else if (length >= 10) {
    if (resultDiv.innerHTML.includes("Совет:")) {
      resultDiv.innerHTML = "";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById("message");
  if (messageInput) {
    messageInput.addEventListener("input", checkMessageLength);
  }
});

// ============================================
// ДАННЫЕ ДЛЯ ПРОЕКТОВ
// ============================================
const projectsData = [
  {
    id: 1,
    title: "Корпоративный портал DevHub",
    description:
      "Внутренний портал для IT-компании с управлением задачами и документацией",
    fullDescription:
      "Разработан корпоративный портал для компании DevSolutions, объединяющий 500+ сотрудников. Система включает управление проектами, базу знаний, корпоративный мессенджер, интеграцию с Jira и GitLab. Реализована система ролей и прав доступа. Проект выполнен с нуля под ключ, включая дизайн, фронтенд, бэкенд и деплой.",
    category: "dashboard",
    image:
      "img/projects/4f6090243129893.Y3JvcCwxMDIyLDgwMCwwLDA-3734337152.jpg",
    technologies: ["Vue.js", "Django", "DRF", "PostgreSQL", "Redis", "Docker"],
    demoLink: "#",
    githubLink: "#",
    year: "2025",
  },
  {
    id: 2,
    title: "Weather App — прогноз погоды",
    description:
      "Приложение для просмотра погоды с использованием OpenWeatherMap API.",
    fullDescription:
      "Учебный проект для демонстрации навыков работы с API, асинхронными запросами и адаптивной версткой. Приложение позволяет узнавать текущую погоду и прогноз на 5 дней в любом городе мира. Реализован поиск с подсказками, отображение температуры, влажности, скорости ветра, а также иконки погоды.",
    category: "ecommerce",
    image: "img/projects/OIP-3817804085.jpg",
    technologies: ["Python", "OpenWeatherMap API", "CSS Grid"],
    demoLink: "#",
    githubLink: "#",
    year: "2024",
  }
];

/**
 * Функция для отображения последних проектов на главной странице
 * Использует данные из projectsData
 */
function displayLatestProjects() {
  if (typeof projectsData !== "undefined" && projectsData.length > 0) {
    // Берём последние 3 проекта (или меньше, если проектов меньше 3)
    const latestProjects = projectsData.slice(-3).reverse();
    const container = document.getElementById("projects-container");

    if (!container) {
      console.warn("⚠️ Контейнер projects-container не найден на странице");
      return;
    }

    container.innerHTML = "";

    latestProjects.forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.setAttribute("data-category", project.category);

      const imagePath =
        project.image || "https://via.placeholder.com/400x300?text=No+Image";

      projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${imagePath}" alt="${project.title}" loading="lazy">
                </div>
                <div class="project-content">
                    <span class="project-category">${project.category || "Проект"}</span>
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <p class="project-description">${escapeHtml(project.description || "Описание проекта")}</p>
                    <div class="project-tech">
                        ${project.technologies ? project.technologies.map((tech) => `<span class="tech-badge">${escapeHtml(tech)}</span>`).join("") : ""}
                    </div>
                    <button class="project-details-btn" onclick="showProjectDetails(${project.id})">Подробнее →</button>
                </div>
            `;

      container.appendChild(projectCard);
    });

  } else {
    console.warn("⚠️ Массив projectsData не найден или пуст");
    const container = document.getElementById("projects-container");
    if (container) {
      container.innerHTML =
        '<p style="text-align: center; grid-column: 1/-1;">Проекты скоро появятся...</p>';
    }
  }
}

/**
 * Вспомогательная функция для экранирования HTML (безопасность)
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Функция для отображения деталей проекта в модальном окне
 * @param {number} projectId - ID проекта
 */
function showProjectDetails(projectId) {
  // Находим проект по ID
  const project = projectsData.find((p) => p.id === projectId);

  if (!project) {
    console.error(`❌ Проект с ID ${projectId} не найден`);
    return;
  }

  // Проверяем, существует ли модальное окно на странице
  let modal = document.getElementById("projectModal");

  // Если модального окна нет — создаём его
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "projectModal";
    modal.className = "modal";
    modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div id="modalBody"></div>
            </div>
        `;
    document.body.appendChild(modal);

    // Добавляем обработчик закрытия
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Закрытие при клике вне модального окна
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Заполняем содержимое модального окна
  const modalBody = document.getElementById("modalBody");
  const imagePath =
    project.image || "https://via.placeholder.com/800x400?text=No+Image";

  modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${escapeHtml(project.title)}</h2>
            <div class="modal-meta">
                <span>📅 ${project.year || "2024"}</span>
                <span>🏷️ ${project.category || "Проект"}</span>
            </div>
        </div>
        <div class="modal-image">
            <img src="${imagePath}" alt="${escapeHtml(project.title)}">
        </div>
        <div class="modal-body-content">
            <p>${escapeHtml(project.fullDescription || project.description)}</p>
            <h3>Технологии</h3>
            <div class="modal-tags">
                ${project.technologies ? project.technologies.map((tech) => `<span>${escapeHtml(tech)}</span>`).join("") : ""}
            </div>
            <div class="modal-links">
                ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" class="modal-link">🔗 Демо</a>` : ""}
                ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="modal-link">🐙 GitHub</a>` : ""}
            </div>
        </div>
    `;

  // Показываем модальное окно
  modal.style.display = "flex";
}

// Запускаем отображение проектов после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {
  displayLatestProjects();
});
