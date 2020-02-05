class Favorite {
  formatFavorites(favoritesArr) {
    return favoritesArr.map(favorite => {
      return {
        id: favorite.id,
        title: favorite.title,
        artistName: favorite.artistName,
        genre: favorite.genre,
        rating: favorite.rating
      }
    })
  }
}
module.exports = Favorite;
