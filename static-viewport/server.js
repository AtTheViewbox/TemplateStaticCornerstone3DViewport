const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Middleware to log all requests for debugging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.path}`);
    next();
});

// Middleware to add custom headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
});

// Serve static files from the build directory
app.use('/TemplateStaticCornerstone3DViewport', express.static('/Users/vineethgangaram/TemplateStaticCornerstone3DViewport/static-viewport/build'));

// Proxy setup if needed (Modify as per requirements)
// app.use('/someSpecificPath', createProxyMiddleware({
//     target: 'http://localhost:3000',
//     changeOrigin: true,
// }));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
