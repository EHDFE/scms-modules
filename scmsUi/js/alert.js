/*alert*/
var alertTimeValue,
	alertHideTimeValue;
$.alert = function (msg, options) {
	options = options || {};
	var $body = options.$container || $('body');
	if (options.$container) {
		options.$container.css({
			position: 'relative'
		});
	}
	options.type = options.type || 'error';
	options.isOver = options.type === 'confirm' ? true : options.isOver || false;
	var $el = $body.children('.elayerout-alert'), $title, $content, $msg, $button, $over, $errMsg;
	var timestamp = options.timestamp || 3000;
	if (!$el.length) {
		$el = $('<div class="elayerout-alert" style="display:none;"></div>');

		$title = $('<div class="tx_title elayerout-alert-title" style="display:none;"><span></span><a href="javascript:void(0);" class="tx_cansel"></a></div>');
		$content = $('<div class="tx_content elayerout-alert-content"><i class="fa"></i></div>');
		$msg = $('<div class="tx_msg elayerout-alert-msg">提示语内容</div>');
		$errMsg = $('<div class="tx_err_msg elayerout-alert-err-msg">出错提示内容</div>');
		$button = $('<div class="modal-footer "><a href="javascript:void(0);" class="btn btn-default tx_cansel">取消</a><a href="javascript:void(0);" class="btn btn-success tx_submit">确认</a></div>');
		$over = $('<div class="elayerout-alert-over" style="display:none;"></div>');
		$el.append($title);
		$el.append($content);
		$content.append($msg);
		$content.append($errMsg);
		$el.append($button);
		$body.append($over);
		$body.append($el);
	}
	else {
		$title = $el.find('.tx_title');
		$content = $el.find('.tx_content');
		$msg = $el.find('.tx_msg');
		$errMsg = $el.find('.tx_err_msg');
		$over = $body.children('.elayerout-alert-over');
		$over.css('display', 'none');
	}
	$errMsg.hide();
	$el.unbind();
	$el.delegate('.tx_cansel', 'click', function () {
		$el.removeClass('elayerout-alert-show');
		$over.removeClass('elayerout-alert-over-show');
		alertHideTimeValue = setTimeout(function () {
			$el.css('display', 'none');
			$over.css('display', 'none');
		}, 500);
	});

	function close() {
		$el.removeClass('elayerout-alert-show');
		$over.removeClass('elayerout-alert-over-show');
		alertHideTimeValue = setTimeout(function () {
			$el.css('display', 'none');
			$over.css('display', 'none');
		}, 500);
	}

	$el.delegate('.tx_submit', 'click', function () {
		if (options.callbackManual && typeof options.callbackManual === 'function') {
			options.callbackManual({
				msgFun: function (msg) {
					if (msg) {
						$errMsg.html(msg).show();
					}
				},
				closeFun: function () {
					close();
				}
			});
		}
		else {
			if (options.callback && typeof options.callback === 'function') {
				options.callback();
			}
			close();
		}
	});

	$el.removeClass('success');
	$el.removeClass('error');
	$el.removeClass('confirm');
	$el.addClass(options.type);
	$msg.html(msg);
	$title.css('display', 'none');
	if (options.title) {
		$title.find('span').text(options.title);
		$title.css('display', '');
	}

	$el.css('display', '');
	if (options.isOver) {
		$over.css('display', '');
	}
	setTimeout(function () {
		$el.addClass('elayerout-alert-show');
		if (options.isOver) {
			$over.addClass('elayerout-alert-over-show');
		}
	}, 0);

	if (alertTimeValue) {
		clearTimeout(alertTimeValue);
		alertTimeValue = null;
	}
	if (alertHideTimeValue) {
		clearTimeout(alertHideTimeValue);
		alertHideTimeValue = null;
	}
	if (options.type === 'success' || options.type === 'error') {
		alertTimeValue = setTimeout(function () {
			$el.removeClass('elayerout-alert-show');
			$over.removeClass('elayerout-alert-over-show');
		}, timestamp);
		alertHideTimeValue = setTimeout(function () {
			$el.css('display', 'none');
			$over.css('display', 'none');
		}, timestamp + 500);
	}

};


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

	var name = $container.attr('id') + '_' + $container.attr('class');

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

