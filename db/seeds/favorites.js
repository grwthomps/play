
exports.seed = function(knex) {
  return knex('favorites').del()
    .then( () => {

      return Promise.all([
        knex('favorites').insert([
          {title: 'Alive', artistName: 'Dabin', rating: 75, genre: 'edm'},
          {title: 'Time', artistName: 'Kidswaste', rating: 90},
          {title: 'Breathe', artistName: 'Telepopmusik', rating: 80, genre: 'down tempo'}
        ])
        .then(() => console.log('Seeding Complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
