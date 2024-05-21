'use client';
import { Footer } from '@/components';
import { Box } from '@mui/material';

const ProposalCreationLayoutWrapper = ({ children }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
			}}
		>
			<Box
				component="main"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flexGrow: 1,
					backgroundImage: `url('/svg/ellipse-1.svg'), url('/svg/ellipse-2.svg')`,
					backgroundRepeat: 'no-repeat, no-repeat',
					backgroundPosition: 'top left, bottom right',
					backgroundSize: 'auto, auto',
					overflow: 'auto',
					minHeight: 0,
					pt: 2,
				}}
			>
				<Box
					sx={{
						flexGrow: 1,
					}}
				>
					{children}
				</Box>
				<Footer
					sx={{
						mt: 'auto',
						p: 4,
					}}
				/>
			</Box>
		</Box>
	);
};

export default ProposalCreationLayoutWrapper;
