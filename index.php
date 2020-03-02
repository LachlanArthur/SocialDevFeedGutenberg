<?php
/**
 * Plugin Name:  Social Dev Feed Gutenberg
 * Description:  Social media feeds in Gutenberg.
 * Version:      1.0.0
 * Author:       Lachlan Arthur
 * Author URI:   https://lach.la/
 * License:      MIT
 * Text Domain:  lasdfg
 *
 * Uses icons from FontAwesome
 */

define( 'LASDFG_TEMPLATES_PATH', __DIR__ . '/templates' );
define( 'LASDFG_ASSETS_PATH', __DIR__ . '/assets' );
define( 'LASDFG_ASSETS_URL', plugins_url( '/assets', __FILE__ ) );

$GLOBALS[ 'LASDFG_Block_Feed' ] = new LachlanArthur\SocialDevFeedGutenberg\Blocks\Feed();
