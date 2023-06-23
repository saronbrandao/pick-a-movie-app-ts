import { getMoviesRefresher } from './DataFetching';
import { addTrailerBtnListener, addBookmarkListener } from './helper';

const pageEnd = document.querySelector('.page-end') as HTMLElement;

interface IntersectionObserverOptions {
  root: Element | null;
  rootMargin: string;
  threshold: number | number[];
}

const options: IntersectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
};

const observer = new IntersectionObserver(
  (elements: IntersectionObserverEntry[]) => {
    elements.forEach( async (el: IntersectionObserverEntry) => {
      if (el.isIntersecting) {
        await getMoviesRefresher();
        addTrailerBtnListener();
        addBookmarkListener();
      } else {
        return;
      }
    });
  },
  options
);

observer.observe(pageEnd);
