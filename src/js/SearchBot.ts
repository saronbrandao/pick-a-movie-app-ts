import { getMovies } from './DataFetching';
import {
  addTrailerBtnListener,
  addBookmarkListener,
  typeText,
  handleSubmit,
} from './helper';
import { prevSearchTerm } from './Cards';

const rootDirectory = window.location.origin;
const botBtn = document.querySelector('.bot-icon');
const bookmarksBtn = document.querySelector('.bookmarks');
const bookmarksModal = document.querySelector('.bookmarks-modal');
const formContainer = document.querySelector('.form-container');
const main = document.getElementById('main') as HTMLElement;
const topMovies = document.createElement('div');
topMovies.classList.add('movie-list-container');

let movieDescription = '';

export const formContentInnerHTML = `<div class="robot-spinner-container">
<div class="robot-spinner-container__spinner">
  <div></div>
  <div></div>
</div>
</div>
<div class="form-container__robot">
<img src="${rootDirectory}/img/robot.svg" alt="Description of the SVG image" />
</div>
<div class="form-container__text">
<h1>
  If you're unsure which movie to search for, simply describe the movie
  you'd like to watch, and our search bots will provide you with a
  curated list of the top 10 movies that align with your preferences.
</h1>
</div>
<form class="form-container__form" action="">
<textarea
  class="form-container__form__text-area"
  name=""
  id=""
  cols="30"
  rows="10"
  maxlength="100"
  placeholder="Ex: I would like to watch a movie from 90's that contains action, romance and a bit of drama."
></textarea>
<button class="form-container__form__button">GET MOVIES</button>
</form>`;

export const searchBotListeners = () => {
  formContainer!.innerHTML = formContentInnerHTML;

  const searchTextArea = document.querySelector(
    '.form-container__form__text-area'
  ) as HTMLTextAreaElement;
  const searchBot = document.querySelector('.form-container__robot');
  const explainerText = document.querySelector('.form-container__text');

  const getMoviesBtn = document.querySelector('.form-container__form__button');

  const robotLoadAnim = document.querySelector('.robot-spinner-container');
  searchTextArea!.addEventListener('focus', () => {
    searchBot?.classList.add('--active');
    explainerText?.classList.add('--active');
  });
  searchTextArea!.addEventListener('blur', () => {
    setTimeout(() => {
      searchBot?.classList.remove('--active');
      explainerText?.classList.remove('--active');
    }, 100);
  });

  getMoviesBtn?.addEventListener('click', async (e) => {
    e.preventDefault();

    const alertMessage = 'Description is too short! I need more information :)';

    movieDescription = searchTextArea?.value;

    if (searchTextArea?.value.length < 30) {
      searchTextArea!.value = ' ';
      getMoviesBtn?.classList.add('--hidden');
      typeText(searchTextArea, alertMessage);
      setTimeout(() => {
        searchTextArea!.value = movieDescription;
        getMoviesBtn?.classList.remove('--hidden');
      }, 2000);
      return;
    }

    searchBot?.classList.add('--searching');
    explainerText?.classList.add('--hidden');
    searchTextArea?.classList.add('--hidden');
    getMoviesBtn?.classList.add('--hidden');

    setTimeout(() => {
      robotLoadAnim?.classList.add('--active');
    }, 300);

    const res = await handleSubmit(movieDescription);

    if (res.ok) {
      // THIS WILL BE ADDED LATER
      // const data = await res.json();

      setTimeout(() => {
        searchBot?.classList.add('--hidden');
        robotLoadAnim?.classList.remove('--active');
        if (!document.querySelector('.movie-list-container')) {
          const topMovies = document.createElement('div');
          topMovies.classList.add('movie-list-container');
        }
        setTimeout(() => {
          topMovies.innerHTML = `
          <h1>Top 10 ( Demo List )</h1>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>
          <p>"Movie Title"</p>`;

          main.appendChild(topMovies);
          main.classList.remove('hidden');
        }, 1000);
      }, 3000);
    }
  });
};

botBtn?.addEventListener('click', async () => {
  topMovies.remove();
  if (botBtn.classList.contains('active')) {
    botBtn.classList.remove('active');
    formContainer!.innerHTML = '';
    main.classList.remove('hidden');

    await getMovies(prevSearchTerm);
    addTrailerBtnListener();
    addBookmarkListener();

    return;
  }
  setTimeout(() => {
    main.innerHTML = '';
  }, 200);
  formContainer?.classList.remove('hidden');

  botBtn.classList.toggle('active');
  bookmarksBtn!.classList.remove('active');
  bookmarksModal!.classList.add('hidden');
  main.classList.add('hidden');

  searchBotListeners();
});
