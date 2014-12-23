var oots_types = {tours: 'Туры', tickets: 'Билеты'};
var oots_filters = {d: 'дате вылета/выезда', p: 'цене'};
/*var oots_currencies = {
 'USD' : {nom: 'доллар', gen: 'доллара', plu: 'долларов'},
 'UAH' : {nom: 'гривна', gen: 'гривна', plu: 'гривен'},
 'EUR' : {nom: 'евро', gen: 'евро', plu: 'евро'},
 };*/
var ootd_attemptCount = 0;
var ootd_navi = null; // navi container
var ootd_t = 'tours'; // type
var ootd_d = 0; // departure city
var ootd_c = 0; // country dest
var ootd_r = 0; // resort dest
var ootd_p = 0; // page
var ootd_currency = 'UAH'; // currency
var ootd_currency_default = 'UAH'; // currency
var ootd_f = 'd'; // filter d-departure time, p-price
var ootd_pp = 8; // offers per page
//var ootd_pp = 10; // offers per page
var ootd_o = 0; // offer id
var ootd_partner_id = 0;
var ootd_tour_id = 0;

var css = document.createElement('link');
css.rel = "stylesheet";
css.type = "text/css";
css.href = "css/widget2.css";
css.media = "all";
document.getElementsByTagName('head')[0].appendChild(css);

function loadScript(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	script.onreadystatechange = callback;
	script.onload = callback;

	head.appendChild(script);
}

/*function ootd_units(num, cases) {
 num = Math.abs(num);
 var word = '';
 if (num.toString().indexOf('.') > -1) {
 word = cases.gen;
 } else {
 word = (
 num % 10 == 1 && num % 100 != 11
 ? cases.nom
 : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
 ? cases.gen
 : cases.plu
 );
 }
 return word;
 }
 */
function ootd_sp(type, key) {
	switch (type) {
		case 't':
			ootd_t = key;
			ootd_d = 0;
			ootd_c = 0;
			ootd_r = 0;
			ootd_render_types();
			ootd_render_navi();
			break;
		case 'd':
			ootd_d = key;
			ootd_c = 0;
			break;
		case 'c':
			ootd_c = key;
			ootd_r = 0;
			break;
		case 'currency':
			ootd_currency = key;
			break;
		case 'r':
			ootd_r = key;
			break;
	}

	if (type != 'currency') {
		ootd_p = 1;
	}
	ootd_build_navi();
	ootd_render_content();
}

function ootd_sf(key) {
	ootd_f = key;
	ootd_build_navi();
	ootd_render_content();
}

function ootd_page(p) {
	ootd_p = p;
	ootd_render_content();
}

function ootd_render_navi() {
	if (ootd_tour_id != 0) {
		$("#offer_of_the_day_navi").css('display', 'none');
		return;
	}
	var success = function (data) {
		if (typeof ootd_navi === null || typeof ootd_navi === 'undefined') {
			$("#offer_of_the_day_navi").text("No data recived from server. Please reload page.")
			return;
		} else {
			ootd_navi = data;
			ootd_build_navi();
		}
	};

	$.ajax({
		url: '//besthotels.org.ua/api/get_navi/?t=' + ootd_t,
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: true,
		success: success,
		error: function (jqXHR, textStatus, errorThrown) {
			$("#offer_of_the_day_navi").text("Some errors on server. Please reload page.")
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err);
		}
	});
}

function ootd_build_navi() {
	if (ootd_tour_id != 0) {
		return false;
	}
	$("#offer_of_the_day_navi").remove();
/*
	var html = '';
	var currency_html = '';
	$.each(ootd_navi, function (key, value) {
		switch (key) {
			case 'd':
				html += '<div class="ootd_menu_block"><div class="ootd_menu_title">' + value['name'] + ':</div><div class="styled-select"><select onchange="javascript:ootd_sp(\'' + key + '\', this.value)">';
				$.each(value['values'], function (key2, value2) {
					if (ootd_d == key2) {
						html += '<option value="' + key2 + '" selected>' + value2 + '</option>';
					} else {
						html += '<option value="' + key2 + '">' + value2 + '</option>';
					}
				});
				html += '</select></div></div>';

				break;
			case 'c':
				html += '<div class="ootd_menu_block"><div class="ootd_menu_title">' + value['name'] + ':</div><div class="styled-select"><select onchange="javascript:ootd_sp(\'' + key + '\', this.value)">';
				$.each(value['values'], function (key2, value2) {
					if (key2 == 0 || ootd_d == 0 || (typeof ootd_navi['d']['links'][ootd_d] != 'undefined' && ootd_navi['d']['links'][ootd_d].indexOf(key2) != -1)) {
						if (ootd_c == key2) {
							html += '<option value="' + key2 + '" selected>' + value2 + '</option>';
						} else {
							html += '<option value="' + key2 + '">' + value2 + '</option>';
						}
					}
				});
				html += '</select></div></div>';
				break;
			case 'r':
				if (ootd_c > 0) {
					html += '<div class="ootd_menu_block"><div class="ootd_menu_title">' + value['name'] + ':</div><div class="styled-select"><select onchange="javascript:ootd_sp(\'' + key + '\', this.value)">';
					$.each(value['values'], function (key2, value2) {
						if (key2 == 0 || ootd_c == 0 || (typeof ootd_navi['c']['links'][ootd_c] != 'undefined' && ootd_navi['c']['links'][ootd_c].indexOf(key2) != -1)) {
							if (ootd_r == key2) {
								html += '<option value="' + key2 + '" selected>' + value2 + '</option>';
							} else {
								html += '<option value="' + key2 + '">' + value2 + '</option>';
							}
						}
					});
					html += '</select></div></div>';
				}
				break;
			case 'currency':
				currency_html += '<div class="ootd_menu_block ootd_menu_currency"><div class="ootd_menu_title">' + value['name'] + ':</div><ul>';
				$.each(value['values'], function (key2, value2) {
					if (ootd_currency == key2) {
						currency_html += '<li class="selected2">' + key2 + '</li>';
					} else {
						currency_html += '<li class="link" onclick="javascript:ootd_sp(\'' + key + '\', \'' + key2 + '\')">' + key2 + '</li>';
					}
				});
				currency_html += '</ul></div>';
				break;
		}


	});

	html += '<div class="ootd_menu_block ootd_menu_sort"><div class="ootd_menu_title">Сортировка по:</div><ul>';
	$.each(oots_filters, function (key, value) {
		if (ootd_f == key) {
			html += '<li class="selected2">' + value + ' &uarr;</li> ';
		} else {
			html += '<li class="link" onclick="javascript:ootd_sf(\'' + key + '\')">' + value + '</li> ';
		}
	});
	html += '</ul></div>';

	html += currency_html;

	$("#offer_of_the_day_navi").html(html).hide();
*/
}

function ootd_render_content() {
	var success = function (data) {
		if (typeof data === null || typeof data === 'undefined') {
			$("#offer_of_the_day_content").text("No data offers recived from server. Please reload page.")
			return;
		} else {
			ootd_build_content(data);
		}
	};

	$.ajax({
		url: "//besthotels.org.ua/api/get_offers/?t=" + ootd_t + "&f=" + ootd_f + "&d=" + ootd_d + "&c=" + ootd_c + "&r=" + ootd_r + "&p=" + ootd_p + "&pp=" + ootd_pp + (ootd_tour_id != 0 ? '&tour_id=' + ootd_tour_id : ''),
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: true,
		success: success,
		error: function (jqXHR, textStatus, errorThrown) {
			$("#offer_of_the_day_content").text("Some errors on server. Please reload page.")
			var err = textStatus + ", " + error;
			console.log("Request Failed: " + err);
		}
	});
}

function ootd_build_content(data) {

	// working with currencies
	if (typeof data === 'undefined' || data.length <= 0 || typeof ootd_currency === null || typeof ootd_currency === 'undefined' || typeof data['currencies']['rates'][ootd_currency] === 'undefined' || data['currencies']['rates'][ootd_currency] === null) {
		ootd_currency = ootd_currency_default;
	}

	var html = '';

	if (typeof data === 'undefined' || data.length <= 0 || data['items'] == 0) {
		html += '<div class="message">По указанным критериям предложения не найдены или срок действия их истек</div>';
	} else {

		var currency_code = ootd_currency;
		var currency_rate = data['currencies']['rates'][ootd_currency]['rate'];
		var currency_xcode = data['currencies']['rates'][ootd_currency]['code'];

		console.log("code - " + currency_code);
		console.log("rate - " + currency_rate);


		$.each(data['data'], function (key, value) {

			if (value['currency_code'] == ootd_currency_default) {
				price = Math.round(value['price'] / currency_rate);
				currency = currency_code;
			} else {
				price = Math.round(value['price']);
				currency = value['currency_code'];
			}

			if (data['type'] == 'tickets') {
				html += '<div class="item">';
				html += '<div class="photo" style="background-image: url(' + ((typeof value['type'] === 'undefined' || value['type'] === null) ? '//besthotels.org.ua/img/no-foto.jpg' : '//besthotels.org.ua/img/transfer_' + value['type']) + '.png);"></div>';
				html += '<div class="item_data">';

				/* visual block */
				html += '<div class="title">Билеты ' + value['type_name'] + ' до ' + value['city_name'] + ', ' + value['country_name'] + '</div>';
				html += '<div class="description_short"><div class="travel_nigths"> <img src="//besthotels.org.ua/img/ic_hotel.png" align="absmiddle"> на ' + value['travel_nights'] + ' ночей</div><div class="travel_info"><img src="//besthotels.org.ua/img/ic_' + (value['travel_type'] == '1' ? 'bus.png' : (value['travel_type'] == '2' ? 'plane.png' : 'none.png')) + '" align="absmiddle"> ' + value['travel_date'] + ' из ' + value['departure_city_name'] + '</div><div class="price">от <span class="number">' + price + '</span> <span class="currency">' + currency + '</span></div></div>';
				html += '<div class="action">';
				if (ootd_partner_id != '') {
					html += '<a class="book_button blue" href="//besthotels.org.ua/order/?partner_id=' + ootd_partner_id + '&type=' + data['type'] + '&id=' + value['id'] + '&currency=' + currency_code + '" target="_blank" class="order_button blue" onclick="window.open(this.href,\'targetWindow\',\'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=500,height=400\'); return false;">Оставить заявку</a>';
				} else {
					html += '<a class="book_button blue" href="//online.newstravel.com.ua/search_tour?TOWNFROMINC=' + value['departure_city'] + '&CURRENCY=' + currency_xcode + '&' + value['online_url'] + '" target="_blank" class="order_button blue">Бронировать онлайн</a>';
				}
				html += ' <a class="ootd_details details_link" id="ootd_details" href="#"><span class="details_link">Показать детали</span> <img src="//besthotels.org.ua/img/detailer.png" class="details_link"></a></div>';

				/* detail block */
				html += '<div class="ootd_description" style="display: none;">' +
				'<p><span>Предложение:</span> ' + value['offer_name'] + '</p>' +
				'<p><span>Дата отправления:</span> ' + value['travel_date'] + ' на ' + value['travel_nights'] + ' ночей</p>' +
				'<p><span>Город отправления:</span> ' + value['departure_city_name'] + '</p>' +
				'<p><span>Класс трансфера:</span> ' + value['class'] + '</p>' +
				'<p><span>Предложение действительно:</span> до <b style="color:red;">' + value['till_time'] + '</b></p>' +
				'<p><span>Дополнительное описание:</span> ' + value['description'].replace(/\n/g, "<br/>") + '</p>' +
				'</div>';

				html += '</div></div>';
				html += '';
				html += '</div>';

			} else {
				html += '<div class="item">';
				html += ((typeof value['hotel_url'] === 'undefined' || value['hotel_url'] === null || value['hotel_url'] == "") ? '<a href="#" onclick="javascript:alert(\'No hotel info\')">' : '<a href="http://besthotels.org.ua/info/?id=' + value['hotel'] + '" onclick="window.open(this.href,\'hotel_' + value['id'] + '\',\'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=850,height=600\'); return false;" target="_blank">') + '<div class="photo" style="background-image: url(' + ((typeof value['photo'] === 'undefined' || value['photo'] === null) ? '//besthotels.org.ua/img/no-foto.jpg' : '//offer.newstravel.com.ua/photo/pre/' + value['photo']) + ');">' + (value['is_soldout'] == '1' ? '<img src="//besthotels.org.ua/img/sold.png" width="120" height="80">' : '') + '</div>' + ((typeof value['hotel_url'] === 'undefined' || value['hotel_url'] === null || value['hotel_url'] == "") ? '</a>' : '</a>');
				html += '<div class="item_data">';

				/* visual block */
				html += '<div class="title">' + ((typeof value['hotel_url'] === 'undefined' || value['hotel_url'] === null || value['hotel_url'] == "") ? value['hotel_stars'] + ' ' + value['hotel_name'] : '<a href="http://besthotels.org.ua/info/?id=' + value['hotel'] + '" onclick="window.open(this.href,\'hotel_' + value['id'] + '\',\'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=850,height=600\'); return false;" target="_blank">' + value['hotel_stars'] + ' ' + value['hotel_name'] + '</a>') + ' <span>(' + value['country_name'] + ', ' + value['city_name'] + ')</span></div>';
				html += '<div class="description_short"><div class="travel_nigths"> <img src="//besthotels.org.ua/img/ic_hotel.png" align="absmiddle"> на ' + value['travel_nights'] + ' ночей ' + value['board_name'] + '</div><div class="travel_info"><img src="//besthotels.org.ua/img/ic_' + (value['travel_type'] == '1' ? 'bus.png' : (value['travel_type'] == '2' ? 'plane.png' : 'none.png')) + '" align="absmiddle"> ' + value['travel_date'] + ' из ' + value['departure_city_name'] + '</div><div class="price">от <span class="number">' + price + '</span> <span class="currency">' + currency + '</span></div></div>';
				html += '<div class="action">';

				if (value['is_soldout'] == '1') {
					html += '<a class="book_button gray" href="#">Распродано</a>';
				} else if (ootd_partner_id != '') {
					html += '<a class="nt-btn nt-btn-white btn book_button" href="//besthotels.org.ua/order/?partner_id=' + ootd_partner_id + '&type=' + data['type'] + '&id=' + value['id'] + '&currency=' + currency_code + '" target="_blank" class="order_button blue" onclick="window.open(this.href,\'targetWindow\',\'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=500,height=400\'); return false;">Заказать тур</a>';
				} else {
					html += '<a class="nt-btn nt-btn-white btn book_button" href="//online.newstravel.com.ua/search_tour?TOWNFROMINC=' + value['departure_city'] + '&HOTELINC=' + value['hotel'] + '&MEALINC=' + value['board'] + '&CURRENCY=' + currency_xcode + '&' + value['online_url'] + '" target="_blank" class="order_button blue">Бронировать онлайн</a>';
				}
				//html += ' <a class="ootd_details details_link" id="ootd_details" href="#"><span class="details_link">Показать детали</span> <img src="//besthotels.org.ua/img/detailer.png" class="details_link"></a></div>';
				html += ' <a class="ootd_details details_link pull-right" href="#"><span class="details_link">Показать детали</span> <img src="//besthotels.org.ua/img/detailer.png" class="details_link"></a></div>';

				/* detail block */
				html += '<div class="ootd_description" style="display: none;">' +
				'<p><span>Предложение:</span> ' + value['offer_name'] + '</p>' +
				'<p><span>Дата отправления:</span> ' + value['travel_date'] + ' на ' + value['travel_nights'] + ' ночей</p>' +
				'<p><span>Город отправления:</span> ' + value['departure_city_name'] + '</p>' +
				'<p><span>Питание:</span> ' + value['board_name'] + '</p>' +
				'<p><span>Предложение действительно:</span> до <b style="color:red;">' + value['till_time'] + '</b></p>' +
				'<p><span>Дополнительное описание:</span> ' + value['description'].replace(/\n/g, "<br/>") + '</p>' +
				'</div>';

				html += '</div></div>';
				html += '';
				html += '</div>';
			}

			html += '';
		});

		var ootd_max_pages = 9;
		var ootd_start_page = 1;
		var ootd_end_page = ootd_start_page + ootd_max_pages - 1;

/*
		if (data['pages_total'] > 1) {
			html += '<div class="ootd_pages _display_none"><ul class="pages">' + (data['pages_curent'] > 1 ? '<li class="arr_left page" onclick="javascript:ootd_page(\'' + (parseInt(data['pages_curent']) - 1) + '\')">&larr;</li>' : '<li class="arr_left">&larr;</li>') + '';

			if (data['pages_total'] <= ootd_max_pages) {
				ootd_start_page = 1;
				ootd_end_page = parseInt(data['pages_total']);
			} else if (data['pages_total'] - 4 < data['pages_curent']) {
				ootd_start_page = parseInt(data['pages_total']) - ootd_max_pages + 1;
				ootd_end_page = parseInt(data['pages_total']);
			} else if (data['pages_curent'] > 4) {
				ootd_start_page = parseInt(data['pages_curent']) - 4;
				ootd_end_page = parseInt(data['pages_curent']) - 5 + ootd_max_pages;
			}

			for (var i = ootd_start_page; i <= ootd_end_page; i++) {
				if (data['pages_curent'] == i) {
					html += '<li class="curent">' + i + '</li>';
				} else {
					html += '<li class="page" onclick="javascript:ootd_page(\'' + i + '\')">' + i + '</li>';
				}
			}

			html += (data['pages_curent'] < data['pages_total'] ? '<li class="arr_right page" onclick="javascript:ootd_page(\'' + (parseInt(data['pages_curent']) + 1) + '\')">&rarr;</li>' : '<li class="arr_right">&rarr;</li>') + '</ul></div>';
		}
*/
	}

	$("#offer_of_the_day_content").html(html);
	$(".details_link").on('click', function (e) {
		console.log(".details_link");
		$(this).closest(".item_data").find(".ootd_description").slideToggle('slow');
		return false;
	});
}

function ootd_render_types() {
	$("#offer_of_the_day_type").remove();
/*
	var html = '<ul>';
	$.each(oots_types, function (key, value) {
		if (ootd_t == key) {
			html += '<li class="selected">' + value + '</li> ';
		} else {
			html += '<li class="link" onclick="javascript:ootd_sp(\'t\', \'' + key + '\')">' + value + '</li>';
		}
	});
	html += '</ul>';
	$("#offer_of_the_day_type").html(html).hide();
*/
}

function ootd_init() {
	$("#offer_of_the_day").html('<div id="offer_of_the_day_type"></div><div id="offer_of_the_day_navi">Loading navi...</div><div id="offer_of_the_day_content">Loading content...</div>');

	if (typeof $("#offer_of_the_day").attr('per_page') !== 'undefined' && $("#offer_of_the_day").attr('per_page') != '') {
		ootd_pp = $("#offer_of_the_day").attr('per_page');
	}
	//if(typeof $( "#offer_of_the_day").attr('type') !== 'undefined' && $( "#offer_of_the_day").attr('type')!= ''){ootd_t = $( "#offer_of_the_day").attr('type');}
	if (typeof $("#offer_of_the_day").attr('departure_city') !== 'undefined' && $("#offer_of_the_day").attr('departure_city') != '') {
		ootd_d = $("#offer_of_the_day").attr('departure_city');
		if (ootd_d.match(/[^0-9]/)) {
			ootd_d = 0;
		}
	}
	if (typeof $("#offer_of_the_day").attr('country') !== 'undefined' && $("#offer_of_the_day").attr('country') != '') {
		ootd_c = $("#offer_of_the_day").attr('country');
	}
	if (typeof $("#offer_of_the_day").attr('partner_id') !== 'undefined' && $("#offer_of_the_day").attr('partner_id') != '') {
		ootd_partner_id = $("#offer_of_the_day").attr('partner_id');
	}
	if (typeof $("#offer_of_the_day").attr('tour_id') !== 'undefined' && $("#offer_of_the_day").attr('tour_id') != '') {
		ootd_tour_id = $("#offer_of_the_day").attr('tour_id');
	}
	if (typeof $("#offer_of_the_day").attr('currency') !== 'undefined' && $("#offer_of_the_day").attr('currency') != '') {
		ootd_currency = $("#offer_of_the_day").attr('currency');
	}

	ootd_render_types();
	ootd_render_navi();
	ootd_render_content();

	$(".details_link").on('click', function (e) {
		console.log(".details_link");
		$(this).closest(".item_data").find(".ootd_description").slideToggle('slow');
		return false;
	});
}

if (typeof ootd === 'undefined') {
	console.log("Loading O version");
	var ootd = 1;

//	loadScript("//ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js", function () {
		//$ = jQuery.noConflict(true);
		console.log("JQ loaded " + $.fn.jquery);

		$(document).ready(function () {
			ootd_init();
		});
//	});
} else {
	console.log("O version not loaded");
}

window.onerror = function errorHandler(msg, url, line) {
	console.log(arguments);
	// Just let default handler run.
	return false;
}