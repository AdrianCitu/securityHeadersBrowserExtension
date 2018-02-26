'use strict';

const AVAILABLE_HEADERS = [
  'Strict-Transport-Security',
  'Public-Key-Pins',
  'X-Frame-Options',
  'X-XSS-Protection',
  'X-Content-Type-Options',
  'Content-Security-Policy',
  'Referrer-Policy',
  'Expect-CT'
];

/*
 Remove the first item from `headers` with a .name property matching `pattern`.
 Modifies the Array in-place. Returns after the first match.
 */
function removeMatchingHeaders(headers, headerToLookFor) {
  const HEADER_REGEXP = new RegExp(headerToLookFor, 'i');
  for (var i = 0, header; (header = headers[i]); i++) {
    if (header.name.match(HEADER_REGEXP) != null) {
      headers.splice(i, 1);
      console.log('Removed header ' + headerToLookFor + ' from the HTTPResponse');
      return;
    }
  }
}

function headerPresent(headers, headerToLookFor) {
  const HEADER_REGEXP = new RegExp(headerToLookFor, 'i');
  for (var i = 0, header; (header = headers[i]); i++) {
    if (header.name.match(HEADER_REGEXP) != null) {
      return true;
    }
  }
  return false;
}

function responseListener(details) {

  for (var i = 0; i < AVAILABLE_HEADERS.length; i++) {
    var addHeader = localStorage.getItem('add-' + AVAILABLE_HEADERS[i]);
    if (addHeader == undefined) {
      var removeHeader = localStorage.getItem('delete-' + AVAILABLE_HEADERS[i]);
      if (removeHeader == undefined) {
        continue;
      } else {
        removeMatchingHeaders(
          details.responseHeaders,
          AVAILABLE_HEADERS[i]);
      }
    } else {
      if (!headerPresent(details.responseHeaders, AVAILABLE_HEADERS[i])) {
        details.responseHeaders.push(
          {
            name: AVAILABLE_HEADERS[i],
            value: localStorage.getItem('add-' + AVAILABLE_HEADERS[i])
          });
      }
    }

  }

  return {responseHeaders: details.responseHeaders};
}

chrome.webRequest.onHeadersReceived.addListener(
  //callback
  responseListener,
  //filter
  {
    urls: ['*://*/*']
  },

  //opt_extraInfoSpec
  [
    //that means that the request is blocked until the callback function returns.
    'blocking',
    //
    'responseHeaders'
  ]);
