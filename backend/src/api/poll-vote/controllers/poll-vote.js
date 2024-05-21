// @ts-nocheck
"use strict";

/**
 * poll-vote controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
	"api::poll-vote.poll-vote",
	({ strapi }) => ({
		async create(ctx) {
			const { data } = ctx?.request?.body;
			const { vote_result: voteResult, poll_id: pollId } = data;

			const user = ctx?.state?.user;

			if (!user) {
				return ctx.badRequest(null, 'User is required');
			}

			if (voteResult !== true && voteResult !== false) {
				return ctx.badRequest(null, "Vote result is required");
			}

			if (!pollId) {
				return ctx.badRequest(null, "Poll ID is required");
			}

			let pollVote;
			let poll;

			// Delete the Poll Vote
			const deletePollVote = async () => {
				let deletedPollVote = await strapi.entityService.delete(
					"api::poll-vote.poll-vote",
					pollVote?.id
				);

				if (!deletedPollVote) {
					return ctx.badRequest(null, "Poll vote not deleted");
				}
			};

			try {
				// Create the Poll Vote
				try {
					pollVote = await strapi.entityService.create(
						'api::poll-vote.poll-vote',
						{ data: { ...data, user_id: `${user.id}` } }
					);
					if (!pollVote) {
						return ctx.badRequest(null, "Poll vote not created");
					}
				} catch (error) {
					return ctx.badRequest(null, "Poll vote not created");
				}

				// Get the Poll
				try {
					poll = await strapi.entityService.findOne(
						"api::poll.poll",
						pollVote?.poll_id
					);

					if (!poll) {
						// Delete the Poll Vote because the Poll was not found
						await deletePollVote();

						return ctx.badRequest(null, "Poll not found");
					}
				} catch (error) {
					// Delete the Poll Vote because the Poll was not found
					await deletePollVote();

					return ctx.badRequest(null, "Poll not found");
				}

				const fieldToUpdate = data?.vote_result
					? "poll_yes"
					: "poll_no";
				let updatedPoll;

				// Update the Poll
				try {
					updatedPoll = await strapi.entityService.update(
						"api::poll.poll",
						poll?.id,
						{
							data: {
								[fieldToUpdate]: poll[fieldToUpdate] + 1,
							},
						}
					);

					if (!updatedPoll) {
						// Delete the Poll Vote because the Poll was not updated
						await deletePollVote();

						return ctx.badRequest(null, "Poll not updated");
					}
				} catch (error) {
					// Delete the Poll Vote because the Poll was not updated
					await deletePollVote();

					return ctx.badRequest(null, "Poll not updated");
				}

				return this.transformResponse(pollVote);
				// Global error catch
			} catch (error) {
				pollVote && (await deletePollVote());

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
				return ctx.badRequest(null, "Vote result is required");
			}

			let pollVote;
			let updatedPollVote;
			let poll;

			const rollbackPollVote = async () => {
				const rollbackedPollVote = await strapi.entityService.update(
					"api::poll-vote.poll-vote",
					pollVote?.id,
					{ data: { vote_result: pollVote.vote_result } }
				);
				if (!rollbackedPollVote) {
					return ctx.badRequest(
						null,
						"Poll vote not updated to initial state"
					);
				}

				return ctx.badRequest(null, "Poll vote not updated");
			};
			const rollbackPoll = async () => {
				const rollbackedPoll = await strapi.entityService.update(
					"api::poll.poll",
					poll.id,
					{ data: { poll_yes: poll.poll_yes, poll_no: poll.poll_no } }
				);
				if (!rollbackedPoll) {
					return ctx.badRequest(
						null,
						"Poll not updated to initial state"
					);
				}

				return ctx.badRequest(null, "Poll vote not updated");
			};

			try {
				try {
					pollVote = await strapi.entityService.findOne(
						"api::poll-vote.poll-vote",
						id
					);

					if (!pollVote) {
						return ctx.badRequest(null, "Poll vote not found");
					}

					if (pollVote?.vote_result === voteResult) {
						return ctx.badRequest(
							null,
							"Poll vote already updated"
						);
					}

					updatedPollVote = await strapi.entityService.update(
						"api::poll-vote.poll-vote",
						id,
						{ data: { ...pollVote, vote_result: voteResult } }
					);

					if (!updatedPollVote) {
						return ctx.badRequest(null, "Poll vote not updated");
					}
				} catch (error) {
					return ctx.badRequest(null, "Poll vote not updated");
				}

				try {
					poll = await strapi.entityService.findOne(
						"api::poll.poll",
						pollVote?.poll_id
					);
					if (!poll) {
						return ctx.badRequest(null, "Poll not found");
					}
				} catch (error) {
					return ctx.badRequest(null, "Poll not found");
				}

				// Update the Poll
				try {
					const updatedPoll = await strapi.entityService.update(
						"api::poll.poll",
						poll?.id,
						{
							data: {
								...poll,
								[voteResult ? "poll_yes" : "poll_no"]:
									poll[voteResult ? "poll_yes" : "poll_no"] +
									1,
								[voteResult ? "poll_no" : "poll_yes"]:
									poll[voteResult ? "poll_no" : "poll_yes"] -
									1,
							},
						}
					);
					if (!updatedPoll) {
						await rollbackPollVote();
						return ctx.badRequest(null, "Poll not updated");
					}

					return this.transformResponse(updatedPollVote);
				} catch (error) {
					return ctx.badRequest(null, "Poll not updated");
				}
			} catch (error) {
				pollVote && (await rollbackPollVote());
				poll && (await rollbackPoll());
				ctx.status = 500;
				ctx.body = { error: error, message: error.message };
			}
		},
	})
);
