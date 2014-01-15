<?php

add_filter('body_class', 'moh_body_class');
function moh_body_class($classes) {
	$classes[] = 'moh';
	return $classes;
}

function moh_scripts_styles() {

/* Register JS & CSS */

wp_register_script('productionJS', get_stylesheet_directory_uri().'/js/build/production.min.js', array('jquery'), false, true);

/* Queue scripts and styles */

wp_enqueue_script('productionJS');

/* Page-specific JS */

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

    function comma_tags_filter( $tags_arr ){
        $tags_arr_new = array();
        foreach ( $tags_arr as $tag_arr ) {
            $tags_arr_new[] = comma_tag_filter( $tag_arr );
        }
        return $tags_arr_new;
    }
    add_filter( 'get_terms', 'comma_tags_filter' );
    add_filter( 'get_the_terms', 'comma_tags_filter' );
}

function sortInterviews($a, $b) {
	
	$aval = get_the_time('Ymd', $a->term_id);
	$bval = get_the_time('Ymd', $b->term_id);
	
	
	if ($aval == $bval) {
		return 0;
	}
	return ($aval > $bval) ? 1 : -1;

}