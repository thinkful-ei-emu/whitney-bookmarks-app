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

  const deleteBookmark = function(id) {
    //find bookmark with matching id
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
    //console.log(this.bookmarks);
  };



  // returns store object with bookmarks
  return {
    bookmarks: [],
    error: null,
    adding: false,
    addBookmark,
    expandBookmark,
    deleteBookmark
  };

}();