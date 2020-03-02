import * as Blocks from '@wordpress/blocks';
import * as Element from '@wordpress/element';
import * as I18n from '@wordpress/i18n';
import * as Components from '@wordpress/components';
import * as BlockEditor from '@wordpress/block-editor';
import * as Compose from '@wordpress/compose';

type WordPressAjaxPromise<T = any> = JQueryPromise<T> & { abort(): void };

declare global {
	interface Window {
		wp: {
			blocks: typeof Blocks
			element: typeof Element
			i18n: typeof I18n
			components: typeof Components
			blockEditor: typeof BlockEditor
			compose: typeof Compose

			ajax: {

				settings: {
					url: string
				}

				post: {
					<T = any>( action: string, data: { [ key: string ]: any } ): WordPressAjaxPromise<T>
					<T = any>( settings: JQueryAjaxSettings, data: { [ key: string ]: any } ): WordPressAjaxPromise<T>
				}

				send: {
					<T = any>( action: string, settings: JQueryAjaxSettings ): WordPressAjaxPromise<T>
					<T = any>( data: { [ key: string ]: any }, settings: JQueryAjaxSettings ): WordPressAjaxPromise<T>
				}

			}
		}
	}
}
