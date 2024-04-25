'use strict';

/**
 * proposal-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::proposal-status.proposal-status');
