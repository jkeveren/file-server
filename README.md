# file-server
Whitelisted file server that serves files and directory views for navigation.

## Usage

Create a `./config.json` file with contents that folows this following format:

```javascript
{
	// Mandatory path to directory that you want to be served
	"root": "/some/direcotry",
	/* Optional port that file-server will run on (default: 3000).
	Using the "PORT" environment variable will override this. */
	"port": 3000,
	// Otional. Should file-server log each request made? (defualt: true)
	"log": true,
	// Mandatory IP whitelist
	"whitelist": [
		"127.0.0.1",
		"::1",
		"192.168.1.2"
	]
}
```