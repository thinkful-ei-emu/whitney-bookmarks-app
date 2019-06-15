'use strict';
/*global STORE, api */
/*eslint-env jquery */

// eslint-disable-next-line no-unused-vars
const bookmarks = function() {

  const generateStarRating = function(bookmarkInd) {
    let starRating;
    let starChecked = bookmarkInd.rating;
    let starUnchecked = (5 - starChecked);
    const starCheckedHtml = '<span class="fa fa-star checked"></span>';
    const starUncheckedHtml = '<span class="fa fa-star"></span>';

    starRating = starCheckedHtml.repeat(starChecked) + starUncheckedHtml.repeat(starUnchecked);
    
    return starRating;

    // Refactoring using .repeat string method
    //let starRating = '';
    // let counter;
    // for (let i = 0; i < bookmarkInd.rating; i++) {
    //   // '<span class="fa fa-star checked"></span>'.repeat(bookmarkInd.rating)
    //   starRating += '<span class="fa fa-star checked"></span>';
    //   counter = i;
    //   console.log(starRating);
    // }

    // for (let j = counter; j < 4; j++) {
    //   starRating += '<span class="fa fa-star"></span>';
    // }
    // //console.log(starRating);
    // return starRating;
  };

  const generateBookmarkHtml = function(bookmarkInd) {
    // if expand is false, add expand html (which will set to hidden)
    const bookmarkExpand = !bookmarkInd.expand ? 'bookmark-hide':'';
    const bookmarkRating = generateStarRating(bookmarkInd);      

    // generate individual bookmark html
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
            <a class="bookmark-URL js-bookmark-URL" href=${bookmarkInd.url}>Visit Site!</a>
            <button class="delete-button js-delete-button">Delete</button>
          </div>
        </div>
      </div>
    `;
  };

  const generateHeaderFooterUserControls = function() {
    return `
    <!-- BOOKMARKS HEADER -->
    <header>
    <h1>BookSmarts</h1>
  </header>
<!-- BOOKMARKS CONTROLS-->
  <div class="main-container">
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
  <footer>Thinkful Engineering Immersion</footer>`;
  };

  const generateBookmarkAddHtml = function() {
    return [`
    <div class="add-bookmark-container">
    <form class="add-bookmark-form"> 
      <fieldset>
        <legend class="form">Bookmark Information</legend>
        <label class="form" for="title">Title:</label><br>
        <input type="text" id="title" name="title" required><br>
        <label class="form" for="rating">Rating:</label><br>
        <input type="radio" name="rating" id="rating" value="5" checked>5 stars
        <input type="radio" name="rating" id="rating" value="4">4 stars
        <input type="radio" name="rating" id="rating" value="3">3 stars
        <input type="radio" name="rating" id="rating" value="2">2 stars
        <input type="radio" name="rating" id="rating" value="1">1 star<br>
        <lable class="form" for="bookmark-description">Description:</lable><br>
        <textarea name="desc" id="bookmark-description" cols="100" rows="10" required></textarea><br>
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

  const renderButtonClose = function() {
    $('.js-error-container').remove();
  };

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
      renderError();
      bindEventListeners();
    } else if (STORE.filtering) {
      let bookmarksFilteredCopy = [...STORE.filteredBookmarks];
      const bookmarkFilteredHtml = generateBookmarksHtml(bookmarksFilteredCopy);
      //$('.js-bookmark-container').empty();
      $('.js-bookmark-container').html(bookmarkFilteredHtml);
      renderError();
      STORE.filtering = false;
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

  const serializeJson = function(form) {
    //console.log(form);
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  };

  /*Event Listeners */

  const getBookmarkIdFromElement = function(targetElement) {
    return $(targetElement)
      .closest('.js-bookmark-condensed-container')
      .data('item-id');
  };

  const handleBookmarkExpand = function() {
    $('.js-bookmark-container').on('click', '.js-expand-button', e => {
      //get id from current target bookmark
      const id = getBookmarkIdFromElement(e.currentTarget);
      //call store method to change expand to true
      STORE.expandBookmark(id);
      render();
    });
  };

  const handleBookmarkDelete = function() {
    $('.js-delete-button').click(e => {
      const id = $(e.currentTarget)
        .parent()
        .parent()
        .data('item-id');
      //console.log(id);
      api.deleteBookmark(id)
        .then((jsonObj) => {
          console.log(jsonObj);
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

  const handleBookmarkAdd = function() {
    $('.js-button-add').click(() => {
      //console.log('You clicked the add button');
      STORE.adding = true;
      render();
    });
  };

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

  const handleBookmarkCancel = function() {
    $('.js-cancel-button').click(() => {
      STORE.adding = false;
      render();
    });
  };

  const handleBookmarkFilter = function() {
    $('#star-rating-filter').change( () => {
      let filterParam = $('#star-rating-filter').val();
      STORE.filterBookmarks(filterParam);
      render();
    });
    
  };

  const handleErrorClose = function() {
    $('#cancel-error').click(() => {
      //console.log('You clicked cancel');
      renderButtonClose();
      STORE.setError(null);
    });
  };


  const bindEventListeners = function() {
    handleBookmarkExpand();
    handleBookmarkDelete();
    handleBookmarkAdd();
    handleBookmarkSubmit();
    handleBookmarkCancel();
    handleBookmarkFilter();
    handleErrorClose();
  };

  return {
    bindEventListeners: bindEventListeners,
    render: render,
  };
  
  
}();