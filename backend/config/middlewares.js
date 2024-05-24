module.exports = [
  "strapi::logger", // Enables Strapi's built-in logger middleware for logging.
  "strapi::errors", // Handles errors within the Strapi application.
  {
    name: "strapi::security", // Configures security-related settings.
    config: {
      contentSecurityPolicy: {
        // Defines the Content Security Policy (CSP) directives.
        directives: {
          "default-src": ["'self'"], // Restricts the sources for default loading.
          "base-uri": ["'self'"], // Restricts the base URL for the document.
          "font-src": ["'self'", "https:", "data:"], // Specifies the sources for fonts.
          "form-action": ["'self'"], // Restricts the URLs which can be used as the action for HTML forms.
          "frame-ancestors": ["'self'"], // Specifies valid parents that may embed the page.
          "img-src": ["'self'", "data:", "https://cdn.redoc.ly"], // Specifies the sources for images.
          "object-src": ["'none'"], // Restricts the sources for the <object>, <embed>, and <applet> elements.
          "script-src": ["'self'", "https://cdn.redoc.ly", "'unsafe-eval'"], // Specifies the sources for scripts.
          "worker-src": ["'self'", "blob:"],
          "script-src-attr": ["'none'"], // Specifies that inline script attributes will be rejected.
          "style-src": ["'self'", "https:", "'unsafe-inline'"], // Specifies the sources for stylesheets, allowing inline styles.
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy', // Adds 'X-Powered-By: Strapi' header to responses.
  'strapi::query', // Enables query parsing middleware.
  {
    name: 'strapi::body',
    config: {
      patchKoa: true,
      multipart: true,
      includeUnparsed: true,
    },
  }, // Parses incoming request bodies.
  'strapi::session', // Enables session middleware.
  'strapi::favicon', // Serves the favicon.
  'strapi::public', // Serves public files.
];
