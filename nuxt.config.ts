import { defineNuxtConfig } from 'nuxt3';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: [
    '~/styles/reset.scss',
  ],
  typescript: {
    strict: true
  },
});
