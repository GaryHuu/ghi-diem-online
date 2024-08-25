import BannerHome from '@/assets/images/banner-home.png';
import classes from './Banner.module.scss';

function Banner() {
	return <img className={classes.banner} src={BannerHome} alt="Home Banner" />;
}

export default Banner;
