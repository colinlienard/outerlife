import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  components: {
    dirs: ['~/ui'],
  },
  css: ['~/styles/reset.scss', '~/styles/global.scss'],
  modules: ['@pinia/nuxt'],
  ssr: false,
  typescript: {
    strict: true,
  },
});
