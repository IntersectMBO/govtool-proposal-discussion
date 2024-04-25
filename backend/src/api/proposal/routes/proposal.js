'use strict';

/**
 * proposal router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::proposal.proposal');
