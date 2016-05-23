<?php
/**
 * music-oral-history functions and definitions.
 *
 * @link https://github.com/MITLibraries/music-oral-history
 *
 * @package WordPress
 * @subpackage music-oral-history
 * @since 1.1.11
 */

add_filter( 'body_class', 'moh_body_class' );
function moh_body_class( $classes ) {
	$classes[] = 'moh';
	return $classes;
}

function moh_scripts_styles() {

	/* Register JS & CSS */

	wp_register_style( 'global.css', get_stylesheet_directory_uri().'/css/build/minified/global.css', array('libraries-global'), '20140423' );

	wp_register_script( 'easyXDM', get_stylesheet_directory_uri().'/js/libs/easyXDM.min.js', array( 'jquery' ), false, false );

	wp_register_script( '3play', get_stylesheet_directory_uri().'/js/libs/3playmedia.js', array( 'jquery' ), '3.0', true, true );
	wp_register_script( '3play-player', get_stylesheet_directory_uri().'/js/libs/3play.player.js', array( 'jquery' ), false, true );
	wp_register_script( '3play-hack', get_stylesheet_directory_uri().'/js/3play.hack.js', array('jquery', '3play', '3play-player' ), false, true );

	/* Queue scripts and styles */

	wp_enqueue_style( 'global.css' );
	wp_enqueue_style( 'twentytwelve-style', get_stylesheet_uri(), array(), '20140328' );

	/* Page-specific JS */

	if ( is_page( 'search-all-interviews' ) ) {
			wp_enqueue_style( 'p3' );
			wp_enqueue_script( 'easyXDM' );
			wp_enqueue_script( '3play' );
			wp_enqueue_script( '3play-player' );
			wp_enqueue_script( '3play-hack' );
	}

	if ( is_single() ) {
		wp_enqueue_script( 'easyXDM' );
		wp_enqueue_script( '3play' );
	}

}

add_action( 'wp_enqueue_scripts', 'moh_scripts_styles' );

/* Widget sidebar for About page */

function moh_widgets_init() {
	register_sidebar( array(
		'name' => __( 'About Sidebar', 'moh' ),
		'id' => 'sidebar-4',
		'description' => __( 'Appears exclusively on the About Page template, which has its own widgets.', 'moh' ),
		'before_widget' => '<aside id="%1$s" class="widget %2$s" role="complementary">',
		'after_widget' => '</aside>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
}
add_action( 'widgets_init', 'moh_widgets_init' );

/* Custom featured image sizes */

add_image_size( 'interviewee', 320, 320, true );
add_image_size( 'interviewee-index', 160, 160, true );

/* Allows the use of commas in tags */

if ( !is_admin() ) {
	function comma_tag_filter( $tag_arr ) {
		$tag_arr_new = $tag_arr;
		if ( $tag_arr->taxonomy == 'post_tag' && strpos( $tag_arr->name, '--' ) ) {
			$tag_arr_new->name = str_replace( '--', ', ', $tag_arr->name );
		}
		return $tag_arr_new;
	}
	add_filter( 'get_post_tag', 'comma_tag_filter' );

	function comma_tags_filter( $tags_arr ) {
		$tags_arr_new = array();
		foreach ( $tags_arr as $tag_arr ) {
			$tags_arr_new[] = comma_tag_filter( $tag_arr );
		}
		return $tags_arr_new;
	}
	add_filter( 'get_terms', 'comma_tags_filter' );
	add_filter( 'get_the_terms', 'comma_tags_filter' );
}

function sortInterviews( $a, $b ) {

	$aval = get_the_time( 'Ymd', $a->term_id );
	$bval = get_the_time( 'Ymd', $b->term_id );

	if ( $aval == $bval ) {
		return 0;
	}
	return ($aval > $bval) ? 1 : -1;

}