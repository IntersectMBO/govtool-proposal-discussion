//@ts-nocheck
"use strict";

/**
 * poll router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter('api::poll.poll', {
	config: {
		find: {
			roles: ['authenticated', 'public'],
		},
		create: {
			roles: ['authenticated'],
		},
		findOne: {
			roles: ['authenticated', 'public'],
		},
		update: {
			roles: ['authenticated'],
		},
		delete: {
			roles: [],
			middlewares: ['global::is-owner'],
		},
	},
});
