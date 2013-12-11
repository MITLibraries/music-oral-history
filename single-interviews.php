<?php


$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;


get_header();


?>

		
		<!-- Breadcrumb -->
		
		
		<div id="breadcrumb" class="inner" role="navigation" aria-label="breadcrumbs">
			<a href="<?php echo home_url(); ?>">Music Oral History home</a>
			&raquo; <?php the_title(); ?>
		</div>


		<!-- Stage -->
		
		
		<div id="stage" class="inner column1 row" role="main">
	
			
			<!-- Title -->
			
			
			<div class="title span12">
				<h2><?php the_title(); // echo ' ('; the_time( 'n/j/Y' ); echo ')'; ?></h2>
				<div class="extraInfo">
					<a href="<?php echo home_url(); ?>"><i class="icon-arrow-right"></i> Back to Music Oral History home</a>
				</div>
			</div>
			
			
			<!-- Content -->
			
			
			<div id="content" class="span12">
			
				
				<?php
				
				while ( have_posts() ) : the_post();
				
					$interviewee = get_the_terms( $post->ID, 'interviewees' );
					$interviewee = get_post( $interviewee[0]->term_id );
				
				?>
				
				
				<!-- Title Bar -->
				
				
				<div id="titlebar" class="row">
					<div class="span9">
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
					</div>
					<div class="post-thumbnail span3 pull-right">
						<?php
						
						$output = get_the_post_thumbnail( $interviewee->ID, 'interviewee' );
						echo ( $output ) ? $output : '<img src="' . get_stylesheet_directory_uri() . '/images/no-photo.png" alt="No Photo">';
						
						?>
					</div>
				</div>
				
				
				<!-- 3Play Player -->
				
				
				<div id="video" class="row">
					<div id="plugin" class="span6">
						<div id="videocontainer_noplayer">
							<iframe src="http://techtv.mit.edu/embeds/<?php echo types_render_field( 'video', null ); ?>?size=medium&custom_width=432&player=simple&external_stylesheet=&interactive_transcript=1" frameborder=0 width=432 height=405></iframe>
						</div>
						<script type="text/javascript">

						window.p3_async_init = function(){
							P3.init({
								videocontainer_noplayer: {
									player_type: "kaltura",
									collection: {
									target: "archive1",
									width: 300,
									height: 475,
									show_segments: false
								}
							}
						},"h_RJzPyn1vwbLhFaDLRxJUoNvT_756xr");
						P3.get(0).player.interface = {};
						P3.get(0).player.interface.position = function(){return false;}
						P3.get(0).player.load_video = function(obj){
								var iframe = P3.JQuery("#videocontainer_noplayer").find("iframe:first"); 
								var src = P3.JQuery(iframe).attr("src"); 
								src += /autoplay/.test(src) ? "" : "&autoplay=true";
								src = src.replace(/embeds\/\d+/,"embeds/" + obj.video_id);
								P3.JQuery(iframe).attr("src", src); 
							}
						}

						</script>
					</div>
					<div id="contents" class="span6 pull-right">
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
					</div>
				</div>
				
				
				<div id="information" class="row">
					<div id="mainContent" class="span12">
						<div class="entry-content">
				
				
							<!-- Names &amp; Topics in Interview -->
							
							
							<?php
							
							$individuals_id = types_render_field( 'individuals_id', null );
							$individuals_output = do_shortcode( '[table id=' . $individuals_id . ' /]' );
							
							$topics_id = types_render_field( 'topics_id', null );
							$topics_output = do_shortcode( '[table id=' . $topics_id . ' /]' );
							
							?>
							
							<?php if ( $individuals_id || $topics_id ) { ?>
							
							<section class="expandable">
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
							</section>
							
							<?php } ?>
			
							
							<!-- Biographical Information About Interviewee -->
							
							
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
							
							<section class="expandable">
								<h3><a href="#">Biography &amp; other information</a></h3>
								<div id="biography" class="content" style="display: none;">
									<div class="<?php echo ( $no_sidebar ) ? 'span12' : 'span9'; ?>">
										<h2 class="heading"><?php echo $interviewee->post_title; ?></h2>
										<p class="muted"><strong><?php echo do_shortcode( '[types field="mit_affiliation" id="' . $interviewee->ID . '"]' ) . '<br/> ' . do_shortcode( '[types field="music_affiliation" id="' . $interviewee->ID . '"]' ); ?></strong></p>
										<p><?php echo $interviewee->post_content; ?></p>
									</div>
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
									<div class="clear"></div>
								</div>
							</section>
				
						</div>
					</div>
				</div>


				<?php endwhile; ?>
					
			
			</div>
			
			
			<div class="clear"></div>		
		</div>
		
		
<?php get_footer(); ?>