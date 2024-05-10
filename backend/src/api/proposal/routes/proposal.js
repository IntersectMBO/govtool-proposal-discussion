//@ts-nocheck
"use strict";

/**
 * proposal router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::proposal.proposal", {
	config: {
		find: {
			roles: ["authenticated", "public"],
		},
		create: {
			roles: ["authenticated", "public"],
		},
		findOne: {
			roles: ["authenticated", "public"],
		},
		update: {
			roles: [],
		},
		delete: {
			roles: [],
		},
	},
});
