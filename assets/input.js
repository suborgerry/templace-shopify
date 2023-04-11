$(window).on('load', function () {
	let inputs = $('input[required]');
	let selects = $('.js-select');

	if (inputs) {
		inputs.each(function() {
			if ($(this).val() !== '') {
				$(this).siblings('label').css('opacity', '0');
			}
		});

		inputs.on('change', function() {
			if ($(this).val().length > 0) {
				$(this).siblings('label').css('opacity', '0');
			} else {
				$(this).siblings('label').css('opacity', '1');
			}
		})
	}

	if (selects) {
		selects.each(function() {
			const defOption = $('<option value="Country" data-provinces="[]" selected disabled>Country <span style="color: #b93131">*</span></option>');

			$(this).find('option:first-child').remove();
			$(this).find('select').prepend(defOption);
		});
	}
});