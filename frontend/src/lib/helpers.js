// helpers.js
// This file contains helper functions used throughout the application for performing common tasks.
// Functions include operations such as date formatting, array and object manipulation, and input validation.
// Use these functions to keep your code clean and avoid duplicating code in different parts of the application.

import { loginUser } from '@/lib/api';

export const connectWallet = async (walletName) => {
	try {
		const walletApi = await window.cardano[walletName].enable();
		const rawWalletAddress = await walletApi.getChangeAddress();

		const user = await loginUser({
			identifier: rawWalletAddress,
		});

		return user;
	} catch (error) {
		throw new Error('Error connecting the wallet.');
	}
};
