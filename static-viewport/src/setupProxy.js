const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/TemplateStaticCornerstone3DViewport',
    createProxyMiddleware({
      target: 'http://localhost:3001', // Point to your desired target
      changeOrigin: true,
      onProxyRes: (proxyRes, req, res) => {
        // Add custom headers to response
        proxyRes.headers['Cross-Origin-Opener-Policy'] = 'same-origin';
        proxyRes.headers['Cross-Origin-Embedder-Policy'] = 'credentialless';
      }
    })
  );
};
