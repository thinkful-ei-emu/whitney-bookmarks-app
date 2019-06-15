'use strict';

const STORE = function(){

  // ADDS bookmark to STORE
  const addBookmark = function(bookmark) {

    // adds expand tracking locally
    this.bookmarks.forEach(bookmarkInd => (bookmarkInd.expand = false));

    // adds bookmark to store
    this.bookmarks.push(bookmark);
    // toggles adding state
    this.adding = false;
  };

  // toggles EXPANDED state in STORE
  const expandBookmark = function(id) {
    // find bookmark with matching id
    let expandedBookmark = this.bookmarks.find(bookmark => bookmark.id === id);

    // toggle expanded value
    if (expandedBookmark.expand) {
      expandedBookmark.expand = false;
    } else {
      expandedBookmark.expand = true;
    }
  };

  // DELETES bookmark in STORE
  const deleteBookmark = function(id) {

    // returns all bookmarks that DO NOT match the id param
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  // FILTERS bookmarks in STORE
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

  // sets error message in STORE
  const setError = function(errorMessage) {
    this.error = errorMessage;
  };

  // toggles ADDING state in STORE
  const setAdding = function(param) {
    this.adding = param;
  };

  // toggles FILTERING state in STORE
  const setFiltering = function(param) {
    this.filtering = param;
  };



  // returns STORE object with bookmarks, allow global access
  return {
    bookmarks: [],
    filteredBookmarks: [],
    error: null, 
    adding: false,
    filtering: false,
    addBookmark,
    expandBookmark,
    deleteBookmark,
    filterBookmarks,
    setError,
    setAdding,
    setFiltering
  };

}();