// @ts-nocheck
"use strict";

/**
 * governance-action-type controller
 */

const axios = require("axios");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::governance-action-type.governance-action-type",
  ({ strapi }) => ({
    async find(ctx) {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);

      try {
        const { data } = await axios.get(
          `${process.env.GOVTOOL_API_BASE_URL}/epoch/params`
        );

        if (data) {
          if (!sanitizedQueryParams.filters) {
            sanitizedQueryParams.filters = {};
          }

          if (+data?.protocol_major < 9) {
            sanitizedQueryParams.filters = {
              ...sanitizedQueryParams.filters,
              $and: [
                {
                  gov_action_type_name: {
                    $ne: "Treasury",
                  },
                },
                {
                  gov_action_type_name: {
                    $ne: "Info",
                  },
                },
              ],
            };
          }
          if (+data?.protocol_major === 9) {
            sanitizedQueryParams.filters = {
              ...sanitizedQueryParams.filters,
              gov_action_type_name: {
                $ne: "Treasury",
              },
            };
          }
        }
      } catch (error) {}

      const { results, pagination } = await strapi
        .service("api::governance-action-type.governance-action-type")
        .find(sanitizedQueryParams);

      return this.transformResponse(results, { pagination });
    },
  })
);
