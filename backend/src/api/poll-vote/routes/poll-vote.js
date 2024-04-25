"use strict";

/**
 * poll-vote router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::poll-vote.poll-vote");
