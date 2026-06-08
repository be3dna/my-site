/* ============================================ */
/* ОСНОВНЫЕ СКРИПТЫ ДЛЯ СТРАНИЦЫ "ОБО МНЕ"     */
/* ============================================ */

/**
 * Инициализация мобильного меню (бургер-меню)
 * Управляет открытием/закрытием меню и изменением иконки кнопки
 */
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.addEventListener("click", () => {
      // Переключаем класс active у меню
      menu.classList.toggle("active");
      // Меняем текст кнопки в зависимости от состояния меню
      btn.textContent = menu.classList.contains("active") ? "✕" : "☰";
    });
  }
}

/* ============================================ */
/* КАЛЬКУЛЯТОР СТОИМОСТИ ПРОЕКТА               */
/* ============================================ */

/**
 * Расчёт стоимости проекта на основе выбранных параметров
 * Учитывает тип проекта, количество часов, технологии и дополнительные услуги
 */
function calculateCost() {
  // === Получение элементов формы ===
  const projectType = document.getElementById("projectType");
  const hoursInput = document.getElementById("hours");
  const techChecks = document.querySelectorAll(".tech");
  const extraChecks = document.querySelectorAll(".extra");
  const totalField = document.getElementById("totalCost");

  // === Создание/получение блока для ошибок ===
  let errorDiv = document.getElementById("calc-error");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = "calc-error";
    errorDiv.className = "error-message";
    document.querySelector(".calculator-form").appendChild(errorDiv);
  }

  // Сброс предыдущего сообщения об ошибке
  errorDiv.innerHTML = "";
  errorDiv.style.display = "none";
  errorDiv.style.color = "#d32f2f";
  errorDiv.style.background = "#ffe0e0";
  errorDiv.style.padding = "12px";
  errorDiv.style.borderRadius = "8px";
  errorDiv.style.marginTop = "15px";

  // === Получение значений ===
  // Базовая стоимость от типа проекта
  let baseCost = parseFloat(projectType.value) || 0;
  // Количество часов
  let hours = parseFloat(hoursInput.value);

  // === ВАЛИДАЦИЯ ДАННЫХ ===

  // Проверка: выбран ли тип проекта
  if (projectType.value === "0") {
    errorDiv.innerHTML = "❌ Ошибка: пожалуйста, выберите тип проекта";
    errorDiv.style.display = "block";
    totalField.value = "";
    return;
  }

  // Проверка: корректность ввода часов
  if (isNaN(hours) || hours < 0) {
    errorDiv.innerHTML =
      "❌ Ошибка: количество часов должно быть положительным числом";
    errorDiv.style.display = "block";
    totalField.value = "";
    return;
  }

  // Предупреждение: нулевое количество часов
  if (hours === 0) {
    errorDiv.innerHTML =
      "⚠️ Предупреждение: количество часов равно 0. Добавьте часы для расчёта";
    errorDiv.style.display = "block";
    errorDiv.style.color = "#856404";
    errorDiv.style.background = "#fff3cd";
  } else {
    errorDiv.style.display = "none";
  }

  // === РАСЧЁТ СТОИМОСТИ ===

  // 1. Стоимость за часы работы (700 ₽ в час)
  const hourlyRate = 700;
  const hoursCost = hours * hourlyRate;

  // 2. Стоимость выбранных технологий
  let techCost = 0;
  techChecks.forEach((cb) => {
    if (cb.checked) techCost += parseFloat(cb.value);
  });

  // 3. Стоимость дополнительных услуг
  let extraCost = 0;
  extraChecks.forEach((cb) => {
    if (cb.checked) extraCost += parseFloat(cb.value);
  });

  // 4. Итоговый расчёт
  const total = baseCost + hoursCost + techCost + extraCost;

  // Форматирование числа с пробелами для удобства чтения
  const formattedTotal = total.toLocaleString("ru-RU");

  // === ВЫВОД РЕЗУЛЬТАТА ===
  totalField.value = formattedTotal + " ₽";

  // === Временное сообщение об успехе ===
  if (hours !== 0 && projectType.value !== "0") {
    const successMsg = document.createElement("div");
    successMsg.innerHTML = "✓ Расчет выполнен успешно!";
    successMsg.style.color = "#2e7d32";
    successMsg.style.background = "#e8f5e9";
    successMsg.style.padding = "12px";
    successMsg.style.borderRadius = "8px";
    successMsg.style.marginTop = "15px";
    successMsg.style.textAlign = "center";
    successMsg.className = "calc-success";

    // Удаляем предыдущее сообщение об успехе, если оно есть
    const oldMsg = document.querySelector(".calc-success");
    if (oldMsg) oldMsg.remove();

    document.querySelector(".calculator-form").appendChild(successMsg);

    // Автоматическое скрытие сообщения через 2 секунды
    setTimeout(() => {
      successMsg.remove();
    }, 2000);
  }
}

// Переменная для хранения исходного пути к аватарке
let originalAvatarSrc = "img/avatar1.jpg";

/**
 * Предпросмотр аватарки при наведении на альтернативное изображение
 * @param {string} imageSrc - путь к изображению для предпросмотра
 */
function previewAvatar(imageSrc) {
  const mainAvatar = document.getElementById("mainAvatar");
  if (mainAvatar) {
    // Сохраняем исходную аватарку при первом наведении
    if (
      originalAvatarSrc === "img/avatar1.jpg" &&
      mainAvatar.src !== imageSrc
    ) {
      originalAvatarSrc = mainAvatar.src;
    }
    mainAvatar.src = imageSrc;
  }
}

/**
 * Восстановление исходной аватарки при уходе курсора
 */
function restoreAvatar() {
  const mainAvatar = document.getElementById("mainAvatar");
  if (mainAvatar) {
    mainAvatar.src = originalAvatarSrc;
  }
}
