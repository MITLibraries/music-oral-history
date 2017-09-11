<?php
/**
 * This partial displays a single interview.
 *
 * @link https://github.com/MITLibraries/music-oral-history
 *
 * @package MIT_Libraries_Child
 * @since 2.0.0
 */

$pageRoot = getRoot( $post );
$section = get_post( $pageRoot );
$isRoot = $section->ID == $post->ID;

get_header( 'moh' );

?>

<?php get_template_part( 'inc/breadcrumbs', 'child' ); ?>

<div id="stage" class="inner" role="main">
	<?php get_template_part( 'inc/postHead' ); ?>
	<div class="title-page flex-container">
		<h3 class="title-sub"><?php the_title(); ?></h3>
	</div>
	
	<div class="content-main group">
	
		<?php

		while ( have_posts() ) : the_post();

			$interviewee = get_the_terms_override( $post->ID, 'interviewees' );
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

				if ( $audio ) {
					echo '<li><i class="icon-download"></i> ' . $audio . '</li>';
				}
				if ( $transcript ) {
					echo '<li><i class="icon-file"></i> ' . $transcript . '</li>';
				}
				if ( $cd ) {
					echo '<li><img src="' . get_stylesheet_directory_uri() . '/images/icon-cd.png" width="16" class="cd"> <a href="' . $cd . '">CD available in the library</a></li>';
				}
				if ( $print ) {
					echo '<li><i class="icon-book"></i> <a href="' . $print . '">Print transcript available in the library</a></li>';
				}

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

			<?php

			$no_sidebar = true;

			$output_header_1 = do_shortcode( '[types field="sidebar_header_1" id="' . $interviewee->ID . '"]' );
			$output_content_1 = do_shortcode( '[types field="sidebar_content_1" id="' . $interviewee->ID . '"]' );
			if ( $output_header_1 && $output_content_1 ) { $no_sidebar = false; }

			$output_header_2 = do_shortcode( '[types field="sidebar_header_2" id="' . $interviewee->ID . '"]' );
			$output_content_2 = do_shortcode( '[types field="sidebar_content_2" id="' . $interviewee->ID . '"]' );
			if ( $output_header_2 && $output_content_2 ) { $no_sidebar = false; }

			$output_header_3 = do_shortcode( '[types field="sidebar_header_3" id="' . $interviewee->ID . '"]' );
			$output_content_3 = do_shortcode( '[types field="sidebar_content_3" id="' . $interviewee->ID . '"]' );
			if ( $output_header_3 && $output_content_3 ) { $no_sidebar = false; }

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

							if ( $output_header_1 && $output_content_1 ) {
								echo '<aside class="widget"><h3>' . $output_header_1 . '</h3>' . $output_content_1 . '</aside>';
							}
							if ( $output_header_2 && $output_content_2 ) {
								echo '<aside class="widget"><h3>' . $output_header_2 . '</h3>' . $output_content_2 . '</aside>';
							}
							if ( $output_header_3 && $output_content_3 ) {
								echo '<aside class="widget"><h3>' . $output_header_3. '</h3>' . $output_content_3 . '</aside>';
							}

							?>
						</div>
					</div>
					<?php } ?>

				</div>
			</section><!-- end section.expandable -->

		</div><!-- end div#information -->

		<div class="content-page group">
		<div id="playerWrap" class="wrap-videoplayer">

			<script type="text/javascript" src="https://www.youtube.com/iframe_api"></script>
			<iframe frameborder="0" height="300" id="myytplayer" src="https://www.youtube.com/embed/<?php echo types_render_field( 'youtube-video-id', null ); ?>?enablejsapi=1" type="text/html" width="440" allowfullscreen></iframe><script type="text/javascript" src="https://static.3playmedia.com/p/projects/10129/files/<?php echo types_render_field( '3play-transcript-id', null ); ?>/plugins/10862.js"></script>

		</div>


			<div id="interviewContents" class="wrap-interviewcontents">
				<?php

				$contents_id = types_render_field( 'contents_id', null );
				if ( $contents_id ) {
					echo '<h3 class="inverse">Contents</h3>';
					echo do_shortcode( '[table id=' . $contents_id . ' /]' );
				}

				$interviews = get_the_terms( $interviewee->ID, 'interviews' );
				if ( $interviews ) {
					usort( $interviews, "sortInterviews" );
					$output = '';
					foreach ( $interviews as $interview ) {
						if ( $interview->term_id != get_the_ID() ) {
							// $output .= '<li><a href="' . get_permalink( $interview->term_id ) . '">' . $interview->name . ' (' . get_the_time( 'n/j/Y', $interview->term_id ) . ')</a></li>';
							$output .= '<li><a href="' . get_permalink( $interview->term_id ) . '">' . $interview->name . '</a></li>';
						}
					}
					if ( $output ) { echo '<h3>More Interviews</h3><ul class="arrows">' . $output . '</ul>'; }
				}

				?>
			</div><!-- end div#contents -->

			</div><!-- end div.mainContent -->

		<?php endwhile; ?>
	</div><!-- end div#content -->


<?php get_footer(); ?>
