// eslint-disable-next-line import/no-extraneous-dependencies
import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ['~/styles/reset.scss', '~/styles/global.scss'],
  target: 'static',
  ssr: false,
  typescript: {
    strict: true,
  },
});
