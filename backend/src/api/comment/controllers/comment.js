// @ts-nocheck
'use strict';

/**
 * comment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::comment.comment', ({ strapi }) => ({
	async create(ctx) {
		const { data } = ctx?.request?.body;

		const user = ctx?.state?.user;

		if (!user) {
			return ctx.badRequest(null, 'User is required');
		}

		let comment;

		const deleteComment = async () => {
			let deletedComment = await strapi.entityService.delete(
				'api::comment.comment',
				comment?.id
			);

			if (!deletedComment) {
				return ctx.badRequest(null, 'Comment not deleted');
			}
		};

		try {
			comment = await strapi.entityService.create(
				'api::comment.comment',
				{
					data: {
						...data,
						user_id: user?.id?.toString(),
					},
				}
			);

			if (!comment) {
				return ctx.badRequest(null, 'Comment not created');
			}

			let proposal;

			try {
				proposal = await strapi.entityService.findOne(
					'api::proposal.proposal',
					data?.proposal_id
				);

				if (!proposal) {
					comment && (await deleteComment());
					return ctx.badRequest(null, 'Proposal not found');
				}
			} catch (error) {
				return ctx.badRequest(null, 'Proposal not found');
			}

			let updatedProposal;

			try {
				updatedProposal = await strapi.entityService.update(
					'api::proposal.proposal',
					data?.proposal_id,
					{
						data: {
							prop_comments_number:
								proposal?.prop_comments_number + 1,
						},
					}
				);

				if (!updatedProposal) {
					comment && (await deleteComment());
					return ctx.badRequest(null, 'Proposal not updated');
				}

				if (data?.comment_parent_id) {
					const updatedComment = await strapi.entityService.update(
						'api::comment.comment',
						data?.comment_parent_id,
						{
							data: {
								comment_has_replays: true,
							},
						}
					);

					if (!updatedComment) {
						comment && (await deleteComment());
						return ctx.badRequest(
							null,
							'Parent comment not updated'
						);
					}
				}
			} catch (error) {
				comment && (await deleteComment());
				return ctx.badRequest(null, 'Proposal not updated');
			}

			return this.transformResponse(comment);
		} catch (error) {
			comment && (await deleteComment());
			ctx.status = 500;
			ctx.body = { error: error, message: error.message };
		}
	},
}));
