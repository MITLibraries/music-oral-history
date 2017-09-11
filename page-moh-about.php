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

get_header( 'moh' );

?>

<?php get_template_part( 'inc/breadcrumbs', 'child' ); ?>

		
<?php while ( have_posts() ) : the_post(); ?>
			
	<div id="stage" class="inner" role="main">
		
		<?php get_template_part( 'inc/postHead' ); ?>

		<div class="title-page flex-container">
				<?php if ($isRoot): ?>
				<h3 class="title-sub"><?php echo esc_html( $section->post_title ); ?></h3>
				<?php else: ?>
				<h3 class="title-sub"><a href="<?php echo get_permalink( $section->ID ) ); ?>"><?php echo $section->post_title; ?></a></h3>
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