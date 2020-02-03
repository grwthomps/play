
exports.seed = function(knex) {
  return knex('favorites').del()
    .then( () => {
      return Promise.all([
        return knex('favorites').insert([
          {title: 'We Will Rock You'},
          {title: 'Back in Black'},
          {title: 'Imagine'}
        ]);
      ])
    });
};
