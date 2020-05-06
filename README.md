# file-server
Whitelisted file server that serves files and directory views for navigation.

## Usage

Create a `./config.json` file with contents that folows this following format:

```javascript
{
	"root": "~/Downloads",
	"port": 50000,
	"whitelist": [
		"::1",
		"::ffff:127.0.0.1",
	]
}
```

- `root` Mandatory path to directory that you want to serve.
- `port` Optional port that file-server will run on (default: 50000). Using the "PORT" environment variable will override this.
- `whitelist` Mandatory IPv6 whitelist.

Start the server with the command `node --experimental-modules index.mjs`
