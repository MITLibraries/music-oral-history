<?php

/* Template Name: MOH Search */

$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;

get_header();

?>

<div id="breadcrumb" class="inner" role="navigation" aria-label="breadcrumbs">
	<a href="<?php echo home_url(); ?>">Music Oral History home</a>
	&raquo; <?php the_title(); ?>
</div>

		
<?php while ( have_posts() ) : the_post(); ?>		
		
	<div id="stage" class="inner column1 row" role="main">
				
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
			
		<div id="content" class="span12 group">
			<div class="entry-content">
				<?php the_content(); ?>
			</div>
			<footer class="entry-meta group">
				<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
			</footer>
			<div class="search-area">
				<span class="search-help">Search across all interviews below. Click the play button to start any video, then search within the transcript of each.</span>
				<div class="row">

						<!-- <div id="archive1"></div> -->
						<div id="collection1"></div>


							<div id="iframe-location"></div>
							<div id="transcript1"></div>

					</div>
				</div>
			</div>
		</div><!--end div#content -->

	</div><!-- end div#stage -->
		
<?php endwhile; ?>

<?php get_footer(); ?>