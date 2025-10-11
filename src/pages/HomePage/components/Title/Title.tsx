import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import classes from './Title.module.scss';

function Title() {
	const { t } = useTranslation();

	return (
		<div className={classes.homeTextAni}>
			<h2 className={classes.title}>
				<span className={classNames(classes.titleWord, classes.titleWord1)}>
					{t('pages.home.titlePrefix')}
				</span>
				<span className={classNames(classes.titleWord, classes.titleWord2)}>
					{t('pages.home.title')}
				</span>
				<span className={classNames(classes.titleWord, classes.titleWord3)}>
					{t('pages.home.titleSuffix')}
				</span>
				{/* 				<span className={classNames(classes.titleWord, classes.titleWord4)}></span> */}
			</h2>
		</div>
	);
}

export default Title;
