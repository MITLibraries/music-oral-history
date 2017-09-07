<?php

/* Template Name: MOH Search */

$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;

get_header('moh');

?>

<?php get_template_part('inc/breadcrumbs', 'child'); ?>

<?php while ( have_posts() ) : the_post(); ?>		
		
	<div id="stage" class="inner" role="main">
		<?php get_template_part( 'inc/postHead' ); ?>
		<div class="title-page flex-container">
			<?php if ($isRoot): ?>
			<h3 class="title-sub"><?php echo $section->post_title; ?></h3>
			<?php else: ?>
			<h2><a href="<?php echo get_permalink($section->ID) ?>"><?php echo $section->post_title; ?></a></h2>
			<?php endif; ?>

		</div>
		<div class="content-main group">
			<div class="entry-content">
				<?php the_content(); ?>
			</div>
			<footer class="entry-meta group">
				<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
			</footer>
			<div class="search-area group">
				<iframe src='https://s3.amazonaws.com/interactive.3playmedia.com/portal/templates/v1/basic-light.html?linked_account_id=2556&video_id=LnYbIVIVmcs&project_id=10129&lc=youtube' frameborder=0 scrolling='no' seamless='seamless' style='overflow:hidden;' width='960px' height='600px'></iframe>
			</div>
		</div>
	</div><!--end div#content -->
		
<?php endwhile; ?>

<?php get_footer(); ?>
