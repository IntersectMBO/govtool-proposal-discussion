'use strict';

/**
 * proposal service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::proposal.proposal');
