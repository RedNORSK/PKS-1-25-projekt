document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Анимация главной страницы (Hero)
    const heroBlock = document.querySelector(".hero");
    if (heroBlock) {
        setTimeout(() => {
            heroBlock.classList.add("loaded");
        }, 60);
    }

    // 2. Плавное каскадное появление карточек студентов
    const studentCards = document.querySelectorAll(".student-card");
    if (studentCards.length > 0) {
        studentCards.forEach((card, index) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = "opacity 0.5s ease, transform 0.5s ease, border-color 0.2s ease";

            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 40 * index);
        });
    }

    // 3. Интерактивный 3D-Tilt эффект для карточек при движении мыши
    const allCards = document.querySelectorAll(".student-card, .author-item");
    
    allCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
    });

    // 4. Плавный переход при клике на ВСЕ кнопки навигации
    const pageLinks = document.querySelectorAll("a.btn, a.back-btn, a.germany-link-btn");
    
    pageLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const destination = link.getAttribute("href");
            
            // Пропускаем внешние ссылки (Инстаграм и т.д.)
            if (destination.startsWith("http") || link.getAttribute("target") === "_blank") {
                return;
            }

            e.preventDefault();
            document.body.style.opacity = "0";
            document.body.style.transition = "opacity 0.3s ease";

            setTimeout(() => {
                window.location.href = destination;
            }, 300);
        });
    });

    // 5. Логика Модального окна (открытие/закрытие)
    const modal = document.getElementById("studentModal");
    if (modal) {
        const modalAvatar = document.getElementById("modalAvatar");
        const modalName = document.getElementById("modalName");
        const modalRole = document.getElementById("modalRole");
        const modalHobby = document.getElementById("modalHobby");
        const modalQuote = document.getElementById("modalQuote");
        const closeBtn = modal.querySelector(".modal-close");

        studentCards.forEach(card => {
            card.addEventListener("click", () => {
                modalAvatar.src = card.getAttribute("data-img");
                modalName.textContent = card.getAttribute("data-name");
                modalRole.textContent = card.getAttribute("data-role");
                modalHobby.textContent = card.getAttribute("data-hobby");
                modalQuote.textContent = card.getAttribute("data-quote");

                modal.classList.add("active");
            });
        });

        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("active")) {
                modal.classList.remove("active");
            }
        });
    }

    // 6. Живой поиск (ультра-надежный: ищет и по атрибутам, и по тексту внутри)
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            studentCards.forEach(card => {
                const dataName = card.getAttribute("data-name") ? card.getAttribute("data-name").toLowerCase() : "";
                const textContent = card.textContent.toLowerCase();

                if (dataName.includes(query) || textContent.includes(query)) {
                    card.style.display = ""; // Возвращает дефолтный flex из CSS
                } else {
                    card.style.display = "none"; // Скрывает не подходящие
                }
            });
        });
    }
});

// 7. Секретная пасхалка для Айганыш ❤️
    const easterEggBadge = document.getElementById("aiganyshEasterEgg");
    if (easterEggBadge) {
        easterEggBadge.addEventListener("click", (e) => {
            e.stopPropagation(); // Чтобы при клике на бейдж не открывалось модальное окно карточки
            
            const originalText = easterEggBadge.textContent;
            easterEggBadge.textContent = "Mój kotek ❤️";
            easterEggBadge.style.background = "#ff5c8a";
            easterEggBadge.style.color = "#fff";

            // Спавним несколько летающих сердечек
            for (let i = 0; i < 6; i++) {
                const heart = document.createElement("div");
                heart.className = "floating-heart";
                heart.innerHTML = "❤️";
                
                const rect = easterEggBadge.getBoundingClientRect();
                // Рандомное смещение вокруг бейджа
                const randomX = rect.left + rect.width / 2 + (Math.random() * 50 - 25);
                
                heart.style.left = `${randomX}px`;
                heart.style.top = `${rect.top}px`;
                
                document.body.appendChild(heart);

                setTimeout(() => {
                    heart.remove();
                }, 1000);
            }

            // Возвращаем всё назад через 2.5 секунды
            setTimeout(() => {
                easterEggBadge.textContent = originalText;
                easterEggBadge.style.background = "";
                easterEggBadge.style.color = "";
            }, 2500);
        });
    }

    // 8. Управление фоновым аудио (Lofi/Autumn Ambience)
    const audioBtn = document.getElementById("audioToggleBtn");
    const audioEl = document.getElementById("ambientAudio");

    if (audioBtn && audioEl) {
        audioBtn.addEventListener("click", () => {
            if (audioEl.paused) {
                audioEl.play().then(() => {
                    audioBtn.classList.add("playing");
                    audioBtn.querySelector(".audio-text").textContent = "Играет атмосфера...";
                }).catch(err => {
                    console.log("Ошибка воспроизведения аудио:", err);
                    alert("Убедись, что аудиофайл называется autumn-sound.mp3 и лежит в папке проекта!");
                });
            } else {
                audioEl.pause();
                audioBtn.classList.remove("playing");
                audioBtn.querySelector(".audio-text").textContent = "Атмосфера";
            }
        });
    }

    // 9. Логика модального окна для карточек Германии
    const gModal = document.getElementById("germanyModal");
    if (gModal) {
        const gModalImg = document.getElementById("gModalImg");
        const gModalTitle = document.getElementById("gModalTitle");
        const gModalSubtitle = document.getElementById("gModalSubtitle");
        const gModalDesc = document.getElementById("gModalDesc");
        const gCloseBtn = document.getElementById("germanyModalClose");

        const germanyCards = document.querySelectorAll(".germany-card");

        germanyCards.forEach(card => {
            card.addEventListener("click", () => {
                gModalImg.src = card.getAttribute("data-img");
                gModalTitle.textContent = card.getAttribute("data-name");
                gModalSubtitle.textContent = card.getAttribute("data-subtitle");
                gModalDesc.textContent = `«${card.getAttribute("data-desc")}»`;

                gModal.classList.add("active");
            });
        });

        if (gCloseBtn) {
            gCloseBtn.addEventListener("click", () => {
                gModal.classList.remove("active");
            });
        }

        gModal.addEventListener("click", (e) => {
            if (e.target === gModal) {
                gModal.classList.remove("active");
            }
        });
    }

    // 10. Автоматический ротатор осенних цитат с плавным эффектом
    const slides = document.querySelectorAll(".quote-slide");
    const dots = document.querySelectorAll(".quote-dots .dot");

    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 6500; // Смена каждые 6.5 секунд

        function showSlide(index) {
            const activeSlide = document.querySelector(".quote-slide.active");
            
            // Если есть активный слайд, плавно убираем его
            if (activeSlide) {
                activeSlide.style.transition = "opacity 0.4s ease";
                activeSlide.style.opacity = "0";

                setTimeout(() => {
                    slides.forEach((slide, i) => {
                        slide.classList.remove("active");
                        slide.style.opacity = "";
                        slide.style.transition = "";
                        if (dots[i]) dots[i].classList.remove("active");
                    });

                    // Включаем новый слайд
                    slides[index].classList.add("active");
                    if (dots[index]) dots[index].classList.add("active");
                }, 400); // Пауза 0.4с для плавного исчезновения
            } else {
                slides[index].classList.add("active");
                if (dots[index]) dots[index].classList.add("active");
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Авто-переключение
        let timer = setInterval(nextSlide, slideInterval);

        // Клики по точкам-индикаторам
        dots.forEach((dot, idx) => {
            dot.addEventListener("click", () => {
                if (idx === currentSlide) return;
                clearInterval(timer);
                currentSlide = idx;
                showSlide(currentSlide);
                timer = setInterval(nextSlide, slideInterval);
            });
        });
    }