var intervalObject = 0;
var running = false;
var currentTime = 0;

// tracks which mode we are in.
// 0 == prepare
// 1 == rehearse
// 2 == cooldown

var rehearseTime = 900;

var music = new Howl({
  		urls: ['req/music.mp3']
	});

$(document).ready(function() {
	$('.center_pane_close').click(function() {
		$(this).parent('.center_pane').fadeOut('fast');
	});
	
	$('#start_button').click(function() {
		if($(this).html() == "Start")
		{
			start();
			$(this).css('opacity', 0);
		}
		else
		{
			pause();
			$(this).html("Start");
		}
	});
	
	$('#about_text').click(function() {
		$('#about_pane').fadeIn();
	});
	
	$('#settings_text').click(function() {
		$('#settings_pane').fadeIn();
	});
	
	$('input[type=text]').change(function() {
		var field = $(this).prop('name');
		if(field == 'fontsize')
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

	if(currentTime == 60)
	{
		finishedSoundCheck();
	}
	
		
	var percent = (((max - currentTime) / max) * 100)+1 + '%';
	$('.slider').stop().animate({width: percent}, 1100);

	if(currentTime < 121){
		$('.slider').addClass("short_remaining");
	}

	if (currentTime < 61 ){
		$('body').css('background', '#4F0008');
	}

	else if(currentTime < 121 ){
		if(currentTime % 2 == 0){
			$('body').css('background', '#4F0008');
		}
		else {
			$('body').css('background', '#333');
		}
	}
	console.log(currentTime);
	
	var minutes = Math.floor(currentTime / 60);
	var seconds = currentTime - (minutes * 60);

	console.log(minutes+":" + seconds);
	
	$('#clock').html(minutes + ":" + zeroFill(seconds, 2));
}

function finished()
{
	pause();

	$('#cooldown_mode').removeClass('active_mode');
	$('#warmup_mode').addClass('active_mode');
	$('body').css('background', '#333');
	setupTimers();
	start();
	music.fade(1, 0, 2000);
	music = new Howl({
			urls: ['req/music.mp3']
		});		
	
}

function finishedSoundCheck(){
	$('#warmup_mode').removeClass('active_mode');
	$('#cooldown_mode').addClass('active_mode');
	music.play();
}


function reset() {
	pause();
	$('#warmup_mode').removeClass('active_mode');
	$('#cooldown_mode').removeClass('active_mode');
	$('#prepare_mode').addClass('active_mode');
	
	mode = 1;
	setupTimers();
}

function setupTimers()
{	
	
	max = rehearseTime;
	
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