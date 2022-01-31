const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments(filmId) {
    return this.#load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => ({
    'id': film.id,
    'comments': film.comments,
    'film_info': {
      'title': film.title,
      'alternative_title': film.alternativeTitle,
      'total_rating': film.totalRating,
      'poster': film.poster,
      'age_rating': film.ageRating,
      'director': film.director,
      'writers': film.writers,
      'actors': film.actors,
      'release': {
        'date': film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
        'release_country': film.releaseCountry,
      },
      'runtime': film.runtime,
      'genre': film.genres,
      'description': film.description,
    },
    'user_details': {
      'watchlist': film.isWatchList,
      'already_watched': film.isWatched,
      'favorite': film.isFavorite,
    },
  })

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
