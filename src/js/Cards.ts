import { getMovies } from './DataFetching';
import { addTrailerBtnListener, addBookmarkListener } from './helper';

const form = document.getElementById('form') as HTMLFormElement;
const search = document.getElementById('search') as HTMLInputElement;
const main = document.getElementById('main') as HTMLElement;
const botBtn = document.querySelector('.bot-icon');

const bookmarksModal = document.querySelector(
  '.bookmarks-modal'
) as HTMLFormElement;
const bookmarksBtn = document.querySelector('.bookmarks') as HTMLFormElement;

export let prevSearchTerm: string;

form.addEventListener('submit', async (e: Event): Promise<void> => {
  e.preventDefault();

  const searchTerm: string = search.value;
  prevSearchTerm = searchTerm;

  main.classList.remove('hidden');
  bookmarksModal?.classList.add('hidden');
  bookmarksBtn?.classList.remove('active');
  botBtn?.classList.remove('active');

  if (search && searchTerm !== '') {
    await getMovies(searchTerm);
    search.value = '';
    addTrailerBtnListener();
    addBookmarkListener();
  } else {
    return;
  }
});
