'use strict';
/*global STORE, api */

const bookmarks = function() {

  const generateBookmarkHtml = function(bookmarkInd) {
    // if expand is false, add expand html (which will set to hidden)
    const bookmarkExpand = !bookmarkInd.expand ? 'bookmark-expand':'';
      

    // generate individual bookmark html
    return `
    <div class="bookmark-condensed-container js-bookmark-condensed-container" data-item-id="${bookmarkInd.id}">
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

  // Returns joined individual bookmark html
  const generateBookmarksHtml = function(bookmarksObj) {
    const bookmarksHtml = bookmarksObj.map((bookmarkInd) => generateBookmarkHtml(bookmarkInd));
    return bookmarksHtml.join('');
  };
  // add html to the page
  const render = function (){
    //console.log('Rendering page');

    //making a copy of our STORE
    let bookmarksStoreCopy = [...STORE.bookmarks];
    //console.log(bookmarksStoreCopy);
    //console.log(bookmarks);

    // send bookmarks object to generate html
    const bookmarkHtml = generateBookmarksHtml(bookmarksStoreCopy);
    // add the html to the bookmark container
    $('.js-bookmark-container').html(bookmarkHtml);
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
          store.setError(error.message);
          renderError();
        }
        );
    });
  };

  const bindEventListeners = function() {
    handleBookmarkExpand();
    handleBookmarkDelete();
  };

  return {
    bindEventListeners: bindEventListeners,
    render: render,
  };
  
  
}();