/*loading*/
var loadingTimeoutValue = {};
$.loading = function (isShow, options) {
	options = options || {};
	var $container = options.$container || $('.elayout-loading-container');
	if ($container && $container.length) {
		$container.css({
			position: 'relative'
		});
	}

	$container = $container && $container.length ? $container : $('body');
	var $el = $container.children('.elayout-loading');
	var $over = $container.children('.elayout-loading-over');

	$container = $container.length ? $container : $('body');
	$container.data('loadName',$container.data('loadName') || (+new Date()));
	//$container.loadName = $container.loadName || (+new Date())
	if (!$el.length) {
		$over = $('<div class="elayout-loading-over" style="display:none;"></div>');
		var $el = $('<div class="elayout-loading" style="display:none;">\
		        <span class="icon">\
		            <i></i><i></i><i></i><i></i>\
		        </span>\
		        <div class="text">Loading...</div>\
		    </div>');
		$container.append($over);
		$container.append($el);
	}

	var name = $container.data('loadName'); //$container.attr('id') + '_' + $container.attr('class');

	if (loadingTimeoutValue[name]) {
		clearTimeout(loadingTimeoutValue[name]);
		loadingTimeoutValue[name] = null;
	}

	if (isShow) {

		loadingTimeoutValue[name] = setTimeout(function () {
			clearTimeout(loadingTimeoutValue[name]);
			loadingTimeoutValue[name] = null;
			$el.css({
				'display': '',
				'margin-top': $container.scrollTop() + 'px'
			});
			$over.css({
				'display': '',
				'height': ($container[0].scrollHeight || $container.height()) + 'px'
			});

		}, 200);
	}
	else {
		if (loadingTimeoutValue[name]) {
			clearTimeout(loadingTimeoutValue[name]);
			loadingTimeoutValue[name] = null;
		}
		$el.css('display', 'none');
		$over.css('display', 'none');

	}

	if (options.isClear) {
		if (loadingTimeoutValue[name]) {
			clearTimeout(loadingTimeoutValue[name]);
			loadingTimeoutValue[name] = null;
		}
		$('elayout-loading').css('display', 'none');
		$('elayout-loading-over').css('display', 'none');
	}
}