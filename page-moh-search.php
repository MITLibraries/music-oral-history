<?php


/* Template Name: MOH Search */


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

		
<?php while ( have_posts() ) : the_post(); ?>


		<!-- Stage -->
		
		
		<div id="stage" class="inner column1 row" role="main">
	
			
			<!-- Title -->
			
			
			<div class="title span12">
				<?php if ($isRoot): ?>
				<h2><?php echo $section->post_title; ?></h2>
				<?php else: ?>
				<h2><a href="<?php echo get_permalink($section->ID) ?>"><?php echo $section->post_title; ?></a></h2>
				<?php endif; ?>
				<div class="extraInfo">
					<a href="<?php echo home_url(); ?>"><i class="icon-arrow-right"></i> Back to Music Oral History home</a>
				</div>
			</div>
			
			
			<!-- Content -->
			
			
			<div id="content" class="span12">
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
				<div class="search-area">
					<span class="search-help">Search across all interviews below. Click the play button to start any video, then search within the transcript of each.</span>
					<div class="row">
						<div class="span6">
							<div id="archive1"></div>
						</div>
						<div class="span6">
							<div id="videocontainer_noplayer">
								<iframe src="http://techtv.mit.edu/embeds/21823?size=medium&amp;custom_width=432&amp;player=simple&amp;external_stylesheet=&interactive_transcript=1" frameborder=0 width=432 height=475></iframe>
							</div>
							<script type="text/javascript">
							
							window.p3_async_init = function() {
								P3.init({
									videocontainer_noplayer: {
										player_type: "kaltura",
										collection: {
										target: "archive1",
										width: 300,
										height: 475,
										show_segments: false,
										all_files_sort_by: "name"
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
							<!--<script type="text/javascript" src="http://p3.3playmedia.com/p3.js"></script>-->
						</div>
					</div>
				</div>
			</div>
				
				
			<!-- Edit -->
			
			
			<footer class="entry-meta">
				<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
			</footer>
			
			
			<div class="clear"></div>		
		</div>
		
		
<?php endwhile; ?>


<?php get_footer(); ?>