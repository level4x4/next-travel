/**
 * Created by Alex on 09.10.2014.
 */
(function(){
	var classNames = {
		sliderContent: 'slider-content',
		sliderPages: 'slider-pages',

		active: 'active'
	};

	var ids = {
	};

	var buildSelectors = function (selectors, source, characterToPrependWith) {
		$.each(source, function (propertyName, value) {
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	var slBuildSelectors = function (classNames, ids) {
		var selectors = {};
		if (classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if (ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	var selectors = slBuildSelectors(classNames, ids);

	$.fn.slider = function(options){
		var settings = {
			rotateBy: 1,
			speed: 500,
			btnNext: null,
			btnPrev: null,
			auto: 10000,
			backSlide: false
		};

		return this.each(function(){
			if (options) {
				$.extend(settings, options);
			}

			var $this = $(this);
			var $sliderContainer = $this.find(selectors.sliderContent);
			var $pagesContainer = $this.find(selectors.sliderPages);
			var itemsTotal = $this.find(selectors.sliderContent).children().length;
			var running = false;
			var intID = null;

			var endAnimation = function(){
				if (settings.auto) {
					intID = window.setInterval(function() { slide(settings.backSlide); }, settings.auto);
				}
				running = false;
			};

			if ($pagesContainer.length > 0) {
				$pagesContainer.html('');
				for (var i = 0; i < itemsTotal; i++) {
					$pagesContainer.append($('<li/>'));
				}
				$pagesContainer.find('li:first').addClass(classNames.active);
			}

			function slide(dir){
				var direction = !dir ? -1 : 1;
				var leftIndent = 0;

				if (!running) {
					running = true;

					if (intID) {
						window.clearInterval(intID);
					}

					leftIndent = (735 * settings.rotateBy * direction);

					if (!dir) {
						$sliderContainer.children(':last').after($sliderContainer.children().slice(0, settings.rotateBy).clone(true));
						if ($pagesContainer.length > 0) {
							$pagesContainer.children(':first').before($pagesContainer.children().slice(itemsTotal - settings.rotateBy, itemsTotal).clone(true));
							$pagesContainer.children().slice(itemsTotal, itemsTotal + settings.rotateBy).remove();
						}
						$sliderContainer.children().slice(1, 2).animate({left: leftIndent}, {queue: false, duration: settings.speed, complete: function() {
							$sliderContainer.children().slice(1, 2).css({left: 0});
						}});
						$sliderContainer.children().slice(0, settings.rotateBy).animate({left: leftIndent}, {queue: false, duration: settings.speed, complete: function() {
							$sliderContainer.children().slice(0, settings.rotateBy).remove();
							endAnimation();
						}});
					} else {
						$sliderContainer.children(':first').before($sliderContainer.children().slice(itemsTotal - settings.rotateBy, itemsTotal).clone(true));
						if ($pagesContainer.length > 0) {
							$pagesContainer.children(':last').after($pagesContainer.children().slice(0, settings.rotateBy).clone(true));
							$pagesContainer.children().slice(0, settings.rotateBy).remove();
						}
						$sliderContainer.children().slice(0, settings.rotateBy).css({left: -leftIndent});
						$sliderContainer.children().slice(1, 2).css({left: -leftIndent});
						$sliderContainer.children().slice(0, settings.rotateBy).animate({left: 0}, {queue: false, duration: settings.speed, complete: function() {
							$sliderContainer.children().slice(itemsTotal, itemsTotal + settings.rotateBy).remove();
							endAnimation();
						}});

						$sliderContainer.children().slice(1, 2).animate({left: 0}, {queue: false, duration: settings.speed, complete: function() {
							$sliderContainer.children().slice(1, 2).css({left: 735});
						}});
					}
				}
			}

			$(settings.btnNext).on('click', function() {
				return slide(false);
			});

			$(settings.btnPrev).on('click', function() {
				return slide(true);
			});

			if (settings.auto) {
				intID = window.setInterval(function() { slide(settings.backSlide); }, settings.auto);
			}
		});

	};
})();