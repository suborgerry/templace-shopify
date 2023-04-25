// class CartRemoveButton extends HTMLElement {
// 	constructor() {
// 	  super();
// 	  this.addEventListener('click', (event) => {
// 		event.preventDefault();
// 		this.closest('cart-notification').updateQuantity(this.dataset.index, 0);
// 	  });
// 	}
// }

// customElements.define('cart-remove-button', CartRemoveButton);

class CartNotification extends HTMLElement {
	constructor() {
		super();

		this.notification = document.getElementById('cart-notification');
		this.header = document.querySelector('sticky-header');
		// this.onBodyClick = this.handleBodyClick.bind(this);

		this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
		this.querySelectorAll('.cart-notification__close').forEach((closeButton) =>
			closeButton.addEventListener('click', this.close.bind(this))
		);
		document.querySelectorAll('.cs-site-overlay').forEach((closeOverlay) =>
			closeOverlay.addEventListener('click', this.close.bind(this))
		);
	}

	open() {
		this.notification.classList.add('active');
		document.body.classList.add('cart-notification-active');

		this.notification.addEventListener('transitionend', () => {
			this.notification.focus();
			trapFocus(this.notification);
		}, {once: true});

		document.body.addEventListener('click', this.onBodyClick);
	}

	close() {
		this.notification.classList.remove('active');
		document.body.classList.remove('cart-notification-active');

		document.body.removeEventListener('click', this.onBodyClick);

		removeTrapFocus(this.activeElement);
	}

	renderContents(parsedState) {
		this.productId = parsedState.id;
		this.getSectionsToRender().forEach((section => {
			document.getElementById(section.id).innerHTML =
				this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
		}));
		this.open();
	}


	getSectionsToRender() {
		return [
			{
				id: 'cart-notification-product',
			},
			{
				id: 'cart-notification-button'
			},
			{
				id: 'cart-icon-bubble'
			}
		];
	}

	getSectionInnerHTML(html, selector = '.shopify-section') {
		return new DOMParser()
			.parseFromString(html, 'text/html')
			.querySelector(selector).innerHTML;
	}

	// handleBodyClick(evt) {
	// 	const target = evt.target;
	// 	if (target !== this.notification && !target.closest('cart-notification')) {
	// 		this.close();
	// 	}
	// }

	setActiveElement(element) {
		this.activeElement = element;
	}

	updateQuantity(line, quantity, name) {
		this.enableLoading(line);

		const body = JSON.stringify({
			line,
			quantity,
			sections: this.getSectionsToRender().map((section) => section.section),
			sections_url: window.location.pathname
		});

		fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{body}})
			.then((response) => {
				return response.text();
			})
			.then((state) => {
				const parsedState = JSON.parse(state);
				this.classList.toggle('is-empty', parsedState.item_count === 0);

				this.getSectionsToRender().forEach((section => {
					const elementToReplace =
						document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

					elementToReplace.innerHTML =
						this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
				}));

				this.updateLiveRegions(line, parsedState.item_count);
				document.getElementById(`cart-notification-product-${line}`)?.querySelector(`[name="${name}"]`)?.focus();
				this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
			}).catch(() => {
			this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
			document.getElementById('cart-errors').textContent = window.cartStrings.error;
			// this.disableLoading();
		});
	}

	enableLoading(line) {
		this.querySelectorAll('.loading-overlay')[line - 1].classList.remove('hidden');
		document.activeElement.blur();
	}


}

let cartLink = document.querySelector('.header__cart');

function notificationOpen(e) {
	document.body.classList.add('cart-notification-active');
	e.preventDefault();
}

if (cartLink) {
	cartLink.addEventListener('click', notificationOpen);
}


customElements.define('cart-notification', CartNotification);


/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

const moneyFormat = '${{amount}}';

/**
 * Format money values based on your shop currency settings
 * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
 * or 3.00 dollars
 * @param  {String} format - shop money_format setting
 * @return {String} value - formatted value
 */
function formatMoney(cents, format) {
	if (typeof cents === 'string') {
		cents = cents.replace('.', '');
	}
	let value = '';
	const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
	const formatString = theme.moneyFormat || moneyFormat;

	function formatWithDelimiters(
		number,
		precision = 2,
		thousands = ',',
		decimal = '.'
	) {
		if (isNaN(number) || number == null) {
			return 0;
		}

		number = (number / 100.0).toFixed(precision);

		const parts = number.split('.');
		const dollarsAmount = parts[0].replace(
			/(\d)(?=(\d\d\d)+(?!\d))/g,
			`$1${thousands}`
		);
		const centsAmount = parts[1] ? decimal + parts[1] : '';

		return dollarsAmount + centsAmount;
	}

	switch (formatString.match(placeholderRegex)[1]) {
		case 'amount':
			value = formatWithDelimiters(cents, 2);
			break;
		case 'amount_no_decimals':
			value = formatWithDelimiters(cents, 0);
			break;
		case 'amount_with_comma_separator':
			value = formatWithDelimiters(cents, 2, '.', ',');
			break;
		case 'amount_no_decimals_with_comma_separator':
			value = formatWithDelimiters(cents, 0, '.', ',');
			break;
	}

	return formatString.replace(placeholderRegex, value);
}

/**
 * Adds a Shopify size attribute to a URL
 *
 * @param src
 * @param size
 * @returns {*}
 */

function getSizedImageUrl(src, size) {
	if (size === null) {
		return src;
	}

	if (size === 'master') {
		return removeProtocol(src);
	}

	var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

	if (match) {
		var prefix = src.split(match[0]);
		var suffix = match[0];
		return removeProtocol(prefix[0] + '_' + size + suffix);
	} else {
		return null;
	}
}

function removeProtocol(path) {
	return path.replace(/http(s)?:/, '');
}


let updateCartCount = function (count) {
	if (count) {
		$(".cart-count-bubble span").text(count);
		

		let cartCountSidebarWrapper = $(".cart-notification__count");
		let cartCountValue = $(".cart-notification__count .cart-notification__count-value");
		
		if (cartCountValue.length > 0) {
			cartCountValue.text(count);
		}
		else {
			cartCountSidebarWrapper.append(`
				<span class="cart-notification__count-value">${ count }</span>
				<span class="cart-notification__count-label"></span>
			`)
		}
	} else {
		$(".cart-count-bubble").remove();
		$(".cart-notification-active .cart-notification__count").html("");
	}
}

let updateCartSubtotal = function (data, subtotal) {	
	let subtotalWrapper = $(".cart-notification__subtotal");
	let subtotalTotal = $(".cart-notification__subtotal .totals");
	let subtotalValue = $(".cart-notification__subtotal .totals__subtotal-value");
	let cartBottom = $(".cart-notification__bottom");
	let discountsWraper = $(".discounts__wrapper");

	if (subtotal) {
		subtotalWrapper.addClass('active');
		if (cartBottom) {
			cartBottom.addClass('active');
		}
		if (subtotalValue.length > 0) {
			subtotalValue.html(
				`${formatMoney(subtotal, Shopify.money_format)}`
			)
		} else {
			subtotalTotal.append(`<p class="totals__subtotal-value">${formatMoney(subtotal, Shopify.money_format)}</p>`)
		}

	} else {
		subtotalWrapper.removeClass('active');
		subtotalValue.remove();
		if (cartBottom) {
			cartBottom.removeClass('active');
		}
		if (discountsWraper) {
			discountsWraper.remove();
		}
	}

	if (data.cart_level_discount_applications) {
		let discountsOrder = ``;
		data.cart_level_discount_applications.forEach(element => {
			discountsOrder += `<li class="discounts__discount discounts__discount--end">
				<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-discount color-foreground-{{ settings.accent_icons }}" viewBox="0 0 12 12">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M7 0h3a2 2 0 012 2v3a1 1 0 01-.3.7l-6 6a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4l6-6A1 1 0 017 0zm2 2a1 1 0 102 0 1 1 0 00-2 0z" fill="currentColor">
				</svg>
				${element.title}
				(-${formatMoney(element.total_allocated_amount, Shopify.money_format)})
			</li>`;
		});

		if (discountsWraper.length == 0) {
			subtotalTotal.after(`
			<div class="discounts__wrapper">
				<ul class="discounts list-unstyled" role="list">
				${discountsOrder}
				</ul>
			</div>
			`);
		}
		else {
			let discountsList = $(".discounts__wrapper > ul.discounts");
			discountsList.empty();
			discountsList.append(`${discountsOrder}`);
		}
	}
}

let updateCartNotifications = function (data) {
	if (data.item_count > 0) {
		$(".cart-notification-product").html("");
		for (let i = 0; i < data.item_count; i++) {
			if (data.items[i]) {
				let optons = ``;
				if (!data.items[i].product_has_only_default_variant) {
					data.items[i].options_with_values.forEach(element => {
						optons += `<div class="cart-notification-product__option">
							<dt>${element.name}:</dt>
							<dd>${element.value}</dd>
						</div>`;
					});
				}

				let selling_plan = '';
				if (data.items[i].selling_plan_allocation) {
					selling_plan = data.items[i].selling_plan_allocation.selling_plan.name;
				}

				let discounts = ``;
				if (data.items[i].discounts) {
					data.items[i].discounts.forEach(element => {
						if (element.original_price != element.final_price) {
							discounts += `<li class="discounts__discount">
								<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-discount color-foreground-{{ settings.accent_icons }}" viewBox="0 0 12 12">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M7 0h3a2 2 0 012 2v3a1 1 0 01-.3.7l-6 6a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4l6-6A1 1 0 017 0zm2 2a1 1 0 102 0 1 1 0 00-2 0z" fill="currentColor">
								</svg>
								${element.title}
							</li>`
						}
					});
				}

				let price = ``
				if (data.items[i].original_price != data.items[i].final_price) {
					price = `<dl class="cart-item__discounted-prices">
						<dd class="price">
							${formatMoney(data.items[i].final_price, Shopify.money_format)}
						</dd>
						<dd>
							<s class="cart-item__old-price price">
							${formatMoney(data.items[i].original_price, Shopify.money_format)}
							</s>
						</dd>
					</dl>`
				}
				else {
					price = `<span class="price">
						${formatMoney(data.items[i].final_price, Shopify.money_format)}
					</span>`
				}

				let line_price = ``;
				if (data.items[i].original_line_price != data.items[i].final_line_price) {
					line_price = `<dl class="cart-item__discounted-prices-total">
						<dd class="price">
							${formatMoney(data.items[i].final_line_price, Shopify.money_format)}
						</dd>
						<dd>
							<s class="cart-item__old-price price">
							${formatMoney(data.items[i].original_line_price, Shopify.money_format)}
							</s>
						</dd>
					</dl>`
				}
				else {
					line_price = `<span class="price">
						${formatMoney(data.items[i].original_line_price, Shopify.money_format)}
					</span>`
				}

				const imgSrc = data.items[i].featured_image ? data.items[i].featured_image.url : data.items[i].image;
				const imgAlt = data.items[i].featured_image ? data.items[i].featured_image.alt : '';
				const imgUrl = imgSrc && getSizedImageUrl(imgSrc, '140x');

				let htmlItems = `
				<div id="cart-notification-product-${i + 1}" class="cart-notification-product__inner">
					<div class="cart-notification-product__inner-top"> `;
				if (imgUrl != null)	 {
					htmlItems += `
					<div class="cart-notification-product__wrapper-image">
						<img class="cart-notification-product__image" src="${imgUrl}" alt="${imgAlt}" width="70" height="auto" loading="lazy">
					</div>`;
				}
				htmlItems += `
						<div class="cart-notification-product__info">
							<div class="cart-notification-product__name">${data.items[i].product_title}</div>
							<dl class="cart-notification-product__options">
								${optons}
							</dl>
							<p class="product-option">${selling_plan}</p>
							<ul class="discounts list-unstyled" role="list">
								${discounts}
							</ul>
						</div>
						<div class="cart-notification-product__price">
							${price}
						</div>	
					</div>
					<div class="cart-notification-product__inner-bottom">
						<div class="cart-notification-product__quantity">
							<quantity-input class="quantity">
								<button class="quantity__button no-js-hidden" name="minus" type="button">
									<span class="visually-hidden">Decrease quantity for Jewelry five</span>
										<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-minus" fill="none" viewBox="0 0 13 3">
										<path d="M12.1193 0.990918L5.99341 0.993329L0.547412 0.990918V1.67559L5.99341 1.67318L12.1193 1.67559V0.990918Z" fill="currentColor" stroke="currentColor"></path>
										</svg>
		
								</button>
								<input class="quantity__input" type="number" name="updates[]" value="${data.items[i].quantity}" min="0" aria-label="Quantity for Jewelry five" id="Quantity-${i + 1}" data-index="${i + 1}">
								<button class="quantity__button no-js-hidden" name="plus" type="button">
									<span class="visually-hidden">Increase quantity for Jewelry five</span>
									<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-plus" fill="none" viewBox="0 0 13 13">
									<path d="M6.67326 5.99333L12.1193 5.99092V6.67559L6.67326 6.67318L6.67567 12.1192L5.991 12.1192L5.99341 6.67318L0.547412 6.67559V5.99092L5.99341 5.99333L5.991 0.547327L6.67567 0.547327L6.67326 5.99333Z" fill="currentColor" stroke="currentColor"></path>
									</svg>
								</button>
							</quantity-input>
						</div>
						<div class="cart-notification-product__footer">
							<div class="cart-notification-product__remove">
								<cart-remove-button id="Remove-${i + 1}" data-index="${i + 1}">
									<a href="/cart/change?id=${data.items[i].key}&amp;quantity=0" aria-label="Remove ${data.items[i].title}">
										<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 11 11">
											<path d="M9.00568 0.823302L5.33333 4.4989L1.66099 0.823302L1.48421 0.646368L1.30736 0.823223L0.823223 1.30736L0.646368 1.48421L0.823302 1.66099L4.4989 5.33333L0.823302 9.00568L0.646368 9.18246L0.823223 9.35931L1.30736 9.84344L1.48421 10.0203L1.66099 9.84337L5.33333 6.16777L9.00568 9.84337L9.18246 10.0203L9.35931 9.84344L9.84344 9.35931L10.0203 9.18246L9.84337 9.00568L6.16777 5.33333L9.84337 1.66099L10.0203 1.48421L9.84344 1.30736L9.35931 0.823223L9.18246 0.646368L9.00568 0.823302Z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
										</svg>
				
										Remove
									</a>
								</cart-remove-button>
							</div>
							<div class="cart-notification__total-price">
								<div class="loading-overlay hidden">
									<div class="loading-overlay__spinner">
										<svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
											<circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
										</svg>
									</div>
								</div>
								<div class="cart-item__price-wrapper medium-up">
									${line_price}
								</div>
							</div>
						</div>
					</div>
				</div>`; 
				$(".cart-notification-product").append(htmlItems);
			}
		}

	} else {
		$(".cart-notification-product").html(`
			<div class="cart-notification-empty">
				<svg width="35" height="35" viewBox="0 0 35 35" fill="none" class="icon icon-account-order-none" xmlns="http://www.w3.org/2000/svg">
					<path d="M23.1857 4.73365H17.6791C17.415 3.39955 16.6962 2.1984 15.6454 1.33514C14.5945 0.471885 13.2766 0 11.9167 0C10.5567 0 9.23884 0.471885 8.18797 1.33514C7.1371 2.1984 6.41832 3.39955 6.15427 4.73365H0.647597C0.475846 4.73366 0.311132 4.80189 0.189686 4.92333C0.06824 5.04478 8.60879e-06 5.20949 2.19023e-08 5.38124V27.9197C-2.20997e-05 28.0047 0.0167133 28.089 0.0492502 28.1675C0.0817872 28.2461 0.129488 28.3175 0.189627 28.3777C0.249767 28.4378 0.321166 28.4855 0.399746 28.518C0.478326 28.5506 0.562547 28.5673 0.647597 28.5673H23.1857C23.2708 28.5673 23.355 28.5506 23.4336 28.518C23.5122 28.4855 23.5836 28.4378 23.6437 28.3777C23.7038 28.3175 23.7515 28.2461 23.7841 28.1675C23.8166 28.089 23.8334 28.0047 23.8333 27.9197V5.38124C23.8333 5.20949 23.7651 5.04478 23.6436 4.92333C23.5222 4.80189 23.3575 4.73366 23.1857 4.73365ZM11.9167 1.29519C12.9316 1.297 13.9173 1.63558 14.7191 2.25785C15.521 2.88013 16.0936 3.7509 16.3473 4.73365H7.48602C7.73972 3.7509 8.31237 2.88013 9.1142 2.25785C9.91603 1.63558 10.9017 1.297 11.9167 1.29519ZM22.5381 27.2721H1.29519V6.02884H6.04087V8.70176C6.04087 8.87351 6.10909 9.03823 6.23054 9.15968C6.35199 9.28113 6.51671 9.34935 6.68846 9.34935C6.86022 9.34935 7.02493 9.28113 7.14638 9.15968C7.26783 9.03823 7.33606 8.87351 7.33606 8.70176V6.02884H16.4973V8.70176C16.4973 8.87351 16.5655 9.03823 16.6869 9.15968C16.8084 9.28113 16.9731 9.34935 17.1449 9.34935C17.3166 9.34935 17.4813 9.28113 17.6028 9.15968C17.7242 9.03823 17.7925 8.87351 17.7925 8.70176V6.02884H22.5381V27.2721Z" fill="currentColor"/>
					<circle cx="23.834" cy="23.8333" r="10.35" fill="white" stroke="currentColor" stroke-width="1.3"/>
					<path d="M26.029 21.5273L24.0181 23.54L22.0072 21.5273L21.9011 21.4211L21.795 21.5272L21.5287 21.7935L21.4226 21.8996L21.5287 22.0057L23.5415 24.0166L21.5287 26.0276L21.4226 26.1336L21.5287 26.2398L21.795 26.506L21.9011 26.6121L22.0072 26.506L24.0181 24.4933L26.029 26.506L26.1351 26.6121L26.2412 26.506L26.5075 26.2398L26.6136 26.1336L26.5075 26.0276L24.4947 24.0166L26.5075 22.0057L26.6136 21.8996L26.5075 21.7935L26.2412 21.5272L26.1351 21.4211L26.029 21.5273Z" fill="currentColor" stroke="currentColor" stroke-width="0.3"/>
				</svg>
				<p class="cart-notification-empty__text">${window.cartStrings.empty}</p>
				<a href = "${window.cartStrings.collections_url}" class = "button button--secondary button--arrow">
					<span>${window.cartStrings.shop_now}</span> 
					<svg viewBox="0 0 22 16" fill="none" aria-hidden="true" focusable="false" role="presentation" class="icon icon-button-arrow" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M16.7244 7.5C13.8017 6.1141 11.7355 3.30033 11.5001 0H12.374C12.7077 4.23944 16.3735 7.57895 20.8465 7.57895C21.0664 7.57895 21.2844 7.57087 21.5001 7.55502V8.44498C21.2844 8.42913 21.0664 8.42105 20.8465 8.42105C16.3735 8.42105 12.7077 11.7606 12.374 16H11.5001C11.7355 12.6997 13.8017 9.8859 16.7244 8.5H0.499878V7.5H16.7244Z" fill="currentColor"/>
					</svg>
				</a>
			</div>	
		`);
	}

}
$(document).on('click', ".cart-notification-product__remove a", function (e) {
	e.preventDefault();


	let line = $(this).parent().attr("data-index");
	let quantity = $(this).parents(".cart-notification-product__info").find(".quantity__input").val();
	let query = {
		'line': line,
		'quantity': 0
	};


	$.ajax({
		url: window.Shopify.routes.root + 'cart/change.js',
		type: "POST",
		data: query,
		dataType: 'json',
		success: function (data) {
			updateCartSubtotal(data, data.total_price);
			updateCartCount(data.item_count);
			updateCartNotifications(data);
		}
	});
});

$(document).on('change', ".quantity__input", function (e) {
	e.preventDefault();


	let line = $(this).attr("data-index");
	let quantity = $(this).val();
	let query = {
		'line': line,
		'quantity': quantity
	};


	$.ajax({
		url: window.Shopify.routes.root + 'cart/change.js',
		type: "POST",
		data: query,
		dataType: 'json',
		success: function (data) {
			updateCartSubtotal(data, data.total_price);
			updateCartCount(data.item_count);
			updateCartNotifications(data);
		}
	});
});


$(document).on('product-form-responsed', function (event, response) {

	$.ajax({
		url: window.Shopify.routes.root + 'cart.js',
		type: "POST",
		dataType: 'json',
		success: function (data) {
			updateCartCount(data.item_count);
			updateCartSubtotal(data, data.total_price);
		}
	});

});