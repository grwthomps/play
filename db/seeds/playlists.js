exports.seed = function(knex) {
  return knex('playlists').del()
    .then(() => {
      return Promise.all([
        knex('playlists').insert([
          {title: "Road Trip Jamz"},
          {title: "Shower Jamz"},
          {title: "Workout Jamz"},
          {title: "Sexy Time Jamz"},
          {title: "80's Jamz"},
          {title: "Classy Jamz"},
          {title: "Jazzy Jamz"}
        ], 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
