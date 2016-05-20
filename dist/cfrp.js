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
	exports.reaction = exports.computed = exports.behavior = exports.observable = exports.event = undefined;

	var _event = __webpack_require__(7);

	var _event2 = _interopRequireDefault(_event);

	var _observable = __webpack_require__(8);

	var _observable2 = _interopRequireDefault(_observable);

	var _behavior = __webpack_require__(5);

	var _behavior2 = _interopRequireDefault(_behavior);

	var _computed = __webpack_require__(6);

	var _computed2 = _interopRequireDefault(_computed);

	var _reaction = __webpack_require__(9);

	var _reaction2 = _interopRequireDefault(_reaction);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.event = _event2.default;
	exports.observable = _observable2.default;
	exports.behavior = _behavior2.default;
	exports.computed = _computed2.default;
	exports.reaction = _reaction2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.autoId = autoId;
	exports.eachObj = eachObj;
	exports.check = check;

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

	function check(value, predicate, error) {
	  if (!predicate(value)) {
	    throw new Error(error);
	  }
	}

	var is = exports.is = {
	  undef: function undef(v) {
	    return v === null || v === undefined;
	  },
	  notUndef: function notUndef(v) {
	    return v !== null && v !== undefined;
	  },
	  function: function _function(f) {
	    return typeof f === 'function';
	  },
	  number: function number(n) {
	    return typeof n === 'number';
	  },
	  array: Array.isArray
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SubscribablePrototype = undefined;
	exports.default = subscribable;

	var _utils = __webpack_require__(1);

	/*
	  Dep  : Derivation | Reaction
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
	  addDep: function addDep(d, isReaction) {
	    if (this.completed) return;
	    var deps = isReaction ? this.reactions : this.derivations;
	    if (!deps[d.id]) {
	      deps[d.id] = d;
	      this.depsCount++;
	      this.onAddDep && this.onAddDep(d);
	    }
	  },
	  removeDep: function removeDep(d, isReaction) {
	    if (this.completed) return;
	    var deps = isReaction ? this.reactions : this.derivations;
	    if (deps[d.id]) {
	      deps[d.id] = undefined;
	      this.depsCount--;
	      this.onRemoveDep && this.onRemoveDep(d);
	    }
	  },
	  end: function end() {
	    this.completed = true;
	    this.derivations = null;
	    this.reactions = null;
	    this.depsCount = 0;
	    this.onRemoveDep && this.onRemoveDep();
	  },
	  notifyDirty: function notifyDirty(e) {
	    if (this.completed) return;
	    (0, _utils.eachObj)(this.reactions, function (r) {
	      return r.onDirty && r.onDirty(e);
	    });
	    (0, _utils.eachObj)(this.derivations, function (d) {
	      return d.onDirty && d.onDirty(e);
	    });
	  },
	  notifyReady: function notifyReady(e) {
	    if (this.completed) return;
	    (0, _utils.eachObj)(this.reactions, function (r) {
	      return r.onReady(e);
	    });
	    (0, _utils.eachObj)(this.derivations, function (d) {
	      return d.notifyReady(e);
	    });
	  },
	  notify: function notify(e) {
	    if (this.completed) return;
	    this.notifyDirty(e);
	    this.notifyReady(e);
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
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AutoSubscriberPrototype = undefined;

	var _utils = __webpack_require__(1);

	var _tracker = __webpack_require__(3);

	var addSource = function addSource(self) {
	  return function (src) {
	    //console.log('addSource', self.id, self.trackVersion)
	    var sources = self.sources;
	    var srcId = src.id;
	    src[self.id] = self.trackVersion;
	    if (!sources[srcId]) {
	      sources[srcId] = src;
	      src.addDep(self, self.isReaction);
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
	        src.removeDep(this, this.isReaction);
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
	      src.removeDep(this, this.isReaction);
	      src[this.id] = undefined;
	    }
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.default = behavior;

	var _subscribable = __webpack_require__(2);

	var _subscribable2 = _interopRequireDefault(_subscribable);

	var _tracker = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function behavior(state) {
	  var sub = (0, _subscribable2.default)(name);
	  var _error = void 0,
	      isError = void 0;

	  function updateState(reducer, e) {
	    var newState = reducer(state, e);
	    if (newState !== state) {
	      state = newState;
	      sub.notify();
	    }
	  }

	  function getValue() {
	    if (isError) {
	      throw _error;
	    }
	    if (!sub.completed) {
	      (0, _tracker.registerDep)(sub);
	    }
	    return state;
	  }

	  getValue.pick = function () {
	    if (isError) throw _error;
	    return state;
	  };

	  for (var _len = arguments.length, cases = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    cases[_key - 1] = arguments[_key];
	  }

	  cases.forEach(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);

	    var stream = _ref2[0];
	    var reducer = _ref2[1];

	    stream.subscribe({
	      next: function next(e) {
	        return updateState(reducer, e);
	      },
	      complete: sub.end,
	      error: function error(err) {
	        _error = err;
	        isError = true;
	        sub.notify();
	        sub.end();
	      }
	    });
	  });

	  return getValue;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ComputedPrototype = exports.CIRCULAR_DEPENDENCY_ERROR = undefined;
	exports.default = computed;

	var _utils = __webpack_require__(1);

	var _subscribable = __webpack_require__(2);

	var _autoSubscriber = __webpack_require__(4);

	var _tracker = __webpack_require__(3);

	var CIRCULAR_DEPENDENCY_ERROR = exports.CIRCULAR_DEPENDENCY_ERROR = 'Detected circular dependency in the computable chain';

	var ComputedPrototype = exports.ComputedPrototype = Object.assign({}, _subscribable.SubscribablePrototype, _autoSubscriber.AutoSubscriberPrototype, {
	  initComputed: function initComputed(fn, target, name) {
	    var _this = this;

	    this.initSubscribable(name);
	    this.initAutoSubscriber(false);

	    this.fn = !target ? fn : function () {
	      return fn.call(_this);
	    };
	  },
	  onDirty: function onDirty() {
	    this.dirty = true;
	    this.notifyDirty();
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
	    if (this.isComputing) {
	      throw new Error(CIRCULAR_DEPENDENCY_ERROR);
	    }
	    (0, _tracker.registerDep)(this);
	    this.isComputing = true;
	    if (!this.depsCount) {
	      this.lastResult = (0, _tracker.track)(this.fn, null);
	    } else if (this.dirty) {
	      this.dirty = false;
	      this.lastResult = this.track(this.fn);
	    }
	    this.isComputing = false;
	    return this.lastResult;
	  }
	});

	function computed(fn, target, name) {
	  (0, _utils.check)(fn, _utils.is.function, 'computed: fn argument is not a function');
	  var comp = Object.create(ComputedPrototype);
	  comp.initComputed(fn, target, name);
	  return function () {
	    return comp.get();
	  };
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = event;

	var _utils = __webpack_require__(1);

	var _subscribable = __webpack_require__(2);

	var _subscribable2 = _interopRequireDefault(_subscribable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function event(name) {
	  var sub = (0, _subscribable2.default)(name);

	  sub.subscribe = function (_ref) {
	    var next = _ref.next;

	    sub.addDep({
	      id: (0, _utils.autoId)(),
	      onDirty: function onDirty() {
	        return sub.notifyDirty();
	      },
	      onReady: next
	    }, true);
	  };

	  sub.next = function (e) {
	    sub.notifyReady(e);
	  };

	  sub.filter = function (pred) {
	    var fsub = event();
	    fsub.onDirty = function (e) {
	      return pred(e) && fsub.notifyDirty(e);
	    }, fsub.onReady = function (e) {
	      return pred(e) && fsub.notifyReady(e);
	    };
	    sub.addDep(fsub, true);
	    return fsub;
	  };

	  sub.map = function (fn) {
	    var msub = event();
	    msub.onDirty = function (e) {
	      return msub.notifyDirty(fn(e));
	    }, msub.onReady = function (e) {
	      return msub.notifyReady(fn(e));
	    };
	    sub.addDep(msub, true);
	    return msub;
	  };

	  return sub;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = observable;

	var _subscribable = __webpack_require__(2);

	var _subscribable2 = _interopRequireDefault(_subscribable);

	var _tracker = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function observable(seed, name) {
	  var sub = (0, _subscribable2.default)(name);
	  return {
	    _sub: sub,
	    pick: function pick() {
	      return seed;
	    },

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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ReactionPrototype = undefined;
	exports.default = reaction;

	var _utils = __webpack_require__(1);

	var _autoSubscriber = __webpack_require__(4);

	var ReactionPrototype = exports.ReactionPrototype = Object.assign({}, _autoSubscriber.AutoSubscriberPrototype, {
	  initReaction: function initReaction(action, target, name) {
	    var _this = this;

	    this.name = name;
	    this.initAutoSubscriber(true);
	    this.action = !target ? action : function () {
	      return action.call(_this);
	    };
	  },
	  onDirty: function onDirty() {
	    this.dirty = true;
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
	  (0, _utils.check)(action, _utils.is.function, 'reaction: fn argument is not a function');
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