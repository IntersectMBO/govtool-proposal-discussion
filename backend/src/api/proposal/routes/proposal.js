//@ts-nocheck
"use strict";

/**
 * proposal router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::proposal.proposal", {
  config: {
    find: {
      roles: ["authenticated", "public"],
    },
    create: {
      roles: ["authenticated"],
    },
    findOne: {
      roles: ["authenticated", "public"],
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
});
