<?php
/**
 * The template for displaying the child navigation bar.
 *
 * @package music_oral_history
 * @since 2.0.0
 */

$siteName = get_bloginfo( 'name' );
$countPosts = wp_count_posts( 'page' )->publish;
if ( $countPosts > 1 ) {
?>

<nav class="navbar navbar-default" role="navigation">
	<div class="container-fluid">
	<!-- Brand and toggle get grouped for better mobile display -->
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand mobile-display">
				<?php _e( 'View Menu' ); ?>
			</a>
		</div>
		<?php
		wp_nav_menu(
			array(
				'menu'              => 'Sub Nav',
				'theme_location'    => 'child-nav',
				'container'         => 'div',
				'container_class'   => 'collapse navbar-collapse',
				'container_id'      => 'bs-example-navbar-collapse-1',
				'menu_class'        => 'nav navbar-nav nav-second',
				'fallback_cb'       => 'navwalker::fallback',
				'walker'            => new navwalker(),
				)
		);
		?>
	</div>
</nav>
<script>
	$('.dropdown-toggle').click(function() {
	var location = $(this).attr('href');
	window.location.href = location;
	return false;
});
</script>

<!-- #site-navigation -->

<?php } ?>
