// ==UserScript==
// @name         Cleaner API
// @namespace    http://tampermonkey.net/
// @version      1.2.85
// @updateURL    https://github.com/Vector-98/CleanAPI/raw/master/Cleaner%20API.user.js
// @downloadURL  https://github.com/Vector-98/CleanAPI/raw/master/Cleaner%20API.user.js
// @description  try to make things better for everyone
// @author       Vector, Dylon L, Kevin B
// @match        https://fireflycomputers.com/api-sro/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// @require 	 https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/barcodes/JsBarcode.code39.min.js
// @require		 https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.js
// @resource	 https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.css
// @grant		 GM_addStyle
// @grant		 GM_cookie
// @grant		 GM.getResourceUrl
/* globals jQuery, $, waitForKeyElements, JsBarcode */
// ==/UserScript==

var $ = window.jQuery;
var preferencesEnabled = false;
var techName;
var RunSave = false;
(function() {
	'use strict';
	var autoHideDoneLines = getCookie("autoHideDoneLines");
	var CheckEm = getCookie("CheckEm");
	var Checked = getCookie('Checked');

	$(".flex_layout_row.layout_2_across.bgnone.bottom-call-action.container_widewidth").hide()
	$(".footer").hide()
	$("#masthead").hide()
	document.getElementById("sro-submit").value="Load SRO";
	//var multisel = GM.getResourceUrl('https://unpkg.com/multiple-select@1.5.2/dist/multiple-select.min.css')


	$("#get-item").focusout(function() {
		AutoSro();
	});
	$("#get-item").submit(function() {
		AutoSro();
	});
	function AutoSro() {
		var SroLength = $("#sro-number").val().length
		var SroNum = $("#sro-number").val()

		if(SroLength == 1) {
			var Pre1 = "SRO000000"
			$("#sro-number").val(Pre1+$("#sro-number").val())
		}//end of IF
		if(SroLength == 2) {
			var Pre2 = "SRO00000"
			$("#sro-number").val(Pre2+$("#sro-number").val())
		}//end of IF
		if(SroLength == 3) {
			var Pre3 = "SRO0000"
			$("#sro-number").val(Pre3+$("#sro-number").val())
		}//end of IF
		if(SroLength == 4) {
			var Pre4 = "SRO000"
			$("#sro-number").val(Pre4+$("#sro-number").val())
		}//end of IF
		if(SroLength == 5) {
			var Pre5 = "SRO00"
			$("#sro-number").val(Pre5+$("#sro-number").val())
		}//end of IF
		if(SroLength == 6) {
			var Pre6 = "SRO0"
			$("#sro-number").val(Pre6+$("#sro-number").val())
		}//end of IF
	};

	if(getCookie("techName") == "null" || getCookie("techName") == ""){
		setTechName("");
	}
	if(getCookie("autoHideDoneLines") == "null" || getCookie("autoHideDoneLines") == ""){
		setAutoHideDoneLines("no");
	}
	if(getCookie("CheckEm") == "null" || getCookie("CheckEm") == ""){
		CheckEm("no");
	}

	$("#main").prepend('<button type="button" class="glob" id="preferences" style= "background-color: white;position: absolute;top: 0px;right: 0px;margin: 10px;" >Preferences</button>');

	$('#preferences').click(function(){
		if(preferencesEnabled){
			var techName = prompt("Tech name:", getCookie("techName"));
			setTechName(techName);

			var autoHideRTS = prompt("(Experimental feature) - Auto hide done lines? (yes or no):", getCookie("autoHideDoneLines"));
			setAutoHideDoneLines(autoHideRTS);

			var CheckEm = prompt("(Experimental feature) - Generate Checksum of page? (yes or no):", getCookie("CheckEm"));
			setCheckEm(CheckEm);
		}
	})

	function setAutoHideDoneLines(autoHideRTS) {
		var CookieDate = new Date;
		CookieDate.setFullYear(CookieDate.getFullYear() + 1);
		var cookieName = "autoHideDoneLines=" + autoHideRTS + "; expires=" + CookieDate.toUTCString() + ";";
		// alert("autoHideDoneLines:\n\n" + cookieName); // Debugging
		document.cookie = cookieName;
		if((autoHideRTS.toLowerCase() == "yes") || (autoHideRTS.toLowerCase() == "y")){
			autoHideDoneLines = true;
		} else {
			autoHideDoneLines = false;
		}
	}
	function setTechName(techName) {
		var CookieDate = new Date;
		CookieDate.setFullYear(CookieDate.getFullYear() + 1);
		var cookieName = "techName=" + techName + "; expires=" + CookieDate.toUTCString() + ";";
		// alert("techName:\n\n" + cookieName); // Debugging
		document.cookie = cookieName;
	}
	function setCheckEm(CheckEm) {
		var CookieDate = new Date;
		CookieDate.setFullYear(CookieDate.getFullYear() + 1);
		var cookieName = "CheckEm=" + CheckEm + "; expires=" + CookieDate.toUTCString() + ";";
		document.cookie = cookieName;
		if((CheckEm.toLowerCase() == "yes") || (CheckEm.toLowerCase() == "y")){
			CheckEm = true;
		} else {
			CheckEm = false;
		}
	}
	function setChecked(Checked) {
		String.prototype.hashCode = function(){
			var hash = 0, i, char;
			if (this.length == 0) return hash;
			for (i = 0; i < this.length; i++) {
				char = this.charCodeAt(i);
				hash = ((hash<<5)-hash)+char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash;
		};
		var CookieDate = new Date;
		CookieDate.setFullYear(CookieDate.getFullYear() + 1);
		var cookieName = "Checked" + Checked + "; expires=" + CookieDate.toUTCString() + ";";
		document.cookie = cookieName;
		Checked = $("#full-container").prop('outerHTML').hashCode();
	}
	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}


	waitForKeyElements("body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable", function () {
		if (RunSave) {
			console.log("SN and Warr save enabled")
		}else{
			$("body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable").remove()
			$("body > div.ui-widget-overlay.ui-front").remove()
			console.log(RunSave+" wait else")
			console.log("SN and Warr save disabled")
		}
	});/// Removes the "Are you sure you want to change the serial number?" pop up because its kinda a pain to deal with atm

	waitForKeyElements("#full-container", function () {
		$("[id^=snumber-]").css({"width": "112%","float":"left"}) // serial number width fix
		$("[id^=warranty-]").css({"width": "123%","float":"left"}) // Warranty width fix
		$("[id^=customer]").css({"width": "145%","float":"left"}) // Customer width fix

		preferencesEnabled = true;

		if($("#sro-number").val().includes(420)){
			$("body").append('<iframe width="1" height="1" wmode="transparent" src="https:\/\/www.youtube.com\/embed\/y6120QOlsfU?controls=0&amp;start=30&autoplay=1&mute=0" frameborder="0" allow="autoplay"></iframe>');

		}else if($("#sro-number").val().includes(69)){
			$("body").append('<iframe width="1" height="1" wmode="transparent" src="https:\/\/www.youtube.com\/embed\/y6120QOlsfU?controls=0&amp;start=30&autoplay=1&mute=0" frameborder="0" allow="autoplay"></iframe>');

		}

		//$("#full-container").append('<input id="item-submit" class="btn btn-success" type="submit" name="save_items" value="Submit">')

		//Begin adding show/hide for each line
		var stateOfButtons = [];//stores state of buttons. false for shown true for hidden
		var numberOfButtons = 0;
		var createdButtons = 0;
		var AllLines2DArray = []; //Stores array of line number and upperline index.
		var currentUpperLine = 2;
		var jumpMenu = ("<ul style='list-style-type:none;position:fixed;left:0px;top:100px;padding-left: 5px;' id='jumpMenu'></ul>");
		$("#full-container").append(jumpMenu);
		var SroNum = $("#sro-number").val()
		$('title').text(SroNum);

		for(var m = 1; m <= 25; m++){
			if(!$("#snumber-" + m).val() == ""){//check if line exist
				AllLines2DArray.push([m,currentUpperLine]);
				currentUpperLine += 2;
				//console.log(AllLines2DArray)
			}

		}// part of 2d array for line numbers

		function toggle(value){//class to flip value
			if (stateOfButtons[value]){
				stateOfButtons[value] = false;
			}else{
				stateOfButtons[value] = true;

			}
		};

		for (var n = 25; n > 0; n--) {//Create button for each line
			if(!$("#snumber-" + n).val() == ""){
				var label = "Line " + n;
				var done = "";
				var butt = $("#full-container").prepend('<button type="button" class="glob" id="insert" onload="document.innerHTML(label)" style="background-color: white; border-radius: 8px; margin-top: 4px; margin-right: 4px; line-height: normal;" > </button>')
				document.getElementById("insert").innerHTML = label;
				$("#insert").attr("id", "butt-" + n);// +"-"+CBI
				stateOfButtons.push(false);
				numberOfButtons++;
				createdButtons++;
				var l4label;

				if($("#snumber-" + n).val().length <= 11){// For LEN/HP
					l4label = $('#snumber-' + n).val().slice(-4);
				}else if($("#snumber-" + n).val().length == 15){// for ASUS CBK
					l4label = $('#snumber-' + n).val().slice(-4);
				}else{
					l4label = $('#snumber-' + n).val().slice(14,18); // for ACER
				}

				var l4SN = $("<small id='Last4' onload='document.innerHTML(l4label)' style='display: block; line-height: normal;'> </small>").appendTo("#butt-"+ n)// +"-"+ CBI
				document.getElementById("Last4").innerHTML = ("SN: ")+l4label;
				$("#Last4").attr("id", "Last4-L" + n);

				// jump menu trash
				var repairBoxName = "#repair-completed-" + n;
				var diagBoxName = "#diagnosed-" + n;
				if($(repairBoxName).is(":checked")){
                   			done = " Done";
                		}
				else if($(diagBoxName).is(":checked")){
                   			done = " Diag";
            		        }
                		label = "Line " + n + done;
				let jumpLinks = ('<li><a id="placeholder">' + label + '</a></li>');
				let jumpLinkID = "jumpLink"+(n+1);
				$("#placeholder").attr("id",jumpLinkID);
				$("#"+jumpLinkID).attr("href","#paid-" + (n+1));
				$("#jumpMenu").prepend(jumpLinks);
			}

		};//Create button for each line and add last 4 of SN
		/* 		for (var sn = 25; sn > 0; sn--) {
			if(!$("#snumber-" + sn).val() == ""){
				var SNlabel = "Enable Pop-up";
				var SNbtn = $('<button type="button" class="savebtn" id="insert1" onload="document.innerHTML(SNlabel)" style="background-color: white; border-radius: 8px; margin-top: -5px;width: 110%;"></button>').insertAfter("#snumber-" + sn)
				document.getElementById("insert1").innerHTML = SNlabel;
				$("#insert1").attr("id", "SN-" + sn);
			}
		};//Create Save button for each line */
		for (var di = 25; di > 0; di--) {
			if($("#diagnosed-by-" + di).prop("type") == "text"){
				var DIlabel = "Fill Diag Name";
				var DIbtn = $('<button type="button" class="diagbtn" id="DIinsert" onload="document.innerHTML(DIlabel)" style="background-color: white; border-radius: 8px; /*margin-top: -5px;*/"></button>').insertBefore("#diagnosed-by-" + di)
				document.getElementById("DIinsert").innerHTML = DIlabel;
				$("#DIinsert").attr("id", "DI-" + di);
				console.log("diag name fill made")
			}
		};//Create Diag button for each line
		for (var tn = 25; tn > 0; tn--) {
			if($("#tech-name-" + tn).prop("type") == "text"){
				var TNlabel = "Fill Tech Name";
				var TNbtn = $('<button type="button" class="techbtn" id="TNinsert" onload="document.innerHTML(TNlabel)" style="background-color: white; border-radius: 8px; /*margin-top: -5px;*/"></button>').insertBefore("#tech-name-" + tn)
				document.getElementById("TNinsert").innerHTML = TNlabel;
				$("#TNinsert").attr("id", "TN-" + tn);
				console.log("tech name fill made")
			}
		};//Create Tech button for each line

		/* 		$("[id^=SN-]").on('click', function(){
			RunSave = !RunSave
			console.log(RunSave)
		});
		$("[id^=SN-]").on("click", function(){
			if(RunSave){
				$("[id^=SN-]").text("Disable Pop-up")
				$("[id^=SN-]").css("background-color","28a745")
			}else{
				$("[id^=SN-]").text("Enable Pop-up")
				$("[id^=SN-]").css("background-color","white")
			}
		}); */
		$("[id^=DI-]").on('click', function(){
			if($("[id^=diagnosed-by-]").is(':disabled') === true){
				console.log("Stoped name fill ")
			}else{
				$(this).next("input").focus();
				$(this).next("input").attr("value", getCookie("techName")) // canges html value
				$(this).next("input").val(getCookie("techName")) // updates the text in box
				$(this).next("input").blur()// should make sure it saves
			}

		});//name insert function for Diag Name
		$("[id^=TN-]").on('click', function(){
			if($("[id^=tech-name-]").is(':disabled') === true){
				console.log("Stoped name fill ")
			}else{
				$(this).next("input").focus();
				$(this).next("input").attr("value", getCookie("techName")) // canges html value
				$(this).next("input").val(getCookie("techName")) // updates the text in box
				$(this).next("input").blur()// should make sure it saves
			}
		});//name insert function for Tech Name

		let jumpLinks = ('<li><a id="placeholder"></a></li>');
		let jumpLinkID = "jumpLink"+(1);
		$("#placeholder").attr("id",jumpLinkID);
		$("#"+jumpLinkID).attr("href","#paid-" + (1));
		$("#jumpMenu").prepend(jumpLinks);

		$.fn.single_double_click = function(single_click_callback, double_click_callback, timeout) {//function to add double click functionality
			return this.each(function(){
				var clicks = 0, self = this;
				jQuery(this).click(function(event){
					clicks++;
					if (clicks == 1) {
						setTimeout(function(){
							if(clicks == 1) {
								single_click_callback.call(self, event);
							} else {
								double_click_callback.call(self, event);
							}
							clicks = 0;
						}, timeout || 200);
					}
				});
			});
		}

		function hideAll(){
			for(var i = 1; i < 26; i++){
				if(!stateOfButtons[i]){
					singleClick(i);
					toggle[i];
				}
			}
		};//end of hideAll function
		function showAll(){
			for(var i = 1; i < 26; i++){
				if(stateOfButtons[i]){
					singleClick(i);
					toggle[i];
				}
			}
		};
		function singleClick(buttonNumber){
			var buttonName = "#butt-" + buttonNumber;
			var buttonNameOn = "#butt-" + buttonNumber + ".on";
			var buttonNameNotOn = "#butt-" + buttonNumber + "[class='glob']"; //[class!='on']
			var upperLine;
			var currElement;

			for(var q = 0; q < AllLines2DArray.length; q++){
				currElement = AllLines2DArray[q];
				if(currElement[0] == buttonNumber){
					upperLine = currElement[1];
				}
			}
			$(buttonName).toggleClass("on")
			$(buttonNameOn).css("background-color",getRandomColor());	// Random colors - Aka last commit by Tony ;)
			// $(buttonNameOn).css("background-color","#28a745");	// Green - Aka last commit by Dylon ;)
			//$(buttonNameOn).css("background-color","#FA4D1C");	// FireFly Orange - Aka last commit by Kevin ;)
			$(buttonNameNotOn).css("background-color","white");
			$("#full-container > div:eq("+upperLine+")").toggle(125,"linear")
			$("#full-container > div:eq("+(upperLine + 1)+")").toggle(125,"linear")
			toggle(buttonNumber);
			function getRandomColor() {
				var letters = '789ABCD';// 0123456EF cut letters for more light colors
				var color = '#';
				for (var i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 6)];//16
				}
				return color;
			}
			function setRandomColor() {
				$(buttonName).css("background-color", getRandomColor());
			}
		};
		function doubleClick(buttonNumber){
			var count = 0;
			$('title').text(SroNum.slice(5) + " - Line " + buttonNumber);
			for(var i = 0; i < 25; i++){
				if(stateOfButtons[i]){
					$('title').text(SroNum + " - Line " + buttonNumber);
					count++;
				}
			}
			if(count > 1){
				if(!stateOfButtons[buttonNumber]){
					showAll();
				}
			}else{
				hideAll();
				singleClick(buttonNumber);
			}
			if(numberOfButtons == count){
				showAll();//TESTING
			}
			if(stateOfButtons[buttonNumber]){
				hideAll();
				singleClick(buttonNumber);
			}
		};

		var rawbutt = $("[id^=butt-]").click(function() {
			rawbutt = this.id;
		});	//  create var for btn selectors
		var linebtn = $("[id^=butt-]").click(function() {
			linebtn = this.id;
			linebtn = linebtn.replace("butt-", "");
		});	//	create var raw number for btn selectors
		$(rawbutt).single_double_click(function() {
			singleClick(linebtn);
		}, function (){
			doubleClick(linebtn);
		});	// handles the btn clicks

		waitForKeyElements("h1", function () {
			$("h1").hide()
		}); // remove bottom of page footer
		waitForKeyElements("h6", function(){
			$("h6").remove()
		}) // removes ....... from save box

		$(function() {
			$("textarea").on("keyup", function(event) {
				var value = $(this).val();
				if (value.indexOf("'") != -1) {
					$(this).val(value.replace(/\'/g, ""));
				}
			})
			$("input").on("keyup", function(event) {
				var value = $(this).val();
				if (value.indexOf("'") != -1) {
					$(this).val(value.replace(/\'/g, ""));
				}
			})
		})// revoves ' from testareas and inputs as you type



		$("body > div.navbar-brand > a").removeAttr("href");
		$('body > div.navbar-brand > a > img').removeAttr("alt");
		//$("#bottom-item-wrap > div.col-md-12").append(box)
		//$('#bottom-item-wrap > div.col-md-12 > div > label').append(chkdrp)
		//$('#bottom-item-wrap > div.col-md-12').append(btndrp)



		//_______________________________________________________________________________________________________________________________________________________________________________________
		$("#full-container").prepend('<div id="EXP"> <button type="button" class="glob" id="copy" style="background-color: white; border-radius: 8px" >Export</button> </div>') //Add export button
		$("#EXP").append('<button type="button" class="glob" id="PrintBtn" style="background-color: white; border-radius: 8px" >Print</button>') //Add print BTN

		function fixWarranty(warranty){
			switch(warranty) {
				case "PAID":
				case "Paid":
					return "Paid";

				case "FF BASE":
				case "FF EXT BASE":
				case "FF BASE + FF EXT BASE":
					return "FF-Base";

				case "FF ADP":
				case "FF ADP ONLY":
					return "FF-ADP";

				case "LEN ADP":
				case "LEN ADP ONLY":
				case "HP ADP":
				case "ACER ADP":
					return "MFR-ADP";

				case "FF BASE + FF ADP":
				case "FF EXT BASE+ FF ADP":
				case "FF EXT BASE + FF ADP":
				case "FF ADP + FF EXT BASE":
					return "FF-Full";


				case "LEN BASE"://-----------------------// Start of Lenovo Base warranties
				case "LEN EXT BASE":
				case "LEN EXT BASE ONLY":
				case "LEN EXTBASE ONLY":
				case "LEN BASE ONLY":
				case "LEN BASE + LEN EXT BASE":
				case "LEN BASE + LEN EXTBASE":
				case "HP BASE":	//-----------------------// Start of HP Base warranties
				case "HP BASE ONLY":
				case "HP EXT BASE ONLY":
				case "HP BASE + HP EXT BASE":
				case "HP BASE+ HP EXT BASE":
				case "HP BASE +HP EXT BASE":
				case "ACER BASE"://----------------------// Start of Acer Base warranties
				case "ACER BASE ONLY":
				case "DELL BASE"://----------------------// Start of Dell Base warranties
					return "MFR-Base";

				case "DELL BASE ONLY":
					return "MFR-Base";

				case "LEN BASE + LEN EXTBASE + LEN ADP": //god damn thats alot of coverage	// Start of Lenovo Full warranties
				case "LEN ADP + LEN BASE + LEN EXTBASE":
				case "LEN BASE + LEN ADP + LEN EXTBASE":
				case "LEN BASE + LEN ADP":
				case "LEN EXT BASE + LEN ADP ONLY":
				case "HP BASE + HP ADP"://---------------// Start of HP Full warranties
					return "MFR-Full";

				case "SFW ADP ONLY":
					return "Safeware";

				default:
					return "Missing";
			}
		};

		if(autoHideDoneLines == true){
			showAll();
			for(var k = 0; k < 26; k++){
				var repairBoxName = "#repair-completed-" + k;
				if($(repairBoxName).is(":checked")){
					singleClick(k);
				}
			}
		};

		if(CheckEm == "yes"){
			console.log("check em true")
			$("#EXP").append('<button type="button" class="glob" id="Checksum" style="background-color: white; border-radius: 8px" >Checksum Gen</button>')
			console.log("last page checksum   " + Checked)

			String.prototype.hashCode = function(){
				var hash = 0, i, char;
				if (this.length == 0) return hash;
				for (i = 0; i < this.length; i++) {
					char = this.charCodeAt(i);
					hash = ((hash<<5)-hash)+char;
					hash = hash & hash; // Convert to 32bit integer
				}
				return hash;
			};
			var fullPage = $("#full-container").prop('outerHTML')

			$('#Checksum').on("click",function(){
				var ff = [];
				var line = $(this).data("id");
				var ShtPrt = ['Batt.','MLB','LCD','LCD Cable','Palmrest','KB','TPD','TPD Cable','WLAN','DC Jack','HDD/SSD','Speakers','Power Button Board','USB Board',
							  'Audio Board','LCD Bezel','LCD Back Cover','Bottom Chassis','Hinges','Webcam','Secondary Webcam','Webcam Cable','RAM','Service Door'];

				var CutPrt = ['WWAN','AC Adapter','HDD/SSD Bracket','Finger Print Reader','Rubber Kit','Optical Drive','G-Sensor','Touchscreen Sensor','Stylus','Screw Kit','Card Reader','Hinge Cap',
							  'Power Board','Backlit MLB','Heatsink','Thermal Pad','Fan','Batt. Cable','Cable Kit','Click Board','HDD/SSD Cable','Sensor Board','CMOS'];

				var Dstr = ('|LCD||Batt||TPD||TPD CBL||Lcdc|'); //$("#diagnosed-notes-1").val();
				var Store

				var regex = /\|(.*?)\|/g;
				//var MatchReg = Dstr.match(regex)
				//var finMatch = ff.push([MatchReg])
				//console.log("finMatch"+ff)

				while((Store = regex.exec(Dstr)) != null){
					//console.log("full match "+Store[0])
					console.log("G1 Match "+Store[1])
					ff.push(Store[1])
					console.log("parts array "+ff)
					console.log('parts array len'+ShtPrt)
				}


				/* 				console.log(fullPage.hashCode())
				var hash = fullPage.hashCode()
				var opens = prompt("Copy this code: "+fullPage.hashCode()+"\nPaste copied code after ")
				if(hash == opens){
					prompt("Checksum Matched")
				}else{
					prompt("Checksum Does not match\nDouble check your fields and reloading the SRO page")
				} */

			})
		};// checksum goodies

		$('#copy').click(function(){// this is called when export button is clicked
			var techName = getCookie("techName");
			/* 			if(techName === "Tony"){
				techName = "Vector"
			}else{
				techName = getCookie("techName");
			};
 */
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0');
			var yyyy = today.getFullYear().toString().slice(-2);

			today = mm + '/' + dd + '/' + yyyy;

			var lenLines = [];
			var hpLines = [];
			var acerLines = [];
			var dellLines = [];
			var FstLine = $(":text").eq(3).data("id")
			const TotLines = $('#num-lines').val();
			var CurIn = 0;
			var EXP2DArray = []


			var lines = [];//array to store arrays of line information.
			var modelsArray = document.querySelectorAll("#top-item-wrap > div.col-md-4 > div > div:nth-child(1) > div:nth-child(1) > br:nth-child(3)");
			var warrArray = document.querySelectorAll("#top-item-wrap > div.col-md-4 > div > div:nth-child(1) > div:nth-child(2) > span");

			for(var m = 1; m <= 25; m++){
				if(!$("#snumber-" + m).val() == ""){//check if line exist
					EXP2DArray.push([m]);
					//console.log(EXP2DArray)
				}

			}
			function testw(){
				i
			}

			for (var i = 0; i <= 25; i++) {//for (var i = 1; i < 25; i++
				if(!$("#snumber-" + i).val() == ""){
					CurIn ++
					//console.log(CurIn)
					var model = modelsArray[CurIn-1].nextSibling.textContent;//var model = modelsArray[i-1].nextSibling.textContent;
					var modelTrim;
					var SroNum = $("#sro-number").val()
					var Cust = $("#customer").val()
					var SerNum = $("#snumber-" + i).val()
					var fullWarrName = "#warranty-" + i;
					var warranty = $("#warranty-" + i).val();
					var location = $("#shelf-location").val();
					var diagNotes = $("#diagnosed-notes-" + i).val();
					var warrantyFixed;
					var s = ""
					var p1 = ""
					var p2 = ""
					var p3 = ""
					var p4 = ""
					var p5 = ""

					if ($("#paid-"+i).is(":checked") == true){
						warranty = "Paid"
					}else{
						warranty = $("#warranty-" + i).val();
					}
					//let HpLinArr = [today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed]
					//hpLines.push([today, techName, $("#sro-number").val(), $("#customer").val(), i, location, $("#snumber-" + i).val(), modelTrim, warrantyFixed]);
					//lenLines.push([today, techName, $("#sro-number").val(), $("#customer").val(), i, location, $("#snumber-" + i).val(), modelTrim, warrantyFixed]);
					//dellLines.push([today, techName, $("#sro-number").val(), $("#customer").val(), i, location, $("#snumber-" + i).val(), modelTrim, warrantyFixed]);


					if (model.includes("HP-CBK") ) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : HP-CBK-', '');
						hpLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed, s, s, p1, s, p2, s, p3, s, p4, s, p5])

					}else if (model.includes("HP-PBK")) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : HP-PBK-', '');
						hpLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])

					}else if (model.includes("HP-EBK")) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : HP-EBK-', '');
						hpLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])

					}else if (model.includes("LEN-")) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : LEN-', '');
						lenLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])

					}else if (model.includes("ACER-")) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : ACER-', '');
						acerLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])

					}else if (model.includes("ASUS-CBK") ) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : ASUS-CBK-', '');
						dellLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])

					}else if (model.includes("DEL-")) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : DEL-', '');
						dellLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])

					}else if (model.includes("GEN-REPAIR")) {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = model.replace('Model(Item) : GEN-REPAIR', 'MISSING MODEL');
						dellLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])

					}else {
						warrantyFixed = fixWarranty(warranty);
						modelTrim = 'MISSING MODEL'
						dellLines.push([today, techName, SroNum, Cust, i, location, SerNum, modelTrim, warrantyFixed])
					}

				}

			}// most of the thing you are looking for are here
			var empty = [];

			if(!lenLines.length == 0){
				lenLines.push(empty);
			}
			if(!hpLines.length == 0){
				hpLines.push(empty);
			}
			lines = lines.concat(lenLines);
			lines = lines.concat(hpLines);
			lines = lines.concat(acerLines);
			lines = lines.concat(dellLines);

			exportToCsv(($("#sro-number").val() + ".csv"), lines);

		});//end of export function

		function autoHideLinesOnStartup(){
			if(autoHideDoneLines == true){
				showAll();
				for(var k = 1; k < 25; k++){
					var repairBoxName = "#repair-completed-" + k;
					if($(repairBoxName).is(":checked")){
						singleClick(k);
					}
				}
			}

		};

		$(document).on("keydown", function(e){
			if(e.ctrlKey && e.keyCode == 80){
				customPrint();
				//console.log("ctrl+p pressed")
			}
		});
		$('#PrintBtn').click(function(){
			customPrint();
		});

		function customPrint(){
			GM.getResourceUrl('https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/barcodes/JsBarcode.code39.min.js')

			var w = window.open("","Print page 9000","width=816","height=1056");
			const openerWindow = window.opener
			var stuffToPrint = $("#sro-number").val().fontsize(7);
			var PntLoc = $("#shelf-location").val()

			var OnlySRO = document.querySelector("#sro-number").value
			var osr = String(OnlySRO)

			if(PntLoc.length < 1){
				PntLoc = "__"
			}else{
				PntLoc = $("#shelf-location").val().toUpperCase();
			}

			//w.document.write("<h1 style='position: absolute; top: 89%; right: 33%;font-family: cursive;'>" +stuffToPrint+ "</h1>");
			w.document.write("<h2 style='position: absolute; transform: rotate(-90deg); bottom: 45%; left: 77%;font-family: cursive;'>" +stuffToPrint+ "</h2>");

			w.document.write("<h1 style='position: absolute; top: 89%; right: 45%;font-family: cursive');>" +stuffToPrint+ "</h1>");
			w.document.write("<h1 style='position: absolute; top: 83%; right: 45%;font-family: cursive;font-size: xxx-large;white-space: nowrap;'>Location: " +PntLoc+ "</h1>");
			w.document.write("<h2 style='position: absolute; transform: rotate(-90deg); bottom: 43%; left: 70%;font-family: cursive;font-size: xxx-large;white-space: nowrap;'>Location: " +PntLoc+ "</h2>");
			w.document.write("Customer: ");
			w.document.write($("#customer").val());
			w.document.write("<br> <br>");

			var lenLines = [];
			var hpLines = [];
			var acerLines = [];
			var dellLines = [];

			var lines = [];//array to store arrays of line information.
			var modelsArray = document.querySelectorAll("#top-item-wrap > div.col-md-4 > div > div:nth-child(1) > div:nth-child(1) > br:nth-child(3)");
			var warrArray = document.querySelectorAll("#top-item-wrap > div.col-md-4 > div > div:nth-child(1) > div:nth-child(2) > span");
			var custDesc = document.querySelectorAll("#top-item-wrap > div.col-md-4 > div > div:nth-child(2) > div > br:nth-child(2)");
			var EXP2DArray = []
			var CurIn = 0
			var FstLine = $(":text").eq(3).data("id")
			const TotLines = $('#num-lines').val();

			for(var m = 1; m <= 25; m++){
				if(!$("#snumber-" + m).val() == ""){//check if line exist
					EXP2DArray.push([m]);
					console.log(EXP2DArray)
				}

			}

			for (var i = 0; i <= 25; i++) {//i = 1
				if(!$("#snumber-" + i).val() == ""){
					CurIn ++
					console.log("EXP"+EXP2DArray[i-1])
					console.log(i)
					console.log(CurIn-1)

					var model = modelsArray[CurIn-1].nextSibling.textContent;//	i-1
					var desc = custDesc[CurIn-1].nextSibling.textContent;//		i-1
					var warranty = $("#warranty-" + i).val();
					w.document.write("Line: " + i + " ~~~ " + $("#snumber-" + i).val() + " ~~~ " + warranty + " ~~~ " + desc);
					w.document.write("<br> <br>");

				}
			}

			w.document.write($('#full-container').append("<svg id='barcode' style='visibility: hidden;'></svg>"));
			//w.document.write($('body').append("<svg class='barcode' jsbarcode-format='CODE39'jsbarcode-value="+osr+"></svg>"));

			JsBarcode("#barcode", osr, {
				format: "CODE39",
				width: 1
			});

			window.open("","Print page 9000").document.write($('svg:last').css({'position': 'absolute', 'top': '86%', 'right': '8%'}))// css for barcode loc
			window.open("","Print page 9000").document.write($('svg:last').prop('outerHTML'));// ripping barcode from main window to print page
			//window.open("","Print page 9000").document.write();

			waitForKeyElements("#full-container > #barcode",function(){
				$(w.document.body).ready(function() {
					jQuery('#full-container > #barcode').hide()
				});
			})// hide barcode on main window after copying

			/* 			for (var i = FstLine; i < 25; i++) {//i = 1
				if(!$("#snumber-" + i).val() == ""){
					var model = modelsArray[i-FstLine].nextSibling.textContent;//	i-1
					var desc = custDesc[i-FstLine].nextSibling.textContent;//		i-1
					var warranty = $("#warranty-" + i).val();
					w.document.write(["Line: " + i + " ~~~ " + $("#snumber-" + i).val() + " ~~~ " + warranty + " ~~~ " + desc]);
					w.document.write("<br> <br>");

				}
			} */


			w.print();
			//w.close();
		}


		$("[id^=repair-completed]").change(function() {
			autoHideDoneLines = getCookie("autoHideDoneLines");
			if(autoHideDoneLines){
				var line = this.id;
				line = line.replace("repair-completed-", "");
				if(autoHideDoneLines == true){
					if(document.getElementById(this.id).checked){
						singleClick(line);
					}
				}
			}
		});//check if repair complete button was pressed then update what lines are hidden or shown
		//Code I totally wrote and didn't copy paste from stack overflow
		function exportToCsv(filename, rows) {
			var processRow = function (row) {
				var finalVal = '';
				for (var j = 0; j < row.length; j++) {
					var innerValue = row[j] === null ? '' : row[j].toString();
					if (row[j] instanceof Date) {
						innerValue = row[j].toLocaleString();
					};
					var result = innerValue.replace(/"/g, '""');
					if (result.search(/("|,|\n)/g) >= 0){
						result = '"' + result + '"';
					}
					if (j > 0){
						finalVal += ',';
					}
					finalVal += result;
				}
				return finalVal + '\n';
			};
			var csvFile = '';
			for (var i = 0; i < rows.length; i++) {
				csvFile += processRow(rows[i]);
			}
			var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
			if (navigator.msSaveBlob) { // IE 10+
				navigator.msSaveBlob(blob, filename);
			} else {
				var link = document.createElement("a");
				if (link.download !== undefined) { // feature detection
					// Browsers that support HTML5 download attribute
					var url = URL.createObjectURL(blob);
					link.setAttribute("href", url);
					link.setAttribute("download", filename);
					link.style.visibility = 'hidden';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			}
		};// end of exportToCsv function

		//_______________________________________________________________________________________________________________________________________________________________________________________
		//END OF ALL EXPORT BUTTON CODE
	});
})();
