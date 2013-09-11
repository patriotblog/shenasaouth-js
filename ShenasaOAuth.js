var SHENASA_ADDR = 'https://accounts.shenasaservice.com/';
var SHENASA_API = 'https://api.shenasaservice.com/';
var sso_window;
var shenasa_access_token;
function ShenasaLoginAction(){
	var uri = SHENASA_ADDR+"oauth2/auth?client_id="+shenasa_client_id+"&response_type=token&redirect_uri="+encodeURIComponent(shenasa_redirect_uri)+"&scope=email";
	sso_window = window.open(uri,'_blank');
	ShenasaCheckSuccess();
}
function ShenasaCheckSuccess(){
	hash = sso_window.location.hash;
	if(hash){
		sso_window.close();
		shenasa_access_token = hash.substr(7);
		ShenasaValidateToken();
	}else{
		setTimeout(function(){
			ShenasaCheckSuccess();
		}, 1000);
	}
}
function ShenasaValidateToken(){
	uri = SHENASA_API+"oauth2/tokeninfo?client_secret="+shenasa_client_secret+"&access_token="+shenasa_access_token;
	SSOAJAX(uri, "GET", 'ShenasaValidateTokenRespons');
}
function ShenasaValidateTokenRespons(res){
	if(res.status=='success' && res.expires_in>2*60){
		ShenasaGetuserInfo();
	}else{
		alert('access_token expired');
	}
}
function ShenasaGetuserInfo(){
	uri = SHENASA_API+"oauth2/userinfo?access_token="+shenasa_access_token;
	SSOAJAX(uri, "GET", 'ShenasaValidateuserData');
}
function ShenasaValidateuserData(data){
	shenasa_afterlogin_function(data);
}
function SSOAJAX(uri, method, return_function){
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200){
			eval(return_function+"("+xmlhttp.responseText+")");
	  }else{
      }
	}
	xmlhttp.open(method,uri,true);
	xmlhttp.send();
}
function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}
function getCookie(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1)
	  {
	  c_start = c_value.indexOf(c_name + "=");
	  }
	if (c_start == -1)
	  {
	  c_value = null;
	  }
	else
	  {
	  c_start = c_value.indexOf("=", c_start) + 1;
	  var c_end = c_value.indexOf(";", c_start);
	  if (c_end == -1)
	  {
	c_end = c_value.length;
	}
	c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}
