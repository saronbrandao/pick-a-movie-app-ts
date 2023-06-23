import { getMovies } from './DataFetching';
import { addTrailerBtnListener, addBookmarkListener } from './helper';

//GENERAL VARIABLES
const form = document.getElementById('form') as HTMLFormElement;
const search = document.getElementById('search') as HTMLInputElement;
export let prevSearchTerm: string;

form.addEventListener('submit', (e: Event): void => {
  e.preventDefault();

  const searchTerm: string = search.value;
  prevSearchTerm = searchTerm;

  if (search && searchTerm !== '') {
    getMovies(searchTerm);
    search.value = '';
    addTrailerBtnListener();
    addBookmarkListener();
  } else {
    return;
  }
});
