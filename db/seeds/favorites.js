exports.seed = function(knex) {
  return knex('favorites').del()
    .then(() => {
      return Promise.all([
        knex('favorites').insert([
          {title: 'Alive', artistName: 'Dabin', rating: 75, genre: 'edm'},
          {title: 'Time', artistName: 'Kidswaste', rating: 90, genre: 'alternative'},
          {title: 'Breathe', artistName: 'Telepopmusik', rating: 80, genre: 'down tempo'}
          {title: 'Shake It Off', artistName: 'Taylor Swift', genre: 'Pop', rating: 95},
          {title: 'Get Out', artistName: 'Chvrches', genre: 'Pop', rating: 92},
          {title: "Sing About Me / I'm Dying of Thirst", artistName: 'Kendrick Lamar', genre: 'Rap', rating: 85},
          {title: 'Whispers in the Dark', artistName: 'Mumford & Sons', genre: 'Folk', rating: 80}
        ], 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
