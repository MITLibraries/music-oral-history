<?php

/* Template Name: MOH About */


$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;


get_header('moh');


?>

<?php get_template_part('inc/breadcrumbs'); ?>

		
<?php while ( have_posts() ) : the_post(); ?>
			
	<div id="stage" class="group" role="main">
		
		<div class="title-page flex-container">
				<?php if ($isRoot): ?>
				<h2><?php echo $section->post_title; ?></h2>
				<?php else: ?>
				<h2><a href="<?php echo get_permalink($section->ID) ?>"><?php echo $section->post_title; ?></a></h2>
				<?php endif; ?>

			</div>
			
			<div class="content-main flex-container">
				
				<div class="content-page col-1 hasSidebar">
					<div class="entry-content moh-entry">
						<?php the_content(); ?>
					</div>
				</div>
				
				<div class="col-2">
					<?php get_sidebar( 'moh-about' ); ?>
				</div>
				
			</div>
			
			<footer class="entry-meta">
				<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
			</footer><!-- .entry-meta -->

	</div><!-- end div#stage -->
		
		
<?php endwhile; ?>


<?php get_footer(); ?>