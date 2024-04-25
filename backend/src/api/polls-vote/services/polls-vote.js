'use strict';

/**
 * polls-vote service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::polls-vote.polls-vote');
