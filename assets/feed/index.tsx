import { Dashicon } from "@wordpress/components";
import { BlockConfiguration } from "@wordpress/blocks";
import { FunctionComponent } from "react";

declare var LASDFG_Feed: {
	platforms: Array<Omit<PlatformType, 'icon'> & { icon: string }>
}

type ThumbnailImage = {
	url: string
	width: number
	height: number
}

type PlatformType = {
	name: string
	title: string
	idLabel: string
	icon?: Dashicon.Icon | string
};

type PlatformMeta = {
	platform: string
	title: string
	author: string
	url: string
	thumbnail: string
};

type PlatformItem = {
	platform: string
	id: string
	meta?: PlatformMeta
};

( function ( { blocks, element, i18n, blockEditor, components, compose, ajax } ) {
	const el = element.createElement;
	const { __, _x } = i18n;

	const { TextControl, IconButton, Button, Icon, Placeholder, Modal, DropdownMenu, MenuItem } = components;
	const { withState } = compose;
	const { useState, Fragment } = React;

	const platforms: PlatformType[] = LASDFG_Feed.platforms;

	type Feed = {
		items: PlatformItem[]
		align: string
		limit: number
	}

	function getPlatform( platformName: string ): PlatformType {
		const matches = platforms.filter( platform => platform.name === platformName );
		if ( !matches.length ) {
			return {
				name: 'unknown',
				title: 'Unknown',
				icon: 'warning',
				idLabel: 'ID',
			};
		}
		return matches[ 0 ];
	}

	async function getPlatformMeta( platform: PlatformItem ) {
		return ajax.post<PlatformMeta>( 'get-platform-meta', {
			platform: platform.platform,
			id: platform.id,
		} );
	}

	const PlatformIcon: FunctionComponent<{ icon: string }> = ( { icon } ) => {
		if ( /^https?:\/\//.test( icon ) ) {
			return <img src={icon} />;
		} else if ( typeof icon === 'string' ) {
			return <Icon icon={icon as Dashicon.Icon} />
		}
		return null;
	}

	type AddPlatformPopoverState = {
		onClick: ( platform: PlatformType ) => void,
	}

	const PlatformPopover: FunctionComponent<AddPlatformPopoverState> = ( { onClick } ) => {
		return <DropdownMenu
			label={__( 'Add Platform', 'lasdfg' )}
			icon="plus"
		>
			{() => <Fragment>{(
				platforms.map( ( platform: PlatformType ) => (
					<MenuItem
						icon={platform.icon ? <PlatformIcon icon={platform.icon} /> : undefined}
						onClick={() => onClick( platform )}
					>
						{platform.title}
					</MenuItem> ) )
			)}</Fragment>}
		</DropdownMenu>
	};

	const blockConfig: BlockConfiguration<Feed> = {

		title: __( 'Social Feed', 'lasdfg' ),

		icon: 'networking',

		category: 'common',

		supports: {
			align: true,
			html: false,
		},

		attributes: {

			align: {
				type: 'string',
				default: undefined,
			},

			items: {
				type: 'array',
				default: [],
			},

			limit: {
				type: 'number',
				default: 12,
			},

		},

		edit( props ) {
			const { className, attributes, setAttributes, isSelected } = props;

			let [ platformModalVisible, setPlatformModalVisibility ] = useState( false );

			let [ newPlatformItem, updateNewPlatformItem ] = useState<PlatformItem>( {
				id: '',
				platform: '',
			} );

			return <div className={className + ( ( isSelected ? ' is-selected' : '' ) )}>

				<div className="preview">
					
				</div>

				<Placeholder
					icon={( attributes.items.length ? '' : blockConfig.icon ) as Dashicon.Icon}
					label={attributes.items.length ? '' : blockConfig.title}
					instructions={attributes.items.length ? '' : __( 'Add a platform.', 'lasdfg' )}
					isColumnLayout={true}
					// style={{ visibility: isSelected ? 'visible' : 'hidden' }}
				>
					{attributes.items.map( ( item, index ) => {
						const platform = getPlatform( item.platform );

						let avatar: string | null = null;
						let title: string | null = null;
						let icon: string | SVGElement | null = null;

						if ( item.meta ) {
							avatar = item.meta.thumbnail || null;
							title = item.meta.title || 'Unknown';
							icon = platform.icon || null;
						}

						return <section key={index} className="platform-item">
							<div className="avatar">
								{avatar && (
									<img src={avatar} width="60" height="60" />
								)}
							</div>
							<div className="title">{title}</div>
							<div className="platform-name">
								{icon && <PlatformIcon icon={icon} />}
								{platform.title} &bull; <code>{item.id}</code>
							</div>
							<IconButton
								icon="no"
								label={__( 'Remove platform', 'lasdfg' )}
								isDestructive
								onClick={() => {
									const items = [ ...attributes.items ];
									items.splice( index, 1 );
									setAttributes( { items } );
								}}
							/>
						</section>;
					} )}
					<PlatformPopover onClick={platform => {
						updateNewPlatformItem( {
							id: '',
							platform: platform.name,
						} );
						setPlatformModalVisibility( true );
					}} />
				</Placeholder>

				{platformModalVisible && (
					<Modal
						title={getPlatform( newPlatformItem.platform ).title}
						onRequestClose={() => setPlatformModalVisibility( false )}
					>
						<TextControl
							label={getPlatform( newPlatformItem.platform ).idLabel}
							value={newPlatformItem.id}
							autoFocus={true}
							onChange={id => updateNewPlatformItem( { ...newPlatformItem, id } )}
						/>
						<Button
							onClick={async () => {
								try {
									const meta = await getPlatformMeta( newPlatformItem );

									const _newPlatformItem: PlatformItem = {
										...newPlatformItem,
										meta,
									};

									updateNewPlatformItem( _newPlatformItem );

									setAttributes( {
										items: [
											...attributes.items,
											{ ..._newPlatformItem },
										],
									} );

									setPlatformModalVisibility( false );

								} catch ( e ) {
									alert( e );
								}
							}}
						>
							{_x( 'Add', 'Add platform button', 'lasdfg' )}
						</Button>
					</Modal>
				)}

			</div>;
		},

		save() {
			return null;
		},

	};

	blocks.registerBlockType( 'lasdfg/feed', blockConfig );

} )( window.wp );
