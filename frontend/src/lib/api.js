import axiosInstance from '@/lib/axiosInstance';
import axios from "axios";

export const loginUser = async (loginData) => {
	try {
		const { data } = await axiosInstance.post(`/api/auth/local`, {
			...loginData,
		});
		return data;
	} catch (error) {
		console.error(error);
	}
};
export const getProposals = async () => {
	try {
		// const { data } = await axiosInstance.get(`/api/proposals`)
		const { data } = await axios.get(
			`https://my.api.mockaroo.com/proposals.json?key=5d22e910`
		);

		return data;
	} catch (error) {
		return error;
	}
};
