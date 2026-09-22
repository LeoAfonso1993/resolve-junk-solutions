import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://resolvejunksolutions.com',
  trailingSlash: 'never',
  output: 'static',
  devToolbar: { enabled: false },
});
