import axiosInstance from '@/lib/axiosInstance';

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
export const getProposals = async (query = '') => {
	try {
		const { data } = await axiosInstance.get(`/api/proposals?${query}`);

		const proposals = data?.data;
		const pgCount = data?.meta?.pagination?.pageCount;
		const total = data?.meta?.pagination?.total;
		return { proposals, pgCount, total };
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
export const getGovernanceActionTypes = async () => {
	try {
		const { data } = await axiosInstance.get(
			`/api/governance-action-types`
		);

		return data;
	} catch (error) {
		throw error;
	}
};

export const createProposal = async (data, addPoll) => {
	try {
		const response = await axiosInstance.post(`/api/proposals`, {
			data: {
				...data,
				prop_status_id: '1', // TODO: proposal status
				user_id: '1', // TODO: set user_id,
				prop_rev_active: true, // For first draft to be seen on frontend, temporary!!!
				add_poll: addPoll,
			},
		});

		return response?.data;
	} catch (error) {
		console.error('Error in createProposal:', error);
		throw error;
	}
};

export const deleteProposal = async (proposalId) => {
	try {
		const response = await axiosInstance.delete(
			`/api/proposals/${proposalId}`
		);

		return response?.data;
	} catch (e) {
		console.error(e);
	}
};

export const getPoll = async ({ proposalID }) => {
	try {
		const { data } = await axiosInstance.get(
			`/api/polls?filters[proposal_id][$eq]=${proposalID}&pagination[page]=1&pagination[pageSize]=1&sort[createdAt]=desc`
		);

		if (data?.data && data?.data?.length > 0) {
			return data.data[0];
		} else {
			return null;
		}
	} catch (error) {
		throw error;
	}
};

export const createPoll = async ({ pollData }) => {
	try {
		const { data } = await axiosInstance.post(`/api/polls`, pollData);

		return data?.data;
	} catch (error) {
		throw error;
	}
};

export const getComments = async (query = '') => {
	try {
		const { data } = await axiosInstance.get(`api/comments?${query}`);
		const comments = data?.data;
		const pgCount = data?.meta?.pagination?.pageCount;
		const total = data?.meta?.pagination?.total;
		return { comments, pgCount, total };
	} catch (error) {
		console.error(error);
	}
};

export const createComment = async (commentData) => {
	try {
		const { data } = await axiosInstance.post(`api/comments`, {
			data: {
				...commentData,
			},
		});
		return data;
	} catch (error) {
		console.error(error);
	}
};

export const createProposalLikeOrDislike = async ({ createData }) => {
	try {
		const { data } = await axiosInstance.post(`api/proposal-votes`, {
			data: {
				...createData,
			},
		});
		return data?.data;
	} catch (error) {
		throw error;
	}
};
export const updateProposalLikesOrDislikes = async ({
	proposalVoteID,
	updateData,
}) => {
	try {
		const { data } = await axiosInstance.put(
			`api/proposal-votes/${proposalVoteID}`,
			{
				data: {
					...updateData,
				},
			}
		);
		return data?.data;
	} catch (error) {
		throw error;
	}
};

export const getUserProposalVote = async ({ proposalID }) => {
	try {
		const { data } = await axiosInstance.get(
			`/api/proposal-votes?filters[proposal_id][$eq]=${proposalID}`
		);

		return data.data;
	} catch (error) {
		return error;
	}
};

export const getUserPollVote = async ({ pollID }) => {
	try {
		const { data } = await axiosInstance.get(
			`/api/poll-votes?filters[poll_id][$eq]=${pollID}&pagination[page]=1&pagination[pageSize]=1&sort[createdAt]=desc`
		);

		if (data?.data && data?.data?.length > 0) {
			return data.data[0];
		} else {
			return null;
		}
	} catch (error) {
		throw error;
	}
};

export const createPollVote = async ({ createData }) => {
	try {
		const { data } = await axiosInstance.post(`api/poll-votes`, {
			data: {
				...createData,
			},
		});
		return data?.data;
	} catch (error) {
		throw error;
	}
};
