'use strict';
/*global STORE, api */
/*eslint-env jquery */

// eslint-disable-next-line no-unused-vars
const bookmarks = function() {

  // generates checked and unchecked stars based on the user's rating
  const generateStarRating = function(bookmarkInd) {
    let starRating;
    let starChecked = bookmarkInd.rating;
    let starUnchecked = (5 - starChecked);
    const starCheckedHtml = '<span class="fa fa-star checked"></span>';
    const starUncheckedHtml = '<span class="fa fa-star"></span>';

    // Repeat the checked star HTML to indicate how many stars a user has given a bookmark
    // Repeat the unchecked star HTML however many times is necessary for their to be 5 stars total
    starRating = starCheckedHtml.repeat(starChecked) + starUncheckedHtml.repeat(starUnchecked);
    
    return starRating;
  };

  const generateBookmarkHtml = function(bookmarkInd) {
    // if expand is false, add expand html (which will set to hidden)
    const bookmarkExpand = !bookmarkInd.expand ? 'bookmark-hide':'';
    const bookmarkRating = generateStarRating(bookmarkInd);      

    // generate individual bookmark HTML
    return `
      <div class="bookmark-condensed-container js-bookmark-condensed-container" data-item-id="${bookmarkInd.id}">
        <button class="expand-button js-expand-button">...</button>  
        <h2 class="bookmark-name js-bookmark-name">${bookmarkInd.title}</h2>
        <div class="bookmark-rating js-bookmark-rating">
          ${bookmarkRating}
        </div>
        <div class="bookmark-expand js-bookmark-expand-container ${bookmarkExpand}">
          <p>Description: ${bookmarkInd.desc}</p>
          <div class="actions">
            <a class="bookmark-URL js-bookmark-URL" href=${bookmarkInd.url} target="_blank">Visit Site!</a>
            <button class="delete-button js-delete-button">Delete</button>
          </div>
        </div>
      </div>
    `;
  };

  const generateHeaderFooterUserControls = function() {

    // generate header, user controls, and footer HTML
    return `
    <!-- BOOKMARKS HEADER -->
    <header role="banner">
    <h1>BookSmarts</h1>
  </header>
<!-- BOOKMARKS CONTROLS-->
  <div class="main-container" role="main">
    <div class="flex-container">
      <section class="user-controls">
        <button class="button-add js-button-add">+Add</button>
        <div class="filter-container">
          <label for="star-rating-filter">Filter by:</label>
          <select name="star-rating" id="star-rating-filter">
            <option value="0">minimum rating</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars+</option>
            <option value="3">3 stars+</option>
            <option value="2">2 stars+</option>
            <option value="1">See All</option>
          </div>
        </select>
      </section>
  <!-- BOOKMARKS DISPLAY -->
      <section class="bookmark-container js-bookmark-container">
      </section>
    </div>
  </div>
<!-- BOOKMARKS FOOTER -->
  <div class="footer-space" />
  <footer role="contentinfo">Thinkful Engineering Immersion</footer>`;
  };

  const generateBookmarkAddHtml = function() {

    // generate the HTML for adding a bookmark
    return [`
    <div class="add-bookmark-container">
    <form class="add-bookmark-form"> 
      <fieldset role="group">
        <legend class="form">Bookmark Information</legend>
        <label class="form" for="title">Title:</label><br>
        <input type="text" id="title" name="title" required><br>
        <div class"bookmark-hide" role="radiogroup" aria-labelledby="rating">
          <label class="form" id="rating">Rating:</label><br>
          <label class="bookmark-hide" for="rating5">5 stars</label>
          <input type="radio" name="rating" id="rating5" value="5" checked>5 stars
          <label class="bookmark-hide" for="rating4">4 stars</label>
          <input type="radio" name="rating" id="rating4" value="4">4 stars
          <label class="bookmark-hide" for="rating3">3 stars</label>
          <input type="radio" name="rating" id="rating3" value="3">3 stars
          <label class="bookmark-hide" for="rating2">2 stars</label>
          <input type="radio" name="rating" id="rating2" value="2">2 stars
          <label class="bookmark-hide" for="rating1">1 star</label>
          <input type="radio" name="rating" id="rating1" value="1">1 star<br>
        </div>
      <lable class="form">Description:<br>
          <textarea name="desc" id="bookmark-description" cols="100" rows="10" required></textarea>
        </lable><br>
        <label class="form" for="url">Bookmark URL:</label><br>
        <input type="url" name="url" id="url" required><br><br>
        <div class="actions">
          <input type="submit" value="Submit">
          <input type="reset" value="Reset"> 
          <input type="button" value="Cancel" class="js-cancel-button">
        </div>
      </fieldset>
    </form>
  </div>`];
  };

  // Returns joined individual bookmark html
  const generateBookmarksHtml = function(bookmarksObj) {
    const bookmarksHtml = bookmarksObj.map((bookmarkInd) => generateBookmarkHtml(bookmarkInd));
    return bookmarksHtml.join('');
  };

  // generates error message HTML
  const generateError = function(errorMessage) {
    return `
    <!-- ERROR DISPLAY -->
    <div class="error-container js-error-container">
      <button id="cancel-error">X</button>
      <h2>ERROR!</h2>
      <p>${errorMessage}</p>
    </div>
  `;
  };

  // removes error container
  const renderButtonClose = function() {
    $('.js-error-container').remove();
  };

  // if there is an error, render error container
  const renderError = function() {

    if (STORE.error) {
      const errorMessage = generateError(STORE.error);
      $('.user-controls').after(errorMessage);
    } else {
      $('.js-error-container').empty();
    }
  };

  /* RENDER OUR PAGE */

  const render = function (){
    // No matter the state, render the following HTML
    const baseHtml = generateHeaderFooterUserControls();
    $('#js-bookmark-body').html(baseHtml);
    
    // if STORE.adding is true, add the following HTML
    if (STORE.adding) {
      const addHtml = generateBookmarkAddHtml().join('');
      $('.user-controls').toggleClass('bookmark-hide');
      $('.js-error-container-main').toggleClass('bookmark-hide');
      $('.js-bookmark-container').html(addHtml);
      // check for errors, and render if there is an error
      renderError();
      bindEventListeners();
    } else 

    // if STORE.filtering is true, add the following HTML
    if (STORE.filtering) {
      
      let bookmarksFilteredCopy = [...STORE.filteredBookmarks];
      const bookmarkFilteredHtml = generateBookmarksHtml(bookmarksFilteredCopy);
      $('.js-bookmark-container').html(bookmarkFilteredHtml);
      // check for errors, and render if there is an error
      renderError();
      STORE.setFiltering(false);
      bindEventListeners();
    } else {
      //otherwise add the bookmark html
      let bookmarksStoreCopy = [...STORE.bookmarks];

      // send bookmarks object to generate html
      const bookmarkHtml = generateBookmarksHtml(bookmarksStoreCopy);

      // add the html to the bookmark container
      $('.js-bookmark-container').html(bookmarkHtml);
      renderError();
      bindEventListeners();
    }
  };

  // interpret form data
  const serializeJson = function(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  };

  /*Event Listeners */

  // returns the id of the target element
  const getBookmarkIdFromElement = function(targetElement) {
    return $(targetElement)
      .closest('.js-bookmark-condensed-container')
      .data('item-id');
  };

  // EXPANDS the bookmark clicked
  const handleBookmarkExpand = function() {
    $('.js-bookmark-container').on('click', '.js-expand-button', e => {
      //get id from current target bookmark
      const id = getBookmarkIdFromElement(e.currentTarget);
      //call store method to change expand to true
      STORE.expandBookmark(id);
      render();
    });
  };

  // DELETES the bookmark clicked
  const handleBookmarkDelete = function() {
    $('.js-delete-button').click(e => {
      const id = $(e.currentTarget)
        .parent()
        .parent()
        .parent()
        .data('item-id');
      api.deleteBookmark(id)
        .then(() => {
          STORE.deleteBookmark(id);
          render();
        })
        .catch((error) => {
          STORE.setError(error.message);
          renderError();
        }
        );
    });
  };

  // Changes state to ADDING
  const handleBookmarkAdd = function() {
    $('.js-button-add').click(() => {
      STORE.setAdding(true);
      render();
    });
  };

  // ADDS the bookmark
  const handleBookmarkSubmit = function() {
    $('.add-bookmark-form').submit(function(event) {
      event.preventDefault();
      let formElement = $('.add-bookmark-form')[0];
      let jsonObj = serializeJson(formElement);

      //create item in API
      api.createBookmark(jsonObj)
        .then((newBookmark) => {
          //then update the store
          STORE.addBookmark(newBookmark);
          render();
        }).catch((error) => {
          STORE.setError(error.message);
          renderError();
        });
      // Expand will not work after adding a new item without this render
      render();
    });
  };

  // Returns state to initial view when cancel is clicked
  const handleBookmarkCancel = function() {
    $('.js-cancel-button').click(() => {
      STORE.setAdding(false);
      render();
    });
  };

  // FILTERS bookmarks by user input
  const handleBookmarkFilter = function() {
    $('#star-rating-filter').change( () => {
      let filterParam = $('#star-rating-filter').val();
      STORE.filterBookmarks(filterParam);
      render();
    });
    
  };

  // closes error container
  const handleErrorClose = function() {
    $('#cancel-error').click(() => {
      renderButtonClose();
      STORE.setError(null);
    });
  };

  // set up event listeners
  const bindEventListeners = function() {
    handleBookmarkExpand();
    handleBookmarkDelete();
    handleBookmarkAdd();
    handleBookmarkSubmit();
    handleBookmarkCancel();
    handleBookmarkFilter();
    handleErrorClose();
  };

  // allows access to bindEventListeners and render
  return {
    bindEventListeners: bindEventListeners,
    render: render,
  };
  
}();