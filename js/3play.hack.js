$(window).load(function(){
	// $('#collection form').on('submit', function(){
	// 	setTimeout(function(){
	// 		$('.p3-playlist-results li').addClass('no-result');
	// 		$('li').has('.hit').removeClass('no-result').addClass('has-result')}, 400);
	// });
	// $('.p3-playlist-video-control').on('click', function(){
	// 	setTimeout(function(){
	// 		$('.p3-playlist-results li').addClass('no-result');
	// 		$('li').has('.hit').removeClass('no-result').addClass('has-result')}, 400);
	// });

	p3_listen(0,"Playlist.SearchResult",function(name,atts){
		setTimeout(function(){
			$('.p3-playlist-results li').addClass('no-result');
			$('li').has('.hit').removeClass('no-result').addClass('has-result')}, 400);
	});

});