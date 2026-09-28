"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/image-to-base64";
exports.ids = ["vendor-chunks/image-to-base64"];
exports.modules = {

/***/ "(ssr)/./node_modules/image-to-base64/browser.js":
/*!*************************************************!*\
  !*** ./node_modules/image-to-base64/browser.js ***!
  \*************************************************/
/***/ (function(module) {

eval("\r\n(function(escope) {\r\n    function base64ToBrowser(buffer) {\r\n        return window.btoa([].slice.call(new Uint8Array(buffer)).map(function(bin) { return String.fromCharCode(bin); }).join(''));\r\n    }\r\n\r\n    function imageToBase64Browser(urlOrImage, param) {\r\n        if (!('fetch' in window && 'Promise' in window)) {\r\n            return Promise.reject('[*] image-to-base64 is not compatible with your browser.');\r\n        }\r\n        return fetch(urlOrImage, param || {}).then(function(response) {\r\n            return response.arrayBuffer();\r\n        }).then(base64ToBrowser);\r\n    }\r\n\r\n    if (true) {\r\n        module.exports = imageToBase64Browser;\r\n    } else {}\r\n})(this);\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaW1hZ2UtdG8tYmFzZTY0L2Jyb3dzZXIuanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYjtBQUNBO0FBQ0EscUZBQXFGLGtDQUFrQztBQUN2SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQVEsSUFBNkI7QUFDckM7QUFDQSxNQUFNLEtBQUssRUFFTjtBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbHlpbnNwZWN0b3JzLy4vbm9kZV9tb2R1bGVzL2ltYWdlLXRvLWJhc2U2NC9icm93c2VyLmpzP2E0MTEiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG4oZnVuY3Rpb24oZXNjb3BlKSB7XHJcbiAgICBmdW5jdGlvbiBiYXNlNjRUb0Jyb3dzZXIoYnVmZmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5idG9hKFtdLnNsaWNlLmNhbGwobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSkubWFwKGZ1bmN0aW9uKGJpbikgeyByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShiaW4pOyB9KS5qb2luKCcnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW1hZ2VUb0Jhc2U2NEJyb3dzZXIodXJsT3JJbWFnZSwgcGFyYW0pIHtcclxuICAgICAgICBpZiAoISgnZmV0Y2gnIGluIHdpbmRvdyAmJiAnUHJvbWlzZScgaW4gd2luZG93KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoJ1sqXSBpbWFnZS10by1iYXNlNjQgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB5b3VyIGJyb3dzZXIuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmZXRjaCh1cmxPckltYWdlLCBwYXJhbSB8fCB7fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcclxuICAgICAgICB9KS50aGVuKGJhc2U2NFRvQnJvd3Nlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBpbWFnZVRvQmFzZTY0QnJvd3NlcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXNjb3BlLmltYWdlVG9CYXNlNjQgPSBpbWFnZVRvQmFzZTY0QnJvd3NlcjtcclxuICAgIH1cclxufSkodGhpcyk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/image-to-base64/browser.js\n");

/***/ })

};
;