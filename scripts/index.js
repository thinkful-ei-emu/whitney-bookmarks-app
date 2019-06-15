'use strict';
/*global api, STORE, bookmarks */

// when the page is ready, place event listeners and load initial page
$(document).ready(function() {

  // when document is ready attach listeners
  bookmarks.bindEventListeners();

  // Use getBookmarks to get the bookmarks from the API
  // IF NO BOOKMARKS SHOW - ALL DATA STORED IN API IS WIPED EVERY 24 HOURS PER DOCUMENTATION
  api.getBookmarks()
  // Once bookmarks are retrieved (bookmark structure => [{bookmark}, {bookmark}, {bookmark}] )
    .then((bookmarkObj) => {
      bookmarkObj.forEach(bookmark => STORE.addBookmark(bookmark));
      
      // render the page
      bookmarks.render();
    })
    .catch(error => {
      STORE.setError(`Error fetching bookmarks: ${error}`);
    });
});