const NodeCache = require("node-cache");

const cache = new NodeCache();

function set(req, data, next, cacheKey) {
	cache.set(cacheKey, JSON.stringify(data));
	console.log("Cached registered");
}

function get(req, res, next, cacheKey) {
	const content = cache.get(cacheKey);
	if (content) {
		console.log("Cache hit");
		const data = JSON.parse(content);
		return data;
	}
}

function clear(req, res, next, cacheKey) {
	cache.del(cacheKey);
	console.log("Cache reset");
}

module.exports = { get, set, clear };
