<?php
/**
 * The template for displaying a post header.
 *
 * @package MIT_Libraries_Child
 * @since 2.0.0
 */

?>
<div class="header-section group 
<?php
if ( is_front_page() ) {
	echo 'hasImage';
} 
?>
>
	<?php if ( is_front_page() ) : ?>
		<div class="child-header-tall">
			<div class="page-header-home">
				<h1 class="child-page-title"><?php bloginfo(); ?></h1>
				<?php
				// Checks to see if tagline exists.
				$description = get_bloginfo( 'description' );
				if ( ! empty( $description ) ) :
					?>
					<p class="child-tagline"><?php echo esc_html( $description ); ?></p>
					<?php
				endif;

				global $blog_id;
				$current_blog_id = $blog_id;

				$site_name = get_bloginfo( 'name' );


				?>

			</div>

			<?php get_template_part( 'inc/header','image' ); ?>

		</div>

	<?php else : ?>

		<div class="child-header-short">
			<div class="page-header-internal">
				<div class="child-page-title"><a href="<?php bloginfo( 'url' ); ?>"><?php bloginfo( 'name' ); ?></a></div>
			</div>

			<?php get_template_part( 'inc/header','image' ); ?>

		</div>

	<?php endif; ?>
</div>

<?php get_template_part( 'inc/nav', 'moh' ); ?>
