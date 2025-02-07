interface MenuItem {
  title: string,
  key: string,
  active?: boolean,
  icon: string
}
const menuData: MenuItem[] = [
  { title: 'Local', key: 'local', icon: 'icon-shangchuan_line' },
  { title: 'Image', key: 'image', icon: 'icon-tupian_line' },
  { title: 'Video', key: 'video', icon: 'icon-shipin_line' },
  { title: 'Audio', key: 'audio', icon: 'icon-yinle_line' },
  { title: 'Text', key: 'text', icon: 'icon-wenzi_line' }
];

export { menuData };
export type { MenuItem };
