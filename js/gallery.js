// Данные галереи с группировкой по альбомам
const galleryData = {
  albums: [
    {
      id: "portrait",
      name: "Путишествия",
      description: "Фото из путишествий",
      photos: [
        {
          id: 1,
          title: "Движение поезда",
          description: "горы",
          src: "img/photo/20260409-DSC_0043.jpg",
          thumbnail: "img/photo/20260409-DSC_0043.jpg",
        },
        {
          id: 2,
          title: "Вишня",
          description: "горы",
          src: "img/photo/20260409-DSC_0066.jpg",
          thumbnail: "img/photo/20260409-DSC_0066.jpg",
        },
        {
          id: 3,
          title: "Состав",
          description: "Станция",
          src: "img/photo/20260409-DSC_0095.jpg",
          thumbnail: "img/photo/20260409-DSC_0095.jpg",
        },
      ],
    },
    {
      id: "landscape",
      name: "Пейзажи",
      description: "Природа и городские виды",
      photos: [
        {
          id: 5,
          title: "Вид с вершины",
          description: "полдень",
          src: "img/photo/20260409-DSC_0243.jpg",
          thumbnail: "img/photo/20260409-DSC_0243.jpg",
        },
        {
          id: 7,
          title: "Облака",
          description: "Над землей",
          src: "img/photo/PXL_20260407_113204425.jpg",
          thumbnail: "img/photo/PXL_20260407_113204425.jpg",
        },
      ],
    },
    {
      id: "street",
      name: "Стрит-фото",
      description: "Моменты из жизни города",
      photos: [
        {
          id: 6,
          title: "Мероприятие",
          description: "Кронштадт",
          src: "img/photo/PXL_20251018_143855483.MP.jpg",
          thumbnail: "img/photo/PXL_20251018_143855483.MP.jpg",
        },
      ],
    },
    {
      id: "architecture",
      name: "Архитектура",
      description: "Здания, мосты, детали",
      photos: [
        {
          id: 10,
          title: "Морской собор",
          description: "Якорная площадь, солнце",
          src: "img/photo/PXL_20260502_082634520.jpg",
          thumbnail: "img/photo/PXL_20260502_082634520.jpg",
        },
        {
          id: 8,
          title: "Арт-объект",
          description: "Улицы города",
          src: "img/photo/PXL_20260411_160528712.jpg",
          thumbnail: "img/photo/PXL_20260411_160528712.jpg",
        },
        {
          id: 9,
          title: "народный музей",
          description: "площадь",
          src: "img/photo/PXL_20260412_074523773.jpg",
          thumbnail: "img/photo/PXL_20260412_074523773.jpg",
        },
        {
          id: 4,
          title: "Деревянная лесница на склоне",
          description: "горы",
          src: "img/photo/20260409-DSC_0186.jpg",
          thumbnail: "img/photo/20260409-DSC_0186.jpg",
        },
      ],
    },
  ],
};

// Состояние
let currentAlbum = "all";
let currentLightboxIndex = 0;
let currentLightboxPhotos = [];

// Получение всех фото
function getAllPhotos() {
  const allPhotos = [];
  galleryData.albums.forEach((album) => {
    album.photos.forEach((photo) => {
      allPhotos.push({
        ...photo,
        albumName: album.name,
        albumId: album.id,
      });
    });
  });
  return allPhotos;
}

// Получение фото текущего альбома
function getCurrentAlbumPhotos() {
  if (currentAlbum === "all") {
    return getAllPhotos();
  }
  const album = galleryData.albums.find((a) => a.id === currentAlbum);
  return album
    ? album.photos.map((photo) => ({
        ...photo,
        albumName: album.name,
        albumId: album.id,
      }))
    : [];
}

// Рендер кнопок альбомов
function renderAlbumFilters() {
  const container = document.getElementById("albumFilters");
  if (!container) return;

  const buttonsHtml = `
        <button class="album-btn ${currentAlbum === "all" ? "active" : ""}" data-album="all">Все фото</button>
        ${galleryData.albums
          .map(
            (album) => `
            <button class="album-btn ${currentAlbum === album.id ? "active" : ""}" data-album="${album.id}">
                ${album.name}
            </button>
        `,
          )
          .join("")}
    `;

  container.innerHTML = buttonsHtml;

  document.querySelectorAll(".album-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentAlbum = btn.dataset.album;
      renderAlbumFilters();
      renderGallery();
    });
  });
}

// Рендер сетки галереи
function renderGallery() {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  const photos = getCurrentAlbumPhotos();

  if (photos.length === 0) {
    container.innerHTML =
      '<div class="no-results">😕 Нет фотографий в этом альбоме</div>';
    return;
  }

  container.innerHTML = photos
    .map(
      (photo, index) => `
        <div class="gallery-item" data-index="${index}" data-album="${photo.albumId || currentAlbum}" data-photo-id="${photo.id}">
            <img src="${photo.thumbnail || photo.src}" alt="${photo.title}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-title">${photo.title}</div>
                <div class="gallery-album">${photo.albumName || getAlbumNameById(photo.albumId)}</div>
            </div>
        </div>
    `,
    )
    .join("");

  // Добавляем обработчики кликов для открытия лайтбокса
  document.querySelectorAll(".gallery-item").forEach((item, idx) => {
    item.addEventListener("click", () => {
      const photosList = getCurrentAlbumPhotos();
      currentLightboxPhotos = photosList;
      currentLightboxIndex = parseInt(item.dataset.index);
      openLightbox(currentLightboxIndex);
    });
  });
}

// Получение названия альбома по
// ID
function getAlbumNameById(albumId) {
  const album = galleryData.albums.find((a) => a.id === albumId);
  return album ? album.name : "";
}

// Лайтбокс
function openLightbox(index) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");

  if (!lightbox || !lightboxImage) return;

  currentLightboxIndex = index;
  const photo = currentLightboxPhotos[index];

  if (photo) {
    lightboxImage.src = photo.src;
    lightboxCaption.innerHTML = `${photo.title} — ${photo.description || photo.albumName || ""}`;

    let counter = document.querySelector(".lightbox-counter");
    if (!counter) {
      counter = document.createElement("div");
      counter.className = "lightbox-counter";
      lightbox.appendChild(counter);
    }
    counter.textContent = `${index + 1} / ${currentLightboxPhotos.length}`;

    lightbox.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function nextPhoto() {
  if (currentLightboxIndex < currentLightboxPhotos.length - 1) {
    openLightbox(currentLightboxIndex + 1);
  }
}

function prevPhoto() {
  if (currentLightboxIndex > 0) {
    openLightbox(currentLightboxIndex - 1);
  }
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", prevPhoto);
  if (nextBtn) nextBtn.addEventListener("click", nextPhoto);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (lightbox && lightbox.style.display === "block") {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    }
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  renderAlbumFilters();
  renderGallery();
  initLightbox();
  initAutoplayInLightbox(); // НОВОЕ: инициализация автопрокрутки
});

let autoplayInterval = null;
let isAutoplayRunning = false;
let currentAutoplaySpeed = 5000; // скорость по умолчанию (5 сек)

// Функция переключения на следующее фото
function nextPhotoForAutoplay() {
  if (currentLightboxIndex < currentLightboxPhotos.length - 1) {
    openLightbox(currentLightboxIndex + 1);
  } else {
    // Циклическое зацикливание: после последнего фото переходим к первому
    openLightbox(0);
  }
}

// Запуск автопрокрутки
function startAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }

  autoplayInterval = setInterval(nextPhotoForAutoplay, currentAutoplaySpeed);
  isAutoplayRunning = true;

  // Меняем иконку и добавляем анимацию
  const autoplayBtn = document.getElementById("lightboxAutoplayBtn");
  if (autoplayBtn) {
    autoplayBtn.innerHTML = "⏸";
    autoplayBtn.classList.add("running");
    autoplayBtn.title = "Остановить автопрокрутку";
  }
}

// Остановка автопрокрутки
function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
  isAutoplayRunning = false;

  // Меняем иконку обратно
  const autoplayBtn = document.getElementById("lightboxAutoplayBtn");
  if (autoplayBtn) {
    autoplayBtn.innerHTML = "▶";
    autoplayBtn.classList.remove("running");
    autoplayBtn.title = "Запустить автопрокрутку";
  }
}

// Переключение автопрокрутки (вкл/выкл)
function toggleAutoplay() {
  if (isAutoplayRunning) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}

// Установка скорости автопрокрутки
function setAutoplaySpeed(speed) {
  currentAutoplaySpeed = speed;

  // Обновляем активный класс в панели скорости
  document.querySelectorAll(".autoplay-speed-panel span").forEach((span) => {
    if (parseInt(span.dataset.speed) === speed) {
      span.classList.add("active");
    } else {
      span.classList.remove("active");
    }
  });

  // Если автопрокрутка запущена, перезапускаем с новой скоростью
  if (isAutoplayRunning) {
    // Перезапускаем интервал с новой скоростью
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextPhotoForAutoplay, currentAutoplaySpeed);
  }
}

// ИНИЦИАЛИЗАЦИЯ: привязка обработчиков
function initAutoplayInLightbox() {
  const autoplayBtn = document.getElementById("lightboxAutoplayBtn");
  const speedPanel = document.querySelectorAll(".autoplay-speed-panel span");

  if (autoplayBtn) {
    autoplayBtn.addEventListener("click", toggleAutoplay);
  }

  speedPanel.forEach((span) => {
    span.addEventListener("click", () => {
      const speed = parseInt(span.dataset.speed);
      setAutoplaySpeed(speed);
    });
  });
}

// Функция переключения на следующее фото
function nextPhotoForAutoplay() {
  if (currentLightboxIndex < currentLightboxPhotos.length - 1) {
    openLightbox(currentLightboxIndex + 1);
  } else {
    // Циклическое зацикливание: после последнего фото переходим к первому
    openLightbox(0);
  }
}

// Запуск автопрокрутки
function startAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }

  autoplayInterval = setInterval(nextPhotoForAutoplay, currentAutoplaySpeed);
  isAutoplayRunning = true;

  // Меняем иконку и добавляем анимацию
  const autoplayBtn = document.getElementById("lightboxAutoplayBtn");
  if (autoplayBtn) {
    autoplayBtn.innerHTML = "⏸";
    autoplayBtn.classList.add("running");
    autoplayBtn.title = "Остановить автопрокрутку";
  }
}

// Остановка автопрокрутки
function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
  isAutoplayRunning = false;

  // Меняем иконку обратно
  const autoplayBtn = document.getElementById("lightboxAutoplayBtn");
  if (autoplayBtn) {
    autoplayBtn.innerHTML = "▶";
    autoplayBtn.classList.remove("running");
    autoplayBtn.title = "Запустить автопрокрутку";
  }
}

// Переключение автопрокрутки (вкл/выкл)
function toggleAutoplay() {
  if (isAutoplayRunning) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
}

// Установка скорости автопрокрутки
function setAutoplaySpeed(speed) {
  currentAutoplaySpeed = speed;

  // Обновляем активный класс в панели скорости
  document.querySelectorAll(".autoplay-speed-panel span").forEach((span) => {
    if (parseInt(span.dataset.speed) === speed) {
      span.classList.add("active");
    } else {
      span.classList.remove("active");
    }
  });

  // Если автопрокрутка запущена, перезапускаем с новой скоростью
  if (isAutoplayRunning) {
    startAutoplay();
  }
}

// Инициализация управления автопрокруткой
function initAutoplayInLightbox() {
  const autoplayBtn = document.getElementById("lightboxAutoplayBtn");
  const speedPanel = document.querySelectorAll(".autoplay-speed-panel span");

  if (autoplayBtn) {
    autoplayBtn.addEventListener("click", toggleAutoplay);
  }

  speedPanel.forEach((span) => {
    span.addEventListener("click", () => {
      const speed = parseInt(span.dataset.speed);
      setAutoplaySpeed(speed);
    });
  });
}

// Модифицируем openLightbox: останавливаем автопрокрутку при открытии нового фото
// (чтобы не было конфликта при ручном переключении)
const originalOpenLightbox =
  window.openLightbox ||
  function (index) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");

    if (!lightbox || !lightboxImage) return;

    currentLightboxIndex = index;
    const photo = currentLightboxPhotos[index];

    if (photo) {
      lightboxImage.src = photo.src;
      lightboxCaption.innerHTML = `${photo.title} — ${photo.description || photo.albumName || ""}`;

      let counter = document.querySelector(".lightbox-counter");
      if (!counter) {
        counter = document.createElement("div");
        counter.className = "lightbox-counter";
        lightbox.appendChild(counter);
      }
      counter.textContent = `${index + 1} / ${currentLightboxPhotos.length}`;

      lightbox.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };

// Переопределяем openLightbox (без остановки автопрокрутки)
window.openLightbox = function (index) {
  originalOpenLightbox(index);
};

// closeLightbox — здесь останавливаем, так как лайтбокс закрывается
const originalCloseLightbox =
  window.closeLightbox ||
  function () {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

window.closeLightbox = function () {
  if (isAutoplayRunning) {
    stopAutoplay();
  }
  originalCloseLightbox();
};