'use strict';
/*global api, STORE, bookmarks */

// when the page is ready, place event listeners and load initial page
$(document).ready(function() {
  //console.log('The page is ready');

  // when document is ready attach listeners
  bookmarks.bindEventListeners();

  // Use getBookmarks to get the bookmarks from the API
  api.getBookmarks()
  // Once bookmarks are retrieved (bookmark structure => [{bookmark}, {bookmark}, {bookmark}] )
    .then((bookmarkObj) => {
      //console.log('Adding bookmarks to STORE');
      bookmarkObj.forEach(bookmark => STORE.addBookmark(bookmark));
      //console.log(STORE.bookmarks);
      
      // render the page
      bookmarks.render();
    })
    .catch(error => {
      STORE.setError(`Error fetching bookmarks: ${error}`);
    });
});