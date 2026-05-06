/**
 * 本地开发代理（零依赖）
 * 用途：绕过 HBuilderX 无法配置 proxy 的问题，同时给响应注入 CORS 头
 *
 * 启动：node dev-proxy.js
 * 修改 config/app.js 的 H5 分支 HTTP_REQUEST_URL: 'http://localhost:9000'
 */
const http = require('http');
const https = require('https');
const { URL } = require('url');

const TARGET = process.env.TARGET || 'https://423.ll0x3.cn';
const PORT = Number(process.env.PORT) || 9000;

const server = http.createServer((req, res) => {
	const origin = req.headers.origin || '*';
	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH',
		'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] || 'Content-Type,Authori-zation,Authorization,Form-type,Cookie',
		'Access-Control-Expose-Headers': '*',
	};

	// 预检请求
	if (req.method === 'OPTIONS') {
		res.writeHead(204, corsHeaders);
		res.end();
		return;
	}

	const targetUrl = new URL(req.url, TARGET);
	const isHttps = targetUrl.protocol === 'https:';
	const lib = isHttps ? https : http;

	// 透传 headers，替换 host 为目标 host，避免 nginx 校验异常
	const forwardHeaders = { ...req.headers };
	forwardHeaders.host = targetUrl.host;
	delete forwardHeaders['origin'];
	delete forwardHeaders['referer'];

	const options = {
		hostname: targetUrl.hostname,
		port: targetUrl.port || (isHttps ? 443 : 80),
		path: targetUrl.pathname + targetUrl.search,
		method: req.method,
		headers: forwardHeaders,
	};

	const proxyReq = lib.request(options, (proxyRes) => {
		// 合并响应头：目标响应头 + CORS 头（CORS 覆盖）
		const headers = { ...proxyRes.headers };
		// 移除目标可能返回的 cors 头避免和我们加的冲突
		delete headers['access-control-allow-origin'];
		delete headers['access-control-allow-credentials'];
		Object.assign(headers, corsHeaders);

		res.writeHead(proxyRes.statusCode, headers);
		proxyRes.pipe(res);
	});

	proxyReq.on('error', (err) => {
		console.error('[proxy error]', err.message);
		res.writeHead(502, { 'Content-Type': 'application/json', ...corsHeaders });
		res.end(JSON.stringify({ status: 502, msg: 'proxy error: ' + err.message }));
	});

	req.pipe(proxyReq);
});

server.listen(PORT, () => {
	console.log(`[dev-proxy] listening on http://localhost:${PORT}`);
	console.log(`[dev-proxy] forwarding to ${TARGET}`);
	console.log(`[dev-proxy] example: http://localhost:${PORT}/api/v2/index  ->  ${TARGET}/api/v2/index`);
});
