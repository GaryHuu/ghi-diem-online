import { ColorScheme, UIMode } from '@/utils/types';

export const UNIT_OPTIONS = [
	{
		value: 1,
		labelKey: 'common.currency.1',
	},
	{
		value: 1000,
		labelKey: 'common.currency.1000',
	},
];

export const UI_MODE_OPTIONS: { value: UIMode; labelKey: string }[] = [
	{
		value: 'compact',
		labelKey: 'components.settingDialog.uiModeCompact',
	},
	{
		value: 'full',
		labelKey: 'components.settingDialog.uiModeFull',
	},
];

export const COLOR_SCHEME_OPTIONS: { value: ColorScheme; labelKey: string }[] = [
	{
		value: 'light',
		labelKey: 'components.settingDialog.colorSchemeLight',
	},
	{
		value: 'dark',
		labelKey: 'components.settingDialog.colorSchemeDark',
	},
];
export const LANGUAGE_OPTIONS = [
	{
		value: 'vi' as const,
		label: 'Tiếng Việt',
		flagCode: 'vn',
	},
	{
		value: 'en' as const,
		label: 'English',
		flagCode: 'us',
	},
];
