document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // ローディングアニメーション
    // loadingScreenとmainContentの両方が存在する場合に適用 (通常はindex.html)
    if (loadingScreen && mainContent) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block'; // displayをblockに設定
                mainContent.classList.add('loaded'); // opacityを1にするためのクラス
                console.log("Loading screen finished. Initializing page features."); // 診断ログ
                // ごくわずかに遅延させて、ブラウザがDOMを完全にレンダリングする時間を与える
                setTimeout(() => initializePageSpecificFeatures(), 0);
            }, 500); // フェードアウトの時間に合わせる
        }, 1500); // 1.5秒後にローディングを終了 (調整可能)
    } else if (mainContent) {
        // loadingScreenがないページ (例: shosai.html に直接アクセス)
        mainContent.style.display = 'block'; // displayをblockに設定
        mainContent.classList.add('loaded'); // opacityを1にするためのクラス
        console.log("No loading screen. Initializing page features directly."); // 診断ログ
        // ごくわずかに遅延させて、ブラウザがDOMを完全にレンダリングする時間を与える
        setTimeout(() => initializePageSpecificFeatures(), 0);
    }

    // ハンバーガーメニュー
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', (event) => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active'); // 「×」マークを切り替える
            body.classList.toggle('no-scroll'); // bodyのスクロールを禁止
            event.stopPropagation(); // ハンバーガーメニュー自身のクリックイベントがdocumentまで伝播しないように
        });

        // ナビゲーションリンクがクリックされたらメニューを閉じる
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
        // ただし、ナビゲーションメニューやハンバーガーメニュー自身がクリックされた場合は除く
        document.addEventListener('click', (event) => {
            if (navLinks.classList.contains('active') && !event.target.closest('.nav-links') && !event.target.closest('.hamburger-menu')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    }

    // スムーズスクロール
    // 現在のページ内アンカーと、index.htmlへのアンカーリンクを処理
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const isCurrentPageAnchor = href.startsWith('#');
            // shosai.htmlからindex.htmlのセクションへ移動する場合
            const isIndexPageAnchorFromOtherPage = href.startsWith('index.html#') && !window.location.pathname.includes('index.html');

            if (isCurrentPageAnchor || (isIndexPageAnchorFromOtherPage && mainContent)) {
                e.preventDefault();

                let targetId;
                if (isCurrentPageAnchor) {
                    targetId = href.substring(1);
                } else {
                    // index.html#about のようなURLから #about の部分だけを取得
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
                        body.classList.remove('no-scroll');
                    }
                } else if (isIndexPageAnchorFromOtherPage) {
                    // shosai.htmlからindex.htmlの存在しないIDへ飛ぼうとした場合など、通常のページ遷移として扱う
                    window.location.href = href;
                }
            }
        });
    });

    // ページ固有の機能を初期化する関数
    function initializePageSpecificFeatures() {
        console.log("initializePageSpecificFeatures called."); // 診断ログ
        // 現在のURLがindex.htmlであるか、ルートパスであるかを判断
        const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

        if (isIndexPage) {
            console.log("Current page is index.html. Setting up product carousel."); // 診断ログ
            // スライドショーは削除されたため、ここでの呼び出しは不要
            setupProductCarousel(); // トップページの商品カルーセルを開始
            // setupScrollAnimations(); // 必要であればスクロールアニメーションを有効化
        } else {
            // shosai.html のような詳細ページ専用の機能
            console.log("Current page is not index.html. Starting product detail slideshow."); // 診断ログ
            startProductDetailSlideshow(); // 商品詳細ページの画像スライドショーを開始
        }
    }

    // スライドショー機能は削除されたため、startSlideshow関数は存在しません。

    // トップページ専用: 商品一覧カルーセル
    function setupProductCarousel() {
        const carouselTrack = document.querySelector('#products .carousel-track');
        const productCards = document.querySelectorAll('#products .product-card');
        const prevButton = document.querySelector('#products .prev-button');
        const nextButton = document.querySelector('#products .next-button');

        // カルーセルに必要な要素が見つからない場合は処理を中断し、ボタンを非表示にする
        if (!carouselTrack || productCards.length === 0 || !prevButton || !nextButton) {
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            return;
        }

        let currentIndex = 0; // 現在のカルーセルの開始インデックス
        const totalCards = productCards.length; // 商品カードの総数
        let startX = 0; // タッチ開始時のX座標
        let currentTranslateX = 0; // 現在のtranslateX値
        let isDragging = false; // ドラッグ中かどうかのフラグ

        // 画面幅に応じて一度に表示するカード数を決定
        function getCardsPerPage() {
            if (window.innerWidth <= 768) {
                return 1; // モバイル: 1列
            } else if (window.innerWidth <= 1024) {
                return 2; // タブレット: 2列
            } else {
                return 3; // デスクトップ: 3列
            }
        }

        // カルーセルの表示を更新する
        function updateCarousel() {
            const currentCardsPerPage = getCardsPerPage();
            // カードの幅とマージンを考慮した移動量
            // productCards[0].offsetWidth は要素の実際の幅を取得
            const cardWidth = productCards.length > 0 ? productCards[0].offsetWidth + 20 : 0; // 20pxはマージンなどを想定
            currentTranslateX = -currentIndex * cardWidth;
            carouselTrack.style.transform = `translateX(${currentTranslateX}px)`;

            // 矢印ボタンの表示/非表示を制御
            prevButton.style.display = currentIndex === 0 ? 'none' : 'block';
            nextButton.style.display = (currentIndex + currentCardsPerPage >= totalCards) ? 'none' : 'block';

            // 表示カード数が総カード数以上の場合は両方のボタンを非表示
            if (totalCards <= currentCardsPerPage) {
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
            }
        }

        // 前へボタンのイベントリスナー
        prevButton.addEventListener('click', () => {
            const currentCardsPerPage = getCardsPerPage();
            currentIndex = Math.max(0, currentIndex - currentCardsPerPage); // 最小は0
            updateCarousel();
        });

        // 次へボタンのイベントリスナー
        nextButton.addEventListener('click', () => {
            const currentCardsPerPage = getCardsPerPage();
            // 最大インデックスは総カード数から一度に表示するカード数を引いた値まで
            currentIndex = Math.min(totalCards - currentCardsPerPage, currentIndex + currentCardsPerPage);
            updateCarousel();
        });

        // タッチイベントの追加
        carouselTrack.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX; // タッチ開始時のX座標を記録
            // スムーズなアニメーションを一時的に無効化して、指の動きに追従させる
            carouselTrack.style.transition = 'none';
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const currentX = e.touches[0].clientX;
            const diffX = currentX - startX; // 移動距離

            // 指の動きに合わせてカルーセルを動かす
            carouselTrack.style.transform = `translateX(${currentTranslateX + diffX}px)`;
            
            // 縦方向のスクロールを妨げないように、横方向へのスワイプのみpreventDefault
            // ある程度の横移動が確認できた場合にのみpreventDefaultする
            if (Math.abs(diffX) > 10) { // 10px以上横に動いたら
                e.preventDefault();
            }
        });

        carouselTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            // アニメーションを再度有効化
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';

            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX; // スワイプの最終的な距離

            const swipeThreshold = 50; // スワイプと認識する閾値 (px)
            const cardWidth = productCards.length > 0 ? productCards[0].offsetWidth + 20 : 0;

            if (diffX > swipeThreshold) {
                // 右スワイプ (前へ)
                const currentCardsPerPage = getCardsPerPage();
                currentIndex = Math.max(0, currentIndex - currentCardsPerPage);
            } else if (diffX < -swipeThreshold) {
                // 左スワイプ (次へ)
                const currentCardsPerPage = getCardsPerPage();
                currentIndex = Math.min(totalCards - currentCardsPerPage, currentIndex + currentCardsPerPage);
            }
            // スワイプが閾値に満たない場合は、元の位置に戻すか、現在の位置を維持
            updateCarousel();
        });

        // ウィンドウのリサイズ時にカルーセルをリセット
        window.addEventListener('resize', () => {
            currentIndex = 0; // リサイズ時は最初の位置に戻す
            updateCarousel();
        });

        // 初回表示の更新
        updateCarousel();
    }

    // 商品詳細ページ専用: 商品画像スライドショー
    function startProductDetailSlideshow() {
        const productSlides = document.querySelectorAll('.product-slideshow-container .product-slide');
        const thumbnails = document.querySelectorAll('.thumbnail-images img'); // サムネイルはimgタグで取得

        // スライドやサムネイルが見つからない場合は処理を中断
        if (productSlides.length === 0 || thumbnails.length === 0) {
            return;
        }

        let currentProductSlideIndex = 0; // 現在表示中のスライドのインデックス
        let productSlideshowInterval; // 自動切り替えのインターバルID

        // 特定のスライドを表示する関数
        function displaySlide(index) {
            // 全てのスライドとサムネイルのactiveクラスを削除
            productSlides.forEach(slide => slide.classList.remove('active'));
            thumbnails.forEach(thumb => thumb.classList.remove('active'));

            // 指定されたインデックスが有効範囲内であることを確認
            const validIndex = Math.max(0, Math.min(index, productSlides.length - 1));
            
            // 有効なスライドとサムネイルにactiveクラスを追加
            if (productSlides[validIndex]) {
                productSlides[validIndex].classList.add('active');
            }
            if (thumbnails[validIndex]) {
                thumbnails[validIndex].classList.add('active');
            }
            currentProductSlideIndex = validIndex; // 現在のインデックスを更新
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
        thumbnails.forEach((thumbnail, index) => { // indexを直接取得
            thumbnail.addEventListener('click', () => {
                displaySlide(index); // クリックされたサムネイルのインデックスを直接渡す
                startAutoPlay(); // クリックしたら自動再生を再開
            });
            // data-index 属性がない場合はインデックスを追加（HTML修正不要にするため）
            thumbnail.setAttribute('data-index', index.toString());
            thumbnail.classList.add('thumbnail'); // クラスがついていない場合は追加
        });

        // 初回表示と自動再生開始
        displaySlide(0);
        startAutoPlay();
    }
    
    // script.js の既存のコードの末尾に追加
    
    // 商品一覧カルーセルのスワイプ・ボタン機能
    const productCarouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (productCarouselTrack) {
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationFrame;
        let currentIndex = 0; // 現在表示しているカードのインデックス

        // カードの幅を正確に計算する (マージンも含む)
        let cardWidth = 0;
        const firstCard = productCarouselTrack.querySelector('.product-card');
        if (firstCard) {
            const cardStyle = window.getComputedStyle(firstCard);
            const marginLeft = parseFloat(cardStyle.marginLeft);
            const marginRight = parseFloat(cardStyle.marginRight);
            cardWidth = firstCard.offsetWidth + marginLeft + marginRight;
            console.log('Calculated cardWidth:', cardWidth); // デバッグ用
        } else {
            console.warn('No .product-card found in .carousel-track. Carousel functionality may be limited.');
            return; // カードが見つからない場合は処理を終了
        }

        // 現在のtransform: translateX() の値を取得するヘルパー関数
        function getComputedTranslateX(element) {
            const style = window.getComputedStyle(element);
            const matrix = new DOMMatrixReadOnly(style.transform);
            return matrix.m41;
        }

        // transformを適用するヘルパー関数
        function setTransform(element, translateX) {
            const containerWidth = productCarouselTrack.parentElement.clientWidth; // .product-carouselの幅
            const trackWidth = productCarouselTrack.scrollWidth; // .carousel-trackのコンテンツ幅

            let newTranslateX = translateX;

            // 左端（0より右）に引っ張ろうとした場合、0に制限
            if (newTranslateX > 0) {
                newTranslateX = 0;
            }
            // 右端に到達した場合、それ以上右にスクロールさせない
            if (trackWidth > containerWidth) { // コンテンツがコンテナより大きい場合のみ制限
                const maxTranslate = -(trackWidth - containerWidth);
                if (newTranslateX < maxTranslate) {
                    newTranslateX = maxTranslate;
                }
            } else {
                // コンテンツがコンテナに収まっている場合は、位置を0に固定
                newTranslateX = 0;
            }
            element.style.transform = `translateX(${newTranslateX}px)`;
        }

        // --- マウスイベント (PC用) ---
        productCarouselTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = e.clientX;
            productCarouselTrack.style.cursor = 'grabbing';
            productCarouselTrack.style.transition = 'none'; // ドラッグ中はトランジションを無効化
            prevTranslate = getComputedTranslateX(productCarouselTrack);
            cancelAnimationFrame(animationFrame);
        });

        productCarouselTrack.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                productCarouselTrack.style.cursor = 'grab';
                // マウスが要素を離れた場合もスナップさせる
                snapToNearestCard();
            }
        });

        productCarouselTrack.addEventListener('mouseup', () => {
            isDragging = false;
            productCarouselTrack.style.cursor = 'grab';
            // ドラッグ終了時にスナップさせる
            snapToNearestCard();
        });

        productCarouselTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentX = e.clientX;
            const walk = currentX - startPos;
            currentTranslate = prevTranslate + walk;
            setTransform(productCarouselTrack, currentTranslate);
        });

        // --- タッチイベント (モバイル用) ---
        productCarouselTrack.addEventListener('touchstart', (e) => {
            isDragging = true;
            startPos = e.touches[0].clientX;
            productCarouselTrack.style.transition = 'none'; // ドラッグ中はトランジションを無効化
            prevTranslate = getComputedTranslateX(productCarouselTrack);
            cancelAnimationFrame(animationFrame);
        });

        productCarouselTrack.addEventListener('touchend', () => {
            isDragging = false;
            // スワイプ終了時にスナップさせる
            snapToNearestCard();
        });

        productCarouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentX = e.touches[0].clientX;
            const walk = currentX - startPos;
            currentTranslate = prevTranslate + walk;
            setTransform(productCarouselTrack, currentTranslate);
        });

        // スナップ機能 (最も近いカード位置に移動)
        function snapToNearestCard() {
            // トランジションを有効に戻す
            productCarouselTrack.style.transition = 'transform 0.5s ease-in-out';
            // 強制的にリフローを発生させ、トランジションが適用されるようにする
            void productCarouselTrack.offsetWidth;

            const currentOffset = getComputedTranslateX(productCarouselTrack);
            // 現在のオフセットから最も近いカードのインデックスを計算
            currentIndex = Math.round(Math.abs(currentOffset) / cardWidth);
            
            // 計算されたインデックスに基づいて最終的なtranslateXを適用
            setTransform(productCarouselTrack, -currentIndex * cardWidth);
        }

        // --- ナビゲーションボタン ---
        if (prevButton && nextButton) {
            // ボタンがHTMLに存在するか確認
            console.log('Carousel buttons found:', prevButton, nextButton); // デバッグ用

            nextButton.addEventListener('click', () => {
                // 最大インデックス（最後のカード群が完全に表示される位置）
                const containerWidth = productCarouselTrack.parentElement.clientWidth;
                // 表示されているカードの数
                const cardsInView = Math.floor(containerWidth / cardWidth);
                // 最後のグループの最初のカードのインデックス
                const maxIndex = Math.max(0, productCarouselTrack.children.length - cardsInView);
                
                currentIndex = Math.min(currentIndex + 1, maxIndex);
                
                // ボタンクリックもスナップ機能を利用してスムーズに移動
                productCarouselTrack.style.transition = 'transform 0.5s ease-in-out';
                setTransform(productCarouselTrack, -currentIndex * cardWidth);
            });

            prevButton.addEventListener('click', () => {
                currentIndex = Math.max(currentIndex - 1, 0);
                
                // ボタンクリックもスナップ機能を利用してスムーズに移動
                productCarouselTrack.style.transition = 'transform 0.5s ease-in-out';
                setTransform(productCarouselTrack, -currentIndex * cardWidth);
            });
        } else {
            console.warn('Carousel buttons not found. Check selectors: .carousel-button.prev, .carousel-button.next'); // デバッグ用
        }
    }
});

