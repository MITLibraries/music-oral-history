<?php
/**
 * This partial contains the breadcrumb for a generic page.
 *
 * @link https://github.com/MITLibraries/music-oral-history
 *
 * @package WordPress
 * @subpackage music-oral-history
 * @since 1.1.11
 */

?>
<div class="betterBreadcrumbs" role="navigation" aria-label="breadcrumbs">
	<a href="<?php echo home_url(); ?>">Music Oral History home</a>
	&raquo; <?php the_title(); ?>
</div>
