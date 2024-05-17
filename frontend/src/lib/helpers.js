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

		saveDataInSession('pdfUserJwt', user?.jwt);

		return user;
	} catch (error) {
		throw new Error('Error connecting the wallet.');
	}
};

export const saveDataInSession = (key, value) => {
	const data = { value, timestamp: new Date().getTime() };
	sessionStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromSession = (key) => {
	const data = JSON.parse(sessionStorage.getItem(key));
	if (data) {
		return data.value;
	} else {
		return null;
	}
};

export const clearSession = () => {
	sessionStorage.removeItem('pdfUserJwt');
};
