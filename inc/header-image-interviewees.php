<?php
/**
 * This is the template the loads the relevant hero image.
 *
 * @package music_oral_history
 * @since 2.0.0
 */

$hero_class = 'header-bg-image-short';
?>
<div class="<?php echo esc_attr( $hero_class ); ?>">
<?php

if ( has_header_image() && ! is_archive() ) {
		
	echo '<!-- site hero -->';
?>
	<img src="<?php header_image(); ?>" alt="<?php echo esc_attr( get_bloginfo( 'title' ) ); ?>" />
<?php
} else {
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
