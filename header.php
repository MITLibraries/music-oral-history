<?php
/**
 * MOH Theme header.
**/
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?> class="no-js">
<!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<!-- <meta name="format-detection" content="telephone=no"> -->
<!--<meta name="viewport" content="width=device-width" />-->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<?php // Loads HTML5 JavaScript file to add support for HTML5 elements in older IE versions. ?>
<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js" type="text/javascript"></script>
<![endif]-->
<?php wp_head(); ?>
<?php
		//$askUrl = get_post_meta($post->ID, "ask_us_override", 1);
		$askUrl = "";
		if ($askUrl == "") $askUrl = "/ask";
?>
	<script>
		todayDate="";
	</script>
</head>

<body <?php body_class(); ?>>
	<div id="container">
		<header class="header-main group">

			<a href="/" class="logo-mit-lib">MIT Libraries</a>

			<div class="toolbox">
				<svg class="icon-arrow-right" width="2048" height="2048" viewBox="-256 -384 2048 2048" xmlns="http://www.w3.org/2000/svg"><g transform="scale(1 -1) translate(0 -1280)"><path d="M1472 576q0 -54 -37 -91l-651 -651q-39 -37 -91 -37q-51 0 -90 37l-75 75q-38 38 -38 91t38 91l293 293h-704q-52 0 -84.5 37.5t-32.5 90.5v128q0 53 32.5 90.5t84.5 37.5h704l-293 294q-38 36 -38 90t38 90l75 75q38 38 90 38q53 0 91 -38l651 -651q37 -35 37 -90z" fill="black" /></g></svg>
				<a class="yourAccount" href="/barton-account">Your Account</a>
				<div id="asktell" class="button-ask-tell">
					<img class="hidden-phone" src="<?php bloginfo('template_directory') ?>/images/ask-tell.png" alt="" usemap="#asktell"/>
					<img class="visible-phone" src="<?php bloginfo('template_directory') ?>/images/ask-tell-mobile.png" alt="" usemap="#asktellmobile"/>
					<map name="asktell">
						<area shape="poly" coords="0,2,80,3,65,24,1,26" href="<?php echo $askUrl ?>" alt="Ask Us" title="Ask Us"   />
						<area shape="poly" coords="150,0,150,23,71,22,84,0" href="/suggestions" alt="Tell Us" title="Tell Us"   />
					</map>
					<map name="asktellmobile">
						<area shape="poly" coords="0,2,80,3,65,24,1,26" href="<?php echo $askUrl ?>" alt="Ask Us" title="Ask Us"   />
						<area shape="poly" coords="150,0,150,23,71,22,84,0" href="/suggestions" alt="Tell Us" title="Tell Us"   />
					</map>
				</div>
			</div>

		<?php
			$args = array(
								'container' => 'nav',
								'container_class' => 'nav-main',
							);
			wp_nav_menu($args); ?> 

	</header>