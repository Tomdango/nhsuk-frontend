import nhsuk_autocomplete from './autocomplete';

/*
 * Header
 *
 * Functionality to toggle the search and menu dropdowns
 * on tablet and mobile devices.
 */

/* Shared function to toggle class names */

function toggleClass(ele, class1) {
  /* eslint-disable prefer-template, no-useless-concat, no-param-reassign */
  const classes = ele.className;
  const regex = new RegExp('\\b' + ' ' + class1 + '\\b');
  const hasOne = classes.match(regex);
  class1 = class1.replace(/\s+/g, '');
  if (hasOne) {
    ele.className = classes.replace(regex, '');
  } else {
    ele.className = classes + ' ' + class1;
  }
}

/* Search toggle */
function toggleSearch(e) {
  const searchToggleButton = document.querySelector('#toggle-search');
  const searchContainer = document.querySelector('#wrap-search');
  const menuSearchContainer = document.querySelector('#content-header');

  e.preventDefault();

  if (searchToggleButton.hasAttribute('aria-expanded')) {
    searchToggleButton.removeAttribute('aria-expanded');
  } else {
    searchToggleButton.setAttribute('aria-expanded', 'true');
  }

  toggleClass(searchToggleButton, 'is-active');
  toggleClass(searchContainer, 'js-show');
  toggleClass(menuSearchContainer, 'js-show');
}

function handleSearchToggle() {
  const searchToggleButton = document.querySelector('#toggle-search');
  const searchClose = document.querySelector('#close-search');

  if (searchToggleButton) {
    searchToggleButton.addEventListener('click', toggleSearch);
  }
  if (searchClose) {
    searchClose.addEventListener('click', toggleSearch);
  }
}

/* Menu toggle */

function toggleMenu(e) {
  const menuToggleButton = document.querySelector('#toggle-menu');
  const nav = document.querySelector('#header-navigation');

  e.preventDefault();

  if (menuToggleButton.hasAttribute('aria-expanded')) {
    menuToggleButton.removeAttribute('aria-expanded');
  } else {
    menuToggleButton.setAttribute('aria-expanded', 'true');
  }

  toggleClass(menuToggleButton, 'is-active');
  toggleClass(nav, 'js-show');
}

function handleMenuToggle() {
  const menuToggleButton = document.querySelector('#toggle-menu');
  const menuClose = document.querySelector('#close-menu');

  if (menuToggleButton) {
    menuToggleButton.addEventListener('click', toggleMenu);
  }
  if (menuClose) {
    menuClose.addEventListener('click', toggleMenu);
  }
}

/**
   * Function to build truncated result with svg for search autocomplete
   * @param {string} result String containing individual result from autocomplete source function 
   * @returns {string} String of HTML containing passed result
  */
function suggestion(result) {
  const truncateLength = 36;
  const dots = result.length > truncateLength ? '...' : '';
  const resultTruncated = result.substring(0, truncateLength) + dots;
  return `
    <svg class="nhsuk-icon nhsuk-icon__search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.71 18.29l-4.11-4.1a7 7 0 1 0-1.41 1.41l4.1 4.11a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 10a5 5 0 1 1 5 5 5 5 0 0 1-5-5z"></path></svg>
    <a href="https://www.nhs.uk/search?collection=nhs-meta&query=${result}">
      ${resultTruncated}
    </a>
  `;
}

/**
   * Function to populate the search autocomplete.
   * @param {string} query Query to pass to search API 
   * @param {function} populateResults Callback function passed to source by autocomplete plugin
  */
function source(query, populateResults) {
  // Build URL for search endpoint
  const rootUrl = 'https://nhs.funnelback.co.uk/s/suggest.json';
  const maxResults = 10;
  const fullUrl = `${rootUrl}?collection=nhs-meta&partial_query=${query}&sort=0&fmt=json++&profile=&show=${maxResults}`;

  // Async request for results based on query param
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fullUrl);
  xhr.onload = () => {
    if (xhr.status === 200) {
      // Array of display values from json
      const results = JSON.parse(xhr.responseText)
        .map(({ disp }) => disp);

      // Fire callback from autoComplete plugin
      populateResults(results);
    }
    // No message required for error... fails silently to standard form
  };
  xhr.send();
}

/* Header */
function nhsuk_header() { /* eslint-disable-line camelcase */
  handleSearchToggle();
  handleMenuToggle();
  new nhsuk_autocomplete({
    formId: 'search',
    inputId: 'search-field',
    containerId: 'autocomplete-container',
    source,
    templates: {
      suggestion,
    }
  });
}

export default nhsuk_header; /* eslint-disable-line camelcase */
