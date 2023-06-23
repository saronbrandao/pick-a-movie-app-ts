import { getMovies } from './DataFetching';
import { addTrailerBtnListener } from './helper';

//GENERAL VARIABLES
const form = document.getElementById('form') as HTMLFormElement;
const search = document.getElementById('search') as HTMLInputElement;

form.addEventListener('submit', (e: Event): void => {
  e.preventDefault();

  const searchTerm: string = search.value;

  if (search && searchTerm !== '') {
    getMovies(searchTerm);
    search.value = '';
    addTrailerBtnListener();
  } else {
    return;
  }
});
