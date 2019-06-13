'use strict';
/*global STORE */

const STORE = function(){

  const addBookmark = function(bookmark) {
    // adds expand tracking locally
    this.bookmarks.forEach(bookmarkInd => (bookmarkInd.expand = false));

    this.bookmarks.push(bookmark);
  };

  const expandBookmark = function(id) {
    //find bookmark with matching id
    let expandedBookmark = this.bookmarks.find(bookmark => bookmark.id === id);

    if (expandedBookmark.expand) {
      expandedBookmark.expand = false;
    } else {
      expandedBookmark.expand = true;
    }
  };



  // returns store object with bookmarks
  return {
    bookmarks: [],
    error: null,
    addBookmark,
    expandBookmark
  };

}();