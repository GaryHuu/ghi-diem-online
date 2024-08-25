import classNames from 'classnames';
import classes from './Title.module.scss';

function Title() {
	return (
		<div className={classes.homeTextAni}>
			<h2 className={classes.title}>
				<span className={classNames(classes.titleWord, classes.titleWord1)}>Hỗ</span>
				<span className={classNames(classes.titleWord, classes.titleWord2)}>Trợ</span>
				<span className={classNames(classes.titleWord, classes.titleWord3)}>Ghi</span>
				<span className={classNames(classes.titleWord, classes.titleWord4)}>Điểm</span>
			</h2>
		</div>
	);
}

export default Title;
