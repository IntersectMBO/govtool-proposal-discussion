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
export const getGovernanceActionTypes = async () => {
	try {
		const { data } = await axiosInstance.get(`/api/governance-action-types`);
		
		return data;
	} catch (error) {
		return error;
	}
};

export const createProposal = async (proposal) => {
    try {
		const { data } = await axiosInstance.post(
			`/api/proposals`,  {
				data: {
					prop_likes: 0,
					prop_dislikes: 0,
					prop_poll_active: false,
					prop_submitted: false,
					prop_status_id: '1',
					prop_comments_number: 0
				},
			}
		);

        return data.data;
    } catch (error) {
        console.error(error)
    }
}

export const createProposalContent = async (proposal) => {
    try {
		console.log('createProposalContent')
		const { data } = await axiosInstance.post(
			`/api/proposal-content`,  {
				data: {
					prop_abstract: proposal.abstract,
					prop_motivation: proposal.motivation,
					prop_rationale: proposal.rationale,
					gov_action_type_id: proposal.governanceActionType,
					prop_name: proposal.title,
					prop_receiving_address: proposal.receivingAddress,
					prop_amount: proposal.amount,
					proposal_links: proposal.links,
				},
			}
		);

        return data.data;
    } catch (error) {
        console.error(error)
    }
}