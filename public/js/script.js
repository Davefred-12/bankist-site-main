'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const Header = document.querySelector('.header');
const imgTargets = document.querySelectorAll('img[data-src]');

// CREATING the modal*************************
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// setting button SCROLLING
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  section1.scrollIntoView({ behavior: 'smooth' });
});

// implementing the STICKY NAV**********************
// Using the new "Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(Header);

// PAGE NAVIGATION (SCROLLING)**********************
// to implement a smooth scrolling from sections to sections whenthenav links are clicked

// using the foreach method loop over the nav items
// document.querySelectorAll('.nav__link').forEach(function (element) {
//   // listening for when any of the link is clicked.
//   element.addEventListener('click', function (e) {
//     // we then prevent default behavior of jumping to the "#href" that we set in the HTML
//     e.preventDefault();
//     // now implementing the smooth scrolling into each section "#href"
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// but this method is isnt efficient so we then use the EVENT DELEGATION
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// menu fade Animation on the navBar***************
// (Event Delegation)

// 1. select the parent element of the nav items (including logo) : I.e the navbar rather than 'ul'.
nav.addEventListener('mouseover', function (e) {
  // 2.  now matching the element we are interested in(target). creating a variable containing that element
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // 3. now selecting the sibling links (all the other links inside the nav) using the 'closest' attribute and then use 'querySelector' to search for the links inside this parent element
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // . also check or the mouseover on the logo (since its inside the nav)
    const logo = link.closest('.nav').querySelector('img');
    // 5. now changing the opacity of the siblings of the selected link (unHovered links)
    siblings.forEach(el => {
      // checking if the current selected element is not the link itself
      if (el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
});
nav.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      siblings.forEach(el => {
        if (el !== link) el.style.opacity = 1;
      });
      logo.style.opacity = 1;
    });
  }
});

// BUILDING A TABBED component********************
// 1.listening for clicks on the button
tabsContainer.addEventListener('mouseover', function (e) {
  // but the "span" element is different fromy the button(because it has a different parent), so we use the 'closest' attribute (in this case, the span number is the sibling closest to the button)
  const clicked = e.target.closest('.operations__tab');
  // 2. Guard clause : IF the button is clicked then add the active tab (which applies the active style; transformig the button upwards)
  if (clicked) {
    clicked.classList.add('operations__tab--active');
    console.log('clicked');
  }
  // OR
  // if (!clicked) return;

  // 3. Remove active classes for tab buttons:
  //  we want all button to remain un-transformed till clicked
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // Activate tab
  clicked.classList.add('operations__tab--active');
  // . Remove active classes for content :
  //  we want all content in each component to remain un-transformed till clicked
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // 5. Activate content area
  // using the template literal to check for the dataset that was clicked
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// the SLIDER ********************************
const theSlider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;
  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  // now the function to slide the objects
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  goToSlide(0);

  // next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    // calling the function
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  // previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    // calling the function
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // adding the functionality to the left and right arrow keypads
  document.addEventListener('keydown', function (e) {
    if (e.Key === 'ArrowLeft') prevSlide();
    // or
    e.key === 'ArrowRight' && nextSlide();
  });

  // Imlementing the DOTS (under the slides) functionality
  const createDots = function () {
    // adding the datasets(in the data attribute set) forEach slide
    slides.forEach(function (_, i) {
      // inserting the DOTS to the HTML
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  // activate dots
  // 1. first deactivate the active dot class from all the dots
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // 2. now adding the active dot class to the active slide
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  // to keep the active dot slide active when the page reloads
  activateDot(0);

  // using event deleation to listen to when each dots are clicked
  // 1. we target the arent of the dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
theSlider();

// LOADING lazy images**************************
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// Mobile Hamburger button

// open menu ater clicking hamburger
const btnNavEl = document.querySelector('.mobile-hamburger');
const headerEl = document.querySelector('.header');
btnNavEl.addEventListener('click', function () {
  headerEl.classList.toggle('nav-open');
});

// close menu after clicking on link
const allLinks = document.querySelectorAll('a:link');
allLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (link.classList.contains('nav__link'))
      headerEl.classList.toggle('nav-open');
  });
});

// if (link.classList.contains('nav-link')) headerEl.classList.toggle('nav-open');

// LECTURES*********************************
// selecting elements
// const header = document.querySelector('.header');

// // Creating and inserting elements
// const message = document.createElement('div');
// // inserting the custom class 'cookie-mesaage' into the div
// message.classList.add('cookie-message');
// // inner HTML enables us include any html (button, img, h1, etc)
// // message.innerHTML =
// //   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// // implementing the created element to the page we apend
// header.append(message);

// // Deleting Elements
// // making the element disaper after it is clicked
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// // STYLES, ATTRIBUTE AND CLASSES
// message.style.color = '#333';
// // but for styles that arent in the DOM but in the style sheet
// console.log(getComputedStyle(message).width);

// CSS Custom properties
// in CSS to set a root property:  root{ --color-primary:#5ec576}; but in JAVASCRIPT: document.documentElement.style (or whatever it is youre targeting)

// document.documentElement.style.setProperty('--color-primary', 'lightgreen');

// EVENT HANDLERS:
// adding random colors to nav items

// 1. create a random value generator
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `${randomInt(0, 255)}, ${randomInt(0, 255)} ,${randomInt(0, 255)}`;
// 2. target the parents ('nav', 'nav-links') of the element carrying the "nav item"
// document.querySelector('.nav').addEventListener('click', function (e) {});
// document.querySelector('.nav_links').addEventListener('click', function (e) {});
// document.querySelector('.nav_item').addEventListener('click', function (e) {});
