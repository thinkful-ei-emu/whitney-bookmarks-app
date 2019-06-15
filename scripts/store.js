'use strict';

const STORE = function(){

  const addBookmark = function(bookmark) {
    // adds expand tracking locally
    this.bookmarks.forEach(bookmarkInd => (bookmarkInd.expand = false));

    this.bookmarks.push(bookmark);
    this.adding = false;
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
    console.log(this.bookmarks);
  };

  const filterBookmarks = function(filterNumber) {
    this.filteredBookmarks = [];
    this.filtering = true;
    // filter based on user selection
    this.bookmarks.forEach(function(bookmarkInd) {
      if (bookmarkInd.rating >= filterNumber) {
        STORE.filteredBookmarks.push(bookmarkInd);
      }
    });    
  };

  const setError = function(errorMessage) {
    this.error = errorMessage;
  };



  // returns store object with bookmarks
  return {
    bookmarks: [],
    filteredBookmarks: [],
    error: null, //normally null, {message: 'Testing for errors!'}
    adding: false,
    filtering: false,
    addBookmark,
    expandBookmark,
    deleteBookmark,
    filterBookmarks,
    setError
  };

}();