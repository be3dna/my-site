$(document).ready(function () {
  let slideshowInterval = null; // Идентификатор интервала
  let isRunning = false; // Флаг состояния (запущено/остановлено)
  let currentSpeed = 1000; // Текущая скорость анимации (по умолчанию 1000 мс)

  // Получаем контейнер и все изображения
  const $container = $("#fade");
  const $images = $container.find("img");
  const totalImages = $images.length;
  let currentIndex = 0; // Индекс текущего отображаемого изображения
  $images.each(function (index) {
    if (index === 0) {
      $(this).addClass("from").css("display", "block");
    } else {
      $(this).addClass("to").css("display", "none");
    }
  });

  function nextImageWithFade() {
    // Определяем текущее видимое изображение (с классом from)
    const $current = $container.find("img.from");
    // Определяем следующее изображение (по индексу с циклическим переходом)
    let nextIndex = (currentIndex + 1) % totalImages;
    const $next = $
    .eq(nextIndex);

    // Настраиваем следующее изображение: делаем его видимым с прозрачностью 0
    $next
      .css({
        display: "block",
        opacity: 0,
      })
      .addClass("to")
      .removeClass("from");

    // - следующее изображение плавно появляется (opacity от 0 до 1)
    // - текущее изображение плавно исчезает (opacity от 1 до 0)
    $next.animate({ opacity: 1 }, currentSpeed);
    $current.animate({ opacity: 0 }, currentSpeed, function () {
      // После завершения анимации скрываем текущее изображение
      $(this).css("display", "none").removeClass("from").addClass("to");
      $(this).css("opacity", ""); // Сбрасываем inline-стиль opacity
    });

    // Делаем следующее изображение активным
    $next.removeClass("to").addClass("from");
    $next.css("opacity", ""); // Сбрасываем inline-стиль opacity

    // Обновляем текущий индекс
    currentIndex = nextIndex;
  }

  function startSlideshow() {
    // Останавливаем предыдущий интервал, если он был
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
    }

    // Запускаем новый интервал
    slideshowInterval = setInterval(nextImageWithFade, currentSpeed);
    isRunning = true;

    // Обновляем статус на странице
    updateStatus("running");

    console.log(`Слайд-шоу запущено, интервал: ${currentSpeed} мс`);
  }

  function stopSlideshow() {
    // Останавливаем интервал
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
    isRunning = false;

    // Обновляем статус на странице
    updateStatus("stopped");

    console.log("Слайд-шоу остановлено");
  }

  // ========== ФУНКЦИЯ ОБНОВЛЕНИЯ СТАТУСА ==========
  function updateStatus(state) {
    const $status = $("#slideshowStatus");
    if (state === "running") {
      $status.html("Слайд-шоу запущено");
      $status.css({
        background: "rgba(76, 175, 80, 0.15)",
        color: "#4caf50",
      });
    } else {
      $status.html("⏸Слайд-шоу остановлено");
      $status.css({
        background: "rgba(255, 152, 0, 0.15)",
        color: "#ff9800",
      });
    }
  }

  // Изменение скорости
  $("#fadeSpeed").on("input", function () {
    currentSpeed = parseInt($(this).val());
    $("#speedValue").text(currentSpeed + " мс");

    // Если слайд-шоу запущено, перезапускаем с новой скоростью
    if (isRunning) {
      startSlideshow(); // Перезапуск с обновленной скоростью
    }
  });

  // 2. Кнопка "Включить"
  $("#startBtn").on("click", function () {
    if (!isRunning) {
      startSlideshow();
    }
  });

  // 3. Кнопка "Выключить"
  $("#stopBtn").on("click", function () {
    if (isRunning) {
      stopSlideshow();
    }
  });

  $("#slideshowStatus").html("⏸Слайд-шоу остановлено");
  $("#slideshowStatus").css({
    background: "rgba(255, 152, 0, 0.15)",
    color: "#ff9800",
  });

});
