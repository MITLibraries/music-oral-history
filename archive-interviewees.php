<?php


$cat_query = intval( @$_GET[ 'status' ] );
$tag_query = intval( @$_GET[ 'topic' ] );
( $cat_query ) ? $cat = '&cat=' . $cat_query : $cat = '';
( $tag_query ) ? $tag = '&tag_id=' . $tag_query : $tag = '';


$interviewees = new WP_Query( '&order=ASC&meta_key=wpcf-sort-order&orderby=meta_value&post_type=interviewees&posts_per_page=-1' . $cat . $tag );


get_header();


?>
		
<?php get_template_part('inc/breadcrumbs'); ?>
		
<div id="stage" class="group" role="main">
			
	<div class="title-page flex-container">
		<h2>Index of interviewees</h2>
		<div class="extraInfo">
			<a href="<?php echo home_url(); ?>"><i class="icon-arrow-right"></i> Back to Music Oral History home</a>
		</div>
	</div>
			
	<div id="content">
					
					<form id="filters" action="." method="get">
						<strong>Status:</strong>
						<select name="status">
							<option value="0">All</option>
							<?php
							
							$categories = get_terms( 'category' );
							foreach ( $categories as $cat) {
								$selected = ( $cat->term_id == $cat_query ) ? ' selected' : '';
								echo '<option value="' . $cat->term_id . '"' . $selected . '>' . $cat->name . '</p>';
							}
							
							?>
						</select>
						<strong>Topic:</strong>
						<select name="topic">
							<option value="0">All</option>
							<?php
							
							$tags = get_terms( 'post_tag' );
							foreach ( $tags as $tag) {
								$selected = ( $tag->term_id == $tag_query ) ? ' selected' : '';
								echo '<option value="' . $tag->term_id . '"' . $selected . '>' . $tag->name . '</p>';
							}
							
							?>
						</select>
						<button type="submit" class="btn btn-warning">Apply</button>
					</form>
					
					
					<!-- Table -->
					

					<table class="tablepress">
						<thead>
							<tr>
								<th>Photo</th>
								<th>Name</th>
								<th>MIT Affiliation</th>
								<th>Music/Professional Work</th>
								<th>Interview Dates</th>
							</tr>
						</thead>
						<tbody class="row-hover">
	
							<?php
							
							
							if ( $interviewees->have_posts() ) :
								while ( $interviewees->have_posts() ) : $interviewees->the_post(); ?>
	
							<tr>
								<td class="post-thumbnail"><?php
								
									if ( has_post_thumbnail() ) {
										the_post_thumbnail( 'interviewee-index' );
									} else {
										echo '<img src="' . get_stylesheet_directory_uri() . '/images/no-photo.png' . '" alt="No Photo">';
									}
								?></td>
								<td><h3><?php the_title(); ?></h3></td>
								<td><?php echo types_render_field( 'mit_affiliation' ); ?></td>
								<td><?php echo types_render_field( 'music_affiliation' ); ?></td>
								<td><?php
								
									$interviews = get_the_terms( $interviewees->ID, 'interviews' );
									if ( $interviews ) {
										usort($interviews, "sortInterviews");

									
										echo '<ul class="arrows">';
										foreach ( $interviews as $interview ) {
											echo '<li><a href="' . get_permalink( $interview->term_id ) . '">' . get_the_time( 'm/d/Y', $interview->term_id ) . '</a></li>';
										}
										echo '</ul>';
									} else {
										echo '';
									}
								
								?></td>
							</tr>
	
								<?php endwhile; ?>
							<?php else: ?>
	
							<tr>
								<td colspan="5" class="nothing">Sorry, there were no Interviewees found with that status and topic combination. <a href=".">Reset Filters</a></td>
							</tr>
						
							
							<?php endif; ?>
							
							
						</tbody>
					</table>
					
			
			</div>
			
		</div><!--end div#stage -->
		
<?php get_footer(); ?>