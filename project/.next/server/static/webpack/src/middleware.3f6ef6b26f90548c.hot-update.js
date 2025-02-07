"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("src/middleware",{

/***/ "(middleware)/./src/middleware.ts":
/*!***************************!*\
  !*** ./src/middleware.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js\");\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(middleware)/./node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js\");\n\nconst isProtectedRoute = (0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_0__.createRouteMatcher)([\n    \"/owner(.*)\"\n]);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_1__.clerkMiddleware)(async (auth, req)=>{\n    if (isProtectedRoute(req)) await auth.protect();\n}));\nconst config = {\n    matcher: [\n        // Skip Next.js internals and all static files, unless found in search params\n        \"/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)\",\n        // Always run for API routes\n        \"/(api|trpc)(.*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vc3JjL21pZGRsZXdhcmUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEyRTtBQUUzRSxNQUFNRSxtQkFBbUJELHdFQUFrQkEsQ0FBQztJQUFDO0NBQWE7QUFFMUQsaUVBQWVELHFFQUFlQSxDQUFDLE9BQU9HLE1BQU1DO0lBQzFDLElBQUlGLGlCQUFpQkUsTUFBTSxNQUFNRCxLQUFLRSxPQUFPO0FBQy9DLEVBQUUsRUFBQztBQUVJLE1BQU1DLFNBQVM7SUFDcEJDLFNBQVM7UUFDUCw2RUFBNkU7UUFDN0U7UUFDQSw0QkFBNEI7UUFDNUI7S0FDRDtBQUNILEVBQUUiLCJzb3VyY2VzIjpbIkQ6XFxXb3JrXFxCb29raW5nIEFJIEFnZW50XFxib29raW5nLXN5c3RlbVxccHJvamVjdFxcc3JjXFxtaWRkbGV3YXJlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsZXJrTWlkZGxld2FyZSwgY3JlYXRlUm91dGVNYXRjaGVyIH0gZnJvbSBcIkBjbGVyay9uZXh0anMvc2VydmVyXCI7XHJcblxyXG5jb25zdCBpc1Byb3RlY3RlZFJvdXRlID0gY3JlYXRlUm91dGVNYXRjaGVyKFtcIi9vd25lciguKilcIl0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xlcmtNaWRkbGV3YXJlKGFzeW5jIChhdXRoLCByZXEpID0+IHtcclxuICBpZiAoaXNQcm90ZWN0ZWRSb3V0ZShyZXEpKSBhd2FpdCBhdXRoLnByb3RlY3QoKTtcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xyXG4gIG1hdGNoZXI6IFtcclxuICAgIC8vIFNraXAgTmV4dC5qcyBpbnRlcm5hbHMgYW5kIGFsbCBzdGF0aWMgZmlsZXMsIHVubGVzcyBmb3VuZCBpbiBzZWFyY2ggcGFyYW1zXHJcbiAgICBcIi8oKD8hX25leHR8W14/XSpcXFxcLig/Omh0bWw/fGNzc3xqcyg/IW9uKXxqcGU/Z3x3ZWJwfHBuZ3xnaWZ8c3ZnfHR0Znx3b2ZmMj98aWNvfGNzdnxkb2N4P3x4bHN4P3x6aXB8d2VibWFuaWZlc3QpKS4qKVwiLFxyXG4gICAgLy8gQWx3YXlzIHJ1biBmb3IgQVBJIHJvdXRlc1xyXG4gICAgXCIvKGFwaXx0cnBjKSguKilcIlxyXG4gIF1cclxufTtcclxuIl0sIm5hbWVzIjpbImNsZXJrTWlkZGxld2FyZSIsImNyZWF0ZVJvdXRlTWF0Y2hlciIsImlzUHJvdGVjdGVkUm91dGUiLCJhdXRoIiwicmVxIiwicHJvdGVjdCIsImNvbmZpZyIsIm1hdGNoZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(middleware)/./src/middleware.ts\n");

/***/ })

});