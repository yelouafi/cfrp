(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cfrp"] = factory();
	else
		root["cfrp"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.reaction = exports.computed = exports.observable = undefined;

	var _observable = __webpack_require__(6);

	var _observable2 = _interopRequireDefault(_observable);

	var _computed = __webpack_require__(5);

	var _computed2 = _interopRequireDefault(_computed);

	var _reaction = __webpack_require__(7);

	var _reaction2 = _interopRequireDefault(_reaction);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.observable = _observable2.default;
	exports.computed = _computed2.default;
	exports.reaction = _reaction2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.track = track;
	exports.registerDep = registerDep;

	var spyStack = [];
	var currentSpy = void 0;

	function track(fn, spy) {
	  spyStack.push(currentSpy);
	  currentSpy = spy;
	  var res = fn();
	  currentSpy = spyStack.pop();
	  return res;
	}

	function registerDep(dep) {
	  if (currentSpy) {
	    currentSpy(dep);
	  }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AutoSubscriberPrototype = undefined;

	var _utils = __webpack_require__(4);

	var _tracker = __webpack_require__(1);

	var addSource = function addSource(self) {
	  return function (src) {
	    //console.log('addSource', self.id, self.trackVersion)
	    var sources = self.sources;
	    var srcId = src.id;
	    src[self.id] = self.trackVersion;
	    if (!sources[srcId]) {
	      sources[srcId] = src;
	      src.addDep(self);
	    }
	  };
	};

	var AutoSubscriberPrototype = exports.AutoSubscriberPrototype = {
	  isAutoSubscriber: function isAutoSubscriber() {
	    return true;
	  },
	  initAutoSubscriber: function initAutoSubscriber(isReaction) {
	    this.id = this.id || (0, _utils.autoId)();
	    this.isReaction = isReaction;
	    this.sources = {};
	    this.trackVersion = 0;
	    this.addSource = addSource(this);
	  },
	  updateSources: function updateSources() {
	    var sources = this.sources;
	    var thisId = this.id;
	    for (var key in sources) {
	      var src = sources[key];
	      if (src === undefined) continue;
	      if (src[thisId] !== this.trackVersion) {
	        src.removeDep(this);
	        src[thisId] = undefined;
	        sources[src.id] = undefined;
	      }
	    }
	  },
	  track: function track(fn) {
	    this.trackVersion++;
	    var result = (0, _tracker.track)(fn, this.addSource);
	    this.updateSources();
	    return result;
	  },
	  disconnect: function disconnect() {
	    var sources = this.sources;
	    this.sources = {};
	    for (var key in sources) {
	      var src = sources[key];
	      src.removeDep(this);
	      src[this.id] = undefined;
	    }
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SubscribablePrototype = undefined;
	exports.default = subscribable;

	var _utils = __webpack_require__(4);

	/*
	  Subscriber  : Derivation | Reaction
	  Derivation  : { id, dirty }
	  Reaction    : { id, dirty, onReady }
	*/

	var SubscribablePrototype = exports.SubscribablePrototype = {
	  isSubscribable: function isSubscribable() {
	    return true;
	  },
	  initSubscribable: function initSubscribable(name) {
	    this.id = this.id || (0, _utils.autoId)();
	    this.name = name;
	    this.derivations = {};
	    this.reactions = {};
	    this.depsCount = 0;
	  },
	  addDep: function addDep(d) {
	    var deps = d.isReaction ? this.reactions : this.derivations;
	    if (!deps[d.id]) {
	      deps[d.id] = d;
	      this.depsCount++;
	      this.onAddDep && this.onAddDep(d);
	    }
	  },
	  removeDep: function removeDep(d) {
	    var deps = d.isReaction ? this.reactions : this.derivations;
	    if (deps[d.id]) {
	      deps[d.id] = undefined;
	      this.depsCount--;
	      this.onRemoveDep && this.onRemoveDep(d);
	    }
	  },
	  notifyDirty: function notifyDirty() {
	    (0, _utils.eachObj)(this.reactions, function (r) {
	      return r.dirty = true;
	    });
	    (0, _utils.eachObj)(this.derivations, function (d) {
	      d.dirty = true;
	      d.notifyDirty();
	    });
	  },
	  notifyReady: function notifyReady() {
	    (0, _utils.eachObj)(this.reactions, function (r) {
	      return r.onReady();
	    });
	    (0, _utils.eachObj)(this.derivations, function (d) {
	      return d.notifyReady();
	    });
	  },
	  notify: function notify() {
	    this.notifyDirty();
	    this.notifyReady();
	  },
	  toString: function toString() {
	    return 'subscribable ' + this.name;
	  }
	};

	function subscribable(name) {
	  var sub = Object.create(SubscribablePrototype);
	  sub.initSubscribable(name);
	  return sub;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.autoId = autoId;
	exports.eachObj = eachObj;

	var _autoId = 0;
	function autoId() {
	  return ++_autoId;
	}

	function eachObj(obj, fn) {
	  for (var key in obj) {
	    var val = obj[key];
	    val !== undefined && fn(val, key);
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ComputedPrototype = undefined;
	exports.default = computed;

	var _subscribable = __webpack_require__(3);

	var _autoSubscriber = __webpack_require__(2);

	var _tracker = __webpack_require__(1);

	var ComputedPrototype = exports.ComputedPrototype = Object.assign({}, _subscribable.SubscribablePrototype, _autoSubscriber.AutoSubscriberPrototype, {
	  initComputed: function initComputed(fn, target, name) {
	    var _this = this;

	    this.initSubscribable(name);
	    this.initAutoSubscriber(false);

	    this.fn = !target ? fn : function () {
	      return fn.call(_this);
	    };
	  },
	  onAddDep: function onAddDep() {
	    if (this.depsCount === 1) {
	      this.lastResult = this.track(this.fn);
	    }
	  },
	  onRemoveDep: function onRemoveDep() {
	    if (!this.depsCount) {
	      this.disconnect();
	    }
	  },
	  get: function get() {
	    (0, _tracker.registerDep)(this);
	    if (!this.depsCount) {
	      this.lastResult = (0, _tracker.track)(this.fn, null);
	    } else if (this.dirty) {
	      this.dirty = false;
	      this.lastResult = this.track(this.fn);
	    }
	    return this.lastResult;
	  }
	});

	function computed(fn, target, name) {
	  var comp = Object.create(ComputedPrototype);
	  comp.initComputed(fn, target, name);
	  return function () {
	    return comp.get();
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = observable;

	var _subscribable = __webpack_require__(3);

	var _subscribable2 = _interopRequireDefault(_subscribable);

	var _tracker = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function observable(seed, name) {
	  var sub = (0, _subscribable2.default)(name);
	  return {
	    get value() {
	      (0, _tracker.registerDep)(sub);
	      return seed;
	    },

	    set value(v) {
	      if (seed !== v) {
	        seed = v;
	        sub.notify();
	      }
	    },

	    update: function update(proc) {
	      seed = proc(seed) || seed;
	      sub.notify();
	    }
	  };
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ReactionPrototype = undefined;
	exports.default = reaction;

	var _autoSubscriber = __webpack_require__(2);

	var ReactionPrototype = exports.ReactionPrototype = Object.assign({}, _autoSubscriber.AutoSubscriberPrototype, {
	  initReaction: function initReaction(action, target, name) {
	    var _this = this;

	    this.name = name;
	    this.initAutoSubscriber(true);
	    this.action = !target ? action : function () {
	      return action.call(_this);
	    };
	  },
	  onReady: function onReady() {
	    if (this.connected && this.dirty) {
	      this.dirty = false; // prevents glitches
	      this.track(this.action);
	    }
	  },
	  subscribe: function subscribe() {
	    this.connected = true;
	    this.track(this.action);
	  },
	  unsubscribe: function unsubscribe() {
	    if (this.connected) {
	      this.connected = false;
	      this.disconnect();
	    }
	  }
	});

	function reaction(action, target, name) {
	  var reaction = Object.create(ReactionPrototype);
	  reaction.initReaction(action, target, name);
	  reaction.subscribe();

	  return function () {
	    return reaction.unsubscribe();
	  };
	}

/***/ }
/******/ ])
});
;