<?php declare( strict_types = 1 );

namespace LachlanArthur\SocialDevFeedGutenberg\Blocks;

abstract class AbstractBlock {

	public $name;

	public $scriptDeps = [ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-components', 'wp-util' ];
	public $editorDeps = [];
	public $styleDeps  = [];

	public function __construct() {

		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		$this->hooks();

	}

	public function hooks() {

		add_action( 'init', [ $this, 'register' ], 100 );

	}

	public function register() {

		$url = LASDFG_ASSETS_URL  . "/{$this->name}";
		$dir = LASDFG_ASSETS_PATH . "/{$this->name}";

		$script = 'index.js';
		$editor = 'editor.css';
		$style  = 'style.css';

		wp_register_script( __CLASS__ . '\\script', "$url/$script", $this->scriptDeps, filemtime( "$dir/$script" ) );
		wp_register_style(  __CLASS__ . '\\editor', "$url/$editor", $this->editorDeps, filemtime( "$dir/$editor" ) );
		wp_register_style(  __CLASS__ . '\\style',  "$url/$style",  $this->styleDeps,  filemtime( "$dir/$style" ) );

		wp_localize_script( __CLASS__ . '\\script', 'LASDFG_Feed', $this->getJsVar() );

		register_block_type( "lasdfg/{$this->name}", array_merge( [
			'editor_script'   => __CLASS__ . '\\script',
			'editor_style'    => __CLASS__ . '\\editor',
			'style'           => __CLASS__ . '\\style',
		], $this->getBlockRegistrationArgs() ) );

	}

	public function getBlockRegistrationArgs() {

		return [];

	}

	public function getJsVar() {

		return null;

	}

}
