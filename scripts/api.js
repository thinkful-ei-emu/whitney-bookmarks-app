'use strict';

const api = function() {
  const baseURL = 'https://thinkful-list-api.herokuapp.com/whitneywallace/bookmarks';

  const bookmarkApiFetch = function(url, options) {
    let error;
    return fetch(url)
      .then(response => {
        // check if our resopnse is NOT ok
        if (!response.ok) {
          // if our response is NOT ok, create an error object in our error variable with the error status
          error = {code: response.status};
          //check if the content-type of our response is NOT JSON
          if (!response.headers.get('content-type').includes('json')) {
          // if the content-type is NOT JSON, add to our error object the status text
            error.message = response.statusText;
            // return that our promise rejected with the error object
            return Promise.reject(error);
          }
        }
        // if our response is OK, return JSON
        return response.json();
      })
      .then(jsonObj => {
        // NEED MORE CLARIFICATION ON WHAT THIS PORTION DOES
        if (error) {
          console.log(error);
          console.log('this is in the if loop');
          error.message = jsonObj.message;
          return Promise.reject(error);
        }
        // if there are no errors, return the JSON object (data retrieved)
        //console.log(jsonObj);
        return jsonObj;
      });
  };

  const getBookmarks = function() {
    // call our bookmarkApiFetch function using the baseURL
    // expect to return all bookmark objects
    return bookmarkApiFetch(baseURL);
  };

  return {
    getBookmarks
  };

}();