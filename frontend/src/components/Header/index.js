import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { connectWallet } from '@/lib/helpers';
import { useAppContext } from '@/context/context';
const Header = () => {
	const { setUser, user } = useAppContext();

	const handleWalletConnect = async () => {
		setUser(await connectWallet('nufi'));
	};
	return (
		<Box display="flex" justifyContent="space-between" alignItems="center">
			<Typography variant="h4">Proposed Governance Actions</Typography>

			{user ? (
				<Button variant="contained" onClick={() => setUser(null)}>
					Propose a Governance Action
				</Button>
			) : (
				<Button variant="contained" onClick={handleWalletConnect}>
					Connect Wallet
				</Button>
			)}
		</Box>
	);
};

export default Header;
