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

	wp_register_style( 'global.css', get_stylesheet_directory_uri().'/css/build/minified/global.css', array( 'libraries-global' ), '20140423' );

	wp_register_style( 'bootstrapCSS', get_stylesheet_directory_uri() . '/css/bootstrap.css', 'false', '', false );



	wp_register_script( 'easyXDM', get_stylesheet_directory_uri().'/js/libs/easyXDM.min.js', array( 'jquery' ), false, false );

	wp_register_script( '3play', get_stylesheet_directory_uri().'/js/libs/3playmedia.js', array( 'jquery' ), '3.0', true, true );
	wp_register_script( '3play-player', get_stylesheet_directory_uri().'/js/libs/3play.player.js', array( 'jquery' ), false, true );
	wp_register_script( '3play-hack', get_stylesheet_directory_uri().'/js/3play.hack.js', array( 'jquery', '3play', '3play-player' ), false, true );

	wp_register_script( 'bootstrap-js', '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js', array( 'jquery' ), true ); // All the bootstrap javascript goodness.



	/* Queue scripts and styles */

	wp_enqueue_style( 'global.css' );
	wp_enqueue_style( 'twentytwelve-style', get_stylesheet_uri(), array(), '20140328' );
	
	wp_enqueue_style( 'bootstrap', '//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css' );
	wp_enqueue_script( 'bootstrap-js', '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js', array( 'jquery' ), true );
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

if ( ! is_admin() ) {
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

/**
 * Define MOH-specific child breadcrumb function
 */
function moh_child_breadcrumb() {

	global $post;

	if ( is_search() ) {
		echo '<span>Search</span>';
	}

	if ( ! is_child_page() && is_page() || is_category() || is_single() ) {
		echo '<span>' . the_title() . '</span>';
		return;
	}

	if ( is_child_page() ) {
		$parent_link = get_permalink( $post->post_parent );
		$parent_title = get_the_title( $post->post_parent );
		$start_link = '<a href="';
		$end_link = '">';
		$close_link = '</a>';
		$parent_breadcrumb = $start_link . $parent_link . $end_link . $parent_title . $close_link;
		$page_title = get_the_title( $post );
		$page_link = get_permalink( $post );
		$child_breadcrumb = $start_link . $page_link . $end_link . $page_title . $close_link;
	}

	if ( '' !== $parent_breadcrumb ) {echo '<span>' . esc_html( $parent_breadcrumb ) . '</span>';}
	if ( '' !== $child_breadcrumb ) {echo '<span>' . esc_html( $page_title ) . '</span>';}

}

/**
 * Address CPTonomies plugin bug
 *
 * @param type $post post.
 * @param type $taxonomy taxonomy.
 */
function get_the_terms_override( $post, $taxonomy ) {
	if ( ! $post = get_post( $post ) ) {
		return false;
	}

	$terms = wp_get_object_terms( $post->ID, $taxonomy );
	if ( ! is_wp_error( $terms ) ) {
		$term_ids = wp_list_pluck( $terms, 'term_id' );
		wp_cache_add( $post->ID, $term_ids, $taxonomy . '_relationships' );
	}
	$terms = apply_filters( 'get_the_terms', $terms, $post->ID, $taxonomy );

	if ( empty( $terms ) ) {
		return false;
	}

	return $terms;
}

/**
 * Define custom header image size
 */
function customHeader() {

	$args = array(
		'width'         => 1250,
		'height'        => 800,
		'uploads'       => true,
	);

	add_theme_support( 'custom-header', $args );

}
add_action( 'after_setup_theme', 'customHeader' );

