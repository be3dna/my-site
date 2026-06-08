// Данные статей блога
const blogPostsData = [
  {
    id: 1,
    title: "Как я перешёл с JavaScript на TypeScript и не пожалел",
    excerpt:
      "Типизация спасла мой проект от багов и сделала код понятнее. Рассказываю о подводных камнях и преимуществах.",
    category: "frontend",
    date: "2026-05-10",
    readTime: 8,
    image: "https://picsum.photos/id/101/400/250",
    slug: "javascript-to-typescript",
  },
  {
    id: 2,
    title: "UI/UX тренды 2026: что реально работает",
    excerpt:
      "Разбираем актуальные тренды в дизайне интерфейсов: glassmorphism, микроанимации и доступность.",
    category: "design",
    date: "2026-05-05",
    readTime: 6,
    image: "https://picsum.photos/id/102/400/250",
    slug: "ui-ux-trends-2026",
  },
  {
    id: 3,
    title: "Оптимизация производительности React приложений",
    excerpt:
      "Мемоизация, lazy loading, code splitting и другие техники для ускорения React-приложений.",
    category: "frontend",
    date: "2026-04-28",
    readTime: 10,
    image: "https://picsum.photos/id/103/400/250",
    slug: "react-performance-optimization",
  },
  {
    id: 4,
    title: "Как я создал свой первый opensource проект",
    excerpt:
      "Путь от идеи до 100 звёзд на GitHub. Советы для начинающих контрибьютеров.",
    category: "career",
    date: "2026-04-20",
    readTime: 7,
    image: "https://picsum.photos/id/104/400/250",
    slug: "first-opensource-project",
  },
  {
    id: 5,
    title: "Создаём кастомный хук useLocalStorage",
    excerpt:
      "Пишем полезный React хук для работы с localStorage с поддержкой SSR и типизацией.",
    category: "tutorial",
    date: "2026-04-15",
    readTime: 5,
    image: "https://picsum.photos/id/105/400/250",
    slug: "custom-uselocalstorage-hook",
  },
  {
    id: 6,
    title: "Node.js vs Deno vs Bun: что выбрать в 2026",
    excerpt:
      "Сравниваем современные JavaScript runtime: производительность, экосистема и использование.",
    category: "backend",
    date: "2026-04-10",
    readTime: 9,
    image: "https://picsum.photos/id/106/400/250",
    slug: "nodejs-deno-bun-comparison",
  },
  {
    id: 7,
    title: "Анимации в CSS: от простого к сложному",
    excerpt:
      "Полный гайд по CSS анимациям: keyframes, transitions, performance best practices.",
    category: "frontend",
    date: "2026-04-05",
    readTime: 12,
    image: "https://picsum.photos/id/107/400/250",
    slug: "css-animations-guide",
  },
  {
    id: 8,
    title: "Как найти первую работу в IT: мой опыт",
    excerpt:
      "Реальные советы для junior разработчиков: резюме, портфолио, собеседования и нетворкинг.",
    category: "career",
    date: "2026-03-28",
    readTime: 8,
    image: "https://picsum.photos/id/108/400/250",
    slug: "first-it-job-guide",
  },
];

// Функция форматирования даты
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Функция получения названия категории
function getCategoryName(category) {
  const categories = {
    frontend: "Frontend",
    backend: "Backend",
    design: "UI/UX Дизайн",
    career: "Карьера",
    tutorial: "Туториал",
  };
  return categories[category] || category;
}

// Рендер карточек блога
function renderBlogPosts(posts) {
  const container = document.getElementById("blogPostsContainer");
  const noResults = document.getElementById("noResults");

  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  container.innerHTML = posts
    .map(
      (post, index) => `
        <article class="blog-card" style="animation-delay: ${index * 0.05}s">
            <img src="${post.image}" alt="${post.title}" class="blog-card-image" loading="lazy">
            <div class="blog-card-content">
                <span class="blog-card-category">${getCategoryName(post.category)}</span>
                <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
                <div class="blog-card-meta">
                    <span>📅 ${formatDate(post.date)}</span>
                    <span>⏱️ ${post.readTime} мин чтения</span>
                </div>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <a href="post.html?slug=${post.slug}" class="read-more">Читать полностью →</a>
            </div>
        </article>
    `,
    )
    .join("");
}

// Фильтрация и поиск
let currentCategory = "all";
let currentSearchTerm = "";

function filterAndSearch() {
  let filtered = [...blogPostsData];

  // Фильтр по категории
  if (currentCategory !== "all") {
    filtered = filtered.filter((post) => post.category === currentCategory);
  }

  // Поиск
  if (currentSearchTerm.trim() !== "") {
    const searchLower = currentSearchTerm.toLowerCase();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower),
    );
  }

  renderBlogPosts(filtered);
}

// Обработчики событий
function initBlogFilters() {
  // Поиск
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.querySelector(".search-btn");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchTerm = e.target.value;
      filterAndSearch();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      currentSearchTerm = searchInput.value;
      filterAndSearch();
    });
  }

  // Категории
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Обновляем активный класс
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Обновляем текущую категорию
      currentCategory = btn.dataset.category;
      filterAndSearch();
    });
  });
}

// Анимация при скролле для карточек (дополнительно)
function initScrollAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".blog-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.5s ease";
    observer.observe(card);
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  renderBlogPosts(blogPostsData);
  initBlogFilters();
  initScrollAnimation();
});
