import { defineConfig } from 'vite';

/**
 * The build is deployed into the subfolder /Memory/ on the FTP server, so the
 * asset URLs have to carry that prefix – with the default '/' the browser
 * would look for the CSS and JS bundles in the document root and find nothing.
 */
export default defineConfig({
  base: '/Memory/'
});
