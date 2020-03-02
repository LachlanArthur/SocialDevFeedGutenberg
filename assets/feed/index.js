var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function ({ blocks, element, i18n, blockEditor, components, compose, ajax }) {
    const el = element.createElement;
    const { __, _x } = i18n;
    const { TextControl, IconButton, Button, Icon, Placeholder, Modal, DropdownMenu, MenuItem } = components;
    const { withState } = compose;
    const { useState, Fragment } = React;
    const platforms = LASDFG_Feed.platforms;
    function getPlatform(platformName) {
        const matches = platforms.filter(platform => platform.name === platformName);
        if (!matches.length) {
            return {
                name: 'unknown',
                title: 'Unknown',
                icon: 'warning',
                idLabel: 'ID',
            };
        }
        return matches[0];
    }
    function getPlatformMeta(platform) {
        return __awaiter(this, void 0, void 0, function* () {
            return ajax.post('get-platform-meta', {
                platform: platform.platform,
                id: platform.id,
            });
        });
    }
    const PlatformIcon = ({ icon }) => {
        if (/^https?:\/\//.test(icon)) {
            return el("img", { src: icon });
        }
        else if (typeof icon === 'string') {
            return el(Icon, { icon: icon });
        }
        return null;
    };
    const PlatformPopover = ({ onClick }) => {
        return el(DropdownMenu, { label: __('Add Platform', 'lasdfg'), icon: "plus" }, () => el(Fragment, null, (platforms.map((platform) => (el(MenuItem, { icon: platform.icon ? el(PlatformIcon, { icon: platform.icon }) : undefined, onClick: () => onClick(platform) }, platform.title))))));
    };
    const blockConfig = {
        title: __('Social Feed', 'lasdfg'),
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
        edit(props) {
            const { className, attributes, setAttributes, isSelected } = props;
            let [platformModalVisible, setPlatformModalVisibility] = useState(false);
            let [newPlatformItem, updateNewPlatformItem] = useState({
                id: '',
                platform: '',
            });
            return el("div", { className: className + ((isSelected ? ' is-selected' : '')) },
                el("div", { className: "preview" }),
                el(Placeholder, { icon: (attributes.items.length ? '' : blockConfig.icon), label: attributes.items.length ? '' : blockConfig.title, instructions: attributes.items.length ? '' : __('Add a platform.', 'lasdfg'), isColumnLayout: true },
                    attributes.items.map((item, index) => {
                        const platform = getPlatform(item.platform);
                        let avatar = null;
                        let title = null;
                        let icon = null;
                        if (item.meta) {
                            avatar = item.meta.thumbnail || null;
                            title = item.meta.title || 'Unknown';
                            icon = platform.icon || null;
                        }
                        return el("section", { key: index, className: "platform-item" },
                            el("div", { className: "avatar" }, avatar && (el("img", { src: avatar, width: "60", height: "60" }))),
                            el("div", { className: "title" }, title),
                            el("div", { className: "platform-name" },
                                icon && el(PlatformIcon, { icon: icon }),
                                platform.title,
                                " \u2022 ",
                                el("code", null, item.id)),
                            el(IconButton, { icon: "no", label: __('Remove platform', 'lasdfg'), isDestructive: true, onClick: () => {
                                    const items = [...attributes.items];
                                    items.splice(index, 1);
                                    setAttributes({ items });
                                } }));
                    }),
                    el(PlatformPopover, { onClick: platform => {
                            updateNewPlatformItem({
                                id: '',
                                platform: platform.name,
                            });
                            setPlatformModalVisibility(true);
                        } })),
                platformModalVisible && (el(Modal, { title: getPlatform(newPlatformItem.platform).title, onRequestClose: () => setPlatformModalVisibility(false) },
                    el(TextControl, { label: getPlatform(newPlatformItem.platform).idLabel, value: newPlatformItem.id, autoFocus: true, onChange: id => updateNewPlatformItem(Object.assign(Object.assign({}, newPlatformItem), { id })) }),
                    el(Button, { onClick: () => __awaiter(this, void 0, void 0, function* () {
                            try {
                                const meta = yield getPlatformMeta(newPlatformItem);
                                const _newPlatformItem = Object.assign(Object.assign({}, newPlatformItem), { meta });
                                updateNewPlatformItem(_newPlatformItem);
                                setAttributes({
                                    items: [
                                        ...attributes.items,
                                        Object.assign({}, _newPlatformItem),
                                    ],
                                });
                                setPlatformModalVisibility(false);
                            }
                            catch (e) {
                                alert(e);
                            }
                        }) }, _x('Add', 'Add platform button', 'lasdfg')))));
        },
        save() {
            return null;
        },
    };
    blocks.registerBlockType('lasdfg/feed', blockConfig);
})(window.wp);
//# sourceMappingURL=index.js.map