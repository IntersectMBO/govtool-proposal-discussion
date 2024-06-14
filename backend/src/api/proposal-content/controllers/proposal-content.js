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
      const sanitizedQueryParams = ctx?.query
        ? await this.sanitizeQuery(ctx)
        : ctx;

      if (!sanitizedQueryParams.populate) {
        sanitizedQueryParams.populate = [];
      }

      if (!sanitizedQueryParams?.populate?.includes("proposal_links")) {
        sanitizedQueryParams.populate.push("proposal_links");
      }

      const { results, pagination } = await strapi
        .service("api::proposal-content.proposal-content")
        .find(sanitizedQueryParams);

      // Get the gov_action_type for each proposal
      const govActionTypes = await strapi.entityService.findMany(
        "api::governance-action-type.governance-action-type",
        {
          filters: {
            id: {
              $in: results.map((proposal) => proposal.gov_action_type_id),
            },
          },
        }
      );

      for (const proposal of results) {
        proposal.gov_action_type = this.transformResponse(
          govActionTypes.find(
            (govActionType) =>
              +govActionType.id === +proposal.gov_action_type_id
          )
        )?.data;
      }

      return ctx?.query
        ? this.transformResponse(results, { pagination })
        : { results, pagination };
    },
    async create(ctx) {
      const { data } = ctx?.request?.body;
      const { proposal_id: proposalId, publish: publishContent } = data;

      const user = ctx?.state?.user;

      if (!user) {
        return ctx.badRequest(null, "User is required");
      }

      if (!proposalId) {
        return ctx.badRequest(null, "Proposal ID is required");
      }

      let proposal_content;

      try {
        proposal_content = await strapi.entityService.create(
          "api::proposal-content.proposal-content",
          {
            data: {
              ...data,
              proposal_id: proposalId.toString(),
              gov_action_type_id: data?.gov_action_type_id.toString(),
              prop_rev_active: data?.prop_rev_active,
              user_id: user?.id?.toString(),
            },
          }
        );

        // Update the prop_rev_active field for other proposal contents
        if (data?.prop_rev_active === true && !data?.is_draft) {
          try {
            await strapi.db
              .query("api::proposal-content.proposal-content")
              .updateMany({
                where: {
                  proposal_id: proposalId,
                  id: { $ne: proposal_content?.id },
                },
                data: {
                  prop_rev_active: false,
                },
              });
          } catch (error) {
            console.error("Error updating proposal contents:", error);
            return ctx.badRequest(null, "Failed to update proposal contents");
          }
        }

        return this.transformResponse(proposal_content);
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    },
    async update(ctx) {
      const { id } = ctx.params;
      const { data } = ctx?.request?.body;

      try {
        const proposalContent = await strapi.entityService.findOne(
          "api::proposal-content.proposal-content",
          id
        );

        if (proposalContent && proposalContent?.prop_submitted !== true) {
          const updatedProposal = await strapi.entityService.update(
            "api::proposal-content.proposal-content",
            id,
            {
              data: data,
            }
          );

          return this.transformResponse(updatedProposal);
        }
      } catch (error) {
        return ctx.badRequest(
          "Proposal can't be updated, it has been already submited"
        );
      }
    },
  })
);
