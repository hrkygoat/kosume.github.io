document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body; // body要素を取得

    // ローディングアニメーション
    if (loadingScreen && mainContent) { // loadingScreenがあるページのみ適用 (例: index.html)
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block'; // displayをblockに設定
                mainContent.classList.add('loaded'); // opacityを1にするためのクラス
                console.log("Loading screen finished. Initializing page features."); // 診断ログ
                initializePageSpecificFeatures(); // ページ固有の機能を初期化
            }, 500); // フェードアウトの時間に合わせる
        }, 1500); // 1.5秒後にローディングを終了 (調整可能)
    } else if (mainContent) {
        // loadingScreenがないページ (例: shosai.html に直接アクセス)
        mainContent.style.display = 'block'; // displayをblockに設定
        mainContent.classList.add('loaded'); // opacityを1にするためのクラス
        console.log("No loading screen. Initializing page features directly."); // 診断ログ
        initializePageSpecificFeatures(); // ページ固有の機能を初期化
    }


    // ハンバーガーメニュー
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', (event) => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            event.stopPropagation(); // ハンバーガーメニュー自身のクリックイベントがdocumentまで伝播しないように
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            });
        });

        // ドキュメント全体のクリックイベントでメニューを閉じる
        document.addEventListener('click', (event) => {
            if (navLinks.classList.contains('active') && !event.target.closest('.nav-links') && !event.target.closest('.hamburger-menu')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    }

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const isCurrentPageAnchor = href.startsWith('#');
            const isIndexPageAnchorFromOtherPage = href.startsWith('index.html#') && !window.location.pathname.includes('index.html');

            if (isCurrentPageAnchor || (isIndexPageAnchorFromOtherPage && mainContent)) {
                e.preventDefault();

                let targetId;
                if (isCurrentPageAnchor) {
                    targetId = href.substring(1);
                } else {
                    targetId = href.split('#')[1];
                }

                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // モバイルメニューが開いている場合は閉じる
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        if (hamburgerMenu) {
                            hamburgerMenu.classList.remove('active');
                        }
                        body.classList.remove('no-scroll'); // bodyのスクロール禁止を解除
                    }
                } else if (isIndexPageAnchorFromOtherPage) {
                    window.location.href = href;
                }
            }
        });
    });

    // ページ固有の機能を初期化する関数
    function initializePageSpecificFeatures() {
        console.log("initializePageSpecificFeatures called."); // 診断ログ
        const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/'; // トップページを判断

        if (isIndexPage) {
            console.log("Current page is index.html. Starting slideshow and carousel."); // 診断ログ
            startSlideshow(); // トップページのスライドショー
            setupProductCarousel(); // トップページの商品カルーセル
            // setupScrollAnimations(); // スクロールアニメーション（もし必要なら）
        } else {
            // 詳細ページ shosai.html 専用の機能
            console.log("Current page is shosai.html. Starting product detail slideshow."); // 診断ログ
            startProductDetailSlideshow(); // 商品詳細ページの画像スライドショー
        }
    }

    // トップページ専用: スライドショー（ファーストビュー）
    function startSlideshow() {
        const slides = document.querySelectorAll('.hero-section .slide');
        console.log("startSlideshow called. Number of slides found:", slides.length); // 診断ログ

        if (slides.length === 0) {
            console.log("No slides found in .hero-section .slide. Slideshow will not start.");
            return;
        }

        let slideIndex = 0;
        let slideshowInterval;

        function showSlides() {
            slides.forEach(slide => slide.classList.remove('active'));
            slideIndex++;
            if (slideIndex > slides.length) {
                slideIndex = 1;
            }
            slides[slideIndex - 1].classList.add('active');
            console.log("Showing slide index:", slideIndex - 1); // 診断ログ
        }

        // 最初のスライドをすぐにアクティブに
        if (slides[0]) { // 念のためslides[0]の存在を確認
            slides[0].classList.add('active');
            console.log("First slide set to active immediately."); // 診断ログ
        } else {
            console.log("Error: slides[0] not found for initial active class."); // 診断ログ
        }
        
        slideshowInterval = setInterval(showSlides, 5000); // 5秒ごとにスライドを切り替え
    }

    // トップページ専用: 商品一覧カルーセル
    function setupProductCarousel() {
        const carouselTrack = document.querySelector('#products .carousel-track');
        const productCards = document.querySelectorAll('#products .product-card');
        const prevButton = document.querySelector('#products .prev-button');
        const nextButton = document.querySelector('#products .next-button');

        if (!carouselTrack || productCards.length === 0 || !prevButton || !nextButton) {
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        const totalCards = productCards.length;

        function getCardsPerPage() {
            if (window.innerWidth <= 768) {
                return 1;
            } else if (window.innerWidth <= 1024) {
                return 2;
            } else {
                return 3;
            }
        }

        function updateCarousel() {
            const currentCardsPerPage = getCardsPerPage();
            const cardWidth = productCards.length > 0 ? productCards[0].offsetWidth + 20 : 0;
            carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

            prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
            nextButton.style.display = (currentIndex + currentCardsPerPage >= totalCards) ? 'none' : 'block';

            if (totalCards <= currentCardsPerPage) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
            }
        }

        prevButton.addEventListener('click', () => {
            const currentCardsPerPage = getCardsPerPage();
            currentIndex = Math.max(0, currentIndex - currentCardsPerPage);
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            const currentCardsPerPage = getCardsPerPage();
            currentIndex = Math.min(totalCards - currentCardsPerPage, currentIndex + currentCardsPerPage);
            updateCarousel();
        });

        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateCarousel();
        });

        updateCarousel();
    }

    // 商品詳細ページ専用: 商品画像スライドショー
    function startProductDetailSlideshow() {
        const productSlides = document.querySelectorAll('.product-slideshow-container .product-slide');
        const thumbnails = document.querySelectorAll('.thumbnail-images .thumbnail');

        if (productSlides.length === 0 || thumbnails.length === 0) {
            return;
        }

        let currentProductSlideIndex = 0;
        let productSlideshowInterval;

        function displaySlide(index) {
            productSlides.forEach(slide => slide.classList.remove('active'));
            thumbnails.forEach(thumb => thumb.classList.remove('active'));

            const validIndex = Math.max(0, Math.min(index, productSlides.length - 1));
            
            if (productSlides[validIndex]) {
                productSlides[validIndex].classList.add('active');
            }
            if (thumbnails[validIndex]) {
                thumbnails[validIndex].classList.add('active');
            }
            currentProductSlideIndex = validIndex;
        }

        function nextSlide() {
            const nextIndex = (currentProductSlideIndex + 1) % productSlides.length;
            displaySlide(nextIndex);
        }

        function startAutoPlay() {
            clearInterval(productSlideshowInterval);
            productSlideshowInterval = setInterval(nextSlide, 5000);
        }

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const index = parseInt(thumbnail.getAttribute('data-index'));
                if (!isNaN(index)) {
                    displaySlide(index);
                    startAutoPlay();
                }
            });
        });

        displaySlide(0);
        startAutoPlay();
    }
});
