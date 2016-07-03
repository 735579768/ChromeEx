;
$(function() {
	var gloabalSetPosition;
	var useRightList = [];
	useRightList.push('plus.google.com');
	useRightList.push('www.facebook.com');
	gloabalSetPosition = ($.inArray(window.location.host, useRightList) >= 0) ? 'left' : 'right';
	chrome.extension.sendRequest({
		hostname: window.location.hostname
	}, function(response) {
		if (response.domainToIP !== null) {

			//显示IP
			$("body").append("<div  id=\"iplocation\" title='双击移除'class=\"tqShowIP_" + gloabalSetPosition + "\">" + response.domainToIP + "<span id='ipaddress'></span><span id='ipdomain'></span></div>");
			$('#iplocation').dblclick(function(event) {
				$(this).remove();
			});
			$('#iplocation').mouseover(function(event) {
				var left = parseInt($(this).css('left'));
				var width = $(this).outerWidth();
				var sw = $(window).width();
				if (left === 0) {
					$(this).animate({
							left: sw - width
						},
						0,
						function() {});
				} else {
					$(this).animate({
							left: 0
						},
						0,
						function() {});
				}
			});
			try {
				//查询物理地址
				var surl = window.location.href;
				if (surl.indexOf('https://') == -1) {
					$.get("http://www.ip138.com/ips138.asp?ip=" + response.domainToIP, function(da) {
						var regex = /本站主数据：(.+?)</;
						//var regex = /<font color="blue"[\s\S]*?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\s\S]*?<\/font>[\s\S]*?本站主数据：(.+?)</;
						var arr = regex.exec(da);
						if (arr) {
							if (arr.length > 1) arr = '-->' + arr[1];
						} else {
							arr = '-->没有查到物理地址';
						}
						$('#ipaddress').html(arr);
						//物理地址查询结束
					});
				} else {
					console.log(surl + '是加密链接不能查询!');
				}


			} catch (e) {}
		}
	});
});