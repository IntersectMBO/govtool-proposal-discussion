// @ts-nocheck
'use strict';

/**
 * proposal controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::proposal.proposal',
  ({ strapi }) => ({
    async find(ctx) {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      const { results, pagination } = await strapi
        .service('api::proposal.proposal')
        .find(sanitizedQueryParams);

      for (const proposal of results) {
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
        proposal.content = proposalContent?.data?.[0];
      } else {
        proposal.content = null;
      }

      return this.transformResponse(proposal);
    },
    async create(ctx) {
      const { data } = ctx?.request?.body;
      const { user_id: userID, add_poll: addPoll } = data;

      if (!userID) {
        return ctx.badRequest(null, 'User ID is required');
      }

      let proposal;
      let proposal_content;
      let poll;

      // Delete the Prposal
      const deleteProposal = async () => {
        let deletedProposal = await strapi.entityService.delete(
          'api::proposal.proposal',
          proposal?.id
        );

        if (!deletedProposal) {
          return ctx.badRequest(null, 'Proposal not deleted');
        }
      };

      // Delete the Proposal Content
      const deleteProposalContent = async () => {
        let deletedProposal = await strapi.entityService.delete(
          'api::proposal-content.proposal-content',
          proposal_content?.id
        );

        if (!deletedProposal) {
          return ctx.badRequest(null, 'Proposal content not deleted');
        }
      };

      try {
        // Create the Proposal
        try {
          proposal = await strapi.entityService.create(
            'api::proposal.proposal',
            { data }
          );

          if (!proposal) {
            return ctx.badRequest(null, 'Proposal not created');
          }
        } catch (error) {
          return ctx.badRequest(null, 'Proposal not created');
        }

        // Create Proposal content
        try {
          proposal_content = await strapi.entityService.create(
            'api::proposal-content.proposal-content',
            {
              data: {
                ...data,
                proposal_id: proposal?.id.toString(),
                gov_action_type_id: data?.gov_action_type_id?.toString(),
              },
            }
          );
        } catch (error) {
          // Delete the Proposal because the Proposal content was not created
          await deleteProposal();

          return ctx.badRequest(null, 'Proposal content not created');
        }

        if (addPoll) {
          // Create the Poll
          try {
            poll = await strapi.entityService.create('api::poll.poll', {
              data: {
                proposal_id: proposal?.id.toString(),
                is_poll_active: true,
                poll_start_dt: new Date().toISOString(),
              },
            });
          } catch (error) {
            // Delete the Proposal and Proposal Content because the Poll was not created
            await deleteProposalContent();
            await deleteProposal();

            return ctx.badRequest(null, 'Poll not created');
          }
        }

        return this.transformResponse({
          proposal_id: proposal.id,
          proposal_content_id: proposal_content.id,
        });

        // Global error catch
      } catch (error) {
        addPoll && poll && (await deletePoll());
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
          'api::proposal.proposal',
          id
        );

        if (!deletedProposal) {
          throw new Error('Proposal not found or delete failed');
        }

        // Delete proposal content
        await strapi.db
          .query('api::proposal-content.proposal-content')
          .deleteMany({
            where: {
              proposal_id: id,
            },
          });

        // Handling proposal submitions
        await strapi.db
          .query('api::proposal-submition.proposal-submition')
          .deleteMany({
            where: {
              proposal_id: id,
            },
          });

        // Delete proposal votes
        await strapi.db.query('api::proposal-vote.proposal-vote').deleteMany({
          where: {
            proposal_id: id,
          },
        });

        // Delete comments
        await strapi.db.query('api::comment.comment').deleteMany({
          where: {
            proposal_id: id,
          },
        });

        // Handling polls and poll votes
        const polls = await strapi.db.query('api::poll.poll').findMany({
          where: {
            proposal_id: id,
          },
        });

        for (const poll of polls) {
          await strapi.db.query('api::poll-vote.poll-vote').deleteMany({
            where: {
              poll_id: poll.id,
            },
          });
        }

        await strapi.db.query('api::poll.poll').deleteMany({
          where: {
            proposal_id: id,
          },
        });

        return this.transformResponse(deletedProposal);
      } catch (error) {
        return ctx.badRequest('Failed to delete proposal and related data', {
          error: error.message,
        });
      }
    },
  })
);
