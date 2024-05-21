//@ts-nocheck
"use strict";

/**
 * proposal-submition router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::proposal-submition.proposal-submition",
  {
    config: {
      find: {
        roles: ["authenticated"],
      },
      create: {
        roles: ["authenticated"],
      },
      findOne: {
        roles: ["authenticated"],
      },
      update: {
        roles: [],
        middlewares: ["global::is-owner"],
      },
      delete: {
        roles: ["authenticated"],
        middlewares: ["global::is-owner"],
      },
    },
  }
);
