//@ts-nocheck
"use strict";

/**
 * proposal router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::proposal-content.proposal-content", {
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
      roles: ["authenticated"],
      middlewares: ["global::is-owner"],
    },
    delete: {
      roles: [],
    },
  },
});
