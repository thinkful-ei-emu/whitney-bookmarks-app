'use strict';
/*global STORE */

const STORE = function(){

  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };



  // returns store object with bookmarks
  return {
    bookmarks: [],
    error: null,
    addBookmark,
  };

}();