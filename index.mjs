import http from 'http';
import fs from 'fs';
import path from 'path';

const getConfig = async () => {
	const configBuffer = await fs.promises.readFile('config.json');
	return JSON.parse(configBuffer);
};

const server = http.createServer();

server.on('request', async (request, response) => {
	try {
		const ip = request.socket.remoteAddress; // get ip before waiting for config in case of client that disconnects immediately
		const config = await getConfig();
		if (!config.whitelist.includes(request.socket.remoteAddress)) {
			response.statusCode = 403;
			console.log('Unregocnised IP address: ' + ip);
			return;
		}
		const relativePath = decodeURI(request.url);
		const absolutePath = path.join(config.root, relativePath);
		console.log(`${request.socket.remoteAddress} --> ${relativePath}`);
		let stat;
		stat = await fs.promises.stat(absolutePath);
		if (stat.isDirectory()) {
			response.setHeader('content-type', 'text/html');
			response.write('<html style="background: black; font-family: monospace"><style>a {color: white}</style>');
			const items = await fs.promises.readdir(absolutePath);
			if (request.url !== '/') {
				items.unshift('..');
			}
			for (const item of items) {
				response.write(`<a href="${path.join(relativePath, item)}">${item}</a><br>`);
			}
		} else if (stat.isFile()) {
			response.setHeader('content-disposition', 'attachment');
			response.setHeader('content-length', stat.size);
			await new Promise((resolve, reject) => {
				const stream = fs.createReadStream(absolutePath);
				stream.on('open', () => stream.pipe(response));
				stream.on('error', reject);
			});
		} else {
			throw new Error('Item is not directory or file.');
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			response.statusCode = 404;
		} else {
			console.error(error);
			response.statusCode = 500;
		}
	} finally {
		response.end();
	}
});

(async () => {
	const config = await getConfig();
	server.listen(config.port, () => {
		console.log(`HTTP on port ${config.port}`);
	});
})();
