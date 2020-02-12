
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('playlist_favorites', function(table){
      table.increments('id').primary();
      table.integer('playlist_id').references('playlists.id');
      table.integer('favorite_id').references('favorites.id');

      table.unique(['favorite_id', 'playlist_id']);
    }),
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('playlist_favorites')
  ])
};
