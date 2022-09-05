var MBTiles = require('@mapbox/mbtiles');
var VectorTile = require('@mapbox/vector-tile').VectorTile;
var Pbf = require('pbf');
var zlib = require('zlib');

var z = 14;
var x = 8292;
var y = 6115;

function hash(z, x, y) {
    return `${z}/${x}/${y}`;
}

function getTMSy(z, y){
	return  (1 << z) - 1 - y;
}

function updateTile(mbtiles, data, callback){
	let _db = mbtiles._db;
	_db.run('PRAGMA synchronous=OFF', this);

	_db.serialize(function() {
		_db.run('BEGIN');
		// Flip Y coordinate because MBTiles files are TMS.
		y = getTMSy(z, y);
		console.log(y);
		var coords = hash(z, x, y);
		console.log(coords);
		var images = _db.prepare('UPDATE images SET tile_data = ? WHERE tile_id = ?');
		images.run(data, coords);
		images.finalize();
		_db.run('COMMIT', callback);
	});
}

var mbtiles_dest = './2017-07-03_europe_spain.mbtiles';

new MBTiles('./osm_icgc_perry.mbtiles', function(err, mbtiles) {

  mbtiles.getTile(z, x, y, function(err, data, headers) {
	console.log(data);  
	// `data` is your gzipped buffer - use zlib to gunzip or inflate
	if (err) {
      throw err;
	}
	new MBTiles(mbtiles_dest, function(err, mbtiles2) {
		if (err) {
			throw err;
		}

		updateTile(mbtiles2, data, function(err){
			mbtiles2.stopWriting(function(err) {
				// stop writing to your mbtiles object
				console.log("stopWriting");
				if (err) {
					throw err;
				}
			}); //end stopwrite
		});
		
	});
});
});	
