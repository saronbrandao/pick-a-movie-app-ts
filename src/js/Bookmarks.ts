import { IMG_PATH, GENRES } from './Config';
import { getMovies } from './DataFetching';
import { prevSearchTerm } from './Cards';
import { addTrailerBtnListener, addBookmarkListener } from './helper';

const bookmarksBtn = document.querySelector('.bookmarks');
const main = document.getElementById('main') as HTMLElement;
const bookmarksModal = document.querySelector('.bookmarks-modal');
export const bookmarks: [] = [];

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

export const removeBookmark = async (id: number) => {
  // console.log(id);
  // console.log(bookmarks.length);

  // if (bookmarks.length < 1) {
  //   bookmarksModal.innerHTML = '';
  // }

  const newBookmarks = bookmarks.filter((el) => el.id !== id);

  bookmarks.length = 0;

  // console.log(newBookmarks.length);

  if (newBookmarks.length < 1) {
    bookmarksModal.innerHTML = 'There are no bookmarks';
    return;
  }

  newBookmarks.forEach(async (el) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${el.id}?api_key=8d9871ba48a0b98e7eca6525a75a97a9`
    );
    const data = await res.json();

    bookmarks.push(data);

    // console.log(bookmarks.length);

    //////////////////////////////
    //////////////////////////////
    //////////////////////////////
    //////////////////////////////
    //////////////////////////////
    //////////////////////////////

    bookmarksModal.innerHTML = '';

    // if (bookmarks.length === 0) return;

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

      const vote: number = vote_average.toFixed(1);

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
      movieEl.setAttribute('data-id', movie.id);

      const bgImage = poster_path
        ? `
      style="background-image: url('${IMG_PATH + poster_path}')"
      `
        : '';

      movieEl.innerHTML = `
      <div class="col1 title-gender">
            <h1>${title}</h1>
            <ul class="movie-gen">
              <li>${genres.join('')}</li>
            </ul>
          </div>
          <div class="movie-img ${
            !poster_path ? 'movie-img--default' : ''
          }" ${bgImage} ></div>
      <div class="text-movie-cont">
        <div class="mr-grid">
        </div>
        <div class="mr-grid summary-row">
          <div class="col2">
            <h5>SUMMARY</h5>
          </div>
          <div class="col2">
            <ul class="movie-likes">
              <p>Score: ${vote}</p>
              <li>${reaction()}</li>
            </ul>
          </div>
        </div>
        <div class="mr-grid">
          <div class="col1">
            <p class="movie-description">
              ${overview.substring(0, 100)}...
            </p>
          </div>
        </div>
        <div class="mr-grid actors-row"></div>
        <div class="mr-grid action-row">
          <div class="col2 btns">
            <div class="watch-btn">
              <h3><i class="material-icons">&#xE037;</i>TRAILER</h3>
            </div>
            <div class="bookmark-remove">
              <i class="fa-solid fa-bookmark bookmark-remove" data-id="${
                movie.id
              }"></i>
            </div>
        </div>
      </div>
    `;

      bookmarksModal.appendChild(movieEl);
    });
    bookmarkedListener();
    addTrailerBtnListener();
  });
};

export const bookmarkedListener = () => {
  const bookmerkedMovies = document.querySelectorAll('.bookmark-remove');

  // console.log(bookmerkedMovies);

  bookmerkedMovies.forEach((movie) => {
    movie.addEventListener('click', () => {
      if (!movie.getAttribute('data-id')) return;
      const id = +movie.getAttribute('data-id');
      // console.log(id);
      removeBookmark(id);
    });
  });
};

bookmarksBtn.addEventListener('click', () => {
  main.classList.toggle('hidden');
  bookmarksModal.classList.toggle('hidden');

  if (bookmarksModal.classList.contains('hidden')) {
    getMovies(prevSearchTerm);
    addTrailerBtnListener();
    addBookmarkListener();
    return;
  }

  if (bookmarks.length < 1) {
    bookmarksModal.innerHTML = 'There are no bookmarks';
    return;
  }

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

    const vote: number = vote_average.toFixed(1);

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
    movieEl.setAttribute('data-id', movie.id);

    const bgImage = poster_path
      ? `
      style="background-image: url('${IMG_PATH + poster_path}')"
      `
      : '';

    movieEl.innerHTML = `
      <div class="col1 title-gender">
            <h1>${title}</h1>
            <ul class="movie-gen">
              <li>${genres.join('')}</li>
            </ul>
          </div>
          <div class="movie-img ${
            !poster_path ? 'movie-img--default' : ''
          }" ${bgImage} ></div>
      <div class="text-movie-cont">
        <div class="mr-grid">

        </div>
        <div class="mr-grid summary-row">
          <div class="col2">
            <h5>SUMMARY</h5>
          </div>
          <div class="col2">
            <ul class="movie-likes">
              <p>Score: ${vote}</p>
              <li>${reaction()}</li>
            </ul>
          </div>
        </div>
        <div class="mr-grid">
          <div class="col1">
            <p class="movie-description">
              ${overview.substring(0, 100)}...
            </p>
          </div>
        </div>
        <div class="mr-grid actors-row"></div>
        <div class="mr-grid action-row">
          <div class="col2 btns">
            <div class="watch-btn">
              <h3><i class="material-icons">&#xE037;</i>TRAILER</h3>
            </div>
            <div class="bookmark-remove">
              <i class="fa-solid fa-bookmark bookmark-remove" data-id="${
                movie.id
              }"></i>
            </div>
        </div>
      </div>
    `;

    bookmarksModal.appendChild(movieEl);
  });
  bookmarkedListener();
});

export const addBookmark = async (id) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=8d9871ba48a0b98e7eca6525a75a97a9`
  );
  const data = await res.json();

  bookmarks.push(data);
};

// REMOVING BOOKMARK
