<?php declare( strict_types = 1 );

namespace LachlanArthur\SocialDevFeedGutenberg\Blocks;

use LachlanArthur\SocialDevFeed;
use LachlanArthur\SocialDevFeed\Meta;
use LachlanArthur\SocialDevFeed\Platforms;

class Feed extends AbstractBlock {

	public $name = 'feed';

	public $platformClasses = [];

	public function hooks() {
		parent::hooks();

		add_action( 'init', [ $this, 'setApiKeys' ], 10, 0 );

		add_action( 'init', [ $this, 'registerDefaultPlatforms' ], 20, 0 );

		add_action( 'wp_ajax_get-platform-meta', [ $this, 'ajaxGetPlatformMeta' ] );
	}

	public function getBlockRegistrationArgs() {

		return [

			'render_callback' => [ $this, 'render' ],
			'attributes'      => [

				'align' => [
					'type' => 'string',
				],

				'platforms' => [
					'type' => 'array',
				],

				'limit' => [
					'type' => 'number',
					'default' => 12,
				],
		
			],

		];

	}

	public function getJsVar() {

		$platforms = [];

		foreach ( $this->platformClasses as $platformClass ) {
			$name = $platformClass::getName();

			$icon = "/icons/{$name}.svg";
			$iconUrl = null;

			if ( file_exists( LASDFG_ASSETS_PATH . $icon ) ) {
				$iconUrl = LASDFG_ASSETS_URL . $icon;
			}

			$platforms[] = [
				'name' => $name,
				'title' => $platformClass::getTitle(),
				'idLabel' => $platformClass::getIdLabel(),
				'icon' => $iconUrl,
			];
		}

		return [
			'platforms' => $platforms,
		];

	}

	public function registerPlatform( $platformClass ) {

		$this->platformClasses[ $platformClass::getName() ] = $platformClass;

	}

	public function setApiKeys() {

		if ( defined( 'LASDFG_YOUTUBE_API_KEY' ) ) {
			Platforms\YouTube::setApiKey( LASDFG_YOUTUBE_API_KEY );
		}

	}

	public function registerDefaultPlatforms() {

		$this->registerPlatform( Platforms\Instagram::class );

		if ( Platforms\YouTube::hasApiKey() ) {
			$this->registerPlatform( Platforms\YouTube::class );
		}

	}

	public function getFeed( $items ) {

		$feed = new SocialDevFeed\Feed();

		foreach ( $items as $item ) {

			$platformClass = $this->platformClasses[ $item[ 'platform' ] ] ?? null;

			if ( empty( $platformClass ) || ! class_exists( $platformClass ) ) continue;

			$feed->add( new $platformClass( $item[ 'id' ] ) );

		}

		return $feed;

	}

	public function render( $atts ) {

		$feed = $this->getFeed( $atts[ 'items' ] );

		$entries = $feed->getEntries();

		$entries = array_slice( $entries, 0, $atts[ 'limit' ] );

		$classes = [ 'wp-block-lasdfg-feed' ];

		if ( isset( $atts[ 'align' ] ) ) {
			$classes[] = 'align' . $atts[ 'align' ];
		}

		ob_start();

		?>
		<div class="<?= implode( ' ', $classes ) ?>">
			<?php $this->loadTemplate( $entries ); ?>
		<div>
		<?php

		return ob_get_clean();

	}

	public function loadTemplate( $entries ) {

		require apply_filters( 'lasdfg_feed_template', LASDFG_TEMPLATES_PATH . '/feed.php' );

	}

	public function ajaxGetPlatformMeta() {

		$platformName = $_REQUEST[ 'platform' ] ?? '';
		$platformId   = $_REQUEST[ 'id' ] ?? '';

		$platformClass = $this->platformClasses[ $platformName ] ?? null;

		if ( empty( $platformClass ) ) wp_send_json_error( __( 'Unknown platform', 'lasdfg' ) );
		if ( empty( $platformId ) )    wp_send_json_error( sprintf( _x( '%s required', '<ID field label> required', 'lasdfg' ), $platformClass::getIdLabel() ) );

		$feed = new \LachlanArthur\SocialDevFeed\Feed();

		/** @var Meta */
		$meta = $feed->getCachedMeta( new $platformClass( $platformId ) );

		// Only include the first thumbnail
		$meta->thumbnail = $meta->getThumbnail()->url;
		unset( $meta->thumbnails );

		wp_send_json_success( $meta );

	}

}
