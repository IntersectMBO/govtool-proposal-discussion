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

      if (!sanitizedQueryParams.filters) {
        sanitizedQueryParams.filters = {};
      }

      if (!sanitizedQueryParams.filters["$and"]) {
        sanitizedQueryParams.filters["$and"] = [];
      }

      /////GOV ACTION TYPE///////////
      const hasGovActionTypeIDFilter = ctx?.query?.filters["$and"]?.find(
        (elem) => elem?.hasOwnProperty("gov_action_type_id")
      );

      if (hasGovActionTypeIDFilter) {
        const hasGovActionTypeIDFilterInSanitize =
          sanitizedQueryParams?.filters["$and"]?.some((elem) =>
            elem?.hasOwnProperty("gov_action_type_id")
          );
        if (!hasGovActionTypeIDFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            gov_action_type_id: hasGovActionTypeIDFilter?.gov_action_type_id,
          });
        }
      }
      //////////////////////////

      /////PROPOSAL NAME///////////
      const hasPropNameFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("prop_name")
      );

      if (hasPropNameFilter) {
        const hasPropNameFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("prop_name"));
        if (!hasPropNameFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            prop_name: hasPropNameFilter?.prop_name,
          });
        }
      }
      //////////////////////////////

      /////PROPOSAL SUBMITTED///////////
      const hasPropSubmitedFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("prop_submitted")
      );

      if (hasPropSubmitedFilter) {
        const hasPropSubmitedFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("prop_submitted"));
        if (!hasPropSubmitedFilterInSanitize) {
          if (hasPropSubmitedFilter?.prop_submitted === "true") {
            sanitizedQueryParams.filters["$and"].push({
              prop_submitted: hasPropSubmitedFilter?.prop_submitted,
            });
          } else {
            sanitizedQueryParams.filters["$and"].push({
              $or: [
                {
                  prop_submitted: false,
                },
                {
                  prop_submitted: {
                    $null: true,
                  },
                },
              ],
            });
          }
        }
      }
      //////////////////////////////

      /////PROPOSAL ID///////////
      const hasPropIdFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("prop_id")
      );

      if (hasPropIdFilter) {
        if (!ctx?.state?.user) {
          return ctx.badRequest(null, "User is required");
        }

        const hasPropIdFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("prop_id"));
        if (!hasPropIdFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            proposal_id: hasPropIdFilter?.prop_id,
            user_id: ctx?.state?.user?.id,
          });
        }
      } else {
        sanitizedQueryParams.filters["$and"].push({
          prop_rev_active: true,
        });
      }
      //////////////////////////////

      /////IS DRAFT///////////
      const hasIsDraftFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("is_draft")
      );

      if (hasIsDraftFilter) {
        if (!ctx?.state?.user) {
          return ctx.badRequest(null, "User is required");
        }

        const hasIsDraftFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("is_draft"));
        if (!hasIsDraftFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            is_draft: hasIsDraftFilter?.is_draft,
            user_id: ctx?.state?.user?.id,
          });
        }
      } else {
        sanitizedQueryParams.filters["$and"].push({
          is_draft: false,
        });
      }
      //////////////////////////////

      let proposalsList = [];

      const { results, pagination } = await strapi
        .controller("api::proposal-content.proposal-content")
        .find(sanitizedQueryParams);

      for (const proposalContent of results) {
        const proposal = await strapi.entityService.findOne(
          "api::proposal.proposal",
          proposalContent?.proposal_id
        );

        const proposalUser = await strapi
          .query("plugin::users-permissions.user")
          .findOne({ where: { id: +proposal?.user_id } });

        if (proposalUser?.govtool_username) {
          proposal.user_govtool_username = proposalUser?.govtool_username;
        } else {
          proposal.user_govtool_username = "Anonymous";
        }

        const transformedProposalContent =
          this.transformResponse(proposalContent);
        proposal.content = transformedProposalContent?.data;
        proposalsList.push(proposal);
      }

      return this.transformResponse(proposalsList, { pagination });
    },
    async findOne(ctx) {
		const { id } = ctx?.params;

		if (!id) {
			return ctx.badRequest(null, 'Proposal ID is required');
		}
		// const sanitizedQueryParams = await this.sanitizeQuery(ctx);

		const proposal = await strapi.entityService.findOne(
			'api::proposal.proposal',
			id
		);

		if (!proposal) {
			return ctx.badRequest(null, 'Proposal not found');
		}

		const proposalContent = await strapi
			.controller('api::proposal-content.proposal-content')
			.find({
				query: {
					filters: {
						proposal_id: proposal.id,
						prop_rev_active: true,
					},
				},
			});

		if (proposalContent?.data?.length > 0) {
			if (proposalContent?.data?.[0]?.attributes?.is_draft) {
				return ctx.badRequest(
					null,
					'You can not access draft proposal details.'
				);
			}
			proposal.content = proposalContent?.data?.[0];
		} else {
			proposal.content = null;
		}

		const proposalUser = await strapi
			.query('plugin::users-permissions.user')
			.findOne({ where: { id: +proposal?.user_id } });

		if (proposalUser?.govtool_username) {
			proposal.user_govtool_username = proposalUser?.govtool_username;
		} else {
			proposal.user_govtool_username = 'Anonymous';
		}

		return this.transformResponse(proposal);
	},
    async create(ctx) {
      const { data } = ctx?.request?.body;
      const user = ctx?.state?.user;

      if (!user) {
        return ctx.badRequest(null, "User is required");
      }

      let proposal;
      let proposal_content;
      // Delete the Prposal
      const deleteProposal = async () => {
        let deletedProposal = await strapi.entityService.delete(
          "api::proposal.proposal",
          proposal?.id
        );

        if (!deletedProposal) {
          return ctx.badRequest(null, "Proposal not deleted");
        }
      };

      // Delete the Proposal Content
      const deleteProposalContent = async () => {
        let deletedProposal = await strapi.entityService.delete(
          "api::proposal-content.proposal-content",
          proposal_content?.id
        );

        if (!deletedProposal) {
          return ctx.badRequest(null, "Proposal content not deleted");
        }
      };

      try {
        // Create the Proposal
        try {
          proposal = await strapi.entityService.create(
            "api::proposal.proposal",
            {
              data: {
                ...data,
                user_id: user?.id?.toString(),
              },
            }
          );

          if (!proposal) {
            return ctx.badRequest(null, "Proposal not created");
          }
        } catch (error) {
          return ctx.badRequest(null, "Proposal not created");
        }

        // Create Proposal content
        try {
          proposal_content = await strapi.entityService.create(
            "api::proposal-content.proposal-content",
            {
              data: {
                ...data,
                proposal_id: proposal?.id.toString(),
                gov_action_type_id: data?.gov_action_type_id?.toString(),
                prop_rev_active: true,
                user_id: user?.id?.toString(),
              },
            }
          );
        } catch (error) {
          // Delete the Proposal because the Proposal content was not created
          await deleteProposal();

          return ctx.badRequest(null, "Proposal content not created");
        }

        return this.transformResponse({
          proposal_id: proposal.id,
          proposal_content_id: proposal_content.id,
        });

        // Global error catch
      } catch (error) {
        proposal_content && (await deleteProposalContent());
        proposal && (await deleteProposal());

        ctx.status = 500;
        ctx.body = { error: error, message: error.message };
      }
    },
    async delete(ctx) {
      const { id } = ctx.params;

      try {
        // Delete proposal
        let deletedProposal = await strapi.entityService.delete(
          "api::proposal.proposal",
          id
        );

        if (!deletedProposal) {
          throw new Error("Proposal not found or delete failed");
        }

        // Delete proposal content
        await strapi.db
          .query("api::proposal-content.proposal-content")
          .deleteMany({
            where: {
              proposal_id: id,
            },
          });

        // Handling proposal submitions
        await strapi.db
          .query("api::proposal-submition.proposal-submition")
          .deleteMany({
            where: {
              proposal_id: id,
            },
          });

        // Delete proposal votes
        await strapi.db.query("api::proposal-vote.proposal-vote").deleteMany({
          where: {
            proposal_id: id,
          },
        });

        // Delete comments
        await strapi.db.query("api::comment.comment").deleteMany({
          where: {
            proposal_id: id,
          },
        });

        // Handling polls and poll votes
        const polls = await strapi.db.query("api::poll.poll").findMany({
          where: {
            proposal_id: id,
          },
        });

        for (const poll of polls) {
          await strapi.db.query("api::poll-vote.poll-vote").deleteMany({
            where: {
              poll_id: poll.id,
            },
          });
        }

        await strapi.db.query("api::poll.poll").deleteMany({
          where: {
            proposal_id: id,
          },
        });

        return this.transformResponse(deletedProposal);
      } catch (error) {
        return ctx.badRequest("Failed to delete proposal and related data", {
          error: error.message,
        });
      }
    },
  })
);
