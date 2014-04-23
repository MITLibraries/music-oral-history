$(window).load(function(){
	$('#collection form').on('submit', function(){
		setTimeout(function(){
			$('.p3-playlist-results li').addClass('no-result');
			$('li').has('.hit').removeClass('no-result').addClass('has-result')}, 400);
	});
	$('.p3-playlist-video-control').on('click', function(){
		setTimeout(function(){
			$('.p3-playlist-results li').addClass('no-result');
			$('li').has('.hit').removeClass('no-result').addClass('has-result')}, 400);
	});
});

// $(function(){
// 	p3_listen(0, 'Playlist.SearchResult', function(){
// 		console.log('you are searching.');
// 		setTimeout(function(){
// 			$('.p3-playlist-results li').addClass('no-result');
// 			$('li').has('.hit').removeClass('no-result').addClass('has-result')}, 400);
// 	});
// });