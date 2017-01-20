<?php
/**
 * This partial contains the breadcrumb for a child page.
 *
 * @link https://github.com/MITLibraries/music-oral-history
 *
 * @package WordPress
 * @subpackage music-oral-history
 * @since 1.1.11
 */

?>
<div class="betterBreadcrumbs hidden-phone" role="navigation" aria-label="breadcrumbs">
	<span><a href="/">Libraries home</a></span>
	<span><a href="<?php echo home_url(); ?>"><?php bloginfo(); ?></a></span>
	<?php moh_child_breadcrumb(); ?>
</div>
