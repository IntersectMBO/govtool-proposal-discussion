//@ts-nocheck
"use strict";

/**
 * proposal router
 */


const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::governance-action-type.governance-action-type', {
	config: {
		find: {
			roles: ["authenticated", "public"],
		},
		create: {
			roles: [],
		},
		findOne: {
			roles: [],
		},
		update: {
			roles: [],
		},
		delete: {
			roles: [],
		},
	},
})
