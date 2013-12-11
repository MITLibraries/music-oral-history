<?php


/* Template Name: MOH About */


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
		
		
		<div id="stage" class="inner thinSidebar row" role="main">
		
		
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
			
			
			<div id="content">
				
				
				<!-- Content Column -->
				
				
				<div id="mainContent" class="span9">
					<div class="entry-content">
						<?php the_content(); ?>
					</div>
				</div>
				
				
				<!-- Sidebar Column -->
				
				
				<?php get_sidebar( 'moh-about' ); ?>
				
				
			</div>
			
			
			<!-- Edit -->
			
			
			<footer class="entry-meta">
				<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
			</footer><!-- .entry-meta -->
		
		
			<div class="clear"></div>		
		</div>
		
		
<?php endwhile; ?>


<?php get_footer(); ?>