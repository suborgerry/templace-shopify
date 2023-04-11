(function () {
  let articleOptions = () => {
    let articleElement = document.querySelector('.article-template');
    let headerArticle = document.querySelector('.article-template__header');
    let headerWrapper = document.querySelector('.header-wrapper');
    let headerLogo = document.querySelector('.header > .container  .header__heading-logo:not(.header__heading-logo--overlay)'); 
    let headerLogoOverlay = document.querySelector('.header__heading-logo--overlay');

    if (headerLogoOverlay) {
      if (headerLogo) {
        headerLogo.classList.add('hide');
      }
      headerLogoOverlay.classList.add('show');
    }
    else {
      if (headerLogo) {
        headerLogo.classList.remove('hide');
      }
    }
    
    console.log(articleElement);
    if (articleElement.classList.contains('article-template--overlay')) {
      if (headerWrapper) {
        headerWrapper.classList.add('header-wrapper--overlay');
        let heightHeader = document.querySelector('.header').getBoundingClientRect().height;
        articleElement.style.marginTop = -heightHeader-50+'px';
        headerArticle.style.paddingTop = articleElement.style.paddingTop + heightHeader-144+'px';
      }
    }
    else {
      if (headerWrapper) {
        headerWrapper.classList.remove('header-wrapper--overlay');
        articleElement.style.marginTop = '0';
        headerArticle.style.paddingTop = '0';
      }
    }

    let heroMedia = document.querySelector('.article-template__hero > .media');

    if (heroMedia) {
      if (heroMedia.classList.contains('article-template__hero-large')) {
        headerArticle.classList.add('article-template__header-large')
      }
      else {
        headerArticle.classList.remove('article-template__header-large')
      }
    }
  }

  document.addEventListener('shopify:section:load', function() {
    articleOptions();
  });

  window.addEventListener('resize', function() {
    articleOptions();
  });

  articleOptions();
})()