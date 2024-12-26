import classNames from 'classnames';
import classes from './Title.module.scss';

function Title() {
	return (
		<div className={classes.homeTextAni}>
			<h2 className={classes.title}>
				<span className={classNames(classes.titleWord, classes.titleWord1)}>Ghi</span>
				<span className={classNames(classes.titleWord, classes.titleWord2)}>Điểm</span>
				<span className={classNames(classes.titleWord, classes.titleWord3)}>Online</span>
				{/* 				<span className={classNames(classes.titleWord, classes.titleWord4)}></span> */}
			</h2>
		</div>
	);
}

export default Title;
