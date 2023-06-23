import { getMovies } from './DataFetching';
import { addTrailerBtnListener, addBookmarkListener } from './helper';

const form = document.getElementById('form') as HTMLFormElement;
const search = document.getElementById('search') as HTMLInputElement;
const main = document.getElementById('main') as HTMLElement;
const bookmarksModal = document.querySelector('.bookmarks-modal');
const bookmarksBtn = document.querySelector('.bookmarks');

export let prevSearchTerm: string;

form.addEventListener('submit', (e: Event): void => {
  e.preventDefault();

  const searchTerm: string = search.value;
  prevSearchTerm = searchTerm;

  main.classList.remove('hidden');
  bookmarksModal.classList.add('hidden');
  bookmarksBtn.classList.remove('active');

  if (search && searchTerm !== '') {
    getMovies(searchTerm);
    search.value = '';
    addTrailerBtnListener();
    addBookmarkListener();
  } else {
    return;
  }
});