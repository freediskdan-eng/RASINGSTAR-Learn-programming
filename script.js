document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtnMobile = document.querySelector('.mobile-menu .close-btn');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu a:not(.btn), .mobile-menu .btn-login, .mobile-menu .btn-online-editor');
    const scrollToContentBtn = document.querySelector('.scroll-to-content');
    const articleContent = document.querySelector('.article-content');

    // Модальное окно для изображений
    const imageModalBackdrop = document.querySelector('.image-modal-backdrop');
    const imageModalImg = imageModalBackdrop.querySelector('img');
    const imageModalCloseBtn = imageModalBackdrop.querySelector('.modal-close');
    const clickableImages = document.querySelectorAll('.image-wrapper img'); // Выбираем сами <img>

    // --- Утилита для блокировки/разблокировки скролла тела страницы ---
    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    function toggleBodyScroll(enable) {
        if (enable) {
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
        } else {
            // Вычисляем ширину скроллбара, чтобы предотвратить "прыжок" контента
            scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.classList.add('modal-open');
        }
    }


    // --- Эффект прозрачности шапки при прокрутке ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Мобильное меню: Открытие/Закрытие ---
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active'); // Анимируем иконку гамбургера
        toggleBodyScroll(!mobileMenu.classList.contains('active')); // Блокируем прокрутку фона
    });

    closeBtnMobile.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        toggleBodyScroll(true); // Разблокируем прокрутку фона
    });

    // Закрытие мобильного меню при клике на ссылку или кнопку "Войти" (только для внутренних ссылок)
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Если это ссылка на внешний ресурс (онлайн редактор), не закрываем меню
            if (e.currentTarget.tagName === 'A' && e.currentTarget.getAttribute('target') === '_blank') {
                return; 
            }
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            toggleBodyScroll(true); // Разблокируем прокрутку фона
        });
    });

    // --- Плавная прокрутка до статьи по кнопке "Начать Путешествие" ---
    if (scrollToContentBtn && articleContent) {
        scrollToContentBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Предотвращаем стандартное действие ссылки/кнопки
            articleContent.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Плавная прокрутка для навигационных ссылок (в шапке и мобильном меню) ---
    document.querySelectorAll('.desktop-nav a, .mobile-menu a:not(.btn-online-editor)').forEach(anchor => { // Исключаем онлайн редактор
        anchor.addEventListener('click', function (e) {
            // Если это не внутренняя якорная ссылка, пропускаем
            if (!this.getAttribute('href').startsWith('#')) {
                return;
            }
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Пример функции для кнопки "Войти" (можно расширить) ---
    document.querySelectorAll('.btn-login').forEach(button => {
        button.addEventListener('click', () => {
            alert('Функционал входа пока не реализован. Приходите позже!');
            // Здесь будет логика открытия модального окна входа или перенаправления
        });
    });

    // --- Копирование кода с "липкой" кнопкой при горизонтальной прокрутке ---
    const codeBlocks = document.querySelectorAll('pre');
    const prePaddingRight = 20; // Значение padding-right у <pre>

    codeBlocks.forEach(preBlock => {
        const codeElement = preBlock.querySelector('code');
        if (!codeElement) return;

        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-code-btn');
        copyButton.textContent = 'Копировать';

        preBlock.appendChild(copyButton);

        const updateCopyButtonPosition = () => {
            const maxScrollLeft = preBlock.scrollWidth - preBlock.clientWidth;
            const buttonLeft = Math.max(0, preBlock.scrollLeft + preBlock.clientWidth - copyButton.offsetWidth - prePaddingRight);
            copyButton.style.left = `${buttonLeft}px`;
        };

        // Устанавливаем начальную позицию кнопки после рендеринга
        setTimeout(updateCopyButtonPosition, 0); 
        
        // Обновляем позицию при прокрутке <pre>
        preBlock.addEventListener('scroll', updateCopyButtonPosition);

        // Обновляем позицию при изменении размера окна (или родительского блока <pre>)
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === preBlock) {
                    updateCopyButtonPosition();
                }
            }
        });
        resizeObserver.observe(preBlock);


        copyButton.addEventListener('click', async () => {
            const textToCopy = codeElement.textContent;

            try {
                await navigator.clipboard.writeText(textToCopy);
                
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Скопировано!';
                copyButton.classList.add('copied');

                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Не удалось скопировать текст: ', err);
                alert('Ошибка при копировании. Возможно, ваш браузер блокирует прямое копирование или вы используете незащищенное соединение (HTTP). Пожалуйста, скопируйте код вручную.');
            }
        });
    });

    // --- Логика модального окна для изображений ---
    clickableImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            imageModalImg.src = img.src;
            imageModalImg.alt = img.alt;
            imageModalBackdrop.classList.add('active');
            toggleBodyScroll(false); // Блокируем скролл фона
        });
    });

    // Закрытие модального окна по кнопке "X"
    imageModalCloseBtn.addEventListener('click', () => {
        imageModalBackdrop.classList.remove('active');
        toggleBodyScroll(true); // Разблокируем скролл фона
    });

    // Закрытие модального окна по клику вне изображения
    imageModalBackdrop.addEventListener('click', (e) => {
        if (e.target === imageModalBackdrop) {
            imageModalBackdrop.classList.remove('active');
            toggleBodyScroll(true); // Разблокируем скролл фона
        }
    });

    // Закрытие модального окна по нажатию Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModalBackdrop.classList.contains('active')) {
            imageModalBackdrop.classList.remove('active');
            toggleBodyScroll(true); // Разблокируем скролл фона
        }
    });

}); // Конец DOMContentLoaded