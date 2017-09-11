<?php
/**
 * Template Name: MOH Full Width
 *
 * @package music_oral_history
 * @since 2.0.0
 *
 */
$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;

get_header('moh'); ?>

<?php get_template_part( 'inc/breadcrumbs', 'child' ); ?>

		<?php while ( have_posts() ) : the_post(); ?>
		
		<div id="stage" class="inner" role="main">
			<?php get_template_part( 'inc/postHead' ); ?>
			<div class="title-page flex-container">
				<?php if ($isRoot): ?>
				<h3 class="title-sub"><?php echo esc_html( $section->post_title ); ?></h3>
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