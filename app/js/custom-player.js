var clientId = "501c1160b25e660b70fce7761fb86b62";
var list_url = "http://api.soundcloud.com/playlists/113525318";

var playlistGlobal = null;
var actualSong = null;

function inicialice () {
	SC.initialize({
    	client_id: clientId
  	});
  	resolveList(list_url);
}

function resolveList ( list_url ) {
	SC.get('/resolve', { url: list_url }, function ( playlist ) {
		playlistGlobal = playlist;
		
		jQuery('#song-name > span').html(playlistGlobal.title)
		
		var list_items = "";
		
		for (var i=0; i<playlistGlobal.tracks.length; i++){
			list_items += '<li>' + playlist.tracks[i].title + '</li>';
		}
		
		jQuery('ul.dropdown-menu').html(list_items);
		var ancho = jQuery(window).width() - (jQuery('div.dropdown-toggle').offset().left*2);
		jQuery('ul.dropdown-menu > li').css('width', (ancho + 'px'));

		jQuery('ul.dropdown-menu > li').each(function (index, e) {
			jQuery(this).on('click', function (e) {
				resolveSong( playlistGlobal.tracks[index].uri );
			});
		});

		jQuery('#play').on('click', function () {
			resolveSong( playlistGlobal.tracks[0].uri );
		});
	});
}


function resolveSong ( track_url ) {
	if (actualSong) {
		actualSong.destruct();
	}
	SC.get('/resolve', { url: track_url }, streamSong);
}

function streamSong ( track ) {
	jQuery('#song-name > span').html(track.title);
	jQuery('.time-total').html(millisToMinSec(track.duration));
	SC.stream('/tracks/' + track.id + '/', bindControls);
}

var setIconPause = function () {
	jQuery('#play > span > i').removeClass('fa-play');
	jQuery('#play > span > i').addClass('fa-pause');
}

var setIconPlay = function () {
	jQuery('#play > span > i').removeClass('fa-pause');
	jQuery('#play > span > i').addClass('fa-play');
	setTimeout(isPlaying, 500);
}

var whilePlayingSong = function () {
	jQuery('#time').css('width', (((actualSong.position / actualSong.durationEstimate) * 100) + '%'));
	jQuery('.time-actual').html(millisToMinSec(actualSong.position));
}

var whileLoadingSong = function () {
	jQuery('#load').css('width', (((actualSong.bytesLoaded / actualSong.bytesTotal) * 100) + '%'));
}

var onFinishSong = function () {
	actualSong.setPosition(0);
}

var onStopSong = function () {
	jQuery('#time').css('width', '0%');
	jQuery('.time-actual').html(' 0:00');
	jQuery('#play > span > i').addClass('fa-play');
	jQuery('#play > span > i').removeClass('fa-pause');
}

var onProgressSong = function (e) {
	var percent = e.pageX - jQuery('.player-progress').offset().left;
	percent = (percent / jQuery('.player-progress').width()) * 100;
	if ( percent > 100 ) percent = 100;
	if ( percent < 0 ) percent = 0;
	jQuery('#time').css('width', (percent + '%'));	
	var position = (actualSong.duration / 100) * percent;
	actualSong.setPosition(position);
}

var playSong = function () {
	if (actualSong.playState) actualSong.togglePause();
	else actualSong.play();	
}

var stopSong = function () {
	actualSong.stop();
}

var forwardSong = function () {
	var position = actualSong.position + (actualSong.durationEstimate / 10);
	if ( position > actualSong.durationEstimate ) {
		position = actualSong.durationEstimate - 1;
	}
	actualSong.setPosition(position);
}

var backwardSong = function () {
	var position = actualSong.position - (actualSong.durationEstimate / 10);
	if ( position < 0 ) {
		position = 0;
	}
	actualSong.setPosition(position);
}

var toggleMuteSong = function () {
	actualSong.toggleMute();
	if (actualSong.muted) {
		jQuery('#volumen-icon > span > i').removeClass('fa-volume-up');
		jQuery('#volumen-icon > span > i').addClass('fa-volume-off');	
	} else {
		jQuery('#volumen-icon > span > i').removeClass('fa-volume-off');
		jQuery('#volumen-icon > span > i').addClass('fa-volume-up');	
	}
}

var isPlaying = function () {
	if (!actualSong.playState) {
		actualSong.play();
	}	
}

var changeVolumeSong = function () {
	var percent = jQuery('#volumen').val();
	actualSong.setVolume(percent);
}

function bindControls ( sound ) {
	actualSong = sound;

	actualSong.setAutoPlay(true);
	actualSong.options.whileplaying = whilePlayingSong;
	actualSong.options.whileloading = whileLoadingSong;
	actualSong.options.onfinish = onFinishSong;
	actualSong.options.onplay = setIconPause
	actualSong.options.onpause = setIconPlay;
	actualSong.options.onresume = setIconPause
	actualSong.options.onstop = onStopSong;

	jQuery('#load').css('width', '0%');
	jQuery('#time').css('width', '0%');
	jQuery('.time-actual').html(' 0:00');
	jQuery('#volumen').val(actualSong.volume);

	if (actualSong.muted) {
		jQuery('#volumen-icon > span > i').removeClass('fa-volume-up');
		jQuery('#volumen-icon > span > i').addClass('fa-volume-off');
	} else {
		jQuery('#volumen-icon > span > i').removeClass('fa-volume-off');
		jQuery('#volumen-icon > span > i').addClass('fa-volume-up');
	}
	
	jQuery('.player-progress').on('click', onProgressSong);
	jQuery('#play').off();
	jQuery('#play').off('click');
	jQuery('#play').on('click', playSong);
	jQuery('#stop').on('click', stopSong);
	jQuery('#forward').on('click', forwardSong);
	jQuery('#backward').on('click', backwardSong);
	jQuery('#volumen-icon').on('click', toggleMuteSong);
	jQuery('#volumen').on('change mousemove', changeVolumeSong);

	sound.play();
	setTimeout(isPlaying, 500);
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
	return (' ' + min + ':' + sec);
}

jQuery(document).ready(function () {
	inicialice();
});