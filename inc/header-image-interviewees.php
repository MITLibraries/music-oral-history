<?php
/**
 * This is the template the loads the relevant hero image.
 *
 * @package MIT_Libraries_Child
 * @since 2.0.0
 */

// Hero images use a different class on site homepages.
$hero_class = 'header-bg-image-short';
if ( is_front_page() ) {
	$hero_class = 'header-bg-image-high';
}

?>
<div class="<?php echo esc_attr( $hero_class ); ?>">
<?php

	if ( has_header_image() && !is_archive() ) {
		
		echo '<!-- site hero -->';
?>
	<img src="<?php header_image(); ?>" alt="<?php echo esc_attr( get_bloginfo( 'title' ) ); ?>" />
<?php
	
		// Final choice is to get the basic image provided by the theme.
		echo '<!-- theme hero -->';
?>
    <img
		src="<?php echo( esc_url( get_theme_root_uri() . '/libraries-child-new/images/hayden.png' ) ); ?>"
		alt="<?php echo( esc_attr( get_bloginfo( 'title' ) ) ); ?>" 
    />
<?php
	}
?>
</div>
