// @ts-nocheck
"use strict";

/**
 * proposal controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
	"api::proposal.proposal",
	({ strapi }) => ({
		async find(ctx) {
			const sanitizedQueryParams = await this.sanitizeQuery(ctx);

			const { results, pagination } = await strapi
				.service("api::proposal.proposal")
				.find(sanitizedQueryParams);

			for (const proposal of results) {
				const proposalContent = await strapi
					.controller("api::proposal-content.proposal-content")
					.find({
						query: {
							filters: {
								proposal_id: proposal.id,
								prop_rev_active: true,
							},
						},
					});

				if (proposalContent?.data?.length > 0) {
					proposal.content = proposalContent?.data?.[0];
				} else {
					proposal.content = null;
				}
			}

			return this.transformResponse(results, { pagination });
		},
		async findOne(ctx) {
			const { id } = ctx?.params;

			if (!id) {
				return ctx.badRequest(null, "Proposal ID is required");
			}
			// const sanitizedQueryParams = await this.sanitizeQuery(ctx);

			const proposal = await strapi.entityService.findOne(
				"api::proposal.proposal",
				id
			);

			if (!proposal) {
				return ctx.badRequest(null, "Proposal not found");
			}

			const proposalContent = await strapi
				.controller("api::proposal-content.proposal-content")
				.find({
					query: {
						filters: {
							proposal_id: proposal.id,
							prop_rev_active: true,
						},
					},
				});

			if (proposalContent?.data?.length > 0) {
				proposal.content = proposalContent?.data?.[0];
			} else {
				proposal.content = null;
			}

			return this.transformResponse(proposal);
		},
	})
);
