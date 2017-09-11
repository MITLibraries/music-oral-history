<?php
/**
 * Template Name: MOH Home
 *
 * @package music_oral_history
 * @since 2.0.0
 */
 
$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;

get_header( 'moh' );

?>

<?php

		get_template_part( 'inc/breadcrumbs' );

	?>


<?php while ( have_posts() ) : the_post(); ?>

	<div id="stage" class="inner" role="main">
			
		<?php get_template_part( 'inc/postHead' ); ?>

		<div id="content-main">
			<div class="entry-content">
				<?php the_content(); ?>
				<h3 class="heading">
					<a href="<?php echo home_url(); ?>/interviewees/">Index of interviewees</a>
					<i class="icon-arrow-right"></i>
				</h3>
				<p>Find interviews of current and retired MIT music faculty, staff, former students and visiting artists.</p>
				<h3 class="heading">
					<a href="<?php echo home_url(); ?>/search-all-interviews/">Search all interviews</a>
					<i class="icon-arrow-right"></i>
				</h3>
				<p>Find individuals, events, places, musical works and more mentioned in interviews.</p>
				<h3 class="heading">
					<a href="<?php echo home_url(); ?>/about-the-project/">About the project</a>
					<i class="icon-arrow-right"></i>
				</h3>
				<p>Through in-depth recorded audio and video interviews, the MIT Oral History Project is preserving this valuable legacy for the historical record.</p>
			</div>
		</div>
		<div class="video">
			<iframe width="460" height="345" src="https://www.youtube.com/embed/4qstRvBgvUU" frameborder="0" allowfullscreen></iframe>
			<p class="caption muted"><i>Video about the Music at MIT Oral History Project</i></p>
		</div>

	</div><!-- end div#stage -->

	<footer class="entry-meta">
		<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
	</footer>
		
<?php endwhile; ?>

<?php get_footer(); ?>
