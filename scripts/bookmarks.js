'use strict';
/*global STORE */

const bookmarks = function() {

  const generateBookmarkHtml = function(bookmarkInd) {
    //console.log(bookmarkInd);
    // generate individual bookmark html
    return `
    <h2 class="bookmark-name js-bookmark-name">${bookmarkInd.title}</h2>
    <span class="bookmark-rating js-bookmark-rating">${bookmarkInd.rating}</span>
    <button class="expand-button js-expand-button">^</button>
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
    $('.js-bookmark-condensed').html(bookmarkHtml);
  };

  return {
    render: render,
  };
  
  
}();