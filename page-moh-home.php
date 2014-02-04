<?php

/* Template Name: MOH Home */

$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;

get_header();

?>

<div class="betterBreadcrumbs" role="navigation" aria-label="breadcrumbs">
	<a href="<?php echo home_url(); ?>">Music Oral History home</a>
</div>

<?php while ( have_posts() ) : the_post(); ?>

	<div id="stage" class="group" role="main">
		
		<div class="title">
			<?php if ($isRoot): ?>
				<h2><?php echo $section->post_title ?></h2>
			<?php else: ?>
			<h2><a href="<?php echo get_permalink($section->ID) ?>"><?php echo $section->post_title; ?></a></h2>
			<?php endif; ?>
		</div>

		<div id="content">
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
			<iframe src="http://ttv.mit.edu/embeds/22923?size=custom&amp;custom_width=460&amp;external_stylesheet=" frameborder="0" width="460" height="259"></iframe>
			<p class="caption muted"><i>Video about the Music at MIT Oral History Project</i></p>
		</div>

	</div><!-- end div#stage -->

	<footer class="entry-meta">
		<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
	</footer>
		
<?php endwhile; ?>

<?php get_footer(); ?>