// eslint-disable-next-line import/no-extraneous-dependencies
import { defineNuxtConfig } from 'nuxt3';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  alias: {
    assets: '../../../assets',
  },
  css: ['~/styles/reset.scss'],
  typescript: {
    strict: true,
  },
});
