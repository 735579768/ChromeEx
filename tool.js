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
				var left=parseInt($(this).css('left'));
				var width=$(this).outerWidth();
				var sw=$(window).width();
				if(left===0){
					$(this).animate({
						left: sw-width},
						100, function() {
					});
				}else{
					$(this).animate({
						left: 0},
						100, function() {
					});
				}
			});
			//查询物理地址
			$.get("http://www.ip138.com/ips138.asp?ip=" + response.domainToIP, function(da) {
				var re = /本站主数据：(.+?)</;
				var arr = re.exec(da);
				if (arr.length > 1) arr = '-->' + arr[1];
				$('#ipaddress').html(arr);
				//物理地址查询结束
			});
		}
	});
});