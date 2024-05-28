// @ts-nocheck
'use strict';

/**
 * poll controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::poll.poll', ({ strapi }) => ({
	async update(ctx) {
		const { id } = ctx.params;
		const { data } = ctx?.request?.body;
		const { is_poll_active: isPollActive } = data;

		const user = ctx?.state?.user;

		if (!user) {
			return ctx.badRequest(null, 'User is required');
		}

		let poll;
		let updatedPoll;
		let proposal;

		try {
			poll = await strapi.entityService.findOne('api::poll.poll', id);

			if (!poll) {
				return ctx.badRequest(null, 'Poll not found');
			}

			try {
				proposal = await strapi.entityService.findOne(
					'api::proposal.proposal',
					poll?.proposal_id
				);
				if (!proposal) {
					return ctx.badRequest(null, 'Proposal not found');
				}
			} catch (error) {
				return ctx.badRequest(null, 'Proposal not found');
			}

			if (proposal?.user_id?.toString() !== user?.id?.toString()) {
				return ctx.badRequest(
					null,
					'User is not authorized to update this Poll.'
				);
			}

			try {
				updatedPoll = await strapi.entityService.update(
					'api::poll.poll',
					id,
					{ data: { is_poll_active: isPollActive } }
				);

				if (!updatedPoll) {
					return ctx.badRequest(null, 'Poll not updated');
				}
			} catch {
				return ctx.badRequest(null, 'Poll not updated');
			}
			return this.transformResponse(updatedPoll);
		} catch (error) {
			ctx.status = 500;
			ctx.body = { error: error, message: error.message };
		}
	},
}));
