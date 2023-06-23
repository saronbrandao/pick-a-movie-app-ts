import { IMG_PATH, GENRES } from './Config';
import { getMovies } from './DataFetching';
import { prevSearchTerm } from './Cards';
import {
  addTrailerBtnListener,
  addBookmarkListener,
  markupGenerator,
} from './helper';

const bookmarksBtn = document.querySelector('.bookmarks');
const main = document.getElementById('main') as HTMLElement;
const bookmarksModal = document.querySelector('.bookmarks-modal');
const fromBookmarks = true;

interface Bookmark {
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  genres: [];
  genre_ids: [];
  id?: string;
}
export const bookmarks: Bookmark[] = [];
const isBookmarked = true;

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

// LOCAL STORAGE

const bookmarksToLocalStorage = () => {
  localStorage.setItem('myBookmarks', JSON.stringify(bookmarks));
  bookmarksLocalStorageChecker();
};

const bookmarksLocalStorageChecker = () => {
  if (!localStorage.getItem('myBookmarks')) return;

  const localSotageBookmarks = JSON.parse(localStorage.getItem('myBookmarks')!);

  bookmarks.length = 0;

  localSotageBookmarks.forEach((el: any) => {
    bookmarks.push(el);
  });
};

bookmarksLocalStorageChecker();

export const removeBookmark = async (id: number) => {
  const newBookmarks = bookmarks.filter((el: any) => el.id! !== id);

  bookmarks.length = 0;

  if (newBookmarks.length < 1) {
    if (!bookmarksModal) return;
    bookmarksModal.innerHTML = 'There are no bookmarks';
    return;
  }

  newBookmarks.forEach(async (el) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${el.id}?api_key=8d9871ba48a0b98e7eca6525a75a97a9`
    );
    const data = await res.json();

    bookmarks.push(data);

    if (!bookmarksModal) return;
    bookmarksModal.innerHTML = '';

    bookmarks.forEach((movie) => {
      const {
        title,
        poster_path,
        vote_average,
        overview,
        genres: genre_ids,
      } = movie;
      const genres: string[] = [];

      // getting the gender based on the gernder id
      genre_ids.map((genre: number) => {
        if (genres.length === genre_ids.length - 1) {
          genres.push(GENRES[genre]);
        } else {
          genres.push(GENRES[genre] + ', ');
        }
      });

      // const voteAvg = +vote_average

      const vote: number = +vote_average.toFixed(1);

      const reaction = () => {
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
      movieEl.classList.add('bookmarked');
      movieEl.setAttribute('data-id', `${movie.id}`);

      const bgImage = poster_path
        ? `
      style="background-image: url('${IMG_PATH + poster_path}')"
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
        isBookmarked,
        fromBookmarks
      );

      bookmarksModal.appendChild(movieEl);
    });
    bookmarkedListener();
    addTrailerBtnListener();
    bookmarksToLocalStorage();
  });
};

export const bookmarkedListener = () => {
  const bookmerkedMovies = document.querySelectorAll('.bookmark-remove');

  bookmerkedMovies.forEach((movie) => {
    movie.addEventListener('click', () => {
      if (!movie.getAttribute('data-id')) return;
      const id = +movie.getAttribute('data-id')!;
      removeBookmark(id);
    });
  });
};

bookmarksBtn!.addEventListener('click', () => {
  main.classList.toggle('hidden');
  bookmarksModal!.classList.toggle('hidden');
  bookmarksBtn!.classList.toggle('active');

  if (bookmarksModal!.classList.contains('hidden')) {
    getMovies(prevSearchTerm);
    addTrailerBtnListener();
    addBookmarkListener();
    return;
  }

  if (bookmarks.length < 1) {
    bookmarksModal!.innerHTML = 'There are no bookmarks';
    return;
  }

  bookmarksModal!.innerHTML = '';

  bookmarks.forEach((movie) => {
    const {
      title,
      poster_path,
      vote_average,
      overview,
      genres: genre_ids,
    } = movie;
    const genres: string[] = [];

    // getting the gender based on the gernder id
    genre_ids.map((genre: number) => {
      if (genres.length === genre_ids.length - 1) {
        genres.push(GENRES[genre]);
      } else {
        genres.push(GENRES[genre] + ', ');
      }
    });

    const vote: number = +vote_average.toFixed(1);

    const reaction = () => {
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
    movieEl.classList.add('bookmarked');
    movieEl.setAttribute('data-id', `${movie.id}`);

    const bgImage = poster_path
      ? `
      style="background-image: url('${IMG_PATH + poster_path}')"
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
      isBookmarked,
      fromBookmarks
    );

    bookmarksModal!.appendChild(movieEl);
  });
  bookmarkedListener();
  addTrailerBtnListener();
  window.scrollTo(0, 0);
});

export const addBookmark = async (id: number) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=8d9871ba48a0b98e7eca6525a75a97a9`
  );
  const data = await res.json();

  bookmarks.push(data);
  bookmarksToLocalStorage();
};

// REMOVING BOOKMARK
