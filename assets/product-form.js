if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      if (document.querySelector('cart-notification')) {
        this.cartNotification = document.querySelector('cart-notification');
      }
      //this.Cart = document.querySelector('cart-items');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      const submitButton = this.querySelector('[type="submit"]');
      if (submitButton.classList.contains('loading')) return;

      this.handleErrorMessage();
      if (this.cartNotification) {
        this.cartNotification.setActiveElement(document.activeElement);
      }

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cartNotification) {
        formData.append('sections', this.cartNotification.getSectionsToRender().map((section) => section.id));
      }
      formData.append('sections_url', window.location.pathname);
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {

          $(document).trigger('product-form-responsed', [response]);

          if (response.status) {
            this.handleErrorMessage(response.description);
            return;
          }
          else if (!this.cartNotification) {
            window.location = window.routes.cart_url;
            return;
          }

          if (this.cartNotification) {
            this.cartNotification.renderContents(response);
          }
          $.fancybox.close();
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('aria-disabled');
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}
