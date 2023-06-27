import { getTrailerLink } from './DataFetching';
import {
  addBookmark,
  removeBookmark,
  bookmarks as myBookmarks,
} from './Bookmarks';

const body = document.getElementsByTagName('BODY')[0];

// this function will get the clicked movie id, and use its id to fetch the trailer link and return it.
export const addTrailerBtnListener = (): void => {
  setTimeout(() => {
    const movies: NodeListOf<Element> = document.querySelectorAll('.movie');

    movies.forEach((movie) => {
      // listener true will prevent duplicate event listeners
      if (movie.getAttribute('listener')) {
        return;
      }

      movie.setAttribute('listener', 'true');

      movie.addEventListener('click', async (e) => {
        const currentEl = e.target as HTMLElement;
        const exists: null | HTMLElement = currentEl.parentElement;

        if (!exists) return;

        if (currentEl.parentElement!.classList.contains('watch-btn')) {
          const movieId: string = (movie as HTMLElement).dataset.id!;
          const videoLink = await getTrailerLink(movieId);
          const videoPlayerModal = document.createElement('div');

          videoPlayerModal.classList.add('video-player-modal');
          videoPlayerModal.innerHTML = videoLink
            ? `<iframe
          class="video-player-modal__player"
          src="https://www.youtube.com/embed/${videoLink}?&autoplay=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <div class="video-player-modal__options">
          <i class="video-player-modal__options__close fa-solid fa-xmark"></i>
        </div>`
            : `<div class="video-player-modal__player-missing">
            <h2>Trailer not found...</h2>
            <i class="icon-not-found fa-solid fa-face-sad-tear"></i>
            <div class="video-player-modal__options">
              <i class="video-player-modal__options__close fa-solid fa-xmark"></i>
            </div>
          </div>`;

          body.appendChild(videoPlayerModal);

          videoPlayerModal.addEventListener('click', (e) => {
            const currentEl = e.target as HTMLElement;

            if (currentEl.classList.contains('fa-xmark')) {
              videoPlayerModal.remove();
            } else {
              return;
            }
          });
        }
      });
    });
  }, 500);
};

export const addBookmarkListener = () => {
  setTimeout(() => {
    const bookmarks = document.querySelectorAll('.bookmark');
    bookmarks.forEach((bookmark) => {
      if (bookmark.getAttribute('listener')) {
        return;
      }
      bookmark.setAttribute('listener', 'true');
      bookmark.addEventListener('click', (e) => {
        const targetElement = e.target as HTMLElement;
        const movieElement = targetElement.closest('.movie');

        if (!movieElement) return;

        const id = movieElement.getAttribute('data-id');

        if (!id) return;

        const isBookmarked = myBookmarks.some((el) => +el.id! === +id);

        if (isBookmarked) {
          const targetElement = e.target as HTMLElement;
          targetElement?.classList.remove('fa-solid');
          targetElement?.classList.add('fa-regular');
          removeBookmark(+id);
          return;
        } else {
          const targetElement = e.target as HTMLElement;
          targetElement?.classList.remove('fa-regular');
          targetElement?.classList.add('fa-solid');
          addBookmark(+id);

          return;
        }
      });
    });
  }, 500);
};

export const markupGenerator = (
  title: string,
  genres: string[],
  poster_path: string,
  bgImage: string,
  vote: number,
  reaction: () => string | undefined,
  overview: string,
  movie: any,
  isBookmarked: boolean = false,
  fromBookmarks: boolean = false
) => {
  return `
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
        ${
          fromBookmarks
            ? `<div class="bookmark-remove">
        <i class="fa-solid fa-bookmark bookmark-remove" data-id="${movie.id}"></i>
      </div>`
            : `<div class="bookmark">
      <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
    </div>`
        }
        
    </div>
  </div>
`;
};

export const typeText = (el: HTMLTextAreaElement, text: string) => {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      el.value += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
};

export const handleSubmit = async (data: string) => {
  const movieList = await fetch('http://localhost:5000/moviebot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data,
    }),
  });

  return movieList;
};
