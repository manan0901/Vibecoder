// This file contains static params generation for all dynamic routes
// We will include this in our next.config.js

module.exports = {
  // Disable rewrites and headers for static export
  disableRewrites: true,
  disableHeaders: true,
  
  // Specify custom routes to be included in the static export
  // Removing these dynamic routes from the build output
  excludeDynamicRoutes: [
    '/projects/[id]',
    '/projects/[id]/edit',
    '/projects/[id]/analytics',
    '/sellers/[id]'
  ]
};
