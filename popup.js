(function (a) {
	
	//======================一个简单的ajax对象===============================
	var b=function(){
		this.conf={
			url:null,
			type:'get',
			data:{},
			success:function(){},
			error:function(){}
			};
		this.result=null;
		this.xmlHttp=null;
		};
	var c=function(opt){
		var d=new b();
		d.extend(opt,d.conf);
		d.conf.type=d.conf.type.toUpperCase();
		d.ajax();
		return d;
		};
	b.prototype={
		//创建xmlHttp对象
		createXMLHttpRequest : function () {
			if (window.ActiveXObject) {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} else if (window.XMLHttpRequest) {
				return new XMLHttpRequest();
			}
		},
		/*发送请求
		@param re_mod请求的方法
		@param re_file请求的文件
		@param re_param请求的参数，用，号分隔开如：（“1，2，3，”）
		@param callfun回调函数  这里最好直接用一个匿名函数来代替如：function(){}
		 */
		ajax : function () {
			this.xmlHttp = this.createXMLHttpRequest();
			var _t = this; //把本对象赋值给一个变量是为啦兼容ie因为this对象在不同的浏览器中有不同的解释
			var _c=_t.conf;
			_t.xmlHttp.onreadystatechange = function () {
				if (_t.xmlHttp.readyState == 4) {
					_t.result = _t.xmlHttp.responseText
						if (_t.xmlHttp.status == 200 || _t.xmlHttp.status == 500) {
							_c.success(_t.result);
						} else {
							_c.error(_t.xmlHttp);
						}				
				}
			};
			var par=null;
			var url=_c.url;
			for(var name in _c.data){
				(par===null)||(par=par+"&"+name+"="+_c.data[name]);
				(par===null)&&(par=name+"="+_c.data[name]);
				}
			
			if(_c.type=='POST'){
					_t.xmlHttp.open(_c.type,url, true);
					_t.xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				}else{
					var str=url.split('?');
					str[1]?(url=url+"&"+par):(url=url+"?"+par);
					_t.xmlHttp.open(_c.type,url, true);
				}
			
			_t.xmlHttp.send(par);
			  
			
		},
		/**实现功能扩展**/
		extend:function() {
			var arg0=arguments[0]||{};
			var target=arguments[1]||this;
			for(var name in arg0){
				target[name]=arg0[name];
				}
			return target;	
		},
	};
	a.simpleAjax = c;
})(window);

function $sel(id){
	return document.getElementById(id);
	}
var  bw = chrome.extension.getBackgroundPage();

window.onload=function(){
var url;
var hostname='';

chrome.windows.getCurrent(function(window) {
chrome.tabs.getSelected(window.id,function(tab) {
hostname=tab.url.toLowerCase().replace("http://", "").replace("https://", "").split('/')[0];

//查询百度网站收录情况
simpleAjax({ 
			url:"https://www.baidu.com/s?wd=site%3A"+hostname,
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
	$sel('sl-baidu').innerHTML='<a href="http://'+"https://www.baidu.com/s?wd=site%3A"+hostname+'" title="百度收录" target="_blank">'+arr[1]+'</a>';	
				}
});

//查询域名时间
var uri="http://tool.chinaz.com/DomainDel/?wd="+hostname;
simpleAjax({
	url:uri,
	type:'POST',
	success: function(da){
		console.log(da);
			var re1=/创建时间[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var re2=/到期时间[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var re3=/删除时间[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})/g;
			var arr1=re1.exec(da);
			var arr2=re2.exec(da);
			var arr3=re3.exec(da);
			var str='<a target="_blank" href="'+uri+'">没有记录</a>';
			if(arr1!==null){
			str='<a target="_blank" title="注册时间" href="'+uri+'">'+arr1[1]+'</a>';
			str+='<a target="_blank" title="更新时间" href="'+uri+'">'+arr2[1]+'</a>';
			str+='<a target="_blank" title="删除时间" href="'+uri+'">'+arr3[1]+'</a>';
			}
		
		$sel('sl-domain').innerHTML=str;			
		},
	error:function(da){
		$sel('sl-domain').innerHTML='请求超时';
		}
	
	});
//结束
});
});


};