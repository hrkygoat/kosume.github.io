document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header'); // ヘッダー要素を取得

    // ローディングアニメーション
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            // メインコンテンツ表示後にスライドショーとカルーセルを開始
            startSlideshow();
            setupProductCarousel();
        }, 500); // フェードアウトの時間に合わせる
    }, 1500); // 1.5秒後にローディングを終了 (調整可能)

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // ヘッダーの高さ分を考慮してスクロール位置を調整
                // offsetHeightはpaddingやborderを含む要素の高さ
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                // スムーズスクロールを実行
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // モバイルメニューが開いている場合は閉じる
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.querySelector('.hamburger-menu').classList.remove('active');
                }
            }
        });
    });

    // ハンバーガーメニュー
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburgerMenu.classList.toggle('active'); // ハンバーガーアイコンのアニメーション用
    });

    // スライドショー（ファーストビュー）
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');

    function showSlides() {
        if (slides.length === 0) return; // スライドがない場合は処理しない

        slides.forEach(slide => slide.classList.remove('active'));
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        slides[slideIndex - 1].classList.add('active');
        setTimeout(showSlides, 5000); // 5秒ごとにスライドを切り替え
    }

    function startSlideshow() {
        if (slides.length > 0) {
            // 最初のスライドをすぐにアクティブにする
            slides[0].classList.add('active');
            // その後、定期的なスライド切り替えを開始
            setTimeout(showSlides, 5000);
        }
    }


    // 商品一覧カルーセル
    function setupProductCarousel() {
        const carouselTrack = document.querySelector('.product-carousel .carousel-track');
        const productCards = document.querySelectorAll('.product-card');
        const prevButton = document.querySelector('.product-carousel .prev-button');
        const nextButton = document.querySelector('.product-carousel .next-button');

        if (!carouselTrack || productCards.length === 0) {
            // カルーセル要素がないか、商品カードがない場合は何もしない
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        const totalCards = productCards.length;

        // レスポンシブ対応のカード数調整
        function getCardsPerPage() {
            if (window.innerWidth <= 768) { // タブレット以下
                return 1;
            } else if (window.innerWidth <= 1024) { // デスクトップ中サイズ
                return 2;
            } else { // デスクトップ大サイズ
                return 3;
            }
        }

        function updateCarousel() {
            const currentCardsPerPage = getCardsPerPage();
            // productCards[0]が存在しない場合を考慮
            const cardWidth = productCards.length > 0 ? productCards[0].offsetWidth + 20 : 0; // カード幅 + マージン
            carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

            // ボタンの表示/非表示
            prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
            nextButton.style.display = (currentIndex + currentCardsPerPage >= totalCards) ? 'none' : 'block';

            // スライドが1ページに収まる場合は両方のボタンを非表示
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

        // ウィンドウのリサイズ時にカルーセルを更新
        window.addEventListener('resize', () => {
            currentIndex = 0; // リサイズ時に初期位置に戻す
            updateCarousel();
        });

        // 初期表示
        updateCarousel();
    }
});


/* ここから下は詳細画面のcssです */

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');

    // ローディングアニメーション（トップページのみに適用したい場合は条件分岐）
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (mainContent) {
                    mainContent.classList.add('loaded');
                }
                // 各機能のセットアップ
                startSlideshow(); // トップページのスライドショー
                setupProductCarousel(); // トップページの商品カルーセル
                setupScrollAnimations(); // トップページのスクロールアニメーション
                startProductDetailSlideshow(); // ★商品詳細ページの画像スライドショー
            }, 500);
        }, 1500);
    } else {
        // loadingScreen がない場合（例: product-detail.htmlに直接アクセス）
        if (mainContent) {
            mainContent.classList.add('loaded');
        }
        startProductDetailSlideshow(); // ★商品詳細ページの画像スライドショー
        // トップページ専用の関数はここでは呼び出さない
    }


    // スムーズスクロール
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // 同じページ内のアンカーリンク、またはindex.htmlへのアンカーリンク
            if (href.startsWith('#') || (href.startsWith('index.html#') && window.location.pathname.includes('index.html'))) {
                e.preventDefault();

                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = header.offsetHeight;
                    const offsetPosition = (targetId === 'top')
                        ? 0
                        : targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    const navLinks = document.querySelector('.nav-links');
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        document.querySelector('.hamburger-menu').classList.remove('active');
                    }
                } else if (href.startsWith('index.html#') && !window.location.pathname.includes('index.html')) {
                    // product-detail.html から index.html の特定セクションへの遷移
                    // この場合はpreventDefaultせず、ブラウザの通常のリンク遷移に任せる
                    // または、JavaScriptで遷移後にスクロールを制御することも可能
                    // 今回はシンプルに通常の遷移に任せます
                }
            }
        });
    });

    // ハンバーガーメニュー
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }


    // トップページ専用: スライドショー（ファーストビュー）
    function startSlideshow() {
        const slides = document.querySelectorAll('.hero-section .slide');
        if (slides.length === 0) return;

        let slideIndex = 0;
        function showSlides() {
            slides.forEach(slide => slide.classList.remove('active'));
            slideIndex++;
            if (slideIndex > slides.length) {
                slideIndex = 1;
            }
            slides[slideIndex - 1].classList.add('active');
            setTimeout(showSlides, 5000);
        }

        slides[0].classList.add('active');
        setTimeout(showSlides, 5000);
    }


    // トップページ専用: 商品一覧カルーセル
    function setupProductCarousel() {
        const carouselTrack = document.querySelector('#products .carousel-track');
        if (!carouselTrack) return;

        const productCards = document.querySelectorAll('#products .product-card');
        const prevButton = document.querySelector('#products .prev-button');
        const nextButton = document.querySelector('#products .next-button');

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

    // トップページ専用: スクロールアニメーション
    function setupScrollAnimations() {
        const sections = document.querySelectorAll('.section-padding:not(#top)');
        if (sections.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

  // ★修正・再構築: 商品詳細ページ専用: 商品画像スライドショー
  function startProductDetailSlideshow() {
    const productSlides = document.querySelectorAll('.product-slideshow-container .product-slide');
    const thumbnails = document.querySelectorAll('.thumbnail-images .thumbnail');

    if (productSlides.length === 0 || thumbnails.length === 0) {
        console.warn('商品詳細スライドショーの要素が見つかりません。');
        return;
    }

    let currentProductSlideIndex = 0;
    let productSlideshowInterval; // setIntervalのIDを保持

    // 特定のスライドを表示する関数
    function displaySlide(index) {
        // 全てのスライドとサムネイルのactiveクラスを削除
        productSlides.forEach(slide => slide.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));

        // 指定されたインデックスのスライドとサムネイルにactiveクラスを追加
        if (productSlides[index]) {
            productSlides[index].classList.add('active');
        }
        if (thumbnails[index]) {
            thumbnails[index].classList.add('active');
        }
        currentProductSlideIndex = index; // 現在のインデックスを更新
    }

    // 次のスライドに切り替える関数（自動再生用）
    function nextSlide() {
        const nextIndex = (currentProductSlideIndex + 1) % productSlides.length;
        displaySlide(nextIndex);
    }

    // 自動再生を開始する関数
    function startAutoPlay() {
        // 既存のタイマーがあればクリア
        clearInterval(productSlideshowInterval);
        // 新しいタイマーを設定
        productSlideshowInterval = setInterval(nextSlide, 5000); // 5秒ごとに切り替え
    }

    // サムネイルクリック時のイベントリスナーを設定
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const index = parseInt(thumbnail.getAttribute('data-index'));
            if (!isNaN(index)) { // indexが有効な数値であることを確認
                displaySlide(index); // クリックされたスライドを表示
                startAutoPlay(); // その後、自動再生を再開
            }
        });
    });

    // 初回表示と自動再生の開始
    displaySlide(0); // 最初のスライドを表示
    startAutoPlay(); // 自動再生を開始
}
});