<?php
/**
 * This partial contains the archive of interviewees.
 *
 * @link https://github.com/MITLibraries/music-oral-history
 *
 * @package music_oral_history
 * @since 2.0.0
 */

$cat_query = intval( @$_GET[ 'status' ] );
$tag_query = intval( @$_GET[ 'topic' ] );
( $cat_query ) ? $cat = '&cat=' . $cat_query : $cat = '';
( $tag_query ) ? $tag = '&tag_id=' . $tag_query : $tag = '';


$interviewees = new WP_Query( '&order=ASC&meta_key=wpcf-sort-order&orderby=meta_value&post_type=interviewees&posts_per_page=-1' . $cat . $tag );


get_header('moh');



?>
		
<?php get_template_part('inc/breadcrumbs','interviewees'); ?>


		
<div id="stage" class="inner" role="main">	
	<?php get_template_part( 'inc/postHead' ); ?>	
	<div class="title-page flex-container">
		<h3 class="title-sub">Index of interviewees</h3>
	</div>
			
	<div id="content">
					
					<form id="filters" action="." method="get">
					<div class="select-style-first">
							<select name="status">
							<option class="uppercase" value="0">STATUS:</option>
							<?php
							
							$categories = get_terms( 'category' );
							foreach ( $categories as $cat) {
								$selected = ( $cat->term_id == $cat_query ) ? ' selected' : '';
								echo '<option value="' . $cat->term_id . '"' . $selected . '>' . $cat->name . '</p>';
							}
							
							?>
						</select>
					</div>
					<div class="select-style-second">
						<select name="topic">
							<option value="0">TOPIC:</option>
							<?php
							
							$tags = get_terms( 'post_tag' );
							foreach ( $tags as $tag) {
								$selected = ( $tag->term_id == $tag_query ) ? ' selected' : '';
								echo '<option value="' . $tag->term_id . '"' . $selected . '>' . $tag->name . '</p>';
							}
							
							?>
						</select>
					</div>
						<button type="submit" class="btn btn-warning">Apply</button>
					</form>
					
					
					<!-- Table -->
					

					<table class="tablepress">
						<thead>
							<tr>
								<th class="moh-column-one">Photo</th>
								<th class="moh-column-two">Name</th>
								<th class="moh-column-three">MIT Affiliation</th>
								<th class="moh-column-four">Music/Professional Work</th>
								<th class="moh-column-five">Interview Dates</th>
							</tr>
						</thead>
						<tbody class="row-hover">
	
							<?php
							
							
							if ( $interviewees->have_posts() ) :
								while ( $interviewees->have_posts() ) : $interviewees->the_post(); ?>
	
							<tr>
								<td class="moh-column-one"><span class="post-thumbnail"><?php
								
									if ( has_post_thumbnail() ) {
										the_post_thumbnail( 'interviewee-index' );
									} else {
										echo '<img src="' . get_stylesheet_directory_uri() . '/images/no-photo.png' . '" alt="No Photo">';
									}
								?></span></td>
								<td class="moh-column-two"><span class="mobile-include"><?php
								
									if ( has_post_thumbnail() ) {
										the_post_thumbnail( 'interviewee-index' );
									} else {
										echo '<img src="' . get_stylesheet_directory_uri() . '/images/no-photo.png' . '" alt="No Photo">';
									}
								?></span><span class="mobile-right"><h3 class="interviewee-name"><?php the_title(); ?></h3></span></td>
								<td class="moh-column-three"><span class="th-title">MIT Affiliation</span><span class="mobile-right"><?php echo types_render_field( 'mit_affiliation' ); ?></span></td>
								<td class="moh-column-four"><span class="th-title">Music/<br class="ignore-on-tablet">Professional<br>Work</span><span class="mobile-right"><?php echo types_render_field( 'music_affiliation' ); ?></span></td>
								<td class="moh-column-five"><span class="th-title">Interview Dates</span><span class="mobile-right"><?php
								
									$interviews = get_the_terms_override( $interviewees->ID, 'interviews' );
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
								
								?></span></td>
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

