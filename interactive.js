// ============================
// Вспомогательные переменные
// ============================
const header = document.querySelector(".header");
const heroSection = document.querySelector(".hero");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".header__link");

// ============================
// Scroll: хедер + меню активное
// ============================
function scrollHandler() {
  const scrollY = window.scrollY;
  const heroHeight = heroSection?.offsetHeight || 0;

  // Хедер — смена стиля
  if (scrollY > heroHeight - 80) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }

  // Подсветка активного пункта меню
  if (scrollY < 600) {
    navLinks.forEach((link) => link.classList.remove("active"));
    return;
  }

  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 150;
    const height = section.offsetHeight;

    if (scrollY >= top && scrollY < top + height) {
      current = section.getAttribute("id");
    }
  });

  if (
    ["portfolio-audio", "portfolio-video", "portfolio-gallery"].includes(
      current
    )
  ) {
    current = "portfolio";
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href")?.replace("#", "");
    if (href === current) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", scrollHandler);

// ============================
// Анимация слогана
// ============================
window.addEventListener("DOMContentLoaded", () => {
  const introText = document.getElementById("intro-text");
  if (!introText) return;

  const words = introText.textContent.trim().split(" ");
  introText.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");

  // Анимация появления при загрузке
  gsap.fromTo(
    "#intro-text span",
    { opacity: 0, y: 30, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.3,
      stagger: 0.25,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => ScrollTrigger.refresh(), // чтобы триггер корректно пересчитал позиции
    }
  );

  // Регистрируем ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Плавное "улетание" влево при скролле вниз и возврат при скролле вверх
  const tlHeroHide = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top+=320", // диапазон для плавности
      scrub: 1.8, // сглаживание
    },
  });

  tlHeroHide.fromTo(
    "#intro-text span",
    { opacity: 1, x: 0 },
    {
      opacity: 0,
      x: -160,
      stagger: { each: 0.16, from: "start" },
      ease: "none",
      immediateRender: false,
      overwrite: "auto",
    }
  );
});

// ============================
// Плавная прокрутка
// ============================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href")?.substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ============================
// Аудиоплеер
// ============================
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const progress = document.getElementById("progress");
const title = document.getElementById("audio-title");
const cover = document.getElementById("audio-cover");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audioItems = document.querySelectorAll(".custom-audio-player__item");

let currentIndex = -1;

function playTrack(index) {
  const item = audioItems[index];
  if (!item) return;

  audioItems.forEach((i) => i.classList.remove("active", "paused"));
  item.classList.add("active");

  audio.src = item.dataset.src;
  title.textContent = item.querySelector("p").textContent;
  cover.src = item.querySelector("img").src;

  audio.play();
  playPauseBtn.textContent = "⏸";
  currentIndex = index;
}

audioItems.forEach((item, index) => {
  item.addEventListener("click", () => playTrack(index));
});

playPauseBtn?.addEventListener("click", () => {
  const activeItem = document.querySelector(
    ".custom-audio-player__item.active"
  );
  if (!audio.src) return;

  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
    activeItem?.classList.remove("paused");
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
    activeItem?.classList.add("paused");
  }
});

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress?.addEventListener("input", () => {
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

prevBtn?.addEventListener("click", () => {
  if (currentIndex === -1) return;
  playTrack((currentIndex - 1 + audioItems.length) % audioItems.length);
});

nextBtn?.addEventListener("click", () => {
  if (currentIndex === -1) return;
  playTrack((currentIndex + 1) % audioItems.length);
});

audio.addEventListener("ended", () => {
  if (currentIndex === -1) return;
  playTrack((currentIndex + 1) % audioItems.length);
});

// ============================
// Видеоплеер
// ============================
const videoElement = document.getElementById("video");
const videoTitle = document.getElementById("video-title");
const videoItems = document.querySelectorAll(".custom-video-player__item");

let videoCurrentIndex = -1;

function playVideo(index) {
  const item = videoItems[index];
  if (!item || !videoElement) return;

  videoItems.forEach((i) => i.classList.remove("active", "paused"));
  item.classList.add("active");

  videoElement.src = item.dataset.src;
  videoTitle.textContent = item.querySelector("p").textContent;

  const placeholder = document.getElementById("video-placeholder");
  if (placeholder) placeholder.style.display = "none";
  videoElement.style.display = "block";

  videoElement.play();
  videoCurrentIndex = index;
}

videoItems.forEach((item, index) => {
  item.addEventListener("click", () => playVideo(index));
});

// ============================
// Swiper (услуги)
// ============================
new Swiper(".services-swiper", {
  loop: true,
  centeredSlides: true,
  slidesPerView: "auto",
  spaceBetween: 60,
  grabCursor: true,
  speed: 1200,
  effect: "coverflow",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 200,
    modifier: 1,
    slideShadows: false,
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// ============================
// Модалка
// ============================
const openModalButtons = [
  document.querySelector(".header__button"),
  document.querySelector(".services__button"),
];
const modal = document.getElementById("requestModal");
const modalOverlay = modal.querySelector(".modal__overlay");
const modalClose = modal.querySelector(".modal__close");
const requestForm = document.getElementById("requestForm");
const successCheck = document.getElementById("successCheck");
const modalTitle = modal.querySelector(".modal__title");
const modalContent = modal.querySelector(".modal__content");

function openModal() {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

openModalButtons.forEach((btn) => btn.addEventListener("click", openModal));
modalOverlay.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

// ================================================
// Кастомный select (список услуг в модалке)
// ================================================
function initCustomSelects() {
  document.querySelectorAll(".custom-select").forEach((select) => {
    const selected = select.querySelector(".custom-select__selected");
    const options = select.querySelector(".custom-select__options");
    const hiddenInput = select.nextElementSibling; // input type=hidden

    // Открыть/закрыть
    selected.addEventListener("click", () => {
      document.querySelectorAll(".custom-select").forEach((s) => {
        if (s !== select) s.classList.remove("open");
      });
      select.classList.toggle("open");
    });

    // Выбор опции
    options.querySelectorAll(".custom-select__option").forEach((option) => {
      option.addEventListener("click", () => {
        selected.textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        select.classList.remove("open");
      });
    });
  });

  // Закрытие при клике вне
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select")) {
      document
        .querySelectorAll(".custom-select")
        .forEach((s) => s.classList.remove("open"));
    }
  });
}

// Инициализация при загрузке страницы
initCustomSelects();

// ============================
// Отправка в Telegram
// ============================
requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = requestForm.querySelector(".modal__submit");
  const prevText = submitBtn?.textContent;

  // Включаем "загрузка"
  if (submitBtn) {
    submitBtn.textContent = "Отправляем…";
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
  }

  const formData = new FormData(requestForm);

  // Таймаут запроса (12с)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch("http://localhost:3000/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        service: formData.get("service"),
        comment: formData.get("comment") || "",
      }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(
        data.error || data.message || "Не удалось отправить заявку"
      );
    }

    // Успех
    modalTitle.textContent = "ЗАЯВКА ОТПРАВЛЕНА";
    modalContent.classList.add("modal__content--success");

    requestForm.style.display = "none";
    successCheck.classList.add("active");

    setTimeout(() => {
      successCheck.classList.remove("active");
      requestForm.reset();
      requestForm.style.display = "flex";

      // Вернём исходный заголовок и состояние модалки
      modalTitle.textContent = "Оставьте заявку";
      modalContent.classList.remove("modal__content--success");
      closeModal();
    }, 5000);
  } catch (err) {
    if (err.name === "AbortError") {
      alert("Сервер отвечает слишком долго. Попробуйте ещё раз.");
    } else {
      alert(err.message || "Сеть недоступна или сервер не запущен.");
      console.error(err);
    }
  } finally {
    clearTimeout(timeoutId);

    // Выключаем "загрузка"
    if (submitBtn) {
      submitBtn.textContent = prevText || "Отправить";
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }
});

// ============================
// Анимация фотографий в галерее через GSAP
// ============================
gsap.utils.toArray(".photo-gallery__item").forEach((item, i) => {
  gsap.fromTo(
    item,
    {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: i * 0.15,
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    }
  );
});

// ============================
// Фото-галерея с модалкой
// ============================
(() => {
  const galleryImages = Array.from(
    document.querySelectorAll(".photo-gallery .gallery img")
  );
  const lightbox = document.getElementById("photoLightbox");
  const lightboxImg = lightbox?.querySelector(".photo-lightbox__img");
  const btnClose = lightbox?.querySelector(".photo-lightbox__close");
  const btnPrev = lightbox?.querySelector(".photo-lightbox__prev");
  const btnNext = lightbox?.querySelector(".photo-lightbox__next");
  let idx = -1;

  if (!galleryImages.length || !lightbox || !lightboxImg) return;

  const open = (i) => {
    idx = (i + galleryImages.length) % galleryImages.length;
    lightboxImg.classList.remove("fade");
    lightboxImg.src = galleryImages[idx].src;
    requestAnimationFrame(() => lightboxImg.classList.add("fade"));
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  const prev = () => open(idx - 1);
  const next = () => open(idx + 1);

  galleryImages.forEach((img, i) => {
    img.addEventListener("click", () => open(i));
  });

  btnClose?.addEventListener("click", close);
  btnPrev?.addEventListener("click", prev);
  btnNext?.addEventListener("click", next);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close(); // клик по фону
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();

// Мобильное меню (бургер)
const burger = document.querySelector(".header__burger");
const headerNav = document.querySelector(".header__nav");

burger?.addEventListener("click", () => {
  headerNav?.classList.toggle("open");
  document.body.style.overflow = headerNav?.classList.contains("open")
    ? "hidden"
    : "";
});

// Закрываем меню по клику на пункт
navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    headerNav?.classList.remove("open");
    document.body.style.overflow = "";
  })
);

// Закрываем по Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    headerNav?.classList.remove("open");
    document.body.style.overflow = "";
  }
});
