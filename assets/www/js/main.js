var onDeviceReady = function() {
    //navigator.notification.alert("CordovaReady", null, "Debug", "ok");
    
    if (!checkConnection) {
    	navigator.notification.alert("This appliction required to use internet connection", null, "Error", "Ok");
    }else{
    	if (window.localStorage.getItem("owngpsloc") !== "1"){
    		var message = "Locating your current location. Do you allow for this app to get your current location?";
        	var title = "Geolocating Usage";
        	navigator.notification.confirm(message, confirmGPSCallback, title, "Ok,Cancel");
    	} else{
    		getlocation();
    	}
    	
    }
    defaultvariable();
};
var confirmCallback = function (button) {
    if(button===1){
        navigator.app.exitApp();
    }
};
var confirmGPSCallback = function (button) {
	if(button===1){
		getlocation();
	}
};

var getlocation= function (){
	window.localStorage.setItem("owngpsloc", '1');
	var onSuccess = function(position) {
		 
		 window.localStorage.setItem("latitude", position.coords.latitude);
		 window.localStorage.setItem("longitude", position.coords.longitude);
		 navigator.notification.alert("Sucess get gps", null, "Error", "Ok");
    };
    
    //onError Callback receives a PositionError object
    //
    function onError(error) {
       //navigator.notification.alert("Failed to retrive your location. Turn on gps location service", 'Alert', 'Alert');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, timeout: 50000, enableHighAccuracy: true });
};

function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
    document.addEventListener("backbutton", function(e) {
        if($.mobile.activePage.is('#main-page')){
            e.preventDefault();
            navigator.notification.confirm("Are you want to exit app?", confirmCallback, "Exit", "OK,Cancel");
        }else {
            navigator.app.backHistory();
        }
     }, false);
} 

function checkConnection() {
    var networkState = navigator.network.connection.type;
    var return_value = true;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    //alert('Connection type: ' + states[networkState]);
    if (states[networkState] === 'No network connection' || states[networkState] === 'Unknown connection' ) {
        return_value = false;
    }else{
    	//window.plugins.statusBarNotification.notify("Halal Square", "Latest update avaliable please download latest update");
    }
    return return_value;
}

function defaultvariable() {
	if (window.localStorage.getItem("default") !== "1"){
		window.localStorage.setItem("default",'1');
		window.localStorage.setItem("name",'nameless');
		window.localStorage.setItem("handphone",'');
		window.localStorage.setItem("username",'asdasdasdsa');
		window.localStorage.setItem("password",'');
	}else {
		
	}
	
}

$( document ).on("pageshow", "#user-page", function() {
	$("#name_id_txt").val(window.localStorage.getItem("name"));
	$("#hp_id_txt").val(window.localStorage.getItem("handphone"));
	$("#username_id_txt").val(window.localStorage.getItem("username"));
	$("#password_id_txt").val(window.localStorage.getItem("password"));
});

$( document ).on("pageinit", "#teamcreate-page", function() {
	$.post("http://www.ziadahlan.com/futsal/api_feed/list_state", {}, function(res) {
        if(res["states"]) {
        	
        	var xy,yz = "";
        	
        	for (var x in res["states"]){
        		//alert("State Error: " + JSON.stringify(res["states"], null, 4));
        		yz = res["states"][x]["state_code"];
        		xy += '<option onclick="call_district(&quot;'+yz+'&quot;)" value="'+ yz + '" >' + res["states"][x]["state_name"] + ' </option>';
        		
        	}
        	$( "#state_list" ).html(xy);
        	
        } else {
        	alert("Your states failed. " + res["reason"]);
        } 
    }).error(function (e) {
        alert("State Error: " + JSON.stringify(e, null, 4));
    });
});

var call_district = function(state){
	alert(state);
	$.post("http://www.ziadahlan.com/futsal/api_feed/list_district", {state:state}, function(res) {
        if(res["districts"]) {
        	
        	var xy = "";
        	for (var x in res["districts"]){
        		//alert("State Error: " + JSON.stringify(res["states"], null, 4));
        		xy += '<option value="'+ res["districts"][x]["district_id"] + '" >' + res["districts"][x]["district_name"] + ' </option>';
        	}
        	$( "#state_list" ).html(xy);
        	
        } else {
        	alert("Your states failed. " + res["reason"]);
        } 
    }).error(function (e) {
        alert("State Error: " + JSON.stringify(e, null, 4));
    });
};
var save_profile = function (){
	window.localStorage.setItem("name",$("#name_id_txt").val());
	window.localStorage.setItem("handphone",$("#hp_id_txt").val());
	window.localStorage.setItem("username",$("#username_id_txt").val());
	window.localStorage.setItem("password",$("#password_id_txt").val());
	handleSignin();
};

function handleSignin() {

    var name_txt = window.localStorage.getItem("name");
    var username_txt = window.localStorage.getItem("username");
    var password_txt = window.localStorage.getItem("password");
    var hp_txt = window.localStorage.getItem("handphone");
	$.post("http://www.ziadahlan.com/futsal/api_feed/member_signin", {name_txt:name_txt, username_txt:username_txt, password_txt:password_txt,hp_txt:hp_txt}, function(res) {
        //alert(res["loginstatus"]);
        //alert(JSON.stringify(res, null, 4));
        if(res["signinstatus"]) {
        	alert("Your signin success.");
            window.location="#main-page";
        } else {
        	alert("Your signin failed. " + res["reason"]);
        } 
    }).error(function (e) {
        alert("Signin Error: " + JSON.stringify(e, null, 4));
    });
    return false;
}

function handleLogin() {
	if (window.localStorage.getItem("login_session") === undefined ){
		window.localStorage.setItem("login_session",'0');
	}
	
	if ( $("#login_panel").text() === "Login" ){
		var username_txt = window.localStorage.getItem("username");
	    var password_txt = window.localStorage.getItem("password");
		$.post("http://www.ziadahlan.com/futsal/api_feed/login", {username_txt:username_txt, password_txt:password_txt}, function(res) {
	        //alert(JSON.stringify(res, null, 4));
	        if(res["loginstatus"]) {
	        	alert("Your login success.");
	        	window.localStorage.setItem("login_session",'1');
	            window.location="#main-page";
	            $("#login_panel").text('Logout');
	        } else {
	        	alert("Your login failed. " + res["reason"]);
	        	window.localStorage.setItem("login_session",'0');
	        } 
	    }).error(function (e) {
	        alert("Signin Error: " + JSON.stringify(e, null, 4));
	    });
	}else{
		alert("Your logout success.");
    	window.localStorage.setItem("login_session",'0');
        window.location="#main-page";
        $("#login_panel").text('Login');
	}
    
    return false;
}
