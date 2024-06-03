//@ts-nocheck
'use strict';

/**
 * proposal-vote controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
	'api::proposal-vote.proposal-vote',
	({ strapi }) => ({
		async find(ctx) {
			const user = ctx?.state?.user;

			if (!user) {
				return ctx.badRequest(null, 'User is required');
			}

			const { query, ...restQueryParams } = ctx?.query;

			try {
				const proposalVotes = await strapi.entityService.findMany(
					'api::proposal-vote.proposal-vote',
					{
						filters: {
							user_id: user?.id?.toString(),
							...restQueryParams?.filters, // Spread any additional filters
						},
						limit: restQueryParams.limit
							? restQueryParams.limit
							: 1, // Use provided limit or default to 1
						sort: restQueryParams.sort
							? restQueryParams.sort
							: 'createdAt:desc', // Use provided sort or default to 'createdAt:desc'
					}
				);

				if (proposalVotes?.length === 0) {
					ctx.status = 200;
					ctx.body = { data: null };
					return;
				}

				return this.transformResponse(proposalVotes[0]);
			} catch (error) {
				ctx.status = 500;
				ctx.body = { error: error, message: error.message };
			}
		},
		async create(ctx) {
			const { data } = ctx?.request?.body;
			const { vote_result: voteResult, proposal_id: proposalID } = data;

			const user = ctx?.state?.user;

			if (!user) {
				return ctx.badRequest(null, 'User is required');
			}

			if (voteResult !== true && voteResult !== false) {
				return ctx.badRequest(null, 'Vote result is required');
			}

			if (!proposalID) {
				return ctx.badRequest(null, 'Proposal ID is required');
			}

			let proposalVote;
			let proposal;

			// Delete the Proposal Vote
			const deleteProposalVote = async () => {
				let deletedProposalVote = await strapi.entityService.delete(
					'api::proposal-vote.proposal-vote',
					proposalVote?.id
				);

				if (!deletedProposalVote) {
					return ctx.badRequest(null, 'Proposal vote not deleted');
				}
			};

			try {
				// Create the Proposal Vote
				try {
					proposalVote = await strapi.entityService.create(
						'api::proposal-vote.proposal-vote',
						{ data: { ...data, user_id: `${user.id}` } }
					);
					if (!proposalVote) {
						return ctx.badRequest(
							null,
							'Proposal vote not created'
						);
					}
				} catch (error) {
					return ctx.badRequest(null, 'Proposal vote not created');
				}

				// Get the Proposal
				try {
					proposal = await strapi.entityService.findOne(
						'api::proposal.proposal',
						proposalVote?.proposal_id
					);

					if (!proposal) {
						// Delete the Proposal Vote because the Proposal was not found
						await deleteProposalVote();

						return ctx.badRequest(null, 'Proposal not found');
					}
				} catch (error) {
					// Delete the Proposal Vote because the Proposal was not found
					await deleteProposalVote();

					return ctx.badRequest(null, 'Proposal not found');
				}

				const fieldToUpdate = data?.vote_result
					? 'prop_likes'
					: 'prop_dislikes';
				let updatedProposal;

				// Update the Proposal
				try {
					updatedProposal = await strapi.entityService.update(
						'api::proposal.proposal',
						proposal?.id,
						{
							data: {
								[fieldToUpdate]: proposal[fieldToUpdate] + 1,
							},
						}
					);

					if (!updatedProposal) {
						// Delete the Proposal Vote because the Proposal was not updated
						await deleteProposalVote();

						return ctx.badRequest(null, 'Proposal not updated');
					}
				} catch (error) {
					// Delete the Proposal Vote because the Proposal was not updated
					await deleteProposalVote();

					return ctx.badRequest(null, 'Proposal not updated');
				}

				return this.transformResponse(proposalVote);
				// Global error catch
			} catch (error) {
				proposalVote && (await deleteProposalVote());

				ctx.status = 500;
				ctx.body = { error: error, message: error.message };
			}
		},
		async update(ctx) {
			const { id } = ctx.params;
			const { data } = ctx?.request?.body;
			const { vote_result: voteResult } = data;

			const user = ctx?.state?.user;

			if (!user) {
				return ctx.badRequest(null, 'User is required');
			}

			if (voteResult !== true && voteResult !== false) {
				return ctx.badRequest(null, 'Vote result is required');
			}

			let proposalVote;
			let updatedProposalVote;
			let proposal;

			const rollbackProposalVote = async () => {
				const rollbackedProposalVote =
					await strapi.entityService.update(
						'api::proposal-vote.proposal-vote',
						proposalVote?.id,
						{ data: { vote_result: proposalVote.vote_result } }
					);
				if (!rollbackedProposalVote) {
					return ctx.badRequest(
						null,
						'Proposal vote not updated to initial state'
					);
				}

				return ctx.badRequest(null, 'Proposal vote not updated');
			};
			const rollbackProposal = async () => {
				const rollbackedProposal = await strapi.entityService.update(
					'api::proposal.proposal',
					proposal.id,
					{
						data: {
							prop_likes: proposal.prop_likes,
							prop_dislikes: proposal.prop_dislikes,
						},
					}
				);
				if (!rollbackedProposal) {
					return ctx.badRequest(
						null,
						'Proposal not updated to initial state'
					);
				}

				return ctx.badRequest(null, 'Proposal vote not updated');
			};

			try {
				try {
					proposalVote = await strapi.entityService.findOne(
						'api::proposal-vote.proposal-vote',
						id
					);

					if (!proposalVote) {
						return ctx.badRequest(null, 'Proposal vote not found');
					}

					if (proposalVote?.vote_result === voteResult) {
						return ctx.badRequest(
							null,
							'Proposal vote already updated'
						);
					}

					updatedProposalVote = await strapi.entityService.update(
						'api::proposal-vote.proposal-vote',
						id,
						{ data: { ...proposalVote, vote_result: voteResult } }
					);

					if (!updatedProposalVote) {
						return ctx.badRequest(
							null,
							'Proposal vote not updated'
						);
					}
				} catch (error) {
					return ctx.badRequest(null, 'Proposal vote not updated');
				}

				try {
					proposal = await strapi.entityService.findOne(
						'api::proposal.proposal',
						proposalVote?.proposal_id
					);
					if (!proposal) {
						return ctx.badRequest(null, 'Proposal not found');
					}
				} catch (error) {
					return ctx.badRequest(null, 'Proposal not found');
				}

				// Update the Proposal
				try {
					const updatedProposal = await strapi.entityService.update(
						'api::proposal.proposal',
						proposal?.id,
						{
							data: {
								...proposal,
								[voteResult ? 'prop_likes' : 'prop_dislikes']:
									proposal[
										voteResult
											? 'prop_likes'
											: 'prop_dislikes'
									] + 1,
								[voteResult ? 'prop_dislikes' : 'prop_likes']:
									proposal[
										voteResult
											? 'prop_dislikes'
											: 'prop_likes'
									] - 1,
							},
						}
					);
					if (!updatedProposal) {
						await rollbackProposalVote();
						return ctx.badRequest(null, 'Proposal not updated');
					}

					return this.transformResponse(updatedProposalVote);
				} catch (error) {
					return ctx.badRequest(null, 'Proposal not updated');
				}
			} catch (error) {
				proposalVote && (await rollbackProposalVote());
				proposal && (await rollbackProposal());
				ctx.status = 500;
				ctx.body = { error: error, message: error.message };
			}
		},
	})
);
