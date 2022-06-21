const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: '/dist',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  },
  devServer: {
		proxy: {
			'^/m':{
		    target: 'http://lumen.io',
				changeOrigin: true
			},
      '^/a':{
		    target: 'http://lumen.io',
				changeOrigin: true
			}
		}
	}
})
