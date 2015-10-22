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

window.$sel=function(id){
	return document.getElementById(id);
	}