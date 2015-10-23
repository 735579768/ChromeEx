
var  bw = chrome.extension.getBackgroundPage();
var surl;
var url;
var hname='';
window.onload=function(){
	chrome.windows.getCurrent(function(window) {
	chrome.tabs.getSelected(window.id,function(tab) {
	surl=tab.url;
	hname=tab.url.toLowerCase().replace("http://", "").replace("https://", "").replace('www.','').split('/')[0];
	if(!hname){
		$sel('wrap-content').innerHTML='域名无效';
		return;	
		}
	if(!(/(.*?\.)+\w/i.test(hname))){
		$sel('wrap-content').innerHTML='域名无效';
		return;		
		}
	for(var name in cank){
		if(name.indexOf('_')==-1){
			(typeof cank[name]=='function')&&(cank[name]());
		}
		}
	});
	});
};
window.cank={
danwei:'',
init:function(){
	var _t=this;
	$sel('checkip').onclick=function(){
		cank._tipweb.apply(_t);
		};
	$sel('checkdomain').onclick=function(){
		cank._tdomain.apply(_t);
		};
	},
//初始化加载图片
initload:function(obj){
	(obj==null)||(obj.innerHTML='<i class="loadimg"></i></span>');
	},

//查询百度网站收录情况
baidushoulu:function(){
	var obj=$sel('sl-baidu');
	this.initload(obj);
	simpleAjax({ 
				url:"https://www.baidu.com/s?wd=site%3A"+hname,
				data:{},
				type:"get",
				success:function (da) {
		var re1=/该网站共有[\s\S]*?>(.+?)<[\s\S]*?个网页/g;
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
		obj.innerHTML='<a href="'+"https://www.baidu.com/s?wd=site%3A"+hname+'" title="百度收录" target="_blank">'+arr[1]+'</a>';	
					}
	});	
},

//查询当前地址的收录情况
currenturl:function(){
	var obj=$sel('sl-benye');
	this.initload(obj);
var bdurl='https://www.baidu.com/s?wd=inurl%3A'+surl
simpleAjax({
	url:bdurl,
	type:'get',
	success:function(da){
		var re1=/百度为您找到相关结果约1个/g;
		var arr=re1.exec(da);
		var str='<a href="'+bdurl+'" title="百度收录" style="color:#ff0000;" target="_blank">百度未收录</a>';
		if(arr!=null){
			str='<a href="'+bdurl+'" title="百度收录" style="color:#00ff00;" target="_blank">百度已收录</a>';
			}	
		obj.innerHTML=str;		
		}
	});	
	},

//搜狗收录
sougoushoulu:function(){
	var obj=$sel('sl-sougou');
	this.initload(obj);
		var sgurl='http://www.sogou.com/web?query=site%3A'+hname
		simpleAjax({ 
					url:sgurl,
					data:{},
					type:"get",
					success:function (da) {
			var re1=/找到约(.+?)条结果/g;
			var arr=re1.exec(da);
			var str='<a href="'+sgurl+'" style="color:#ff0000;" target="_blank">没有收录</a>';
			if(arr!=null){
				str='<a href="'+sgurl+'" title="搜狗收录" target="_blank">'+arr[1].replace(/<.*?>/,'')+'</a>';
				}
			obj.innerHTML=str;	
						}
		});	
	},

//查询360网站收录情况
shoulu360:function(){
	var obj=$sel('sl-360');
	this.initload(obj);
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
			obj.innerHTML='<a href="'+"http://www.haosou.com/s?q=site%3A"+hname+'" title="360收录" target="_blank">'+arr[1]+'</a>';	
						}
		});	
	},

//查询域名时间
domaintime:function(){
	var obj=$sel('sl-domain');
	this.initload(obj);
	var _t=this;
var uri="http://tool.chinaz.com/DomainDel/?wd="+hname;
simpleAjax({
	url:uri,
	type:'POST',
	success: function(da){
			var re1=/创建时间<\/td>[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var re2=/到期时间<\/td>[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var re3=/删除时间<\/td>[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var re4=/删除倒计时[\s\S]*?(\d+?)天/g;
			var arr1=re1.exec(da);
			var arr2=re2.exec(da);
			var arr3=re3.exec(da);
			var arr4=re4.exec(da);
			var str='<a target="_blank" id="timecs"  href="javascript:;">超时/没有记录</a>';;
			if(arr1!==null){
			str='<a target="_blank" title="注册时间" href="'+uri+'">'+arr1[1]+'</a>';
			str+='<a target="_blank" title="到期时间" href="'+uri+'">'+arr2[1]+'</a>';
			str+='<a target="_blank" title="删除时间" href="'+uri+'">'+arr3[1]+'</a>';
			str+='<a target="_blank" title="剩余时间" href="'+uri+'">剩余'+arr4[1]+'天</a>';
			obj.innerHTML=str;
			}else{
				obj.innerHTML=str;
				$sel('timecs').onclick=function(){
					cank.domaintime.apply(_t);
					}
			}
		
					
		},
	error:function(da){
		obj.innerHTML='<a target="_blank"  href="javascript:;">超时/没有记录</a>';;
		}
	});	
	},

//查询备案查询
domainbeian:function(){
	var obj=$sel('sl-beian');
	var _t=this;
	this.initload(obj);
	//var uri3="http://beian.links.cn/beian.asp?domains="+hname;
	var uri="http://beian.links.cn/domain_"+hname+".html";
	simpleAjax({
		url:uri,
		type:'POST',
		success: function(da){
			//console.log(da);
				//var re1=/<table[\s\S]*?域名[\s\S]*?主办单位名称[\s\S]*?主办单位性质[\s\S]*?网站备案\/许可证号[\s\S]*?<a href\=\"(zbdwmc.*?)\">([\s\S]*?)<\/a>[\s\S]*?<td>(.*?)<\/td>[\s\S]*?<a href\=\"(beianhao.*?)\">([\s\S]*?)<\/a>[\s\S]*?<a href\=\"(webname.*?)\">([\s\S]*?)<\/a>[\s\S]*?(\d{2,4}\/\d{1,2}\/\d{1,2})[\s\S]*?<\/table>/g;
				var re1=/网站备案信息如下[\s\S]*?主办单位名称：[\s\S]*?<a.*?href\=\"(.*?)\">([\s\S]*?)<\/a>[\s\S]*?主办单位性质：([\s\S]*?)<br>[\s\S]*?网站备案\/许可证号：[\s\S]*?<a href\=\"(.*?)\">([\s\S]*?)<\/a>[\s\S]*?网站名称：[\s\S]*?<a href\=\"(.*?)\">([\s\S]*?)<\/a>[\s\S]*?审核时间：(\d{4}\/\d{1,2}\/\d{1,2})[\s\S]*?<\/table>/ig;
				
				var arr1=re1.exec(da);
				//console.log(arr1);
				//var arr2=re2.exec(da);
				//var arr3=re3.exec(da);
				var str='<a target="_blank" id="checkbeian"  href="javascript:;">超时/没有记录</a>';
				if(arr1!==null){
				str='<a target="_blank" title="主办单位名称" href="http://beian.links.cn/'+arr1[6]+'">'+arr1[7]+'</a>';
				str+='<a target="_blank" title="主办单位性质" href="javascript:;">'+arr1[3]+'</a>';
				str+='<a target="_blank" title="网站备案/许可证号" href="http://beian.links.cn/'+arr1[4]+'">'+arr1[5]+'</a>';
				str+='<a target="_blank" title="网站名称" href="http://beian.links.cn/'+arr1[6]+'">'+arr1[7]+'</a>';
				str+='<a target="_blank" title="审核通过日期" href="javascript:;">'+arr1[8]+'</a>';
				_t.danwei=arr1[1];
				obj.innerHTML=str;
				}else{
					obj.innerHTML=str;
					$sel('checkbeian').onclick=function(){
						cank.domainbeian.apply(_t);
						};
					}
			
						
			},
		error:function(da){
			obj.innerHTML='<a target="_blank"  href="javascript:;">超时/没有记录</a>';;
			}
		});	
	},

//查询服务器信息
serverinfo:function(){
		var obj=$sel('sl-server');
		this.initload(obj);
		var uri4="http://www.ip138.com/ips138.asp?ip="+hname
		simpleAjax({
			url:uri4,
			type:'GET',
			success: function(da){
				var re=/<font color="blue"[\s\S]*?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\s\S]*?<\/font>[\s\S]*?本站主数据：(.+?)</;
				var arr=re.exec(da);
				//console.log(arr);
				var str='没有记录';
				if(arr!==null){
					str='<a target="_blank" title="服务器地址" href="javascript:;">'+arr[2].replace(/\s*/g,'')+'</a>';
					str+='<a target="_blank" title="服务器IP" href="javascript:;">'+arr[1]+'</a>';
					
					}
				obj.innerHTML=str;
			}
		});	
	},

//查询爱站流量
aizhanll:function(){
		var obj=$sel('sl-aizhan');
		this.initload(obj);
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
					obj.innerHTML=str;		
				}
			});	
	},

//查询站长流量
zhanzhangll:function(){
		var obj=$sel('sl-zhanzhang');
		this.initload(obj);
		var azurl="http://mytool.chinaz.com/baidusort.aspx?host="+hname;
		simpleAjax({
			url:azurl,
			type:'GET',
			success:function(da){
					var re=/<div class\=\"siteinfo\">[\s\S]*?(\d+)[\s\S]*?(\d+)[\s\S]*?(\d+)[\s\S]*?(\d+)[\s\S]*?<\/div>/;
					var arr=re.exec(da);
					var str='<a target="_blank" title="预计流量" href="javascript:;">没有记录</a>';
					if(arr!=null){
					str='<a target="_blank" title="预估百度流量" href="javascript:;">'+arr[3]+'</a>';
					str+='<a target="_blank" title="百度权重" href="javascript:;">'+arr[1]+'</a>';
					str+='<a target="_blank" title="关键词" href="javascript:;">'+arr[2]+'</a>';
					
					str+='<a target="_blank" title="站长排名" href="javascript:;">'+arr[4]+'</a>';					
					}
					obj.innerHTML=str;		
				}
			});	
	},
//查询爱站流量
quchall:function(){
		var obj=$sel('sl-qucha');
		this.initload(obj);
		var azurl="http://www.7c.com/baidu/"+hname+'/';
		simpleAjax({
			url:azurl,
			type:'GET',
			success:function(da){
					var re=/预计百度大概给该网站的流量为([\s\S]*?)<\/td>/g;
					var arr=re.exec(da);
					var str='<a target="_blank" title="预计流量" href="'+azurl+'">没有记录</a>';
					if(arr!=null){
					var te=arr[1].replace('/<.*?>/g','');
					str='<a target="_blank" title="预计流量" href="'+azurl+'">'+te+'</a>';					
					}
					obj.innerHTML=str;		
				}
			});	
	},
//同ip网站
_tipweb:function(){
		var obj=$sel('sl-tipweb');
		this.initload(obj);
		var url="http://s.tool.chinaz.com/same";
		simpleAjax({
			url:url,
			type:'POST',
			data:{s:hname},
			success:function(da){
					var re=/<div id\="contenthtml\">([\s\S]*?)<\/div>/g;
					var arr=re.exec(da);
					var str='没有网站';
					if(arr!=null){
					str=arr[1];					
					}
					str=str.replace(/<span>.*?<\/span>/g,'');
					obj.innerHTML=str;		
				}
			});	
	},
//http://beian.links.cn/zbdwmc_%E8%B5%B5%E5%85%8B%E7%AB%8B.html
_tdomain:function(){
		if(!this.danwei)return;
		var obj=$sel('sl-tdomain');
		this.initload(obj);
		var url="http://beian.links.cn/"+this.danwei;
		simpleAjax({
			url:url,
			type:'POST',
			data:{s:hname},
			success:function(da){
					var re=/(<table cellpadding\=1[\s\S]*?>[\s\S]*?<\/table>)/g;
					var arr=re.exec(da);
					var str='没有网站';
					if(arr!=null){
					str=arr[1];					
					}
					str=str.replace(/(bgcolor\=\".*?\")|(style\=\".*?\")|(width\=940)/g,'');
					obj.innerHTML=str;		
				},
			error:function(){
				obj.innerHTML='超时/没有记录';	
				}
			});	
	}
};