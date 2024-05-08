'use client';

import { useAppContext } from '@/context/context';
import { connectWallet } from "@/lib/helpers";
import { Box, Button, Typography } from "@mui/material";
const Header = () => {
	const { setUser, user } = useAppContext();

	const handleWalletConnect = async () => {
		setUser(await connectWallet('nufi'));
	};
	return (
		<Box
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			borderBottom="1px solid #E0E0E0"
			py={3}
		>
			<Typography variant="h4" component="h1">
				Proposed Governance Actions
			</Typography>

			<Box sx={{ display: { xs: "none", md: "flex" } }}>
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
		</Box>
	);
};

export default Header;
