import {  GENRES } from './Config';
// import { IMG_PATH, SEARCH_API, GENRES } from './Config';
import { bookmarks } from './Bookmarks';
import { markupGenerator } from './helper';

const main = document.getElementById('main') as HTMLElement;
const searchFail = document.createElement('div');

let pageNum: number = 1;
let currentSearchTerm: string = '';

interface Emoji {
  sad: string;
  neutral: string;
  smile: string;
  happy: string;
}

const emoji: Emoji = {
  sad: `<i class="fa-regular fa-face-frown"></i>`,
  neutral: `<i class="fa-regular fa-face-meh"></i>`,
  smile: `<i class="fa-regular fa-face-smile"></i>`,
  happy: `<i class="fa-regular fa-face-laugh-beam"></i>`,
};

export const getMovies = async (term: string): Promise<void> => {
  currentSearchTerm = term;
  const search: string = process.env.SEARCH_API + term + `&page=${pageNum}`;
  const res = await fetch(search);
  const data = await res.json();

  main.innerHTML = '';
  pageNum = 2;

  showMovies(data.results);
  window.scrollTo(0, 0);
};

export const getMoviesRefresher = async (): Promise<void> => {
  const search = process.env.SEARCH_API + currentSearchTerm + `&page=${pageNum}`;
  const res = await fetch(search);
  const data = await res.json();

  pageNum++;

  showMovies(data.results);
};

export const showMovies = (movies: any[]) => {
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, genre_ids } = movie;
    const genres: string[] = [];

    searchFail.remove();

    // getting the gender based on the gernder id
    genre_ids.map((genre: number) => {
      if (genres.length === genre_ids.length - 1) {
        genres.push(GENRES[genre]);
      } else {
        genres.push(GENRES[genre] + ', ');
      }
    });

    const vote: number = vote_average.toFixed(1);

    const reaction = (): string | undefined => {
      if (vote < 5) {
        return emoji.sad;
      } else if (vote <= 6) {
        return emoji.neutral;
      } else if (vote <= 8) {
        return emoji.smile;
      } else if (vote <= 10) {
        return emoji.happy;
      }
    };

    const movieEl = document.createElement('div');

    movieEl.classList.add('movie');
    movieEl.classList.add('main');
    movieEl.setAttribute('data-id', movie.id);

    const isBookmarked = bookmarks.some((el) => el.id === movie.id);

    const bgImage = poster_path
      ? `
    style="background-image: url('${process.env.IMG_PATH + poster_path}')"
    `
      : '';

    movieEl.innerHTML = markupGenerator(
      title,
      genres,
      poster_path,
      bgImage,
      vote,
      reaction,
      overview,
      movie,
      isBookmarked
    );
    main.appendChild(movieEl);
  });
};

export const getTrailerLink = async (id: string): Promise<boolean> => {
  const search = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=8d9871ba48a0b98e7eca6525a75a97a9`;
  const res = await fetch(search);
  const data = await res.json();
  const link = data.results.length > 0 ? data.results[0].key : false;

  if (link) {
    return link;
  } else {
    return false;
  }
};
