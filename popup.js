
var  bw = chrome.extension.getBackgroundPage();
var surl;
var url;
var hname='';
window.onload=function(){
	chrome.windows.getCurrent(function(window) {
	chrome.tabs.getSelected(window.id,function(tab) {
	surl=tab.url;
	hname=tab.url.toLowerCase().replace("http://", "").replace("https://", "").split('/')[0];
	run();
	});
	});
};
function run(){
//查询百度网站收录情况
simpleAjax({ 
			url:"https://www.baidu.com/s?wd=site%3A"+hname,
			data:{},
			type:"get",
			success:function (da) {
	var re1=/该网站共有[\s\S]*?>([\d\,]+?)<[\s\S]*?个网页/g;
	var re2=/找到相关结果数约([\,\d]+?)个/g;
	var arr=re1.exec(da);
	//console.log(arr);
	if(arr===null){
			arr=re2.exec(da);
			if(arr===null){
			arr=new Array();
			arr[1]='没有收录'
				}
			}
	$sel('sl-baidu').innerHTML='<a href="'+"https://www.baidu.com/s?wd=site%3A"+hname+'" title="百度收录" target="_blank">'+arr[1]+'</a>';	
				}
});
//查询当前地址的收录情况
var bdurl='https://www.baidu.com/s?wd=inurl%3A'+surl
simpleAjax({
	url:bdurl,
	type:'get',
	success:function(da){
		var re1=/百度为您找到相关结果约1个/g;
		var arr=re1.exec(da);
		var str='<a href="'+bdurl+'" title="百度收录" target="_blank">百度未收录</a>';
		if(arr!=null){
			str='<a href="'+bdurl+'" title="百度收录" target="_blank">百度已收录</a>';
			}	
		$sel('sl-benye').innerHTML=str;		
		}
	});
//搜狗收录
var sgurl='http://www.sogou.com/web?query=site%3A'+hname
simpleAjax({ 
			url:sgurl,
			data:{},
			type:"get",
			success:function (da) {
	var re1=/找到约(.+?)条结果/g;
	var arr=re1.exec(da);
	var str='没有收录';
	if(arr!=null){
		str='<a href="'+sgurl+'" title="搜狗收录" target="_blank">'+arr[1].replace(/<.*?>/,'')+'</a>';
		}
	$sel('sl-sougou').innerHTML=str;	
				}
});

//查询360网站收录情况
simpleAjax({ 
			url:"http://www.haosou.com/s?q=site%3A"+hname,
			data:{},
			type:"get",
			success:function (da) {
	var re1=/找到相关结果约([\d\,]+?)个/g;
	var re2=/找到相关结果数约([\,\d]+?)个/g;
	var arr=re1.exec(da);
	//console.log(arr);
	if(arr===null){
			arr=re2.exec(da);
			if(arr===null){
			arr=new Array();
			arr[1]='没有收录'
				}
			}
	$sel('sl-360').innerHTML='<a href="'+"http://www.haosou.com/s?q=site%3A"+hname+'" title="360收录" target="_blank">'+arr[1]+'</a>';	
				}
});

//查询域名时间
var uri="http://tool.chinaz.com/DomainDel/?wd="+hname;
simpleAjax({
	url:uri,
	type:'POST',
	success: function(da){
			var re1=/创建时间[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var re2=/到期时间[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var re3=/删除时间[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var arr1=re1.exec(da);
			var arr2=re2.exec(da);
			var arr3=re3.exec(da);
			var str='<a target="_blank" href="'+uri+'">查询超时</a>';
			if(arr1!==null){
			str='<a target="_blank" title="注册时间" href="'+uri+'">'+arr1[1]+'</a>';
			str+='<a target="_blank" title="到期时间" href="'+uri+'">'+arr2[1]+'</a>';
			str+='<a target="_blank" title="删除时间" href="'+uri+'">'+arr3[1]+'</a>';
			}
		
		$sel('sl-domain').innerHTML=str;			
		},
	error:function(da){
		$sel('sl-domain').innerHTML='请求超时';
		}
	});
//查询备案时间
var uri3="http://beian.links.cn/beian.asp?domains="+hname;
simpleAjax({
	url:uri3,
	type:'POST',
	success: function(da){
			var re1=/<table[\s\S]*?域名[\s\S]*?主办单位名称[\s\S]*?主办单位性质[\s\S]*?网站备案\/许可证号[\s\S]*?<a href\=\"(zbdwmc.*?)\">([\s\S]*?)<\/a>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<a href\=\"(beianhao.*?)\">([\s\S]*?)<\/a>[\s\S]*?<a href\=\"(webname.*?)\">([\s\S]*?)<\/a>[\s\S]*?(\d{2,4}\/\d{1,2}\/\d{1,2})[\s\S]*?<\/table>/g;
			var arr1=re1.exec(da);
			console.log(arr1);
			//var arr2=re2.exec(da);
			//var arr3=re3.exec(da);
			var str='<a target="_blank" href="'+uri+'">没有记录</a>';
			if(arr1!==null){
			str='<a target="_blank" title="主办单位名称" href="http://beian.links.cn/'+arr1[1]+'">'+arr1[2]+'</a>';
			str+='<a target="_blank" title="主办单位性质" href="javascript:;">'+arr1[3]+'</a>';
			str+='<a target="_blank" title="网站备案/许可证号" href="http://beian.links.cn/'+arr1[4]+'">'+arr1[5]+'</a>';
			str+='<a target="_blank" title="网站名称" href="http://beian.links.cn/'+arr1[6]+'">'+arr1[7]+'</a>';
			str+='<a target="_blank" title="审核通过日期" href="javascript:;">'+arr1[8]+'</a>';
			}
		
		$sel('sl-beian').innerHTML=str;			
		},
	error:function(da){
		$sel('sl-beian').innerHTML='请求超时';
		}
	});
var uri4="http://www.ip138.com/ips138.asp?ip="+hname
simpleAjax({
	url:uri4,
	type:'GET',
	success: function(da){
		var re=/<font color="blue"[\s\S]*?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\s\S]*?<\/font>[\s\S]*?本站主数据：(.+?)</;
		var arr=re.exec(da);
		console.log(arr);
		var str='没有记录';
		if(arr!==null){
			str='<a target="_blank" title="服务器地址" href="javascript:;">'+arr[2].replace(/\s*/g,'')+'</a>';
			str+='<a target="_blank" title="服务器IP" href="javascript:;">'+arr[1]+'</a>';
			
			}
		$sel('sl-server').innerHTML=str;
	}
});

//查询爱站流量
var azurl="http://baidurank.aizhan.com/baidu/"+hname+'/';
simpleAjax({
	url:azurl,
	type:'GET',
	success:function(da){
			var re=/预计来路[\s\S]*?<[\s\S]*?>([\s\S]*?)<[\s\S]*?>[\s\S]*?IP/;
			var arr=re.exec(da);
			var str='<a target="_blank" title="预计流量" href="'+azurl+'">没有记录</a>';
			if(arr!=null){
			str='<a target="_blank" title="预计流量" href="'+azurl+'">'+arr[1]+'</a>';					
			}
			$sel('sl-aizhan').innerHTML=str;		
		}
	});

			
			

//$.get("http://www.ip138.com/ips138.asp?ip="+response.domainToIP,function(da){
//		var re=/本站主数据：(.+?)</;
//		var arr=re.exec(da);
//		if(arr.length>1)arr='-->'+arr[1];
//		$('#ipaddress').html(arr);	
////物理地址查询结束
//	});
//结束
}
