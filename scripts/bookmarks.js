'use strict';
/*global STORE */

const bookmarks = function() {

  const generateBookmarkHtml = function(bookmarkInd) {
    // if expand is false, add expand html (which will set to hidden)
    const bookmarkExpand = !bookmarkInd.expand ? 'bookmark-expand':'';
      

    // generate individual bookmark html
    return `
    <div class="bookmark-condensed-container js-bookmark-condensed-container">
      <h2 class="bookmark-name js-bookmark-name" data-item-id="${bookmarkInd.id}">${bookmarkInd.title}</h2>
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
      .children('.js-bookmark-name')
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

  const bindEventListeners = function() {
    handleBookmarkExpand();
  };

  return {
    bindEventListeners: bindEventListeners,
    render: render,
  };
  
  
}();