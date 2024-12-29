import { Placement } from 'react-joyride';

export const HOME_GUIDE_STEPS = [
	{
		content: <h2>Let's begin our journey!</h2>,
		locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
		placement: 'center' as Placement,
		target: 'body',
	},
	{
		target: '#start-btn',
		content: 'Nhấn vào đây để bắt đầu trận đấu nhé!',
	},
	{
		target: '#continue-btn',
		content: 'Tiếp tục ván đấu còn dang dở ở đấy nhé!',
	},
];

export const SETTING_GUIDE_STEPS = [
	{
		content: <h2>Thiết lập đơn vị và hệ số cho trận đấu tại đây</h2>,
		locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
		placement: 'center' as Placement,
		target: 'body',
	},
	{
		target: '#setting-unit-id',
		content: 'Tại đây bạn có thể cài đặt đơn vị cho trận đấu!',
	},
	{
		target: '#setting-gap-id',
		content: 'Tại đây bạn có thể xác định hệ sô cho trận đấu!',
	},
];

export enum GuideType {
	HOME = 'home',
	SETTING = 'setting',
}
