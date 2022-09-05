"use strict";

const MbTiles = require('@mapbox/mbtiles');

function getTMSy(z, y){
	return  (1 << z) - 1 - y;
}

function createTileId(z, x, y) {
	return `${z}/${x}/${y}`;
}

class OpenMapTiles extends MbTiles{

	updateTile(z, x, y, data, callback) {
		if (typeof callback !== 'function') throw new Error('Callback needed');
		if (!this.open) return callback(new Error('MBTiles not yet loaded'));
		if (!Buffer.isBuffer(data)) return callback(new Error('Image needs to be a Buffer'));
		var mbtiles = this;
		var _db = mbtiles._db;
		_db.run('PRAGMA synchronous=OFF');

		_db.serialize(function() {
			_db.run('BEGIN');
			y = getTMSy(z, y);
			var coords = createTileId(z, x, y);
			console.log(coords);
			var images = _db.prepare('UPDATE tiles SET tile_data = ? WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?');
			images.run(data, z, x, y);
			images.finalize();
			_db.run('COMMIT', callback);
		});
	}

	updateTilePlanet(z, x, y, data, callback) {
		if (typeof callback !== 'function') throw new Error('Callback needed');
		if (!this.open) return callback(new Error('MBTiles not yet loaded'));
		if (!Buffer.isBuffer(data)) return callback(new Error('Image needs to be a Buffer'));
		var mbtiles = this;
		var _db = mbtiles._db;
		_db.run('PRAGMA synchronous=OFF');

		_db.serialize(function() {
			_db.run('BEGIN');
			y = getTMSy(z, y);
			var coords = createTileId(z, x, y);
			console.log(coords);
			var images = _db.prepare('UPDATE tiles SET tile_data = ? WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?');
			images.run(data, z, x, y);
			images.finalize();
			_db.run('COMMIT', callback);
		});
	}
}

module.exports = OpenMapTiles;
