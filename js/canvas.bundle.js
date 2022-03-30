/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/canvas-confetti/dist/confetti.module.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/canvas-confetti/dist/confetti.module.mjs ***!
  \***************************************************************/
/*! exports provided: default, create */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
// canvas-confetti v1.5.1 built on 2022-02-08T22:20:40.944Z
var module = {};

// source content
(function main(global, module, isWorker, workerSize) {
  var canUseWorker = !!(
    global.Worker &&
    global.Blob &&
    global.Promise &&
    global.OffscreenCanvas &&
    global.OffscreenCanvasRenderingContext2D &&
    global.HTMLCanvasElement &&
    global.HTMLCanvasElement.prototype.transferControlToOffscreen &&
    global.URL &&
    global.URL.createObjectURL);

  function noop() {}

  // create a promise if it exists, otherwise, just
  // call the function directly
  function promise(func) {
    var ModulePromise = module.exports.Promise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;

    if (typeof Prom === 'function') {
      return new Prom(func);
    }

    func(noop, noop);

    return null;
  }

  var raf = (function () {
    var TIME = Math.floor(1000 / 60);
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;

    if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
      frame = function (cb) {
        var id = Math.random();

        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
            lastFrameTime = time;
            delete frames[id];

            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });

        return id;
      };
      cancel = function (id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function (cb) {
        return setTimeout(cb, TIME);
      };
      cancel = function (timer) {
        return clearTimeout(timer);
      };
    }

    return { frame: frame, cancel: cancel };
  }());

  var getWorker = (function () {
    var worker;
    var prom;
    var resolves = {};

    function decorate(worker) {
      function execute(options, callback) {
        worker.postMessage({ options: options || {}, callback: callback });
      }
      worker.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ canvas: offscreen }, [offscreen]);
      };

      worker.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }

        var id = Math.random().toString(36).slice(2);

        prom = promise(function (resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }

            delete resolves[id];
            worker.removeEventListener('message', workerDone);

            prom = null;
            done();
            resolve();
          }

          worker.addEventListener('message', workerDone);
          execute(options, id);

          resolves[id] = workerDone.bind(null, { data: { callback: id }});
        });

        return prom;
      };

      worker.reset = function resetWorker() {
        worker.postMessage({ reset: true });

        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }

    return function () {
      if (worker) {
        return worker;
      }

      if (!isWorker && canUseWorker) {
        var code = [
          'var CONFETTI, SIZE = {}, module = {};',
          '(' + main.toString() + ')(this, module, true, SIZE);',
          'onmessage = function(msg) {',
          '  if (msg.data.options) {',
          '    CONFETTI(msg.data.options).then(function () {',
          '      if (msg.data.callback) {',
          '        postMessage({ callback: msg.data.callback });',
          '      }',
          '    });',
          '  } else if (msg.data.reset) {',
          '    CONFETTI.reset();',
          '  } else if (msg.data.resize) {',
          '    SIZE.width = msg.data.resize.width;',
          '    SIZE.height = msg.data.resize.height;',
          '  } else if (msg.data.canvas) {',
          '    SIZE.width = msg.data.canvas.width;',
          '    SIZE.height = msg.data.canvas.height;',
          '    CONFETTI = module.exports.create(msg.data.canvas);',
          '  }',
          '}',
        ].join('\n');
        try {
          worker = new Worker(URL.createObjectURL(new Blob([code])));
        } catch (e) {
          // eslint-disable-next-line no-console
          typeof console !== undefined && typeof console.warn === 'function' ? console.warn('🎊 Could not load worker', e) : null;

          return null;
        }

        decorate(worker);
      }

      return worker;
    };
  })();

  var defaults = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ['square', 'circle'],
    zIndex: 100,
    colors: [
      '#26ccff',
      '#a25afd',
      '#ff5e7e',
      '#88ff5a',
      '#fcff42',
      '#ffa62d',
      '#ff36ff'
    ],
    // probably should be true, but back-compat
    disableForReducedMotion: false,
    scalar: 1
  };

  function convert(val, transform) {
    return transform ? transform(val) : val;
  }

  function isOk(val) {
    return !(val === null || val === undefined);
  }

  function prop(options, name, transform) {
    return convert(
      options && isOk(options[name]) ? options[name] : defaults[name],
      transform
    );
  }

  function onlyPositiveInt(number){
    return number < 0 ? 0 : Math.floor(number);
  }

  function randomInt(min, max) {
    // [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function toDecimal(str) {
    return parseInt(str, 16);
  }

  function colorsToRgb(colors) {
    return colors.map(hexToRgb);
  }

  function hexToRgb(str) {
    var val = String(str).replace(/[^0-9a-f]/gi, '');

    if (val.length < 6) {
        val = val[0]+val[0]+val[1]+val[1]+val[2]+val[2];
    }

    return {
      r: toDecimal(val.substring(0,2)),
      g: toDecimal(val.substring(2,4)),
      b: toDecimal(val.substring(4,6))
    };
  }

  function getOrigin(options) {
    var origin = prop(options, 'origin', Object);
    origin.x = prop(origin, 'x', Number);
    origin.y = prop(origin, 'y', Number);

    return origin;
  }

  function setCanvasWindowSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }

  function setCanvasRectSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function getCanvas(zIndex) {
    var canvas = document.createElement('canvas');

    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = zIndex;

    return canvas;
  }

  function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(radiusX, radiusY);
    context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    context.restore();
  }

  function randomPhysics(opts) {
    var radAngle = opts.angle * (Math.PI / 180);
    var radSpread = opts.spread * (Math.PI / 180);

    return {
      x: opts.x,
      y: opts.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: (opts.startVelocity * 0.5) + (Math.random() * opts.startVelocity),
      angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: opts.color,
      shape: opts.shape,
      tick: 0,
      totalTicks: opts.ticks,
      decay: opts.decay,
      drift: opts.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: opts.gravity * 3,
      ovalScalar: 0.6,
      scalar: opts.scalar
    };
  }

  function updateFetti(context, fetti) {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.wobble += fetti.wobbleSpeed;
    fetti.velocity *= fetti.decay;
    fetti.tiltAngle += 0.1;
    fetti.tiltSin = Math.sin(fetti.tiltAngle);
    fetti.tiltCos = Math.cos(fetti.tiltAngle);
    fetti.random = Math.random() + 2;
    fetti.wobbleX = fetti.x + ((10 * fetti.scalar) * Math.cos(fetti.wobble));
    fetti.wobbleY = fetti.y + ((10 * fetti.scalar) * Math.sin(fetti.wobble));

    var progress = (fetti.tick++) / fetti.totalTicks;

    var x1 = fetti.x + (fetti.random * fetti.tiltCos);
    var y1 = fetti.y + (fetti.random * fetti.tiltSin);
    var x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
    var y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);

    context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - progress) + ')';
    context.beginPath();

    if (fetti.shape === 'circle') {
      context.ellipse ?
        context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) :
        ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
    } else {
      context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
      context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
      context.lineTo(Math.floor(x2), Math.floor(y2));
      context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
    }

    context.closePath();
    context.fill();

    return fetti.tick < fetti.totalTicks;
  }

  function animate(canvas, fettis, resizer, size, done) {
    var animatingFettis = fettis.slice();
    var context = canvas.getContext('2d');
    var animationFrame;
    var destroy;

    var prom = promise(function (resolve) {
      function onDone() {
        animationFrame = destroy = null;

        context.clearRect(0, 0, size.width, size.height);

        done();
        resolve();
      }

      function update() {
        if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
          size.width = canvas.width = workerSize.width;
          size.height = canvas.height = workerSize.height;
        }

        if (!size.width && !size.height) {
          resizer(canvas);
          size.width = canvas.width;
          size.height = canvas.height;
        }

        context.clearRect(0, 0, size.width, size.height);

        animatingFettis = animatingFettis.filter(function (fetti) {
          return updateFetti(context, fetti);
        });

        if (animatingFettis.length) {
          animationFrame = raf.frame(update);
        } else {
          onDone();
        }
      }

      animationFrame = raf.frame(update);
      destroy = onDone;
    });

    return {
      addFettis: function (fettis) {
        animatingFettis = animatingFettis.concat(fettis);

        return prom;
      },
      canvas: canvas,
      promise: prom,
      reset: function () {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }

        if (destroy) {
          destroy();
        }
      }
    };
  }

  function confettiCannon(canvas, globalOpts) {
    var isLibCanvas = !canvas;
    var allowResize = !!prop(globalOpts || {}, 'resize');
    var globalDisableForReducedMotion = prop(globalOpts, 'disableForReducedMotion', Boolean);
    var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, 'useWorker');
    var worker = shouldUseWorker ? getWorker() : null;
    var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
    var initialized = (canvas && worker) ? !!canvas.__confetti_initialized : false;
    var preferLessMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion)').matches;
    var animationObj;

    function fireLocal(options, size, done) {
      var particleCount = prop(options, 'particleCount', onlyPositiveInt);
      var angle = prop(options, 'angle', Number);
      var spread = prop(options, 'spread', Number);
      var startVelocity = prop(options, 'startVelocity', Number);
      var decay = prop(options, 'decay', Number);
      var gravity = prop(options, 'gravity', Number);
      var drift = prop(options, 'drift', Number);
      var colors = prop(options, 'colors', colorsToRgb);
      var ticks = prop(options, 'ticks', Number);
      var shapes = prop(options, 'shapes');
      var scalar = prop(options, 'scalar');
      var origin = getOrigin(options);

      var temp = particleCount;
      var fettis = [];

      var startX = canvas.width * origin.x;
      var startY = canvas.height * origin.y;

      while (temp--) {
        fettis.push(
          randomPhysics({
            x: startX,
            y: startY,
            angle: angle,
            spread: spread,
            startVelocity: startVelocity,
            color: colors[temp % colors.length],
            shape: shapes[randomInt(0, shapes.length)],
            ticks: ticks,
            decay: decay,
            gravity: gravity,
            drift: drift,
            scalar: scalar
          })
        );
      }

      // if we have a previous canvas already animating,
      // add to it
      if (animationObj) {
        return animationObj.addFettis(fettis);
      }

      animationObj = animate(canvas, fettis, resizer, size , done);

      return animationObj.promise;
    }

    function fire(options) {
      var disableForReducedMotion = globalDisableForReducedMotion || prop(options, 'disableForReducedMotion', Boolean);
      var zIndex = prop(options, 'zIndex', Number);

      if (disableForReducedMotion && preferLessMotion) {
        return promise(function (resolve) {
          resolve();
        });
      }

      if (isLibCanvas && animationObj) {
        // use existing canvas from in-progress animation
        canvas = animationObj.canvas;
      } else if (isLibCanvas && !canvas) {
        // create and initialize a new canvas
        canvas = getCanvas(zIndex);
        document.body.appendChild(canvas);
      }

      if (allowResize && !initialized) {
        // initialize the size of a user-supplied canvas
        resizer(canvas);
      }

      var size = {
        width: canvas.width,
        height: canvas.height
      };

      if (worker && !initialized) {
        worker.init(canvas);
      }

      initialized = true;

      if (worker) {
        canvas.__confetti_initialized = true;
      }

      function onResize() {
        if (worker) {
          // TODO this really shouldn't be immediate, because it is expensive
          var obj = {
            getBoundingClientRect: function () {
              if (!isLibCanvas) {
                return canvas.getBoundingClientRect();
              }
            }
          };

          resizer(obj);

          worker.postMessage({
            resize: {
              width: obj.width,
              height: obj.height
            }
          });
          return;
        }

        // don't actually query the size here, since this
        // can execute frequently and rapidly
        size.width = size.height = null;
      }

      function done() {
        animationObj = null;

        if (allowResize) {
          global.removeEventListener('resize', onResize);
        }

        if (isLibCanvas && canvas) {
          document.body.removeChild(canvas);
          canvas = null;
          initialized = false;
        }
      }

      if (allowResize) {
        global.addEventListener('resize', onResize, false);
      }

      if (worker) {
        return worker.fire(options, size, done);
      }

      return fireLocal(options, size, done);
    }

    fire.reset = function () {
      if (worker) {
        worker.reset();
      }

      if (animationObj) {
        animationObj.reset();
      }
    };

    return fire;
  }

  // Make default export lazy to defer worker creation until called.
  var defaultFire;
  function getDefaultFire() {
    if (!defaultFire) {
      defaultFire = confettiCannon(null, { useWorker: true, resize: true });
    }
    return defaultFire;
  }

  module.exports = function() {
    return getDefaultFire().apply(this, arguments);
  };
  module.exports.reset = function() {
    getDefaultFire().reset();
  };
  module.exports.create = confettiCannon;
}((function () {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  return this || {};
})(), module, false));

// end source content

/* harmony default export */ __webpack_exports__["default"] = (module.exports);
var create = module.exports.create;


/***/ }),

/***/ "./src/img/audio.mp3":
/*!***************************!*\
  !*** ./src/img/audio.mp3 ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "fdad0cdd95c84c4589ea107b10165d66.mp3");

/***/ }),

/***/ "./src/img/background.png":
/*!********************************!*\
  !*** ./src/img/background.png ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "072d51bcc9c09311d4c2a6708b05bddc.png");

/***/ }),

/***/ "./src/img/collect.mp3":
/*!*****************************!*\
  !*** ./src/img/collect.mp3 ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "ee94f529f89814919aec086633391877.mp3");

/***/ }),

/***/ "./src/img/hills.png":
/*!***************************!*\
  !*** ./src/img/hills.png ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "cfffe4c371f5e11d372b398a87c51dd0.png");

/***/ }),

/***/ "./src/img/jump.mp3":
/*!**************************!*\
  !*** ./src/img/jump.mp3 ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "0daad67fe18e47f814a06f67f1fbe83e.mp3");

/***/ }),

/***/ "./src/img/platform.png":
/*!******************************!*\
  !*** ./src/img/platform.png ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "ffab39d3487de561be1a081fcfb3806d.png");

/***/ }),

/***/ "./src/img/rocket.png":
/*!****************************!*\
  !*** ./src/img/rocket.png ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "7f7febd1daffaeef60213d1cff5848a7.png");

/***/ }),

/***/ "./src/img/slides1.png":
/*!*****************************!*\
  !*** ./src/img/slides1.png ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "178e2740a0e00f33c5dd51dc55920d50.png");

/***/ }),

/***/ "./src/img/slides2.png":
/*!*****************************!*\
  !*** ./src/img/slides2.png ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "c14daaf7477d4602931a8ab2d821fc9a.png");

/***/ }),

/***/ "./src/img/slides3.png":
/*!*****************************!*\
  !*** ./src/img/slides3.png ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "11cce28ec2a586daeaed7e28e915c6ff.png");

/***/ }),

/***/ "./src/img/slides4.png":
/*!*****************************!*\
  !*** ./src/img/slides4.png ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "aeccbc9b5b556f090087a604fcfa296b.png");

/***/ }),

/***/ "./src/img/slides5.png":
/*!*****************************!*\
  !*** ./src/img/slides5.png ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "475bbb7d22a28f31a01d14c02520392f.png");

/***/ }),

/***/ "./src/img/slides6.png":
/*!*****************************!*\
  !*** ./src/img/slides6.png ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "f68129fd220f619449c925f4fe6bf93a.png");

/***/ }),

/***/ "./src/img/spriteRunLeft.png":
/*!***********************************!*\
  !*** ./src/img/spriteRunLeft.png ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "c67ea51444aafa9bdcd5bdfd4f4a55bb.png");

/***/ }),

/***/ "./src/img/spriteRunRight.png":
/*!************************************!*\
  !*** ./src/img/spriteRunRight.png ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "a2f75989924952a7e49ce0405d487c93.png");

/***/ }),

/***/ "./src/img/spriteStandLeft.png":
/*!*************************************!*\
  !*** ./src/img/spriteStandLeft.png ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "11514f48f22f6d8e3cf748e45e3e1ffb.png");

/***/ }),

/***/ "./src/img/spriteStandRight.png":
/*!**************************************!*\
  !*** ./src/img/spriteStandRight.png ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "01e8f15e899155c68950c40e0a6b8df0.png");

/***/ }),

/***/ "./src/img/star.png":
/*!**************************!*\
  !*** ./src/img/star.png ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (__webpack_require__.p + "f4265e3ed7a18aab9c1282e5a4852384.png");

/***/ }),

/***/ "./src/js/canvas.js":
/*!**************************!*\
  !*** ./src/js/canvas.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _img_platform_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../img/platform.png */ "./src/img/platform.png");
/* harmony import */ var _img_hills_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../img/hills.png */ "./src/img/hills.png");
/* harmony import */ var _img_star_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../img/star.png */ "./src/img/star.png");
/* harmony import */ var _img_background_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../img/background.png */ "./src/img/background.png");
/* harmony import */ var _img_rocket_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../img/rocket.png */ "./src/img/rocket.png");
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./main */ "./src/js/main.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _img_slides1_png__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../img/slides1.png */ "./src/img/slides1.png");
/* harmony import */ var _img_slides2_png__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../img/slides2.png */ "./src/img/slides2.png");
/* harmony import */ var _img_slides3_png__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../img/slides3.png */ "./src/img/slides3.png");
/* harmony import */ var _img_slides4_png__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../img/slides4.png */ "./src/img/slides4.png");
/* harmony import */ var _img_slides5_png__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../img/slides5.png */ "./src/img/slides5.png");
/* harmony import */ var _img_slides6_png__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../img/slides6.png */ "./src/img/slides6.png");
/* harmony import */ var _img_audio_mp3__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../img/audio.mp3 */ "./src/img/audio.mp3");
/* harmony import */ var _img_jump_mp3__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../img/jump.mp3 */ "./src/img/jump.mp3");
/* harmony import */ var _img_collect_mp3__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../img/collect.mp3 */ "./src/img/collect.mp3");
/* harmony import */ var canvas_confetti__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! canvas-confetti */ "./node_modules/canvas-confetti/dist/confetti.module.mjs");













var slides = document.querySelector('#slides');
slides.append(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_slides1_png__WEBPACK_IMPORTED_MODULE_7__["default"], 'slide', "slide1"));
slides.append(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_slides2_png__WEBPACK_IMPORTED_MODULE_8__["default"], 'slide', "slide2"));
slides.append(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_slides3_png__WEBPACK_IMPORTED_MODULE_9__["default"], 'slide', "slide3"));
slides.append(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_slides4_png__WEBPACK_IMPORTED_MODULE_10__["default"], 'slide', "slide4"));
slides.append(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_slides5_png__WEBPACK_IMPORTED_MODULE_11__["default"], 'slide', "slide5"));
slides.append(Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_slides6_png__WEBPACK_IMPORTED_MODULE_12__["default"], 'slide', "slide6"));




var canvas = document.querySelector("canvas");
var con = document.querySelector('#con');
var c = canvas.getContext("2d");
var Slides = 0;
canvas.width = 1024;
canvas.height = 570;
con.width = 1024;
con.height = 570;
var maxSlides = 6;
var music = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["playAudio"])(_img_audio_mp3__WEBPACK_IMPORTED_MODULE_13__["default"], true);
var platformImage;
var starImage;
var jumpAudio, collectAudio;
var player = null;
var platforms = [];
var stars = [];
var genericObjects = [];
var rocketobj;
var lastKey;
var keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
};
var scrollOffset = 0;

function init() {
  platformImage = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_platform_png__WEBPACK_IMPORTED_MODULE_0__["default"]);
  starImage = Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_star_png__WEBPACK_IMPORTED_MODULE_2__["default"]);
  jumpAudio = new Audio(_img_jump_mp3__WEBPACK_IMPORTED_MODULE_14__["default"]);
  collectAudio = new Audio(_img_collect_mp3__WEBPACK_IMPORTED_MODULE_15__["default"]);
  player = new _main__WEBPACK_IMPORTED_MODULE_5__["Player"](canvas);
  platforms = [];
  platforms.push(new _main__WEBPACK_IMPORTED_MODULE_5__["Platform"]({
    x: -1,
    y: 470,
    image: platformImage,
    canvas: canvas
  }));
  var o = 0;

  for (var i = 0; i < 5; i++) {
    o += 100;
    platforms.push(new _main__WEBPACK_IMPORTED_MODULE_5__["Platform"]({
      x: 700 + (platformImage.width + 300) * i - 2,
      y: 470 - Math.random() * 100,
      image: platformImage,
      canvas: canvas
    }));
  }

  stars = platforms.map(function (platform, idx) {
    return new _main__WEBPACK_IMPORTED_MODULE_5__["Star"]({
      id: idx,
      x: Object(_utils__WEBPACK_IMPORTED_MODULE_6__["randomIntFromRange"])(platform.position.x, platform.position.x + platform.width),
      y: platform.position.y - 100,
      image: starImage,
      canvas: canvas
    });
  });
  genericObjects = [new _main__WEBPACK_IMPORTED_MODULE_5__["GenericObject"]({
    x: -1,
    y: -1,
    image: Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_background_png__WEBPACK_IMPORTED_MODULE_3__["default"]),
    canvas: canvas
  }), new _main__WEBPACK_IMPORTED_MODULE_5__["GenericObject"]({
    x: -1,
    y: -1,
    image: Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_hills_png__WEBPACK_IMPORTED_MODULE_1__["default"]),
    canvas: canvas
  })];
  rocketobj = new _main__WEBPACK_IMPORTED_MODULE_5__["GenericObject"]({
    x: platforms.at(-1).position.x + platforms[0].width / 2,
    y: platforms.at(-1).position.y - 500,
    image: Object(_utils__WEBPACK_IMPORTED_MODULE_6__["createImage"])(_img_rocket_png__WEBPACK_IMPORTED_MODULE_4__["default"]),
    canvas: canvas
  }); //headstart

  platforms.forEach(function (platform) {
    // scrollOffset += 14640;
    platform.position.x += 0;
  });
  console.log(platforms);
  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach(function (genericObject) {
    genericObject.draw();
  });
  platforms.forEach(function (platform) {
    platform.draw();
  });
  stars.forEach(function (star) {
    star.draw();
  });
  rocketobj.draw();
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 100 || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed && scrollOffset < 6000) {
      scrollOffset += player.speed;
      platforms.forEach(function (platform) {
        platform.position.x -= player.speed;
      });
      stars.forEach(function (star) {
        star.position.x -= player.speed;
      });
      genericObjects.forEach(function (genericObject) {
        genericObject.position.x -= player.speed * 0.66;
      });
      rocketobj.position.x -= player.speed;
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach(function (platform) {
        platform.position.x += player.speed;
      });
      stars.forEach(function (star) {
        star.position.x += player.speed;
      });
      genericObjects.forEach(function (genericObject) {
        genericObject.position.x += player.speed * 0.66;
      });
      rocketobj.position.x += player.speed;
    }
  } // console.log(scrollOffset);
  // star collision detection


  stars.forEach(function (star) {
    if (player.position.x < star.position.x + star.width && player.position.x + player.width > star.position.x && player.position.y < star.position.y + star.height && player.height + player.position.y > star.position.y) {
      Slides = star.id + 1;

      if (!collectAudio.paused) {
        collectAudio.pause();
        collectAudio.currentTime = 0;
      }

      collectAudio.play();
    }
  }); // platform collision detection

  platforms.forEach(function (platform) {
    if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
      player.velocity.y = 0;
      console.log(platforms.indexOf(platform));
    }
  }); // sprite switching

  if (keys.right.pressed && lastKey === "right" && player.currentSprite !== player.sprites.run.right) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (keys.left.pressed && lastKey === "left" && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
    player.width = player.sprites.run.width;
  } else if (!keys.left.pressed && lastKey === "left" && player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } else if (!keys.right.pressed && lastKey === "right" && player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
    player.width = player.sprites.stand.width;
  } // win condition


  if (Slides / maxSlides == 1) {
    window.dispatchEvent(new CustomEvent('conf'));
    c.font = "100px Arial";
    c.fillText('finalSlide', canvas.width / 3, canvas.height / 2);
  } // lose condition


  if (player.position.y > canvas.height) {
    init();
  } //stats


  c.rect(10, 10, 100, 10);
  c.stroke();
  c.fillRect(10, 10, Slides / maxSlides * 100, 10);
  c.font = "20px Arial";
  c.fillText("Slide: ".concat(Slides), 10, 50);
}

addEventListener('conf', function () {
  var myConfetti = canvas_confetti__WEBPACK_IMPORTED_MODULE_16__["default"].create(con, {
    resize: true,
    useWorker: true
  });
  myConfetti({
    particleCount: 100,
    spread: 160 // any other options from the global
    // confetti function

  });
  setTimeout(function () {
    myConfetti.reset();
  }, 1000);
}, {
  once: true
});
document.querySelector('button').addEventListener('click', function () {
  var div = document.querySelector('.start');
  console.log('hi', div);
  div.classList.add('invisible');
  Object(_utils__WEBPACK_IMPORTED_MODULE_6__["fullscreen"])(document.getElementById('fullscreen')); // music.play()

  init();
});
init();
animate();
addEventListener("keydown", function (_ref) {
  var key = _ref.key;

  switch (key) {
    case 'a':
    case 'ArrowLeft':
      console.log("left");
      keys.left.pressed = true;
      lastKey = "left";
      break;

    case 's':
    case 'ArrowDown':
      console.log("down");
      break;

    case 'd':
    case 'ArrowRight':
      console.log("right");
      keys.right.pressed = true;
      lastKey = "right";
      break;

    case 'w':
    case 'ArrowUp':
      console.log("up");

      if (player.velocity.y == 0) {
        player.velocity.y -= 25; // laserate(244)

        if (!jumpAudio.paused) {
          jumpAudio.pause();
          jumpAudio.currentTime = 0;
        }

        jumpAudio.play();
      }

      break;

    case 'f':
      Object(_utils__WEBPACK_IMPORTED_MODULE_6__["fullscreen"])(document.getElementById('fullscreen'));
      break;

    case 'm':
      if (!music.paused) {
        music.pause();
        music.currentTime = 0;
      } else {
        music.play();
      }

      break;

    case ' ':
      console.log(Slides);
      Object(_utils__WEBPACK_IMPORTED_MODULE_6__["showSlide"])(Slides);
      break;
  }

  console.log(keys.right.pressed);
});
addEventListener("keyup", function (_ref2) {
  var key = _ref2.key;

  // console.log(keyCode)
  switch (key) {
    case 'a':
    case 'ArrowLeft':
      console.log("left");
      keys.left.pressed = false;
      break;

    case 's':
    case 'ArrowDown':
      console.log("down");
      break;

    case 'd':
    case 'ArrowRight':
      console.log("right");
      keys.right.pressed = false;
      break;

    case 'w':
    case 'ArrowUp':
      console.log("up");
      break;
  }

  console.log(keys.right.pressed);
});

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! exports provided: Platform, Player, GenericObject, Star */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Platform", function() { return Platform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenericObject", function() { return GenericObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Star", function() { return Star; });
/* harmony import */ var _img_spriteRunLeft_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../img/spriteRunLeft.png */ "./src/img/spriteRunLeft.png");
/* harmony import */ var _img_spriteRunRight_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../img/spriteRunRight.png */ "./src/img/spriteRunRight.png");
/* harmony import */ var _img_spriteStandLeft_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../img/spriteStandLeft.png */ "./src/img/spriteStandLeft.png");
/* harmony import */ var _img_spriteStandRight_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../img/spriteStandRight.png */ "./src/img/spriteStandRight.png");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_4__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }






var gravity = 1.5;

var Player = /*#__PURE__*/function () {
  function Player(canvas) {
    _classCallCheck(this, Player);

    this.score = 0;
    this.canvas = canvas;
    this.c = canvas.getContext("2d");
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.width = 66;
    this.height = 150;
    this.image = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["createImage"])(_img_spriteStandRight_png__WEBPACK_IMPORTED_MODULE_3__["default"]);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: Object(_utils__WEBPACK_IMPORTED_MODULE_4__["createImage"])(_img_spriteStandRight_png__WEBPACK_IMPORTED_MODULE_3__["default"]),
        left: Object(_utils__WEBPACK_IMPORTED_MODULE_4__["createImage"])(_img_spriteStandLeft_png__WEBPACK_IMPORTED_MODULE_2__["default"]),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: Object(_utils__WEBPACK_IMPORTED_MODULE_4__["createImage"])(_img_spriteRunRight_png__WEBPACK_IMPORTED_MODULE_1__["default"]),
        left: Object(_utils__WEBPACK_IMPORTED_MODULE_4__["createImage"])(_img_spriteRunLeft_png__WEBPACK_IMPORTED_MODULE_0__["default"]),
        cropWidth: 341,
        width: 127.875
      }
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 177;
  }

  _createClass(Player, [{
    key: "draw",
    value: function draw() {
      this.c.drawImage(this.currentSprite, this.currentCropWidth * this.frames, 0, this.currentCropWidth, 400, this.position.x, this.position.y, this.width, this.height);
    }
  }, {
    key: "update",
    value: function update() {
      this.frames++;
      if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0;else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0;
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.position.y + this.height + this.velocity.y <= this.canvas.height) this.velocity.y += gravity;
    }
  }]);

  return Player;
}();

var StationaryObject = /*#__PURE__*/function () {
  function StationaryObject(_ref) {
    var x = _ref.x,
        y = _ref.y,
        image = _ref.image,
        canvas = _ref.canvas;

    _classCallCheck(this, StationaryObject);

    this.position = {
      x: x,
      y: y
    };
    this.c = canvas.getContext("2d");
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  _createClass(StationaryObject, [{
    key: "draw",
    value: function draw() {
      this.c.drawImage(this.image, this.position.x, this.position.y);
    }
  }]);

  return StationaryObject;
}();

var Platform = /*#__PURE__*/function (_StationaryObject) {
  _inherits(Platform, _StationaryObject);

  var _super = _createSuper(Platform);

  function Platform() {
    _classCallCheck(this, Platform);

    return _super.apply(this, arguments);
  }

  return Platform;
}(StationaryObject);

var Star = /*#__PURE__*/function (_StationaryObject2) {
  _inherits(Star, _StationaryObject2);

  var _super2 = _createSuper(Star);

  function Star(_ref2) {
    var _this;

    var id = _ref2.id,
        x = _ref2.x,
        y = _ref2.y,
        image = _ref2.image,
        canvas = _ref2.canvas;

    _classCallCheck(this, Star);

    _this = _super2.call(this, {
      x: x,
      y: y,
      image: image,
      canvas: canvas
    });
    _this.length = 50;
    _this.count = 0;
    _this.oy = y;
    _this.id = id;
    _this.offset = Math.random() * 0.3;
    return _this;
  }

  return Star;
}(StationaryObject);

var GenericObject = /*#__PURE__*/function () {
  function GenericObject(_ref3) {
    var x = _ref3.x,
        y = _ref3.y,
        image = _ref3.image,
        canvas = _ref3.canvas;

    _classCallCheck(this, GenericObject);

    this.position = {
      x: x,
      y: y
    };
    this.c = canvas.getContext("2d");
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  _createClass(GenericObject, [{
    key: "draw",
    value: function draw() {
      this.c.drawImage(this.image, this.position.x, this.position.y);
    }
  }]);

  return GenericObject;
}();



/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

function createImage(imageSrc, className, id) {
  var image = new Image();

  if (className) {
    image.setAttribute('class', className);
    image.setAttribute('id', id);
  }

  image.src = imageSrc;
  return image;
}

function showSlide(id) {
  if (document.getElementById("slide".concat(id)).classList.contains('visible')) {
    document.getElementById('slides').classList.remove('darkbackground');
    document.querySelectorAll(".slide").forEach(function (slide) {
      slide.classList.remove('visible');
    });
  } else {
    document.getElementById('slides').classList.add('darkbackground');
    document.getElementById("slide".concat(id)).classList.add('visible');
  }
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function playAudio(src) {
  var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  myAudio = new Audio(src);

  if (loop) {
    if (typeof myAudio.loop == 'boolean') {
      myAudio.loop = true;
    } else {
      myAudio.addEventListener('ended', function () {
        alert('done');
        this.currentTime = 0;
        this.play();
      }, false);
    }
  }

  return myAudio;
}

function fullscreen(canvas) {
  if (document.fullscreenElement) {
    document.exitFullscreen().then(function () {
      return console.log("Document Exited from Full screen mode");
    })["catch"](function (err) {
      return console.error(err);
    });
  } else {
    canvas.requestFullscreen();
  }
}

module.exports = {
  randomIntFromRange: randomIntFromRange,
  randomColor: randomColor,
  distance: distance,
  createImage: createImage,
  playAudio: playAudio,
  fullscreen: fullscreen,
  showSlide: showSlide
};

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map