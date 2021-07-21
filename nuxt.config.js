// eslint-disable-next-line nuxt/no-cjs-in-config
const webpack = require('webpack')

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Vue DataTable',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~node_modules/bootstrap-datetime-picker/css/bootstrap-datetimepicker.min.css',
    '~node_modules/glyphicons-only-bootstrap/css/bootstrap.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      ssr: false,
      src: '~node_modules/jquery/dist/jquery.min.js'
    },
    {
      ssr: false,
      src: '~node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js'
    },
    {
      ssr: false,
      src: '~plugins/vue-select.js'
    },
    {
      ssr: false,
      src: '~plugins/datetimepicker.js'
    },
    '~/plugins/bus'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  bootstrapVue: {
    icons: true
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /**
     * add external plugins
     */
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery'
      })
    ]
  }
}
