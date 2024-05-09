'use strict';

/**
 * proposal-content router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::proposal-content.proposal-content', {
    config: {
        create: {
            roles: ['authenticated', 'public'],
        }
    }
});
