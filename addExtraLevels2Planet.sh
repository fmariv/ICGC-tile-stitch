# extract higher levels
echo Extraient nivells de zoom 15 i 16...
tile-join -Z 15 --force -o data/ctxmaps15-16.mbtiles  data/contextmaps.mbtiles
echo ... nivells extrets

# insert ctxmaps15-16.mbtiles into planet and edit metadata
echo Insertant nivells de zoom 15 i 16 a les MBTiles del món i actualitzant metadades...
sqlite3 <<END_COMMANDS
ATTACH "data/ctxmaps15-16.mbtiles" AS db1; 
ATTACH "data/planet.mbtiles" AS db2; 
INSERT INTO db2.tiles SELECT * FROM db1.tiles;
UPDATE db2.metadata SET value = 16 WHERE name = 'maxzoom';
END_COMMANDS
echo ... fet!