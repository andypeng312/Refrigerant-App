function validate_continue() {
//validate the refrigerant and superheat/subcool fields before allowing user to click continue
	$('.error').remove();
	if ($('input[name="refrigerant"]:checked').length === 0) {
		$('label[for="refrigerant"]:last').after('<p class="error">Please select a refrigerant</p>');
	}
	if ($('input[name="method"]:checked').length === 0) {
		$('label[for="method"]:last').after('<p class="error">Please select a calculation method</p>');
	}
	if ($('.error').length>0) {
		return false;
	}
	if ($('input[name="refrigerant"]:checked').length === 1 && $('input[name="method"]:checked').length === 1) {
		return true;
	} else {
		$('#continue').prepend('<p class="error">Please check your inputs and try again</p>');
		return false;
	}
}

function continue_func() {
	if (validate_continue()) {
		var method = $('input[name="method"]:checked').val();
		$('.appscreen').hide();
		$('#calc-screen, #'+method).show();
		mf();
	}
}

function mf() {
	if ($('#mf').prop('checked')) {
		$('#yes-mf').show();
		$('#no-mf').hide();
	} else {
		$('#yes-mf').hide();
		$('#no-mf').show();
	}
}

function makeInput() {
	var formArray = $('form').serializeArray();
	var inputArray = {};
	for (var i=0; i<formArray.length; i++) {
		inputArray[formArray[i]['name']] = formArray[i]['value'];
	}
	return inputArray;
}

function validate_number_fields() {
	$('.error').remove();
	var entries = $('input[type="text"]').filter(':visible');
	for (var i=0; i<entries.length; i++) {
		if (String(parseFloat($(entries[i]).val())) !== $(entries[i]).val()) {
			$('#end_buttons').before('<p class="error">Please enter a number in each field</p>');
			return false;
		}
	}
	return true;
}

function calculate(unit_obj) {
	$('#answer').html('');
	if (validate_number_fields()) {
		try {
			var input_array = unit_obj.convert_input(makeInput());
			var output = charge_status(input_array);
			$('#answer').show();
			if (output.status > 0) {
				$('#answer').html('Add Refrigerant');
			} else if (output.status < 0) {
				$('#answer').html('Remove Refrigerant');
			} else if (output.status === 0) {
				$('#answer').html('Perfect amount of refrigerant!');
			}
			if (!isNaN(output.SH)) {
				var tSH = unit_obj.convert('F', unit_obj.current_temp_unit, output.tSH);
				var SH = unit_obj.convert('F', unit_obj.current_temp_unit, output.SH);
				$('#answer').prepend('Target Superheat: '+tSH+'&deg;'+unit_obj.current_temp_unit+'<br>');
				$('#answer').prepend('Superheat: '+SH+'&deg;'+unit_obj.current_temp_unit+'<br>');
			} else if (!isNaN(output.SC)) {
				var tSC = unit_obj.convert('F', unit_obj.current_temp_unit, output.tSC);
				var SC = unit_obj.convert('F', unit_obj.current_temp_unit, output.SC);
				$('#answer').prepend('Target Subcooling: '+tSC+'&deg;'+unit_obj.current_temp_unit+'<br>');
				$('#answer').prepend('Subcooling: '+SC+'&deg;'+unit_obj.current_temp_unit+'<br>');
			}
		} catch (err) {
			$('#end_buttons').before('<p class="error">Please pick a different set of numbers. Your current numbers may be out of range for our calculations.</p>')
		}
	}
}

function back() {
	$('#answer').html('');
	$('#answer').hide();
	reset();
}

function reset() {
	$('.appscreen').hide();
	$('.start').show();
}

function run() {
	reset();
	$('input[type="text"]').val('');
	$('input[type="radio"]').prop('checked', false);
	$('[value="F"], [value="psi"], [value="gauge"]').prop('checked', true);
	$('input[type="checkbox"]').prop('checked', false);
	var unit_obj = new Units();
	$('#continue').click(continue_func);
	$('#mf').change(mf);
	$('#calculate').click(function() {
		calculate(unit_obj);
	});
	$('#back').click(back);
}

$(document).ready(run);