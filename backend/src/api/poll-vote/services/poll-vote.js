'use strict';

/**
 * poll-vote service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::poll-vote.poll-vote');
