// Основной JavaScript файл

// Переменные
let currentSlide = 0;
let testimonialsTrack;
let testimonialsCards;
let autoSlideInterval;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера отзывов
    initTestimonialsSlider();
    
    // Инициализация навыков с анимацией
    initSkillsAnimation();
    
    // Инициализация панели стилей
    initStylePanel();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация формы
    initForm();
});

// Слайдер отзывов
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    if (!slider) return;
    
    testimonialsTrack = slider.querySelector('.testimonials-track');
    testimonialsCards = slider.querySelectorAll('.testimonial-card');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    
    if (!testimonialsTrack || testimonialsCards.length === 0) return;
    
    // Клонируем первые несколько карточек для бесконечной прокрутки
    const cardsToClone = 3;
    for (let i = 0; i < cardsToClone; i++) {
        const clone = testimonialsCards[i].cloneNode(true);
        testimonialsTrack.appendChild(clone);
    }
    
    // Обновляем коллекцию карточек после добавления клонов
    testimonialsCards = testimonialsTrack.querySelectorAll('.testimonial-card');
    
    // Устанавливаем ширину трека
    updateTrackWidth();
    
    // Обработчики кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoSlide();
            slidePrev();
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoSlide();
            slideNext();
            startAutoSlide();
        });
    }
    
    // Автоматическая прокрутка
    startAutoSlide();
    
    // Остановка при наведении
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Обновление при изменении размера окна
    window.addEventListener('resize', function() {
        updateTrackWidth();
        goToSlide(currentSlide);
    });
}

function updateTrackWidth() {
    if (!testimonialsTrack || testimonialsCards.length === 0) return;
    
    const cardWidth = testimonialsCards[0].offsetWidth;
    const totalWidth = cardWidth * testimonialsCards.length;
    testimonialsTrack.style.width = totalWidth + 'px';
}

function slideNext() {
    const cardWidth = testimonialsCards[0].offsetWidth;
    const visibleCards = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
    const maxSlide = testimonialsCards.length - visibleCards;
    
    if (currentSlide < maxSlide) {
        currentSlide++;
    } else {
        // Плавный переход к началу
        currentSlide = 0;
    }
    
    goToSlide(currentSlide);
}

function slidePrev() {
    const cardWidth = testimonialsCards[0].offsetWidth;
    const visibleCards = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
    const maxSlide = testimonialsCards.length - visibleCards;
    
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = maxSlide;
    }
    
    goToSlide(currentSlide);
}

function goToSlide(slideIndex) {
    if (!testimonialsTrack || testimonialsCards.length === 0) return;
    
    const cardWidth = testimonialsCards[0].offsetWidth;
    const gap = 30; // margin между карточками
    const scrollAmount = slideIndex * (cardWidth + gap);
    
    testimonialsTrack.style.transform = `translateX(-${scrollAmount}px)`;
}

function startAutoSlide() {
    if (autoSlideInterval) return;
    autoSlideInterval = setInterval(slideNext, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Анимация навыков
function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    const progressFills = document.querySelectorAll('.progress-fill');
    const percentSpans = document.querySelectorAll('.skill-percent');
    
    // Функция для запуска анимации
    function animateSkills() {
        progressFills.forEach((fill, index) => {
            const targetPercent = parseInt(percentSpans[index].getAttribute('data-target'));
            let currentPercent = 0;
            
            // Устанавливаем ширину
            fill.style.width = targetPercent + '%';
            
            // Анимируем число
            const interval = setInterval(() => {
                if (currentPercent < targetPercent) {
                    currentPercent++;
                    percentSpans[index].textContent = currentPercent + '%';
                } else {
                    clearInterval(interval);
                }
            }, 20);
        });
    }
    
    // Используем Intersection Observer для запуска анимации при появлении в вьюпорте
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (skillItems.length > 0) {
        observer.observe(skillItems[0].parentElement);
    }
}

// Панель стилей
function initStylePanel() {
    const lightBtn = document.querySelector('.light-btn');
    const darkBtn = document.querySelector('.dark-btn');
    const colorDots = document.querySelectorAll('.color-dot');
    const root = document.documentElement;
    
    // Переключение светлой/темной темы
    if (lightBtn) {
        lightBtn.addEventListener('click', function() {
            document.body.classList.remove('dark-mode');
            lightBtn.classList.add('active');
            darkBtn.classList.remove('active');
        });
    }
    
    if (darkBtn) {
        darkBtn.addEventListener('click', function() {
            document.body.classList.add('dark-mode');
            darkBtn.classList.add('active');
            lightBtn.classList.remove('active');
        });
    }
    
    // Смена акцентного цвета
    colorDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            
            // Убираем активный класс у всех точек
            colorDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            // Меняем акцентный цвет
            changeAccentColor(color);
        });
    });
}

function changeAccentColor(color) {
    // Меняем цвет всех акцентных элементов
    const accentElements = `
        .top-bar-left i,
        .top-bar-right a:hover,
        .logo h1 span,
        .main-nav a:hover,
        .main-nav a.active,
        .hero-text h2 span,
        .form-row input:focus,
        .form-row textarea:focus,
        .stars,
        .client-name,
        .read-more,
        .dark-mode .client-name,
        .footer-section h4,
        .footer-section p i,
        .footer-section a:hover,
        .login-links a:hover
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        ${accentElements} {
            color: ${color} !important;
        }
        
        .quote-btn,
        .submit-btn,
        .prev-btn:hover,
        .next-btn:hover,
        .style-btn.active,
        .style-btn:hover,
        .progress-fill,
        .social-links a:hover {
            background: ${color} !important;
        }
        
        .quote-btn:hover,
        .submit-btn:hover {
            background: ${adjustBrightness(color, -20)} !important;
        }
        
        .prev-btn,
        .next-btn,
        .form-row input:focus,
        .form-row textarea:focus,
        .style-btn {
            border-color: ${color} !important;
        }
    `;
    
    // Удаляем предыдущий стиль, если есть
    const oldStyle = document.getElementById('accent-style');
    if (oldStyle) {
        oldStyle.remove();
    }
    
    style.id = 'accent-style';
    document.head.appendChild(style);
}

function adjustBrightness(hex, percent) {
    // Простая функция для затемнения/осветления цвета
    // В реальном проекте лучше использовать полноценную функцию
    return hex;
}

// Мобильное меню
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
        });
    }
}

// Обработка формы
function initForm() {
    const form = document.getElementById('quoteForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Здесь можно отправить данные на сервер
            console.log('Form submitted:', data);
            
            // Показываем сообщение об успехе
            alert('Thank you for your request! We will contact you soon.');
            
            // Очищаем форму
            form.reset();
        });
    }
}

// Плавная прокрутка для якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Ленивая загрузка изображений
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
