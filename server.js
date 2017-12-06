'use strict';

process.title = 'file-server';

require('dotenv').config();
// const express = require('express');
// const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const server = http.createServer();
const pug = require('pug');

const config = require('./config.json');

const port = process.env.PORT || 3000;

// Compile pug file
const folderView = pug.compileFile(path.join('views', 'folder.pug'));

const error = (err, res) => {
	if (config.log) console.error(err.stack || err);
	if (res) {
		res.statusCode = 500;
		res.end('server error');
	}
}

server.on('request', (req, res) => {

	// Request variables
	const location = decodeURIComponent(path.join(config.root, req.url));

	// Request handler
	new Promise((resolve, reject) => {

		const IP = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].replace(/::?ffff:/, '');

		if (!config.whitelist.includes(IP)) {

			res.statusCode = 403;
			res.end(`Your IP address (${IP}) is not whitelisted.`);


			return reject();
		}

		if (config.log) console.log(req.url, '-->', location);

		fs.stat(location, (err, stats) => {
			if (err) {

				if (err.code === 'ENOENT') {
					res.statusCode = 404;
					res.end('not found')
				} else {
					reject(err);
				}
				return
			}

			if (stats.isFile()) {
				resolve('file');
			} else {
				resolve('folder');
			}

		});

	}).then(type => {
		if (type === 'file') {
			const file = fs.createReadStream(location);
			file.pipe(res);
		} else {
			fs.readdir(location, (err, items) => {
				if (err) return reject(err);

				res.end(folderView({ items }));

			})
		}
	}).catch(err => {
		if (err) error(err, res);
	});

});

server.listen(port || 3000, () => {
	if (config.log) console.log(`HTTP on port ${port}`);
});