var bw = chrome.extension.getBackgroundPage();
var surl;
var url;
var hname = '';
var nullstr='<b style="color:#f00;">无</b>';
window.onload = function() {
	chrome.windows.getCurrent(function(window) {
		chrome.tabs.getSelected(window.id, function(tab) {
			surl = tab.url;
			hname = tab.url.toLowerCase().replace("http://", "").replace("https://", "").replace('www.', '').split('/')[0];
			if (!hname) {
				$sel('wrap-content').innerHTML = '域名无效';
				return;
			}
			if (!(/(.*?\.)+\w/i.test(hname))) {
				$sel('wrap-content').innerHTML = '域名无效';
				return;
			}
			runCheck();
		});
	});
};
//回调对象函数
window.callobj = {
	sl_tdomain: function(arr) {
		if (arr) {
			var url = 'http://beian.links.cn/' + arr[4];
			simpleAjax({
				url: url,
				type: 'POST',
				data: {
					s: hname
				},
				success: function(da) {
					var re = /(<table cellpadding\=1[\s\S]*?>[\s\S]*?<\/table>)/g;
					var arr = re.exec(da);
					var str = '没有网站';
					if (arr != null) {
						str = arr[1];
					}
					str = str.replace(/(bgcolor\=\".*?\")|(style\=\".*?\")|(width\=940)/g, '');
					str = str.replace(/<a(.*?)(href\=[\'|\"])(.*?)([\'|\"].*?>)/ig, '<a target="_blank" $1$2http://beian.links.cn/$3$4');
					str =str.replace(/color\=[\'|\"]?red[\'|\"]?/ig,'');
					$sel('auto_sl_tdomain').innerHTML = str;
				},
				error: function() {
					$sel('auto_sl_tdomain').innerHTML ='<a href="javascript:;">'+nullstr+'</a>' ;
				}
			});
		} else {
			$sel('auto_sl_tdomain').innerHTML = '<a href="javascript:;">'+nullstr+'</a>';
		}
	}
};
/**字段格式
 *sl_baidu: {id名字	
 *		title: '百度收录',												//标题	
 *		url: 'https://www.baidu.com/s?wd=site%3A[hostname]',			//请求数据的url	
 *		regex: /该网站共有[\s\S]*?>(.+?)<[\s\S]*?个网页|找到相关结果数约([\,\d]+?)个/g,//查询数据的正则	
 *		index: {														//正则出结果的数组索引
 *					1: '百度收录'
 *				},
 *		regex_replace://,												//对结果进行正则替换
 *	    atag:false,														//是否需要a标签包裹默认true
 *		callback:function(){},											//调用自定义回调函数再次查询
 *		nothing:true													//只是添加标签什么事情也不做
 *	},
 */

var checkdata = {
	sl_baidu: {
		title: '百度收录',
		url: 'https://www.baidu.com/s?wd=site%3A[hostname]',
		regex: /该网站共有[\s\S]*?>(.+?)<[\s\S]*?个网页|找到相关结果数约([\,\d]+?)个/g,
		index: {
			1: '百度收录'
		}
	},
	sl_haosou: {
		title: '好搜流量',
		url: "http://www.haosou.com/s?q=site%3A[hostname]",
		regex: /找到相关结果数?约([\,\d]+?)个/g,
		index: {
			1: '预计流量'
		}
	},
	sl_sougou: {
		title: '搜狗收录',
		url: 'http://www.sogou.com/web?query=site%3A[hostname]',
		regex: /找到约([\s\S]+?)条结果/g,
		index: {
			1: '搜狗收录'
		}
	},
	sl_qucha: {
		title: '去查流量',
		url: "http://www.7c.com/baidu/[hostname]/",
		regex: /预计百度大概给该网站的流量为([\s\S]*?)<\/td>/g,
		index: {
			1: '预计流量'
		}
	},
	sl_anzhan: {
		title: '爱站流量',
		url: "http://baidurank.aizhan.com/baidu/[hostname]/",
		regex: /预计来路[\s\S]*?<[\s\S]*?>([\s\S]*?)<[\s\S]*?>[\s\S]*?IP/,
		index: {
			1: '预计流量'
		}
	},
	sl_zhanzhang: {
		title: '站长流量',
		url: "http://mytool.chinaz.com/baidusort.aspx?host=[hostname]",
		regex: /<div class\=\"siteinfo\">[\s\S]*?(\d+)[\s\S]*?(\d+)[\s\S]*?(\d+)[\s\S]*?(\d+)[\s\S]*?<\/div>/i,
		index: {
			1: '百度权重',
			2: '关键词',
			3: '预估百度流量',
			4: '站长排名'
		}
	},
	sl_domain: {
		title: '域名时间',
		url: 'http://tool.chinaz.com/DomainDel/?wd=[hostname]',
		regex: /创建时间<\/td>[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})[\s\S]*?到期时间<\/td>[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})[\s\S]*?删除时间<\/td>[\s\S]*?(\d{2,4}\-\d{1,2}\-\d{1,2})[\s\S]*?删除倒计时[\s\S]*?(\d+?)天/g,
		index: {
			1: '创建时间',
			2: '到期时间',
			3: '删除时间',
			4: '删除倒计时'
		}
	},
	sl_beian: {
		title: '域名备案',
		url: 'http://beian.links.cn/domain_[hostname].html',
		regex: /网站备案信息如下[\s\S]*?主办单位名称：[\s\S]*?<a.*?href\=\"(.*?)\">([\s\S]*?)<\/a>[\s\S]*?主办单位性质：([\s\S]*?)<br>[\s\S]*?网站备案\/许可证号：[\s\S]*?<a href\=\"(.*?)\">([\s\S]*?)<\/a>[\s\S]*?网站名称：[\s\S]*?<a href\=\"(.*?)\">([\s\S]*?)<\/a>[\s\S]*?审核时间：(\d{4}\/\d{1,2}\/\d{1,2})[\s\S]*?<\/table>/ig,
		index: {
			3: '主办单位性质',
			5: '网站备案/许可证号',
			7: '网站名称',
			8: '审核通过日期'
		},
		callback:callobj.sl_tdomain
	},

	sl_server: {
		title: '服务器',
		url: "http://www.ip138.com/ips138.asp?ip=[hostname]",
		regex: /<font color="blue"[\s\S]*?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\s\S]*?<\/font>[\s\S]*?本站主数据：(.+?)</,
		index: {
			1: '服务器IP',
			2: '服务器地址'
		}
	},

	sl_sameip: {
		title: '同IP网站',
		url: "http://s.tool.chinaz.com/same?s=[hostname]",
		regex: /<div id\="contenthtml\">([\s\S]*?)<\/div>/g,
		index: {
			1: '同一个ip的网站'
		},
		regex_replace: /<span>.*?<\/span>/g
	},
	sl_sameip: {
		title: '同IP网站',
		url: "http://s.tool.chinaz.com/same?s=[hostname]",
		regex: /<div id\="contenthtml\">([\s\S]*?)<\/div>/g,
		index: {
			1: '同一个ip的网站'
		},
		regex_replace: /<span>.*?<\/span>/g,
		atag: false
	},
	sl_tdomain: {
		title: '其它域名',
		nothing:true
	},
};

window.runCheck = function() {
	for (var i in checkdata) {
		var htmlstr = '<dl><dt>' + checkdata[i]['title'] + '</dt><dd><span class="cl" id="auto_' + i + '"><i class="loadimg"></i></span></dd></dl>';
		var strs = $sel('wrap-content');
		strs.innerHTML += htmlstr;
		
		if(checkdata[i]['nothing']===true){
			continue;
		}
		
		(function() {
			var strid = i;
			var reg = checkdata[i]['regex'];
			var regex_replace = checkdata[i]['regex_replace'];
			var index = checkdata[i]['index'];
			var atag = checkdata[i]['atag'];
			var uri = checkdata[i]['url'].replace('[hostname]', hname);
			simpleAjax({
				url: uri,
				type: 'get',
				success: function(da) {
					var arr = reg.exec(da);
					var str = '';



					for (var a in index) {
						var tit = index[a];
						var val = nullstr;
						try {
							val = arr[a].replace(/\s+/,'');
							checkdata[strid]['data']||(checkdata[strid]['data']=new Array());
							checkdata[strid]['data'][a] = arr[a];

							//是否进行正则处理
							if (regex_replace) {
								val = val.replace(regex_replace, '');
							} else {
								val = val.replace(/<.*?>/, '');
							}

						} catch (e) {
							//console.log(e);
						}
												//是否需要a标签包括
						if (atag === false) {
							str += val;
						} else {
							str += '<a target="_blank" href="' + uri + '" title="' + tit + '" target="_blank">' + val + '</a>';
						}
					}
					//调用回调函数
					if(typeof(checkdata[strid]['callback']) === 'function'){
						checkdata[strid]['callback'](arr);
					}
					$sel('auto_' + strid).innerHTML = str;
				}
			});
		})();
	};

};