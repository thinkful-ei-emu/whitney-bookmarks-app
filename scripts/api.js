'use strict';

// eslint-disable-next-line no-unused-vars
const api = function() {
  const baseURL = 'https://thinkful-list-api.herokuapp.com/whitneywallace/bookmarks';

  const bookmarkApiFetch = function(method, body, id=null) {
    let error;
    let options = {
      headers: new Headers({'Content-Type':'application/json'}),
      method: method,
      body: body
    };
    //console.log(body);
    let destinationURL = baseURL;

    // if the request has an id, add it to the endpoint
    if(id) {
      destinationURL += '/'+id;
    }

    // if request is a GET request, delete the body key to avoid error (GET requests cannot have a body)
    if(options.method === 'GET' || options.method === 'DELETE') {
      delete options.body;
    }
  
    return fetch(destinationURL, options)
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
        if (error) {
          error.message = jsonObj.message;
          return Promise.reject(error);
        }
        // if there are no errors, return the JSON object (data retrieved)
        return jsonObj;
      });
  };

  const getBookmarks = function() {
    // call our bookmarkApiFetch function using the baseURL
    // expect to return all bookmark objects
    return bookmarkApiFetch('GET');
  };

  const deleteBookmark = function(id) {
    return bookmarkApiFetch('DELETE', {}, id);
  };

  const createBookmark = function(jsonObj) {
    //console.log(jsonObj);
    return bookmarkApiFetch('POST', jsonObj);
  };

  return {
    getBookmarks,
    deleteBookmark,
    createBookmark
  };

}();