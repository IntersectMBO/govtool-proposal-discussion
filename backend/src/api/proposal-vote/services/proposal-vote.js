'use strict';

/**
 * proposal-vote service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::proposal-vote.proposal-vote');
