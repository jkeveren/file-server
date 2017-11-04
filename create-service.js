'use strict';

const path = require('path');
const fs = require('fs');
const svc = require('node-windows').Service;

const service = new svc({
	name: 'file-server',
	description: 'Serves files from C:\Users\jkeve\Downloads\public',
	script: path.join(__dirname, 'server.js')
});

service.on('install', () => {
	console.log('Service installed. Starting...');
	service.start();
	console.log('Service started.');
});

service.install();
