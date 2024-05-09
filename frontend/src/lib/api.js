import axiosInstance from "@/lib/axiosInstance";

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
		const { data } = await axiosInstance.get(
			`/api/proposals?pagination[page]=1&pagination[pageSize]=3&sort[createdAt]=desc`
		);

		return data?.data;
	} catch (error) {
		return error;
	}
};
export const getSingleProposal = async (id) => {
	try {
		const { data } = await axiosInstance.get(`/api/proposals/${id}`);

		return data?.data;
	} catch (error) {
		return error;
	}
};
