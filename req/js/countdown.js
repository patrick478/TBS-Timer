var intervalObject = 0;
var running = false;
var currentTime = 0;

// tracks which mode we are in.
// 0 == prepare
// 1 == rehearse
// 2 == cooldown
var mode = 0;

var prepareTime = 60;
var rehearseTime = 900;
var cooldownTime = 60;

$(document).ready(function() {
	$('.center_pane_close').click(function() {
		$(this).parent('.center_pane').fadeOut('fast');
	});
	
	$('#start_button').click(function() {
		if($(this).html() == "Start")
		{
			start();
			$(this).html("Pause");
		}
		else
		{
			pause();
			$(this).html("Start");
		}
	});
	
	$('#reset_button').click(function() {
		reset();
	});
	
	$('#about_text').click(function() {
		$('#about_pane').fadeIn();
	});
	
	$('#settings_text').click(function() {
		$('#settings_pane').fadeIn();
	});
	
	$('input[type=text]').change(function() {
		var field = $(this).prop('name');
		if(field == 'vspace')
			$('#clock').css('margin-top', $(this).val() + "px");
		else if(field == 'fontsize')
			$('#clock').css('font-size', $(this).val() + "pt");
		else if(field == 'prepare')
			prepareTime = $(this).val();
		else if(field == 'rehearse')
			rehearseTime = $(this).val();
			else if(field == 'cooldown')
			cooldownTime = $(this).val();
	});
	
	setupTimers();
});

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

function tick()
{
	if(!running) return;
	
	currentTime--;
	
	if(currentTime < 0)
	{
		finished();
		return;
	}
	
	if(mode == 0)
		max = prepareTime;
	else if(mode == 1)
		max =  rehearseTime;
	else if(mode == 2)
		max = cooldownTime;
		
	var percent = (((max - currentTime) / max) * 100)+1 + '%';
	$('.slider').stop().animate({width: percent}, 1100);
	
	var minutes = Math.floor(currentTime / 60);
	var seconds = Math.ceil(((currentTime / 60) - minutes) * 60);
	
	$('#clock').html(minutes + ":" + zeroFill(seconds, 2));
}

function finished()
{
	pause();
	mode++;
		
	if(mode == 1) {
		$('#prepare_mode').removeClass('active_mode');
		$('#warmup_mode').addClass('active_mode');
		setupTimers();
		start();
	} else if(mode == 2) {
		$('#warmup_mode').removeClass('active_mode');
		$('#cooldown_mode').addClass('active_mode');
		setupTimers();
		start();
	}
	 else if(mode==3){
		mode = 0;
		$('#cooldown_mode').removeClass('active_mode');
		$('#prepare_mode').addClass('active_mode');
		setupTimers();
		start();
		
	}
}


function reset() {
	pause();
	mode = 0;
	setupTimers();
}

function setupTimers()
{	
	if(mode == 0)
		max = prepareTime;
	else if (mode == 1)
		max = rehearseTime;
	else if (mode==2)
		max = cooldownTime;
	this.currentTime = max;
	
	$('.slider').stop().animate({width: '0%'}, 1100);
	
	var minutes = Math.floor(currentTime / 60);
	var seconds = Math.ceil(((currentTime / 60) - minutes) * 60);
	$('#clock').html(minutes + ":" + zeroFill(seconds, 2));
}

function start() {
	running = true;
	intervalObject = window.setInterval(tick, 1000);
}	

function pause() {
	running = false;
	window.clearInterval(intervalObject);
	intervalobject = 0;
}