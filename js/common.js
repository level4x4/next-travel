(function(){
	window.nt = {};

	$.fn.exists = function () {
		return this.length !== 0;
	};

	var classNames = {
		ntSliderContainer: 'nt-slider-container',
		ntHeaderMenuContainer: 'nt-header-menu-container',
		ntHeaderSubMenu: 'nt-header-sub-menu',
		ntSubMenuTempContainer: 'nt-sub-menu-temp-container',
		ntGismeteoWidgetConatiner: 'nt-gismeteo-widget-conatiner'
	};

	var ids = {
		offerOfTheDayType: 'offer_of_the_day_type',
		offerOfTheDayNavi: 'offer_of_the_day_navi'
	};

	var buildSelectors = function (selectors, source, characterToPrependWith) {
		$.each(source, function (propertyName, value) {
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	nt.buildSelectors = function (classNames, ids) {
		var selectors = {};
		if (classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if (ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	var selectors = nt.buildSelectors(classNames, ids);

	var indexHeaderSubMenu,
		$ntHeaderMenuElement,
		$ntHeaderSubMenu;

	$(function(){
		$ntHeaderMenuElement = $(selectors.ntHeaderMenuContainer).find('li');
		$ntHeaderSubMenu = $(selectors.ntHeaderSubMenu);

		$ntHeaderMenuElement.on('click', function(e){
			var $this = $(this),
				thisIndex;
			thisIndex = $this.index() + 1;
			indexHeaderSubMenu = !indexHeaderSubMenu ? thisIndex : indexHeaderSubMenu;
			if ($this.hasClass(classNames.ntHeaderSubMenu)) {
				if (indexHeaderSubMenu === thisIndex) {
					$this.toggleClass('active');
					$(selectors.ntSubMenuTempContainer).toggleClass('_display_none');
				} else {
					indexHeaderSubMenu = thisIndex;
					$ntHeaderMenuElement.removeClass('active');
					$this.addClass('active');
					$(selectors.ntSubMenuTempContainer).removeClass('_display_none');
				}
			} else {
				indexHeaderSubMenu = thisIndex;
				$ntHeaderMenuElement.removeClass('active');
				$this.addClass('active');
				$(selectors.ntSubMenuTempContainer).addClass('_display_none');
			}
		});

		$.getScript('js/slider.js').done(function(){
			$(selectors.ntSliderContainer).slider({
				btnNext: '.nt-nav-slider-next',
				btnPrev: '.nt-nav-slider-prev'
			});
		}).fail(function(){
			console.log('Fail load file slider.js');
		});
		if ($(selectors.ntGismeteoWidgetConatiner).exists()) {
			$.getScript('js/widget_partner.js').done(function () {
				console.log('Load file widget_partner.js');
			}).fail(function () {
				console.log('Fail load file widget_partner.js');
			});
		}
	});
})();