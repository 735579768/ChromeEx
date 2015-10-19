//;$(function(){
//	var gloabalSetPosition;	
//	var useRightList		= [];
//
//	useRightList.push( 'plus.google.com' );
//	useRightList.push( 'www.facebook.com' );
//		
//	gloabalSetPosition = ( $.inArray( window.location.host, useRightList ) >= 0 ) ? 'left' : 'right';
//
//	chrome.extension.sendRequest( {hostname:window.location.hostname}, function(response) {
//		if ( response.domainToIP !== null ) {
//			
//			//显示IP
//					$("body").append("<div id=\"iplocation\" title='双击移除'class=\"tqShowIP_" + gloabalSetPosition + "\">" + response.domainToIP + "<span id='ipaddress'></span><span id='ipbdshoulu'></span><span id='ip360shoulu'></span><span id='ipdomain'></span><span id='ipaizhan'></span></div>");
//					$('#iplocation').dblclick(function(e) {
//                        $(this).animate({bottom:'-20px'},200);
//                    });
//					$('#iplocation').click(function(e) {
//                        $(this).animate({bottom:'1px'},200);
//                    });		
//					setTimeout(function(){
//						$('#iplocation').dblclick();
//						},5000);	
//			//查询物理地址
//			$.get("http://www.ip138.com/ips138.asp?ip="+response.domainToIP,function(da){
//					var re=/本站主数据：(.+?)</;
//					var arr=re.exec(da);
//					if(arr.length>1)arr='-->'+arr[1];
//					$('#ipaddress').html(arr);	
//			//物理地址查询结束
//				});
//			//同服务器网站
//			$('#ipdomain').html('<a target="_blank" href="http://s.tool.chinaz.com/same?s='+response.domainToIP+'">-->同服务器网站</a>');
////			$.post("http://s.tool.chinaz.com/same",{s:response.domainToIP},function(da){
////					var re=/本站主数据：(.+?)</;
////					var arr=re.exec(da);
////					if(arr.length>1)arr='-->'+arr[1];
////					$('#ipaddress').html(arr);	
////				});			
//				//查询百度收录情况
//				var url1="https://www.baidu.com/s?wd=site%3A"+window.location.hostname;
//				$.get(url1,function(da){
//					var re1=/该网站共有[\s\S]*?>([\d\,]+?)<[\s\S]*?个网页/g;
//					var re2=/找到相关结果数约([\,\d]+?)个/g;
//					var arr=re1.exec(da);
//					if(arr===null){
//							arr=re2.exec(da);
//							if(arr===null){
//							arr=new Array();
//							arr[1]='没有收录'
//								}
//							}
//					$('#ipbdshoulu').html('-->百度收录:<a href="'+url1+'" target="_blank">'+arr[1]+'</a>');	
//					});
//				//查询爱站流量
//				$.get("http://baidurank.aizhan.com/baidu/"+window.location.hostname+'/',function(da){
//					var re=/预计来路[\s\S]*?<[\s\S]*?>([\s\S]*?)<[\s\S]*?>[\s\S]*?IP/;
//					var arr=re.exec(da);
//					//console.log(arr);
//					if(arr===null){
//							arr=new Array();
//							arr[1]='0'					
//						}
//						$('#ipaizhan').html('-->爱站流量：'+arr[1]);
//					});
//				//查询360收录情况
//				var url2="http://www.haosou.com/s?q=site%3A"+window.location.hostname;
//				$.get(url2,function(da){
//					var re=/找到相关结果约([\,\d]+?)个/g;
//					var arr=re.exec(da);
//					if(arr===null){
//							arr=new Array();
//							arr[1]='没有收录'
//							}
//					$('#ip360shoulu').html('-->360收录:<a href="'+url2+'" target="_blank">'+arr[1]+'</a>');	
//					});			
//
//		}
//	});
//});