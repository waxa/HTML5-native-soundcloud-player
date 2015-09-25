function inicialice () {
	SC.initialize({
    	client_id: "501c1160b25e660b70fce7761fb86b62"
  	});

  	bindSongNameButton();
}

function bindSongNameButton () {
	// var track_url = "https://soundcloud.com/miami-nights-1984/ocean-drive";
	var track_url = "https://soundcloud.com/darse/kase-o-jazz-magnetism-boogaloo"
	jQuery('#song-name').on('click', function () {
  		resolveSong(track_url);
  	});
}

function resolveSong ( track_url ) {
	SC.get('/resolve', { url: track_url }, streamSong);
}

function streamSong ( track ) {
	console.log('track = ', track);
	jQuery('#song-name > span').html(track.title);
	jQuery('.time-total').html(millisToMinSec(track.duration));
	SC.stream('/tracks/' + track.id + '/', bindControls);
}

function bindControls ( sound ) {
	console.log('sound = ', sound);

	sound.setAutoPlay(false);

	sound.options.whileplaying = function () {
		jQuery('#time').css('width', (((this.position / this.durationEstimate) * 100) + '%'));
		jQuery('.time-actual').html(millisToMinSec(this.position));
	}

	sound.options.whileloading = function () {
		jQuery('#load').css('width', (((this.bytesLoaded / this.bytesTotal) * 100) + '%'));
	}

	sound.options.onfinish = function () {
		jQuery('#play > span > i').toggleClass('fa-play fa-pause');
		this.setPosition(0);
	}

	sound.options.onplay = function () {
		jQuery('#play > span > i').removeClass('fa-play');
		jQuery('#play > span > i').addClass('fa-pause');	
	}

	sound.options.onpause = function () {
		jQuery('#play > span > i').toggleClass('fa-play fa-pause');
	}

	sound.options.onresume = function () {
		jQuery('#play > span > i').toggleClass('fa-play fa-pause');	
	}

	sound.options.onstop = function () {
		jQuery('#time').css('width', '0%');
		jQuery('.time-actual').html('0:00');
		jQuery('#play > span > i').addClass('fa-play');
		jQuery('#play > span > i').removeClass('fa-pause');
	}

	jQuery('#load').css('width', '0%');
	jQuery('#time').css('width', '0%');
	jQuery('.time-actual').html('0:00');

	jQuery('.player-progress').on('click', function (e){
		var percent = e.pageX - jQuery('.player-progress').offset().left;
		percent = (percent / jQuery('.player-progress').width()) * 100;
		if ( percent > 100 ) percent = 100;
		if ( percent < 0 ) percent = 0;
		jQuery('#time').css('width', (percent + '%'));	
		var position = (sound.duration / 100) * percent;
		sound.setPosition(position); 
	});
	
	jQuery('#play').on('click', function () {
		if (sound.playState) sound.togglePause();
		else sound.play();
	});
	
	jQuery('#stop').on('click', function () {
		sound.stop();
	});

	jQuery('#forward').on('click', function () {
		var position = sound.position + (sound.durationEstimate / 10);
		if (position > sound.durationEstimate){
			position = sound.durationEstimate - 1;
		}
		sound.setPosition(position)
	});

	jQuery('#backward').on('click', function () {
		var position = sound.position - (sound.durationEstimate / 10);
		if (position < 0){
			position = 0;
		}
		sound.setPosition(position)
	});

	if (sound.muted) {
		jQuery('#volumen-icon > span > i').removeClass('fa-volume-up');
		jQuery('#volumen-icon > span > i').addClass('fa-volume-off');
	} else {
		jQuery('#volumen-icon > span > i').removeClass('fa-volume-off');
		jQuery('#volumen-icon > span > i').addClass('fa-volume-up');
	}

	jQuery('#volumen-icon').on('click', function () {
		sound.toggleMute();
		jQuery('#volumen-icon > span > i').toggleClass('fa-volume-off fa-volume-up');
	});

	jQuery('#volumen').val(sound.volume);

	jQuery('#volumen').on('change mousemove', function (){
		var percent = jQuery('#volumen').val();
		sound.setVolume(percent);
	});

	jQuery('#song-name > span').on('click', function() {
		jQuery('#time').css('width', '0%');
		jQuery('#load').css('width', '0%');
		jQuery('#play > span > i').addClass('fa-play');
		jQuery('#play > span > i').removeClass('fa-pause');
		sound.destruct();
	});

	console.log("bind finished");
}

function millisToMinSec ( time ) {
	var aux = time / 1000;
	aux = Math.floor(aux);
	var min = aux / 60;
	min = Math.floor(min);
	var sec = aux % 60;
	if (sec < 10) {
		sec = '0' + sec;
	}
	return (min + ':' + sec);
}

jQuery(document).ready(function () {
	inicialice();
	console.log("document ready");
});