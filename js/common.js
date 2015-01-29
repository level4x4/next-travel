(function(){
	window.nt = {};

	$.fn.exists = function () {
		return this.length !== 0;
	};

	$.fn.hotelStars = function() {
		var $li = $(this).find('li'),
			i = 1,
			countStar = $(this).data('stars');
		$li.each(function(){
			if (i > countStar) {
				return false;
			}
			i++;
			$(this).addClass('active');
		});
	};

	$.fn.scrollToTop = function () {
		$(this).removeAttr('href').on('click', function () {
			$('html, body').animate({scrollTop: 0}, 'slow');
		})
	};

	var classNames = {
		ntSliderContainer: 'nt-slider-container',
		ntHeaderMenuContainer: 'nt-header-menu-container',
		ntHeaderSubMenu: 'nt-header-sub-menu',
		ntSubMenuTempContainer: 'nt-sub-menu-temp-container',
		ntPartnerContainer: 'nt-partner-container',
		ntBannerContainer: 'nt-banner-container',
		ntHotelStars: 'nt-hotel-stars',
		ntHotelInfoHotelStars: 'nt-hotel-info__stars-hotel',
		ntPopDieContainer: 'nt-pop-die-container',
		ntPopDieContainerHeight: 'nt-pop-die-container-height',
		ntHotelShortDescription: 'nt-hotel-short-description',
		ntFooter: 'nt-footer',
		ntUpButton: 'nt-up-button',

		ntSubscribeEmailNewsletter: 'nt-subscribe-email-newsletter',
		ntSubscribeEmailNewsletterContainer: 'nt-subscribe-email-newsletter-container',
		ntNewsletterContainerEmail: 'nt-newsletter-container__email',
		ntNewsletterContainerName: 'nt-newsletter-container__name',
		ntNewsletterContainerBtn: 'nt-newsletter-container__btn',
		ntNewsletterContainerType: 'nt-newsletter-container__type',

		positionFooter: '_position_footer',
		positionStatic: '_position_static',
		positionFixed: '_position_fixed',
		displayNone: '_display_none'
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

	var posNtPopDieContainer,
		posNtFooter,
		indexHeaderSubMenu,
		$ntHeaderMenuElement,
		$ntNewsletterContainerEmail,
		$ntNewsletterContainerName,
		$ntNewsletterContainerBtn,
		$ntNewsletterContainerType,
		$ntSubscribeEmailNewsletter,
		$ntSubMenuTempContainer,
		$ntHotelStars,
		$ntHotelInfoHotelStars,
		$ntSliderContainer,
		$ntBannerContainer,
		$ntPopDieContainer,
		$ntPopDieContainerHeight,
		$ntHotelShortDescription,
		$ntFooter,
		$ntUpButton,
		$ntHeaderSubMenu;

	$(function(){
		$ntFooter = $(selectors.ntFooter);
		$ntUpButton = $(selectors.ntUpButton);
		$ntPopDieContainer = $(selectors.ntPopDieContainer);
		$ntPopDieContainerHeight = $(selectors.ntPopDieContainerHeight);
		$ntHotelShortDescription = $(selectors.ntHotelShortDescription);
		$ntHotelStars = $(selectors.ntHotelStars);
		$ntHotelInfoHotelStars = $(selectors.ntHotelInfoHotelStars);
		$ntHeaderMenuElement = $(selectors.ntHeaderMenuContainer).find('> li');
		$ntNewsletterContainerEmail = $(selectors.ntNewsletterContainerEmail);
		$ntNewsletterContainerName = $(selectors.ntNewsletterContainerName);
		$ntNewsletterContainerBtn = $(selectors.ntNewsletterContainerBtn);
		$ntNewsletterContainerType = $(selectors.ntNewsletterContainerType);
		$ntSubscribeEmailNewsletter = $(selectors.ntSubscribeEmailNewsletter);
		$ntHeaderSubMenu = $(selectors.ntHeaderSubMenu);
		$ntSubMenuTempContainer = $(selectors.ntSubMenuTempContainer);
		$ntSliderContainer = $(selectors.ntSliderContainer);
		$ntBannerContainer = $(selectors.ntBannerContainer);

		if ($ntPopDieContainer.exists()) {
			posNtPopDieContainer = $ntHotelShortDescription.offset();
			posNtFooter = $ntFooter.offset();
			$ntUpButton.scrollToTop();
		}

		if ($ntHotelInfoHotelStars.exists()) {
			$ntHotelInfoHotelStars.each(function(){
				$(this).hotelStars();
			});
		}

		if($ntHotelStars.exists()) {
			$ntHotelStars.each(function(){
				$(this).hotelStars();
			});
		}

		$ntHeaderMenuElement.each(function(){
			if ($(this).hasClass('active')) {
				indexHeaderSubMenu = $(this).index() + 1;
				return false;
			}
		});

		$ntHeaderMenuElement.on('click', function(e){
			var $this = $(this), thisIndex;
			thisIndex = $this.index() + 1;
			indexHeaderSubMenu = !indexHeaderSubMenu ? thisIndex : indexHeaderSubMenu;
			if ($this.hasClass(classNames.ntHeaderSubMenu)) {
				if (indexHeaderSubMenu === thisIndex) {
					$this.toggleClass('active');
					$ntSubMenuTempContainer.toggleClass(classNames.displayNone);
				} else {
					indexHeaderSubMenu = thisIndex;
					$ntHeaderMenuElement.removeClass('active');
					$this.addClass('active');
					$ntSubMenuTempContainer.removeClass(classNames.displayNone);
				}
			} else {
				indexHeaderSubMenu = thisIndex;
				$ntHeaderMenuElement.removeClass('active');
				$this.addClass('active');
				$ntSubMenuTempContainer.addClass(classNames.displayNone);
			}
		});

		$ntSubscribeEmailNewsletter.on('click', function(){
			$(selectors.ntSubscribeEmailNewsletterContainer).removeClass(classNames.displayNone);
			$(this).addClass(classNames.displayNone);
			return false;
		});

		$ntNewsletterContainerBtn.on('click', function(){
			$.ajax({
				url: '',
				method: 'POST',
				data: {
					email: $ntNewsletterContainerEmail.val(),
					name: $ntNewsletterContainerName.val(),
					type: $ntNewsletterContainerType.val()
				}
			}).done(function(){
				$(selectors.ntSubscribeEmailNewsletterContainer).addClass(classNames.displayNone);
				$ntSubscribeEmailNewsletter.removeClass(classNames.displayNone);
			}).fail(function(){
				console.log('Unknown error')
			});
		});

		$ntNewsletterContainerEmail.on('propertychange input', function(){
			subscribeEmailNewsletter($(this));
		});

		if ($ntHeaderSubMenu.hasClass('active')) {
			$ntSubMenuTempContainer.removeClass(classNames.displayNone);
		} else {
			$ntSubMenuTempContainer.addClass(classNames.displayNone);
		}

		subscribeEmailNewsletter($ntNewsletterContainerEmail);

		$.getScript('js/slider.js').done(function(){
			if ($ntSliderContainer.exists()) {
				$ntSliderContainer.slider({
					btnNext: '.nt-nav-slider-next',
					btnPrev: '.nt-nav-slider-prev'
				});
			}
			if ($ntBannerContainer.exists()) {
				$ntBannerContainer.slider({
					btnNext: '.nt-nav-banner-slider-next',
					btnPrev: '.nt-nav-banner-slider-prev'
				});
			}
		}).fail(function(){
			console.log('Fail load file slider.js');
		});
		if ($(selectors.ntPartnerContainer).exists()) {
			$.getScript('js/widget_partner.js').done(function () {
				console.log('Load file widget_partner.js');
			}).fail(function () {
				console.log('Fail load file widget_partner.js');
			});
		}
	});

	$(document).on('scroll', function(){
		if ($ntPopDieContainer.exists()) {
			var $this = $(this),
				thisScrollTop = $this.scrollTop();


			if ((thisScrollTop + $(window).height()) >= ($this.height() - $ntFooter.outerHeight())) {
				$ntPopDieContainer.fadeIn('fast', function() {
					$(this).addClass(classNames.positionFooter).fadeIn('fast');
				});
			} else {
				$ntPopDieContainer.fadeIn('fast', function() {
					$(this).removeClass(classNames.positionFooter).fadeIn('fast');
				});
			}


			if (thisScrollTop >= (posNtPopDieContainer.top + $ntHotelShortDescription.outerHeight()) && $ntPopDieContainer.hasClass(classNames.positionStatic)) {
				$ntPopDieContainer.fadeIn('fast', function () {
					$(this).removeClass(classNames.positionStatic).addClass(classNames.positionFixed).fadeIn('fast');
				});
			}
			if (thisScrollTop <= (posNtPopDieContainer.top + $ntHotelShortDescription.outerHeight()) && $ntPopDieContainer.hasClass(classNames.positionFixed)) {
				$ntPopDieContainer.fadeIn('fast', function () {
					$(this).removeClass(classNames.positionFixed).addClass(classNames.positionStatic).fadeIn('fast');
				});
			}

		}
	});

	var subscribeEmailNewsletter = function($_this){
		var regMail = /^([a-zA-Z0-9_\.-]+)@([a-zA-Z0-9_\.-]+)\.([a-z\.]{2,6})$/,
			value = $_this.val();
		if (regMail.test(value)) {
			$.ajax({
				url: '',
				method: 'POST',
				data: {mail: value}
			}).done(function(data){
				$ntNewsletterContainerBtn.prop('disabled', false);
				$ntNewsletterContainerName.prop('disabled', false);
				if (data.isMail) {
					$ntNewsletterContainerName.val(data.name);
					$ntNewsletterContainerType.val('remove');
					$ntNewsletterContainerBtn.text('Отписаться');
				} else {
					$ntNewsletterContainerType.val('add');
					$ntNewsletterContainerBtn.text('Подписаться');
				}
			}).fail(function(){
				console.log('Unknown error')
			});
		} else {
			$ntNewsletterContainerName.prop('disabled', true);
			$ntNewsletterContainerBtn.prop('disabled', true);
		}
	};
})();