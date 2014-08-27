<?php

/* Template Name: MOH Full Width */

$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;

get_header(); ?>

<?php get_template_part('inc/breadcrumbs'); ?>

		<?php while ( have_posts() ) : the_post(); ?>
		
		<div id="stage" class="group" role="main">
	
			<div class="title-page">
				<?php if ($isRoot): ?>
				<h2><?php echo $section->post_title; ?></h2>
				<?php else: ?>
				<h2><a href="<?php echo get_permalink($section->ID) ?>"><?php echo $section->post_title; ?></a></h2>
				<?php endif; ?>
			</div>
			
			<div id="content-main" class="group">
	
				<?php get_template_part( 'content', 'full-no' ); ?>
			
			</div>
		
		</div>
		
		<?php endwhile; // end of the loop. ?>

<?php get_footer(); ?>