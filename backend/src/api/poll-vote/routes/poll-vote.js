//@ts-nocheck
'use strict';

/**
 * poll-vote router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::poll-vote.poll-vote', {
	config: {
		find: {
			roles: ['authenticated'],
			middlewares: ['global::is-owner'],
		},
		create: {
			roles: ['authenticated'],
		},
		findOne: {
			roles: [],
		},
		update: {
			roles: ['authenticated'],
			middlewares: ['global::is-owner'],
		},
		delete: {
			roles: ['authenticated'],
			middlewares: ['global::is-owner'],
		},
	},
});
