(function () {
	$('.modal-iframe').fancybox({
		wrapCSS: 'modal-iframe-wrapper',
		autoSize: false,
		closeClick: false,
		openEffect: 'none',
		closeEffect: 'none',
		type: 'iframe',
		iframe: {
			preload: true,
		},
		tpl: {
			closeBtn:
				'<a href="#" class="modal-close-button modal-iframe-close-button" onclick="$.fancybox.close()"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 14 14">\n' +
				'<rect y="12.728" width="18" height="1.5" transform="rotate(-45 0 12.728)" fill="currentColor"/>\n' +
				'<rect x="1.06055" width="18" height="1.5" transform="rotate(45 1.06055 0)" fill="currentColor"/>\n' +
				'</svg></a>',
		},
	});
})();
