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
export const getGovernanceActionTypes = async () => {
	try {
		const { data } = await axiosInstance.get(
			`/api/governance-action-types`
		);

		return data;
	} catch (error) {
		return error;
	}
};

export const createProposalAndProposalContent = async (
	proposalContent,
	links
) => {
	try {
		const response = await axiosInstance.post(`/api/proposals`, {
			data: {
				prop_likes: 0,
				prop_dislikes: 0,
				prop_poll_active: false,
				prop_submitted: false,
				prop_status_id: '1', // TODO: proposal status
				prop_comments_number: 0,
				user_id: '1', // TODO: set user_id
			},
		});

		if (response && response?.data && response?.data?.data?.id) {
			const responseContent = await createProposalContent(
				response?.data?.data?.id,
				proposalContent,
				links
			);
			return responseContent;
		} else {
			throw new Error('Invalid response structure or missing ID');
		}
	} catch (error) {
		console.error('Error in createProposal:', error);
		throw error;
	}
};

export const createProposalContent = async (
	proposalId,
	proposalContent,
	links
) => {
	try {
		const { data } = await axiosInstance.post(`/api/proposal-contents`, {
			data: {
				proposal_id: proposalId?.toString(),
				gov_action_type_id:
					proposalContent?.gov_action_type_id?.toString(),
				prop_abstract: proposalContent?.prop_abstract,
				prop_motivation: proposalContent?.prop_motivation,
				prop_rationale: proposalContent?.prop_rationale,
				prop_name: proposalContent?.prop_name,
				prop_receiving_address: proposalContent?.prop_receiving_address,
				prop_amount: proposalContent?.prop_amount,
				prop_rev_active: true,
				proposal_links: links,
			},
		});

		return data.data;
	} catch (error) {
		console.error(error);
	}
};

export const updateProposalContent = async (proposalContent, links) => {
	try {
		const { data } = await axiosInstance.put(
			`/api/proposal-contents/${proposalContent?.proposal_content_id}`,
			{
				data: {
					prop_rev_active: proposalContent?.prop_rev_active,
					prop_abstract: proposalContent?.prop_abstract,
					prop_motivation: proposalContent?.prop_motivation,
					prop_rationale: proposalContent?.prop_rationale,
					proposal_id: proposalContent?.proposal_id,
					prop_name: proposalContent?.prop_name,
					prop_receiving_address:
						proposalContent?.prop_receiving_address,
					prop_amount: proposalContent?.prop_amount,
					proposal_links: links,
				},
			}
		);

        return data.data;
    } catch (error) {
        console.error(error)
    }
}

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
