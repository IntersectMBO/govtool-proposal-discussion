//@ts-nocheck
"use strict";

/**
 * proposal-vote router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::proposal-vote.proposal-vote", {
  config: {
    find: {
      roles: ["authenticated"],
    },
    create: {
      roles: ["authenticated"],
    },
    findOne: {
      roles: [],
    },
    update: {
      roles: ["authenticated"],
      middlewares: ["global::is-owner"],
    },
    delete: {
      roles: [],
      middlewares: ["global::is-owner"],
    },
  },
});
