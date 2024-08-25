import { Box } from '@mui/material';
import { ReactNode } from 'react';
import styles from './styles';

type Props = {
	children: ReactNode;
};

function PlayingLayout({ children }: Props) {
	return <Box sx={styles.wrapper}>{children}</Box>;
}

export default PlayingLayout;
