function Units() {
	this.current_temp_unit = $('input[name="temp"]:checked').val();
	this.current_press_unit = $('input[name="press"]:checked').val() + '-' + $('input[name="pressType"]:checked').val();
	$('.unit').change(this.real_time_convert.bind(this));
	this.conversions = {
		'C': {
			'F': C_to_F
		},
		'F': {
			'C': F_to_C
		},
		'kPa-gauge': {
			'kPa-absolute': kpag_to_kpaa,
			'psi-absolute': kpag_to_psia,
			'psi-gauge': kpa_to_psi
		},
		'kPa-absolute': {
			'kPa-gauge': kpaa_to_kpag,
			'psi-absolute': kpa_to_psi,
			'psi-gauge': kpaa_to_psig
		},
		'psi-gauge': {
			'kPa-absolute': psig_to_kpaa,
			'psi-absolute': psig_to_psia,
			'kPa-gauge': psi_to_kpa
		},
		'psi-absolute': {
			'kPa-absolute': psi_to_kpa,
			'kPa-gauge': psia_to_kpag,
			'psi-gauge': psia_to_psig
		}
	};
}

function C_to_F(C) {
	return C*9/5+32;
}

function F_to_C(F) {
	return (F-32)*5/9;
}

function kpa_to_psi(kpa) {
	return kpa*0.145037738;
};

function psi_to_kpa(psi) {
	return psi/0.145037738;
};

function kpaa_to_kpag(kpaa) {
	return kpaa-101.325;
};

function kpag_to_kpaa(kpag) {
	return kpag+101.325;
};

function psia_to_psig(psia) {
	return psia-kpa_to_psi(101.325);
};

function psig_to_psia(psig) {
	return psig+kpa_to_psi(101.325);
};

function kpaa_to_psig(kpaa) {
	return kpa_to_psi(kpaa_to_kpag(kpaa));
};

function psig_to_kpaa(psig) {
	return psi_to_kpa(psig_to_psia(psig));
};

function kpag_to_psia(kpag) {
	return kpa_to_psi(kpag_to_kpaa(kpag));
};

function psia_to_kpag(psia) {
	return psi_to_kpa(psia_to_psig(psia));
};

Units.prototype.convert = function(unit1, unit2, number) {
	if (unit1 === unit2) {
		return number;
	} else {
		return this.conversions[unit1][unit2](number);
	}
}

Units.prototype.real_time_convert = function() {
	var new_temp_unit = $('input[name="temp"]:checked').val();
	var new_press_unit = $('input[name="press"]:checked').val() + '-' + $('input[name="pressType"]:checked').val();
	var temp_array = $('.temp_field');
	var press_array = $('.press_field');
	if (this.current_temp_unit !== new_temp_unit) {
		for (var i=0; i<temp_array.length; i++) {
			var temp_number = $(temp_array[i]).val();
			if (!isNaN(parseFloat(temp_number)) && String(parseFloat(temp_number)) === temp_number) {
				$(temp_array[i]).val(this.convert(this.current_temp_unit, new_temp_unit, parseFloat(temp_number)));
			}
		}
	}
	if (this.current_press_unit !== new_press_unit) {
		for (var j=0; j<press_array.length; j++) {
			var press_number = $(press_array[j]).val();
			if (!isNaN(parseFloat(press_number)) && String(parseFloat(press_number)) === press_number) {
				$(press_array[j]).val(this.convert(this.current_press_unit, new_press_unit, parseFloat(press_number)));
			}
		}
	}
	this.current_temp_unit = new_temp_unit;
	this.current_press_unit = new_press_unit;
}

Units.prototype.convert_input = function(input) {
	var temp_array = $('.temp_field');
	var press_array = $('.press_field');
	if (this.current_temp_unit !== 'F') {
	for (var i=0; i<temp_array.length; i++) {
			var temp_number = $(temp_array[i]).val();
			if (!isNaN(parseFloat(temp_number)) && String(parseFloat(temp_number)) === temp_number) {
				input[$(temp_array[i]).attr('name')] = this.convert(this.current_temp_unit, 'F', parseFloat(temp_number));
			}
		}
	}
	if (this.current_press_unit !== 'psi-gauge') {
		for (var j=0; j<press_array.length; j++) {
			var press_number = $(press_array[j]).val();
			if (!isNaN(parseFloat(press_number)) && String(parseFloat(press_number)) === press_number) {
				input[$(press_array[j]).attr('name')] = this.convert(this.current_press_unit, 'psi-gauge', parseFloat(press_number));
			}
		}
	}
	return input;
}