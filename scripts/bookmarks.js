'use strict';
/*global STORE, api */
/*eslint-env jquery */

const bookmarks = function() {

  const generateBookmarkHtml = function(bookmarkInd) {
    // if expand is false, add expand html (which will set to hidden)
    //console.log(bookmarkInd.title);
    const bookmarkExpand = !bookmarkInd.expand ? 'bookmark-hide':'';
    const bookmarkHide = STORE.adding ? 'bookmark-hide':'';
      

    // generate individual bookmark html
    return `
      <div class="bookmark-condensed-container js-bookmark-condensed-container ${bookmarkHide}" data-item-id="${bookmarkInd.id}">
        <h2 class="bookmark-name js-bookmark-name">${bookmarkInd.title}</h2>
        <span class="bookmark-rating js-bookmark-rating">${bookmarkInd.rating}</span>
        <button class="expand-button js-expand-button">...</button>
      </div>
      <div class=" js-bookmark-expand-container ${bookmarkExpand}">
        <p>${bookmarkInd.desc}</p>
        <a class="bookmark-URL js-bookmark-URL" href=${bookmarkInd.url}>Visit Site!</a>
        <button class="delete-button js-delete-button">Delete</button>
      </div>
    `;
  };

  const generateHeaderFooterUserControls = function() {
    return `
    <!-- BOOKMARKS HEADER -->
    <header>
    <h1>Bookmark App Title</h1>
  </header>
<!-- BOOKMARKS CONTROLS-->
  <div class="flex-container">
    <section class="user-controls">
      <button class="button-add js-button-add">+Add</button>
      <label for="star-rating-filter">Filter by:</label>
      <select name="star-rating" id="star-rating-filter">
        <option value="0">minimum rating</option>
        <option value="5">5 stars</option>
        <option value="4">4 stars+</option>
        <option value="3">3 stars+</option>
        <option value="2">2 stars+</option>
        <option value="1">See All</option>
      </select>
    </section>
<!-- BOOKMARKS DISPLAY -->
    <section class="bookmark-container js-bookmark-container">
    </section>
    </div>
<!-- BOOKMARKS FOOTER -->
  <footer>Bookmark App Footer</footer>`;
  };

  const generateBookmarkAddHtml = function() {
    const errorHide = !STORE.error ? 'bookmark-hide':'';
    return [`
    <div class="add-bookmark-container">
    <form class="add-bookmark-form"> 
      <fieldset>
        <legend>Bookmark Information</legend>
        <label for="title">Title:</label><br>
        <input type="text" id="title" name="title" required><br>
        <label for="rating">Rating:</label><br>
        <input type="radio" name="rating" id="rating" value="5" checked>5 stars
        <input type="radio" name="rating" id="rating" value="4">4 stars
        <input type="radio" name="rating" id="rating" value="3">3 stars
        <input type="radio" name="rating" id="rating" value="2">2 stars
        <input type="radio" name="rating" id="rating" value="1">1 star<br>
        <lable for="bookmark-description">Description:</lable><br>
        <textarea name="desc" id="bookmark-description" cols="100" rows="10" required></textarea><br>
        <label for="url">Bookmark URL:</label><br>
        <input type="url" name="url" id="url" required><br><br>
        <input type="submit" value="Submit">
        <input type="reset" value="Reset"> 
        <input type="button" value="Cancel" class="js-cancel-button">
      </fieldset>
    </form>
    <!-- ERROR DISPLAY -->
    <div class="error-container js-error-container ${errorHide}">
      <h2>ERROR!</h2>
      <p>Errors</p>
    </div>
  </div>`];
  };

  // Returns joined individual bookmark html
  const generateBookmarksHtml = function(bookmarksObj) {
    const bookmarksHtml = bookmarksObj.map((bookmarkInd) => generateBookmarkHtml(bookmarkInd));
    console.log(bookmarksObj);
    return bookmarksHtml.join('');
  };
  // add html to the page
  const render = function (){
    // No matter the state, render the following HTML
    const baseHtml = generateHeaderFooterUserControls();
    $('#js-bookmark-body').html(baseHtml);
    
    // if STORE.adding is true, add the following HTML
    if (STORE.adding) {
      const addHtml = generateBookmarkAddHtml().join('');
      $('.user-controls').toggleClass('bookmark-hide');
      $('.js-bookmark-container').html(addHtml);
      bindEventListeners();
    } else if (STORE.filtering) {
      let bookmarksFilteredCopy = [...STORE.filteredBookmarks];
      const bookmarkFilteredHtml = generateBookmarksHtml(bookmarksFilteredCopy);
      //$('.js-bookmark-container').empty();
      $('.js-bookmark-container').html(bookmarkFilteredHtml);
      STORE.filtering = false;
      bindEventListeners();
    } else {
      //otherwise add the bookmark html
      let bookmarksStoreCopy = [...STORE.bookmarks];

      // send bookmarks object to generate html
      const bookmarkHtml = generateBookmarksHtml(bookmarksStoreCopy);

      // add the html to the bookmark container
      $('.js-bookmark-container').html(bookmarkHtml);
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
      //console.log('I am being clicked');
      //get id from current target bookmark
      const id = getBookmarkIdFromElement(e.currentTarget);
      //console.log(e.currentTarget, id);
      //call store method to change expand to true
      STORE.expandBookmark(id);
      render();
    });
  };

  const handleBookmarkDelete = function() {
    $('.js-bookmark-container').on('click', '.js-delete-button', e => {
      //console.log('You clicked the delete button!');
      const id = $(e.currentTarget)
        .parent()
        .prev()
        .data('item-id');
      //console.log(id);
      api.deleteBookmark(id)
        .then(() => {
          STORE.deleteBookmark(id);
          render();
        })
        .catch((error) => {
          console.log(error);
          //STORE.error(error.message);
          //renderError();
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
        }).catch(e => handleErrors(e));
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


  const bindEventListeners = function() {
    handleBookmarkExpand();
    handleBookmarkDelete();
    handleBookmarkAdd();
    handleBookmarkSubmit();
    handleBookmarkCancel();
    handleBookmarkFilter();
  };

  return {
    bindEventListeners: bindEventListeners,
    render: render,
  };
  
  
}();