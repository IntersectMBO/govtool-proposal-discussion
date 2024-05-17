//@ts-nocheck
"use strict";

/**
 * comment router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::comment.comment", {
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
    },
    delete: {
      roles: [],
    },
  },
});
