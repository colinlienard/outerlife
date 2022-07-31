import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  components: {
    dirs: ['~/ui'],
  },
  css: ['~/styles/reset.scss', '~/styles/global.scss'],
  ssr: false,
  target: 'static',
  typescript: {
    strict: true,
    typeCheck: true,
  },
});
