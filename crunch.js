var a_var_num = 0;
var a_vars = new  Array("age","all","amp","ant","any","ape","ash","ask","asp","axe","bag","bad","bay","bee","bin","bit","bob","bog","bop","bro","bun","bye","cab","cat","cod","cot","cow","dad","den","die","dog","dot","dug","duh","dye","ear","eat","egg","elf","elm","ems","eng","eta");

var active_vars = new Object();

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

function fixSpacing(matchString,op){
	return " " + op + " ";
}
	 
$(document).ready(function(){
	$('#clear').click(function(){ $('#entry').val("");  });
	$('#clear_history').click(function() { $('#history').html(''); active_vars = new Object(); a_var_num = 0; });
	$('#enter').click(function(){ doCalc(); });
	
	$('#entry').keyup(function(e) {
		if(e.keyCode == 13) {
			doCalc();
		}
	});
});

function doCalc(){
	var eq = $('#entry').val();
	if (eq == ""){
		$('<li class="blank">&nbsp;</li>').prependTo('ul#history');
		return;
	}
	
	// Check to see if we should assign this to a variable
	var var_pos = eq.indexOf('=');
	var var_name = null;
	
	if (var_pos > 0){
		var_name = eq.substr(var_pos+1);
		eq = eq.substr(0,var_pos);
	}
	
	var original_eq = eq;
	
	//clean up the output a little
	original_eq = original_eq.replace(/\s/g,'');
	original_eq = original_eq.replace(new RegExp('([-|+|*|\/])',"g"), fixSpacing);
	
	//Replace any percents
	var match = /(\d+)\%/.exec(eq);
	while (match){
		eq = eq.replace(new RegExp(match[1] + '%','g'), match[1] / 100);
		match = /(\d+)\%/.exec(eq);
	}
	//Replace commas
	eq = eq.replace(new RegExp(',','g'), '');
	
	//Replace semicolen with comma
    eq = eq.replace(new RegExp(';','g'), ',');

	//Replace variables
	for (var k in active_vars){
		eq = eq.replace(new RegExp(k,'g'), active_vars[k]);
		original_eq = original_eq.replace(new RegExp(k,'g'), '<span class="variable">'+k+'</span>');
	}
	
	var result = 0;
	try {
		result = eval(eq);
	} catch (err) {
		showError(err);
		return;
	}
	
	var name = a_vars[a_var_num];
	if (var_name != null){
		name = var_name;
	}else{
		if (++a_var_num > a_vars.length){
			a_var_num = 0;
		}
	}
	
	active_vars[name.trim()] = result;
	result = addCommas(result);
	
	$('<li><span class="var" id="var' + name + '">' + name + '</span> <span class="result" id="result' + name + '">' + result + '</span><span class="equals"> &nbsp; = &nbsp; </span><span class="org" id="org' + name + '">' + original_eq + '</span>  </li>').prependTo('ul#history');	
	$('#entry').val("");
	showError('');
}

function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


function showError(msg){
	$('#msg').html('&nbsp;' +msg);
}

function sqrt(num){		return Math.sqrt(num);	}
function ecpm(imps,dollars){
	return Math.round((dollars/imps * 1000)*100)/100;
}
