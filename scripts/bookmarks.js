'use strict';
/*global STORE, api */

const bookmarks = function() {

  const generateBookmarkHtml = function(bookmarkInd) {
    // if expand is false, add expand html (which will set to hidden)
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

  const generateBookmarkAddHtml = function() {
    return [`
    <div class="add-book-container">
    <form> 
      <fieldset>
        <legend>Bookmark Information</legend>
        Title:<br>
        <input type="text" name:"title" required><br>
        Rating:<br>
        <input type="radio" name="stars" value="5 stars" checked>5 stars
        <input type="radio" name="stars" value="4 stars">4 stars
        <input type="radio" name="stars" value="3 stars">3 stars
        <input type="radio" name="stars" value="2 stars">2 stars
        <input type="radio" name="stars" value="1 stars">1 star<br>
        Description:<br>
        <textarea name="description" id="bookmark-description" cols="100" rows="10" required></textarea><br>
        Bookmark URL:<br>
        <input type="url" name="url" required><br><br>
        <input type="submit" value="Submit">
        <input type="reset" value="Reset"> 
      </fieldset>
    </form>
    <!-- ERROR DISPLAY -->
    <div class="error-container js-error-container">
      <h2>ERROR!</h2>
      <p>Errors</p>
    </div>
  </div>`];
  };

  // Returns joined individual bookmark html
  const generateBookmarksHtml = function(bookmarksObj) {
    const bookmarksHtml = bookmarksObj.map((bookmarkInd) => generateBookmarkHtml(bookmarkInd));
    return bookmarksHtml.join('');
  };
  // add html to the page
  const render = function (){
    //making a copy of our STORE
    if (STORE.adding) {
      //if STORE.adding is true, add the ADDING html
      const addHtml = generateBookmarkAddHtml().join('');
      $('.js-bookmark-container').html(addHtml);
    } else {
    //otherwise add the bookmark html
      let bookmarksStoreCopy = [...STORE.bookmarks];

      // send bookmarks object to generate html
      const bookmarkHtml = generateBookmarksHtml(bookmarksStoreCopy);

      // add the html to the bookmark container
      $('.js-bookmark-container').html(bookmarkHtml);
    }


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
          STORE.error(error.message);
          renderError();
        }
        );
    });
  };

  const handleBookmarkAdd = function() {
    $('.js-button-add').click(() => {
      console.log('You clicked the add button');
      STORE.adding = true;
      render();
    });
  };

  const bindEventListeners = function() {
    handleBookmarkExpand();
    handleBookmarkDelete();
    handleBookmarkAdd();
  };

  return {
    bindEventListeners: bindEventListeners,
    render: render,
  };
  
  
}();