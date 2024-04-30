// @ts-nocheck
"use strict";

/**
 * proposal-content controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
	"api::proposal-content.proposal-content",
	({ strapi }) => ({
		async find(ctx) {
			const sanitizedQueryParams = await this.sanitizeQuery(ctx);

			const { results, pagination } = await strapi
				.service("api::proposal-content.proposal-content")
				.find(sanitizedQueryParams);

			// Get the gov_action_type for each proposal
			const govActionTypes = await strapi.entityService.findMany(
				"api::governance-action-type.governance-action-type",
				{
					filters: {
						id: {
							$in: results.map(
								(proposal) => proposal.gov_action_type_id
							),
						},
					},
				}
			);

			results.forEach((proposal) => {
				proposal.gov_action_type = govActionTypes.find(
					(govActionType) =>
						+govActionType.id === +proposal.gov_action_type_id
				);
			});

			return this.transformResponse(results, { pagination });
		},
	})
);
