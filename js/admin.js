// Данные для админки (в реальном проекте здесь будут запросы к API)
let blogPosts = [
  {
    id: 1,
    title: "Как я перешёл на TypeScript",
    category: "frontend",
    date: "2025-05-10",
    excerpt: "Типизация спасла мой проект...",
    image: "images/blog/ts.jpg",
  },
  {
    id: 2,
    title: "UI/UX тренды 2025",
    category: "design",
    date: "2025-05-05",
    excerpt: "Разбираем актуальные тренды...",
    image: "images/blog/ui.jpg",
  },
];

let galleryPhotos = [
  {
    id: 1,
    title: "Горный пейзаж",
    album: "landscape",
    src: "images/gallery/landscape/1.jpg",
    thumbnail: "images/gallery/landscape/thumb1.jpg",
  },
  {
    id: 2,
    title: "Портрет",
    album: "portrait",
    src: "images/gallery/portrait/1.jpg",
    thumbnail: "images/gallery/portrait/thumb1.jpg",
  },
];

let projects = [
  {
    id: 1,
    title: "E-commerce платформа",
    category: "ecommerce",
    status: "active",
    description: "Интернет-магазин одежды",
  },
  {
    id: 2,
    title: "Дашборд аналитики",
    category: "dashboard",
    status: "completed",
    description: "Аналитическая панель",
  },
];

let users = [
  {
    id: 1,
    name: "Алексей Иванов",
    email: "admin@iurchenko.ru",
    role: "admin",
    status: "active",
  },
  {
    id: 2,
    name: "Мария Петрова",
    email: "editor@iurchenko.ru",
    role: "editor",
    status: "active",
  },
];

// Текущая вкладка
let currentTab = "dashboard";

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  initAdminNav();
  loadDashboardStats();
  loadPostsTable();
  loadGalleryGrid();
  loadProjectsTable();
  loadUsersTable();
  initModals();
});

// Навигация
function initAdminNav() {
  const navBtns = document.querySelectorAll(".admin-nav-btn");
  const tabs = document.querySelectorAll(".admin-tab");

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      navBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabs.forEach((tab) => tab.classList.remove("active"));
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
}

// Загрузка статистики
function loadDashboardStats() {
  document.getElementById("statsPosts").textContent = blogPosts.length;
  document.getElementById("statsPhotos").textContent = galleryPhotos.length;
  document.getElementById("statsProjects").textContent = projects.length;
  document.getElementById("statsUsers").textContent = users.length;
}

// Таблица постов
function loadPostsTable() {
  const tbody = document.getElementById("postsTableBody");
  tbody.innerHTML = blogPosts
    .map(
      (post) => `
        <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.category}</td>
            <td>${post.date}</td>
            <td>
                <button class="action-btn edit" onclick="editPost(${post.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deletePost(${post.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// Галерея
function loadGalleryGrid() {
  const grid = document.getElementById("adminGalleryGrid");
  grid.innerHTML = galleryPhotos
    .map(
      (photo) => `
        <div class="admin-gallery-item">
            <img src="${photo.thumbnail}" alt="${photo.title}">
            <div class="admin-gallery-item-info">
                <h4>${photo.title}</h4>
                <p>${photo.album}</p>
            </div>
            <div class="admin-gallery-item-actions">
                <button class="action-btn delete" onclick="deletePhoto(${photo.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Таблица проектов
function loadProjectsTable() {
  const tbody = document.getElementById("projectsTableBody");
  tbody.innerHTML = projects
    .map(
      (proj) => `
        <tr>
            <td>${proj.id}</td>
            <td>${proj.title}</td>
            <td>${proj.category}</td>
            <td><span class="status-badge status-${proj.status}">${proj.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editProject(${proj.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteProject(${proj.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// Таблица пользователей
function loadUsersTable() {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>
                <button class="action-btn edit" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// CRUD операции для постов
function openPostModal(editId = null) {
  const modal = document.getElementById("postModal");
  const title = document.getElementById("postModalTitle");

  if (editId) {
    const post = blogPosts.find((p) => p.id === editId);
    if (post) {
      title.textContent = "Редактировать статью";
      document.getElementById("postId").value = post.id;
      document.getElementById("postTitle").value = post.title;
      document.getElementById("postCategory").value = post.category;
      document.getElementById("postExcerpt").value = post.excerpt;
      document.getElementById("postImage").value = post.image;
    }
  } else {
    title.textContent = "Добавить статью";
    document.getElementById("postForm").reset();
    document.getElementById("postId").value = "";
  }
  modal.style.display = "block";
}

function deletePost(id) {
  if (confirm("Удалить статью?")) {
    blogPosts = blogPosts.filter((p) => p.id !== id);
    loadPostsTable();
    loadDashboardStats();
  }
}

// CRUD для пользователей
function openUserModal(editId = null) {
  const modal = document.getElementById("userModal");
  if (editId) {
    const user = users.find((u) => u.id === editId);
    if (user) {
      document.getElementById("userModalTitle").textContent =
        "Редактировать пользователя";
      document.getElementById("userId").value = user.id;
      document.getElementById("userName").value = user.name;
      document.getElementById("userEmail").value = user.email;
      document.getElementById("userRole").value = user.role;
    }
  } else {
    document.getElementById("userModalTitle").textContent =
      "Добавить пользователя";
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
  }
  modal.style.display = "block";
}

function deleteUser(id) {
  if (confirm("Удалить пользователя?")) {
    users = users.filter((u) => u.id !== id);
    loadUsersTable();
    loadDashboardStats();
  }
}

// Сохранение формы поста
document.getElementById("postForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("postId").value;
  const newPost = {
    id: id ? parseInt(id) : Date.now(),
    title: document.getElementById("postTitle").value,
    category: document.getElementById("postCategory").value,
    date: new Date().toISOString().slice(0, 10),
    excerpt: document.getElementById("postExcerpt").value,
    image: document.getElementById("postImage").value,
  };

  if (id) {
    const index = blogPosts.findIndex((p) => p.id === parseInt(id));
    blogPosts[index] = newPost;
  } else {
    blogPosts.unshift(newPost);
  }

  loadPostsTable();
  loadDashboardStats();
  document.getElementById("postModal").style.display = "none";
});

// Сохранение формы пользователя
document.getElementById("userForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("userId").value;
  const newUser = {
    id: id ? parseInt(id) : Date.now(),
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    role: document.getElementById("userRole").value,
    status: "active",
  };

  if (id) {
    const index = users.findIndex((u) => u.id === parseInt(id));
    users[index] = newUser;
  } else {
    users.push(newUser);
  }

  loadUsersTable();
  loadDashboardStats();
  document.getElementById("userModal").style.display = "none";
});

// Настройки
function saveSettings() {
  const siteTitle = document.getElementById("siteTitle").value;
  const siteEmail = document.getElementById("siteEmail").value;
  const accentColor = document.getElementById("accentColor").value;
  const defaultTheme = document.getElementById("defaultTheme").value;

  document.documentElement.style.setProperty("--accent-color", accentColor);
  localStorage.setItem(
    "siteSettings",
    JSON.stringify({
      siteTitle,
      siteEmail,
      accentColor,
      defaultTheme,
    }),
  );

  alert("Настройки сохранены!");
}

// Инициализация модальных окон
function initModals() {
  const modals = document.querySelectorAll(".admin-modal");
  const closeBtns = document.querySelectorAll(".modal-close");

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modals.forEach((modal) => (modal.style.display = "none"));
    });
  });

  window.addEventListener("click", (e) => {
    modals.forEach((modal) => {
      if (e.target === modal) modal.style.display = "none";
    });
  });
}

// Заглушки для недостающих функций
function editPost(id) {
  openPostModal(id);
}
function editProject(id) {
  alert("Редактирование проекта " + id);
}
function deleteProject(id) {
  if (confirm("Удалить проект?")) {
    projects = projects.filter((p) => p.id !== id);
    loadProjectsTable();
    loadDashboardStats();
  }
}
function editUser(id) {
  openUserModal(id);
}
function openProjectModal() {
  alert("Добавление проекта (в разработке)");
}
function openPhotoModal() {
  alert("Добавление фото (в разработке)");
}
function deletePhoto(id) {
  if (confirm("Удалить фото?")) {
    galleryPhotos = galleryPhotos.filter((p) => p.id !== id);
    loadGalleryGrid();
    loadDashboardStats();
  }
}
