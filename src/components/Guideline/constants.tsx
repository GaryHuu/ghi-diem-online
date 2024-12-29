import { Placement } from 'react-joyride';

export const GUIDE_STEPS = [
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
	{
		target: '#name-of-the-match',
		content: 'Nhập tên ván đấu mà bạn thích nào!',
	},
	// {
	// 	target: '#start-game-btn',
	// 	content:
	// 		'Sau khi nhập tên ván đấu thì nhấn vào "Chơi" để tận hưởng ván đấu của bạn ngay thôi nào!',
	// },
	// {
	// 	target: '#continue-btn',
	// 	content: 'This is Continue!',
	// },
	// {
	// 	target: '#continue-btn',
	// 	content: 'This is Continue!',
	// },
];
