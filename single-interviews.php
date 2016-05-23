<?php
/**
 * This partial displays a single interview.
 *
 * @link https://github.com/MITLibraries/music-oral-history
 *
 * @package WordPress
 * @subpackage music-oral-history
 * @since 1.1.11
 */

$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;

get_header('moh');

?>

<?php get_template_part('inc/breadcrumbs') ?>

<div id="stage" role="main">
	
	<div class="title-page flex-container">
		<h2><?php the_title(); ?></h2>
	</div>
	
	<div class="content-main group">
	
		<?php

		while ( have_posts() ) : the_post();

			$interviewee = get_the_terms( $post->ID, 'interviewees' );
			$interviewee = get_post( $interviewee[0]->term_id );

		?>
		
		<div id="titlebar" class="info-meta group">
			<div class="post-thumbnail">
				<?php

				$output = get_the_post_thumbnail( $interviewee->ID, 'interviewee' );
				echo ( $output ) ? $output : '<img src="' . get_stylesheet_directory_uri() . '/images/no-photo.png" alt="No Photo">';

				?>
			</div>
			<ul class="inline tags">
				<li><i class="icon-folder-close"></i></li>
				<?php

				$categories = get_the_terms( $interviewee->ID, 'category' );
				foreach ( $categories as $cat) {
					echo '<li><a href="' . home_url() . '/interviewees/?status=' . $cat->term_id . '">' . $cat->name . '</a></li>';
				}

				?>
			</ul>
			<ul class="inline tags">
				<li><i class="icon-tag"></i></li>
				<?php

				$tags = get_the_terms( $interviewee->ID, 'post_tag' );
				foreach ( $tags as $tag) {
					$selected = ( $tag->term_id == $tag_query ) ? ' selected' : '';
					echo '<li><a href="' . home_url() . '/interviewees/?topic=' . $tag->term_id . '">' . $tag->name . '</a></li>';
				}

				?>
			</ul>
			<ul class="inline links">
				<?php

				$audio = types_render_field( 'audio', array(
					'link'		=> 'true',
					'title'		=> 'Download (MP3)'
				) );
				$transcript = types_render_field( 'transcript', array(
					'link'		=> 'true',
					'title'		=> 'Transcript (PDF)'
				) );
				$cd = types_render_field( 'cd' );
				$print = types_render_field( 'print' );

				if ( $audio ) echo '<li><i class="icon-download"></i> ' . $audio . '</li>';
				if ( $transcript ) echo '<li><i class="icon-file"></i> ' . $transcript . '</li>';
				if ( $cd ) echo '<li><img src="' . get_stylesheet_directory_uri() . '/images/icon-cd.png" width="16" class="cd"> <a href="' . $cd . '">CD available in the library</a></li>';
				if ( $print ) echo '<li><i class="icon-book"></i> <a href="' . $print . '">Print transcript available in the library</a></li>';

				?>
			</ul>
			
		</div><!-- end div#titlebar -->

		<div class="information group">
	
			<!-- Names &amp; Topics in Interview -->
			
			<?php

			$individuals_id = types_render_field( 'individuals_id', null );
			$individuals_output = do_shortcode( '[table id=' . $individuals_id . ' /]' );

			$topics_id = types_render_field( 'topics_id', null );
			$topics_output = do_shortcode( '[table id=' . $topics_id . ' /]' );

			?>
			
			<?php if ( $individuals_id || $topics_id ) { ?>
			<div class="test" style="height:100px;width:100px;background:red;"></div>
			<section class="expandable" role="region">
				<h3><a href="#">Names &amp; topics mentioned in interview</a></h3>
				<div id="tables" class="content" style="display: none;">
					<div class="tabcontent">
						<ul class="tabnav">
							<?php if ( $individuals_id ) echo '<li class="active"><a href="#tab1">Individuals<div></div></a></li>'; ?>
							<?php if ( $topics_id ) echo '<li' . ( ( $individuals_id == '' ) ? ' class="active"' : '' ) . '><a href="#tab2">Events, places, topics &amp; musical works</a></li>'; ?>
						</ul>
						<?php if ( $individuals_id ) echo '<div id="tab1" class="tab active">' . $individuals_output . '</div>'; ?>
						<?php if ( $topics_id ) echo '<div id="tab2" class="tab' . ( ( $individuals_id == '' ) ? ' active"' : '' ) . '">' . $topics_output . '</div>'; ?>
					</div>
				</div>
			</section><!-- end section.expandable -->
			
			<?php } ?>

			<?php

			$no_sidebar = true;

			$output_header_1 = do_shortcode( '[types field="sidebar_header_1" id="' . $interviewee->ID . '"]' );
			$output_content_1 = do_shortcode( '[types field="sidebar_content_1" id="' . $interviewee->ID . '"]' );
			if ( $output_header_1 && $output_content_1 ) $no_sidebar = false;

			$output_header_2 = do_shortcode( '[types field="sidebar_header_2" id="' . $interviewee->ID . '"]' );
			$output_content_2 = do_shortcode( '[types field="sidebar_content_2" id="' . $interviewee->ID . '"]' );
			if ( $output_header_2 && $output_content_2 ) $no_sidebar = false;

			$output_header_3 = do_shortcode( '[types field="sidebar_header_3" id="' . $interviewee->ID . '"]' );
			$output_content_3 = do_shortcode( '[types field="sidebar_content_3" id="' . $interviewee->ID . '"]' );
			if ( $output_header_3 && $output_content_3 ) $no_sidebar = false;

			?>
			
			<section class="expandable entry-content" role="region">
				<h3><a href="#">Biography &amp; other information</a></h3>
				<div id="biography" class="content" style="display: none;">
						<h2 class="heading"><?php echo $interviewee->post_title; ?></h2>
						<p class="muted"><strong><?php echo do_shortcode( '[types field="mit_affiliation" id="' . $interviewee->ID . '"]' ) . '<br/> ' . do_shortcode( '[types field="music_affiliation" id="' . $interviewee->ID . '"]' ); ?></strong></p>
						<p><?php echo $interviewee->post_content; ?></p>
					<?php if ( !$no_sidebar ) { ?>
					<div id="sidebarContent" class="span3 pull-right">
						<div class="sidebarWidgets">
							<?php

							if ( $output_header_1 && $output_content_1 ) echo '<aside class="widget"><h3>' . $output_header_1 . '</h3>' . $output_content_1 . '</aside>';
							if ( $output_header_2 && $output_content_2 ) echo '<aside class="widget"><h3>' . $output_header_2 . '</h3>' . $output_content_2 . '</aside>';
							if ( $output_header_3 && $output_content_3 ) echo '<aside class="widget"><h3>' . $output_header_3. '</h3>' . $output_content_3 . '</aside>';

							?>
						</div>
					</div>
					<?php } ?>

				</div>
			</section><!-- end section.expandable -->

		</div><!-- end div#information -->

		<div class="content-page group">
			<div id="playerWrap group">
				<div id="video" class="video"></div>
				<div id="transcript" class="transcript"></div>
			</div>
			<script>
				var TECHTVID = "<?php echo types_render_field( 'video', null ); ?>";
				var rpc = new easyXDM.Rpc({
				    remote: "http://techtv.mit.edu/embeds/"+TECHTVID,
				    container: "video",
				    props: { style: { width: 442, height: 200 } }
				  },
	  			{
				    local: {
				      play: function(successFn, errorFn) {},
				      pause: function(successFn, errorFn) {},
				      stop: function(successFn, errorFn) {},
				      resume: function(successFn, errorFn) {},
				      toggle: function(successFn, errorFn) {},
				      seek: function(seconds, successFn, errorFn) {},
				      isPlaying: function(successFn, errorFn) {},
				      isPaused: function(successFn, errorFn) {},
				      playState: function(successFn, errorFn) {},
				      position: function(successFn, errorFn) {},
				      duration: function(successFn, errorFn) {},
				      videoId: function(md5, successFn, errorFn) {},
				      playFile: function(id, successFn, errorFn) {}
				    },
				    remote: {
				      play: {},
				      pause: {},
				      stop: {},
				      resume: {},
				      toggle: {},
				      seek: {},
				      isPlaying: {},
				      isPaused: {},
				      playState: {},
				      position: {},
				      duration: {},
				      videoId: {},
				      playFile: {}
				    }
				  }
				);

				window.p3_async_init = function(){

				P3.PlayerInterface.techtv = function(id, instance) {
	        var parent = this;
	        parent.instance = instance;

	        this.playState = "paused";
	        this.playPosition = false;
	        this.playDuration = false;
	        this.playVideoId = TECHTVID;

	        if (typeof rpc != "undefined" && rpc.play){
	          this.play = function(){rpc.play();};
	          this.pause = function(){rpc.pause();};
	          this.play_state = function(){return parent.playState};
	          this.position = function(){return parent.playPosition};
	          this.video_id = function(){return parent.playVideoId};
	          this.duration = function(){return parent.playDuration};
	          this.seek = function(m){
	            rpc.play();
	            setTimeout(function(){
	              var s = m / 1000;
	              rpc.seek(s);
	            },0);
	          };
	          /***

	            TASK: THERE NEEDS TO BE SOME LOGIC HERE THAT ENABLES A NEW FILE AND TIMESTAMP
	            TO BE LOADED INTO THE PLAYER, AND FOR PLAYBACK TO BEGIN AUTOMATICALLY AND FROM THAT TIMESTAMP
	            RIGHT NOW IT IS TOO CLUNKY

	          ***/
	          this.play_file = function(obj){
	            m = obj.m || 0;
	            if (obj.video_id == parent.playVideoId){
	              parent.seek(m);
	            } else {
	              rpc.playFile(obj.video_id, m/1000);
	            }
	          };
	          /***

	            TASK: THE UPDATE INTERVALS NEED TO BE OPTIMIZED, TRADING OFF USER EXPERIENCE AND PERFORMANCE

	          ***/
	          var SHORT_STAT_INTERVAL = 333;
	          var LONG_STAT_INTERVAL = 3000;
	          this.stat_interval = setInterval(function(){
	            rpc.position(null,function(data){P3.get(0).player.interface.playPosition = data * 1000;});
	          },SHORT_STAT_INTERVAL);
	          this.long_stat_interval = setInterval(function(){
	            rpc.isPlaying(null,function(data){P3.get(0).player.interface.playState = (data ? "PLAYING" : "PAUSED")});
	            rpc.duration(null,function(data){P3.get(0).player.interface.playDuration = data * 1000;})
	            rpc.videoId(null,function(data){P3.get(0).player.interface.playVideoId = data});
	          },LONG_STAT_INTERVAL);
	        }
	      }

				P3.init({
				"video" : {
				  player_type: "techtv",
				  file_id: TECHTVID,
				  platform_integration: true,
				  transcript: {
				    target: "transcript",
				    skin: "minimal mitlib",
				    // template: "bottom_search",
				    width: 423,
				    height: 214,
				    can_print: true,
				    can_download: true,
				    can_collapse: true
				  }
				}

				},"h_RJzPyn1vwbLhFaDLRxJUoNvT_756xr");
				}

				$(document).ready(function(){

				$("#transcriptskin").change(function(){
				P3.get(0).transcript.apply_skin($(this).val());
				});
				$("#playlistskin").change(function(){
				P3.get(0).playlist.apply_skin($(this).val());
				});

				});	
			</script>

			<div id="interviewContents">
				<?php

				$contents_id = types_render_field( 'contents_id', null );
				if ( $contents_id ) {
					echo '<h3 class="inverse">Contents</h3>';
					echo do_shortcode( '[table id=' . $contents_id . ' /]' );
				}

				$interviews = get_the_terms( $interviewee->ID, 'interviews' );
				if ( $interviews ) {
					usort($interviews, "sortInterviews");
					$output = '';
					foreach ( $interviews as $interview ) {
						if ( $interview->term_id != get_the_ID() ) {
							// $output .= '<li><a href="' . get_permalink( $interview->term_id ) . '">' . $interview->name . ' (' . get_the_time( 'n/j/Y', $interview->term_id ) . ')</a></li>';
							$output .= '<li><a href="' . get_permalink( $interview->term_id ) . '">' . $interview->name . '</a></li>';
						}
					}
					if ( $output ) echo '<h3>More Interviews</h3><ul class="arrows">' . $output . '</ul>';
				}

				?>
			</div><!-- end div#contents -->

			</div><!-- end div.mainContent -->

		<?php endwhile; ?>
	</div><!-- end div#content -->
</div><!-- end div.stage -->

<?php get_footer(); ?>