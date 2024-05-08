// @ts-nocheck
"use strict";

const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;
const { sanitize } = utils;
const _ = require("lodash");

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

module.exports = (plugin) => {
  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = strapi.store({ type: "plugin", name: "users-permissions" });
    const grantSettings = await store.get({ key: "grant" });

    const grantProvider = provider === "local" ? "email" : provider;

    if (!_.get(grantSettings, [grantProvider, "enabled"])) {
      throw new ApplicationError("This provider is disabled");
    }

    if (provider === "local") {
      const { identifier } = params;

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            provider,
            $or: [
              { email: identifier.toLowerCase() },
              { username: identifier },
            ],
          },
        });

      if (!user) {
        const pluginStore = await strapi.store({
          type: "plugin",
          name: "users-permissions",
        });

        const settings = await pluginStore.get({ key: "advanced" });

        if (!settings.allow_register) {
          throw new ApplicationError("Register action is currently disabled");
        }

        const role = await strapi
          .query("plugin::users-permissions.role")
          .findOne({ where: { type: settings.default_role } });

        const identifierFilter = {
          $or: [{ username: identifier }],
        };

        const conflictingUserCount = await strapi
          .query("plugin::users-permissions.user")
          .count({
            where: { ...identifierFilter, provider },
          });

        if (conflictingUserCount > 0) {
          throw new ApplicationError(
            "There is already a user with this wallet address."
          );
        }

        const newUser = {
          username: identifier,
          email: `${identifier}@example.com`,
          provider: "local",
          password: identifier,
          role: role.id,
          confirmed: true,
        };

        const user = await getService("user").add(newUser);

        const sanitizedUser = await sanitizeUser(user, ctx);

        if (settings.email_confirmation) {
          try {
            await getService("user").sendConfirmationEmail(sanitizedUser);
          } catch (err) {
            throw new ApplicationError(err.message);
          }

          return ctx.send({ user: sanitizedUser });
        }

        const jwt = getService("jwt").issue(_.pick(user, ["id"]));

        return ctx.send({
          jwt,
          user: sanitizedUser,
        });
      } else {
        const advancedSettings = await store.get({ key: "advanced" });
        const requiresConfirmation = _.get(
          advancedSettings,
          "email_confirmation"
        );

        if (requiresConfirmation && user.confirmed !== true) {
          throw new ApplicationError("Your account email is not confirmed");
        }

        if (user.blocked === true) {
          throw new ApplicationError(
            "Your account has been blocked by an administrator"
          );
        }

        return ctx.send({
          jwt: getService("jwt").issue({ id: user.id }),
          user: await sanitizeUser(user, ctx),
        });
      }
    }
  };

  return plugin;
};