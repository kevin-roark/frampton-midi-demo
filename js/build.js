(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={"path":"videos","videos":[{"filename":"1.mp4","duration":5.033,"volumeInfo":{"mean":-22,"max":-0.8},"tags":[]},{"filename":"2.mp4","duration":5.033,"volumeInfo":{"mean":-23.9,"max":-5.4},"tags":[]},{"filename":"3.mp4","duration":5.033,"volumeInfo":{"mean":-23.6,"max":-4.1},"tags":[]},{"filename":"4.mp4","duration":5.033,"volumeInfo":{"mean":-21.2,"max":-3.2},"tags":[]},{"filename":"5.mp4","duration":5.033,"volumeInfo":{"mean":-22.7,"max":0},"tags":[]},{"filename":"6.mp4","duration":5.033,"volumeInfo":{"mean":-25.5,"max":-3.2},"tags":[]},{"filename":"7.mp4","duration":5.033,"volumeInfo":{"mean":-24.5,"max":-0.6},"tags":[]},{"filename":"8.mp4","duration":5.033,"volumeInfo":{"mean":-25,"max":0},"tags":[]},{"filename":"9.mp4","duration":5.033,"volumeInfo":{"mean":-24.1,"max":-3.5},"tags":[]}],"audio":[],"frames":[]}
},{}],2:[function(require,module,exports){
'use strict';

var util = require('./util');
require('string-natural-compare');

module.exports.frequencyWeightedMedia = function (media) {
  if (!media) return [];

  var weightedMedia = [];
  for (var i = 0; i < media.length; i++) {
    var mediaObject = media[i];
    var frequency = mediaObject.frequency !== undefined ? mediaObject.frequency : 5; // default

    for (var f = 0; f < frequency; f++) {
      weightedMedia.push(mediaObject);
    }
  }

  return util.shuffle(weightedMedia);
};

module.exports.durationSortedMedia = function (media, descending) {
  return _mediaSortedWithComparator(media, function (mediaA, mediaB) {
    var durationA = mediaA.duration || 0;
    var durationB = mediaB.duration || 0;

    return descending ? durationB - durationA : durationA - durationB;
  });
};

module.exports.volumeSortedMedia = function (media) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var descending = options.descending || false;
  var useMax = options.useMax || false;
  return _mediaSortedWithComparator(media, function (mediaA, mediaB) {
    var volumeA = mediaA.volumeInfo ? useMax ? mediaA.volumeInfo.max : mediaA.volumeInfo.mean : -20;
    var volumeB = mediaB.volumeInfo ? useMax ? mediaB.volumeInfo.max : mediaB.volumeInfo.mean : -20;

    return descending ? volumeB - volumeA : volumeA - volumeB;
  });
};

module.exports.naturalLanguageSortedMedia = function (media) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var descending = options.descending || false;
  var caseSensitive = options.caseSensitive || false;

  var comparator = caseSensitive ? String.naturalCompare : String.naturalCaseCompare;

  return _mediaSortedWithComparator(media, function (mediaA, mediaB) {
    var val = comparator(mediaA.filename, mediaB.filename);
    return descending ? -val : val;
  });
};

module.exports.mediaSortedWithComparator = _mediaSortedWithComparator;
function _mediaSortedWithComparator(media, comparator) {
  if (!media || !comparator) return [];

  var mediaCopy = copiedMedia(media);

  mediaCopy.sort(comparator);

  return mediaCopy;
}

function copiedMedia(media) {
  if (!media) return [];

  var mediaCopy = [];

  for (var i = 0; i < media.length; i++) {
    mediaCopy.push(media[i]);
  }

  return mediaCopy;
}
},{"./util":5,"string-natural-compare":24}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function MediaFinder(mediaConfig) {
    _classCallCheck(this, MediaFinder);

    this.mediaConfig = mediaConfig;
  }

  _createClass(MediaFinder, [{
    key: 'findVideoWithPatern',
    value: function findVideoWithPatern(pattern) {
      var videos = this.mediaConfig.videos;
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        if (video.filename.indexOf(pattern) >= 0) {
          return video;
        }
      }

      return null;
    }
  }, {
    key: 'findAudioHandleForVideo',
    value: function findAudioHandleForVideo(video) {
      var strippedFilename = stripExtension(video.filename || video);

      var audio = this.mediaConfig.audio;
      if (!audio || audio.length === 0) {
        return null;
      }

      for (var i = 0; i < audio.length; i++) {
        var track = audio[i];
        if (strippedFilename === stripExtension(track.filename)) {
          return track;
        }
      }

      return null;
    }
  }]);

  return MediaFinder;
}();

function stripExtension(filename) {
  var lastDotIndex = filename.lastIndexOf('.');
  return filename.substring(0, lastDotIndex);
}
},{}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('./util');

module.exports = function () {
  function Tagger(mediaConfig) {
    _classCallCheck(this, Tagger);

    this.mediaConfig = mediaConfig;

    var videos = this.mediaConfig.videos;
    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];
      if (!video.tags) {
        video.tags = [];
      }
    }

    this.buildTagMap();
  }

  _createClass(Tagger, [{
    key: 'buildTagMap',
    value: function buildTagMap() {
      var tagMap = {};

      var videos = this.mediaConfig.videos;
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        var tags = video.tags;
        if (!tags) {
          continue;
        }

        for (var j = 0; j < tags.length; j++) {
          var tag = tags[j];
          var videosWithTag = tagMap[tag];
          if (!videosWithTag) {
            videosWithTag = [];
            tagMap[tag] = videosWithTag;
          }

          videosWithTag.push(video);
        }
      }

      this.tagMap = tagMap;
    }
  }, {
    key: 'videosWithTag',
    value: function videosWithTag(tag, options) {
      var videos = this.tagMap[tag] || [];

      if (options && options.shuffle) {
        videos = util.shuffle(videos);
      }

      if (options && options.limit) {
        videos = videos.slice(0, options.limit);
      }

      return videos;
    }
  }, {
    key: 'videosWithoutTag',
    value: function videosWithoutTag(tag, options) {
      var videos = [];

      var allVideos = this.mediaConfig.videos;
      for (var i = 0; i < allVideos.length; i++) {
        var video = allVideos[i];
        if (!this.videoHasTag(video, tag)) {
          videos.push(tag);
        }
      }

      if (options && options.shuffle) {
        videos = util.shuffle(videos);
      }

      if (options && options.limit) {
        videos = videos.slice(0, options.limit);
      }

      return videos;
    }
  }, {
    key: 'randomVideoWithTag',
    value: function randomVideoWithTag(tag) {
      var videos = this.videosWithTag(tag);
      return util.choice(videos);
    }
  }, {
    key: 'videoSequenceFromTagSequence',
    value: function videoSequenceFromTagSequence(tagSequence) {
      var videos = [];
      for (var i = 0; i < tagSequence.length; i++) {
        var tag = tagSequence[i];
        var video = this.randomVideoWithTag(tag);
        if (video) {
          videos.push(video);
        }
      }
      return videos;
    }
  }, {
    key: 'videoHasTag',
    value: function videoHasTag(video, tag) {
      if (!video) return false;

      var filename = video.filename || video;

      var videosWithTag = this.videosWithTag(tag);

      for (var i = 0; i < videosWithTag.length; i++) {
        if (videosWithTag[i].filename === filename) {
          return true;
        }
      }

      return false;
    }

    /// Utility Taggers

  }, {
    key: 'tagVideosWithPattern',
    value: function tagVideosWithPattern(pattern, tag) {
      var videos = this.mediaConfig.videos;
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        if (video.filename.indexOf(pattern) >= 0) {
          video.tags.push(tag);
        }
      }

      this.buildTagMap();
    }
  }, {
    key: 'tagVideosWithQualitativeLength',
    value: function tagVideosWithQualitativeLength() {
      var videos = this.mediaConfig.videos;
      for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        var duration = video.duration;

        if (duration < 0.3) {
          video.tags.push('short');
          video.tags.push('short1');
        } else if (duration < 1.0) {
          video.tags.push('short');
          video.tags.push('short2');
        } else if (duration < 3.0) {
          video.tags.push('med');
          video.tags.push('med1');
        } else if (duration < 5.0) {
          video.tags.push('med');
          video.tags.push('med2');
        } else if (duration < 10.0) {
          video.tags.push('long');
          video.tags.push('long1');
        } else if (duration < 30.0) {
          video.tags.push('long');
          video.tags.push('long2');
        } else {
          video.tags.push('long');
          video.tags.push('long3');
        }
      }

      this.buildTagMap();
    }
  }]);

  return Tagger;
}();
},{"./util":5}],5:[function(require,module,exports){
"use strict";

module.exports = {
  choice: choice,
  shuffle: shuffle,
  randInt: randInt,
  splitArray: splitArray
};

function choice(arr) {
  var i = Math.floor(Math.random() * arr.length);
  return arr[i];
}

function shuffle(arr) {
  var newArray = new Array(arr.length);
  for (var i = 0; i < arr.length; i++) {
    newArray[i] = arr[i];
  }

  newArray.sort(function () {
    return 0.5 - Math.random();
  });
  return newArray;
}

function randInt(min, max) {
  if (!min) min = 1;
  if (!max) max = 1000;

  return Math.floor(Math.random() * (max - min)) + min;
}

function splitArray(arr, n) {
  var arrs = [];

  var currentArr = [];
  for (var i = 0; i < arr.length; i++) {
    currentArr.push(arr[i]);
    if (currentArr.length === n) {
      arrs.push(currentArr);
      currentArr = [];
    }
  }

  if (currentArr.length > 0) {
    arrs.push(currentArr);
  }

  return arrs;
}
},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
  VideoSegment: require('./segment/video-segment'),
  ImageSegment: require('./segment/image-segment'),
  ColorSegment: require('./segment/color-segment'),
  AudioSegment: require('./segment/audio-segment'),
  TextSegment: require('./segment/text-segment'),

  SequencedSegment: require('./segment/sequenced-segment'),
  StackedSegment: require('./segment/stacked-segment'),
  finiteLoopingSegment: require('./segment/finite-looping-segment'),
  sequencedSegmentFromFrames: require('./segment/sequenced-segment-from-frames'),

  Renderer: require('./renderer/renderer'),

  Tagger: require('./etc/tagger'),
  MediaFinder: require('./etc/media-finder'),
  mediaArranger: require('./etc/media-arranger'),
  util: require('./etc/util')
};
},{"./etc/media-arranger":2,"./etc/media-finder":3,"./etc/tagger":4,"./etc/util":5,"./renderer/renderer":8,"./segment/audio-segment":11,"./segment/color-segment":12,"./segment/finite-looping-segment":13,"./segment/image-segment":14,"./segment/sequenced-segment":18,"./segment/sequenced-segment-from-frames":17,"./segment/stacked-segment":19,"./segment/text-segment":20,"./segment/video-segment":21}],7:[function(require,module,exports){
"use strict";

module.exports.setTransition = function (el, transition) {
  //el.style.setProperty('-moz-transition', transition);
  //el.style.setProperty('-ms-transition', transition);
  //el.style.setProperty('-o-transition', transition);

  el.style.webkitTransition = transition;
  el.style.transition = transition;
};
},{}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Renderer(options) {
    _classCallCheck(this, Renderer);

    this.mediaConfig = options.mediaConfig;
    this.outputFilepath = options.outputFilepath !== undefined ? options.outputFilepath : 'out/';
    this.log = options.log || false;
    this.audioFadeDuration = options.audioFadeDuration;
    this.videoFadeDuration = options.videoFadeDuration;

    if (this.log) {
      console.log('frampton is starting now...');
    }
  }

  /// Scheduling

  _createClass(Renderer, [{
    key: 'scheduleSegmentRender',
    value: function scheduleSegmentRender(segment, delay) {
      // override to provide concrete implementation of actual scheduling

      // this handles associated segments 4 u
      var associatedSegments = segment.associatedSegments();
      if (associatedSegments) {
        for (var i = 0; i < associatedSegments.length; i++) {
          var associatedOffset = delay + associatedSegments[i].offset * 1000;
          this.scheduleSegmentRender(associatedSegments[i].segment, associatedOffset);
        }
      }
    }
  }, {
    key: 'insertScheduledUnit',
    value: function insertScheduledUnit(scheduledUnit, units) {
      var insertionIndex = getInsertionIndex(units, scheduledUnit, compareScheduledUnits);
      units.splice(insertionIndex, 0, scheduledUnit);
    }

    /// Rendering

  }, {
    key: 'renderVideoSegment',
    value: function renderVideoSegment() {}
  }, {
    key: 'renderImageSegment',
    value: function renderImageSegment() {}
  }, {
    key: 'renderColorSegment',
    value: function renderColorSegment() {}
  }, {
    key: 'renderAudioSegment',
    value: function renderAudioSegment() {}
  }, {
    key: 'renderTextSegment',
    value: function renderTextSegment() {}
  }, {
    key: 'renderSegment',
    value: function renderSegment(segment) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      switch (segment.segmentType) {
        case 'video':
          this.renderVideoSegment(segment, options);
          break;

        case 'image':
          this.renderImageSegment(segment, options);
          break;

        case 'color':
          this.renderColorSegment(segment, options);
          break;

        case 'audio':
          this.renderAudioSegment(segment, options);
          break;

        case 'text':
          this.renderTextSegment(segment, options);
          break;

        case 'sequence':
          this.renderSequencedSegment(segment, options);
          break;

        case 'stacked':
          this.renderStackedSegment(segment, options);
          break;

        default:
          console.log('unhandled sequence type: ' + segment.segmentType);
          break;
      }
    }
  }, {
    key: 'renderSequencedSegment',
    value: function renderSequencedSegment(sequenceSegment, _ref) {
      var _this = this;

      var _ref$offset = _ref.offset;
      var offset = _ref$offset === undefined ? 0 : _ref$offset;

      sequenceSegment.segments.forEach(function (segment, idx) {
        _this.scheduleSegmentRender(segment, offset);
        offset += segment.msDuration() + sequenceSegment.msVideoOffset();

        if (idx === 0) {
          _this.overrideOnStart(segment, function () {
            sequenceSegment.didStart();
          });
        } else if (idx === sequenceSegment.segmentCount() - 1) {
          _this.overrideOnComplete(segment, function () {
            sequenceSegment.cleanup();
          });
        }
      });
    }
  }, {
    key: 'renderStackedSegment',
    value: function renderStackedSegment(stackedSegment, _ref2) {
      var _this2 = this;

      var _ref2$offset = _ref2.offset;
      var offset = _ref2$offset === undefined ? 0 : _ref2$offset;

      stackedSegment.segments.forEach(function (segment, idx) {
        var segmentOffset = offset + stackedSegment.msSegmentOffset(idx);
        _this2.scheduleSegmentRender(segment, segmentOffset);

        if (idx === 0) {
          _this2.overrideOnStart(segment, function () {
            stackedSegment.didStart();
          });
        }
      });

      var lastSegment = stackedSegment.lastSegment();
      this.overrideOnComplete(lastSegment, function () {
        stackedSegment.cleanup();
      });
    }

    /// Utility

  }, {
    key: 'overrideOnStart',
    value: function overrideOnStart(segment, onStart) {
      var originalOnStart = segment.onStart;
      segment.onStart = function () {
        // call and reset the original
        if (originalOnStart) {
          originalOnStart();
        }
        segment.onStart = originalOnStart;

        // call the new one
        onStart();
      };
    }
  }, {
    key: 'overrideOnComplete',
    value: function overrideOnComplete(segment, onComplete) {
      var originalOnComplete = segment.onComplete;
      segment.onComplete = function () {
        // call and reset the original
        if (originalOnComplete) {
          originalOnComplete();
        }
        segment.onComplete = originalOnComplete;

        // call the new one
        onComplete();
      };
    }
  }]);

  return Renderer;
}();

function compareScheduledUnits(scheduledUnitA, scheduledUnitB) {
  var offsetA = scheduledUnitA.offset || 0;
  var offsetB = scheduledUnitB.offset || 0;

  return offsetA - offsetB;
}

// binary search baby
function getInsertionIndex(arr, element, comparator) {
  if (arr.length === 0) {
    return 0;
  }

  var low = 0;
  var high = arr.length - 1;

  while (low <= high) {
    var mid = Math.floor((low + high) / 2);
    var compareValue = comparator(arr[mid], element);
    if (compareValue < 0) {
      low = mid + 1;
    } else if (compareValue > 0) {
      high = mid - 1;
    } else {
      return mid;
    }
  }

  return low;
}
},{}],9:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function ScheduledUnit(segment, offset) {
    _classCallCheck(this, ScheduledUnit);

    this.segment = segment;
    this.offset = offset;
  }

  _createClass(ScheduledUnit, [{
    key: "toString",
    value: function toString() {
      return Math.round(this.offset * 100) / 100 + ": " + this.segment.simpleName() + " for " + this.segment.getDuration();
    }
  }]);

  return ScheduledUnit;
}();
},{}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TWEEN = require('tween.js');
var Renderer = require('./renderer');
var ScheduledUnit = require('./scheduled-unit');
var dahmer = require('./dahmer');

var TimePerFrame = 16.67;

module.exports = function (_Renderer) {
  _inherits(WebRenderer, _Renderer);

  function WebRenderer(options) {
    _classCallCheck(this, WebRenderer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebRenderer).call(this, options));

    _this.timeToLoadVideo = options.timeToLoadVideo || 4000;
    _this.startDelayCorrection = options.startDelayCorrection || 1.8; // this adapts over time
    _this.startPerceptionCorrection = options.startPerceptionCorrection || 13; // this is constant

    _this.videoSourceMaker = options.videoSourceMaker !== undefined ? options.videoSourceMaker : function (filename) {
      var mediaPath = _this.mediaConfig.path;
      if (mediaPath[mediaPath.length - 1] !== '/') mediaPath += '/';
      return mediaPath + filename;
    };

    _this.domContainer = document.body;
    _this.scheduledRenders = [];
    _this.updateFunctions = [];

    _this.videosPlayed = 0;
    _this.meanStartDelay = 0;

    _this.lastUpdateTime = 0;
    _this.update(); // get the loop going
    return _this;
  }

  /// Scheduling

  _createClass(WebRenderer, [{
    key: 'update',
    value: function update(totalTime) {
      window.requestAnimationFrame(this.update.bind(this));
      TWEEN.update(totalTime);

      var now = window.performance.now();
      var timeSinceLastUpdate = now - this.lastUpdateTime;
      this.lastUpdateTime = now;

      this.handleScheduledItems(now, timeSinceLastUpdate);

      for (var i = 0; i < this.updateFunctions.length; i++) {
        this.updateFunctions[i].fn(timeSinceLastUpdate);
      }
    }
  }, {
    key: 'handleScheduledItems',
    value: function handleScheduledItems(now, timeSinceLastUpdate) {
      var timeToLoad = this.timeToLoadVideo + TimePerFrame;
      var scheduledRenders = this.scheduledRenders;

      var toRender = [];
      for (var i = 0; i < scheduledRenders.length; i++) {
        var scheduledRender = scheduledRenders[i];
        var timeUntilStart = scheduledRender.offset - now;

        if (timeUntilStart < timeToLoad) {
          // start to render, and mark for removal
          toRender.push({ segment: scheduledRender.segment, options: { offset: Math.max(timeUntilStart, 0) } });
        } else {
          break; // because we sort by offset, we can break early
        }
      }

      if (toRender.length > 0) {
        // remove used-up units
        scheduledRenders.splice(0, toRender.length);

        // actually perform rendering
        for (i = 0; i < toRender.length; i++) {
          var renderModel = toRender[i];
          this.renderSegment(renderModel.segment, renderModel.options);
        }
      }
    }
  }, {
    key: 'addUpdateFunction',
    value: function addUpdateFunction(fn) {
      var identifier = '' + Math.floor(Math.random() * 1000000000);
      this.updateFunctions.push({
        identifier: identifier,
        fn: fn
      });

      return identifier;
    }
  }, {
    key: 'setTimeout',
    value: function (_setTimeout) {
      function setTimeout(_x, _x2) {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    }(function (fn, time) {
      // TODO: let's make this precise with the render loop
      setTimeout(fn, time);
    })
  }, {
    key: 'removeUpdateFunctionWithIdentifier',
    value: function removeUpdateFunctionWithIdentifier(identifier) {
      var indexOfIdentifier = -1;
      for (var i = 0; i < this.updateFunctions.length; i++) {
        if (this.updateFunctions[i].identifier === identifier) {
          indexOfIdentifier = i;
          break;
        }
      }

      if (indexOfIdentifier >= 0) {
        this.updateFunctions.splice(indexOfIdentifier, 1);
      }
    }
  }, {
    key: 'scheduleSegmentRender',
    value: function scheduleSegmentRender(segment, delay) {
      _get(Object.getPrototypeOf(WebRenderer.prototype), 'scheduleSegmentRender', this).call(this, segment, delay);

      var offset = window.performance.now() + delay;
      var unit = new ScheduledUnit(segment, offset);

      this.insertScheduledUnit(unit, this.scheduledRenders);
    }

    /// Rendering

  }, {
    key: 'renderVideoSegment',
    value: function renderVideoSegment(segment, _ref) {
      var _ref$offset = _ref.offset;
      var offset = _ref$offset === undefined ? 0 : _ref$offset;

      var self = this;

      var video = document.createElement('video');
      video.preload = true;
      video.className = 'frampton-video';
      segment._backingVideo = video;

      var filename = video.canPlayType('video/mp4').length > 0 ? segment.filename : segment.extensionlessName() + '.webm';
      video.src = this.videoSourceMaker(filename);

      video.style.zIndex = segment.z;

      if (segment.width) {
        video.style.width = video.style.height = segment.width;
      }
      if (segment.top) {
        video.style.top = segment.top;
      }
      if (segment.left) {
        video.style.left = segment.left;
      }

      video.volume = segment.volume;
      segment.addChangeHandler('volume', function (volume) {
        video.volume = volume;
      });

      video.currentTime = segment.startTime;

      video.playbackRate = segment.playbackRate;
      segment.addChangeHandler('playbackRate', function (playbackRate) {
        video.playbackRate = playbackRate;
      });

      var displayStyle = video.style.display || 'block';
      video.style.display = 'none';
      this.domContainer.appendChild(video);

      var segmentDuration = segment.msDuration();
      var expectedStart = window.performance.now() + offset;

      var hasPlayedFirstTime = false;
      video.addEventListener('playing', function () {
        if (hasPlayedFirstTime) return;

        hasPlayedFirstTime = true;
        var now = window.performance.now();
        var startDelay = now + self.startPerceptionCorrection - expectedStart;

        var endTimeout = segmentDuration;
        if (startDelay > self.startPerceptionCorrection) {
          endTimeout -= startDelay;
        }

        setTimeout(end, endTimeout);

        self.videosPlayed += 1;
        if (self.videosPlayed === 1) {
          self.meanStartDelay = startDelay;
        } else {
          self.meanStartDelay = (self.meanStartDelay * (self.videosPlayed - 1) + startDelay) / self.videosPlayed;

          if (Math.abs(self.meanStartDelay > 1)) {
            if (self.meanStartDelay > 0.05 && self.startDelayCorrection < 3) {
              self.startDelayCorrection += 0.05;
            } else if (self.meanStartDelay < -0.05 && self.startDelayCorrection > 0.05) {
              self.startDelayCorrection -= 0.05;
            }
          }
        }

        if (self.log) {
          console.log(now + ': start ' + filename + ' | duration ' + segmentDuration + ' | start delay ' + startDelay);
          console.log('start correction ' + self.startDelayCorrection + ' | mean delay ' + self.meanStartDelay);
        }
      }, false);

      setTimeout(start, offset - this.startDelayCorrection - this.startPerceptionCorrection);

      function start() {
        video.play();

        video.style.display = displayStyle;

        var videoFadeDuration = segment.videoFadeDuration || self.videoFadeDuration;
        if (videoFadeDuration) {
          videoFadeDuration = Math.min(videoFadeDuration, segmentDuration / 2);

          video.style.opacity = 0;
          var transition = 'opacity ' + videoFadeDuration + 'ms';
          dahmer.setTransition(video, transition);

          // fade in
          setTimeout(function () {
            video.style.opacity = segment.opacity;
          }, 1);

          // fade out
          setTimeout(function () {
            video.style.opacity = 0;
          }, segmentDuration - videoFadeDuration);
        } else {
          self.setVisualSegmentOpacity(segment, video);
        }

        self.fadeAudioForVideoSegment(segment, video);

        segment.didStart();
      }

      function end() {
        if (self.log) {
          var now = window.performance.now();
          var expectedEnd = expectedStart + segmentDuration;
          console.log(now + ': finish ' + filename + ' | end delay: ' + (now - expectedEnd));
        }

        if (segment.loop) {
          video.currentTime = segment.startTime;
          setTimeout(end, segmentDuration);
        } else {
          video.parentNode.removeChild(video);
          video.src = '';
          segment.cleanup();
        }
      }
    }
  }, {
    key: 'fadeAudioForVideoSegment',
    value: function fadeAudioForVideoSegment(segment, video) {
      var audioFadeDuration = segment.audioFadeDuration || this.audioFadeDuration;
      if (audioFadeDuration) {
        var segmentDuration = segment.msDuration();
        audioFadeDuration = Math.min(audioFadeDuration, segmentDuration / 2);

        // fade in
        video.volume = 0;
        new TWEEN.Tween(video).to({ volume: segment.volume }, audioFadeDuration).start();

        setTimeout(function () {
          // fade out
          new TWEEN.Tween(video).to({ volume: 0 }, audioFadeDuration).start();
        }, segmentDuration - audioFadeDuration);
      }
    }
  }, {
    key: 'renderTextSegment',
    value: function renderTextSegment(segment, _ref2) {
      var _ref2$offset = _ref2.offset;
      var offset = _ref2$offset === undefined ? 0 : _ref2$offset;

      var self = this;

      var div = document.createElement('div');
      div.className = 'frampton-text';

      div.style.fontFamily = segment.font;
      div.style.fontSize = segment.fontSize;
      div.style.zIndex = segment.z;
      div.style.textAlign = segment.textAlignment;
      div.style.color = segment.color;

      if (segment.maxWidth) {
        div.style.maxWidth = segment.maxWidth;
      }
      if (segment.top) {
        div.style.top = segment.top;
      }
      if (segment.left) {
        div.style.left = segment.left;
      }

      div.textContent = segment.text;

      div.style.display = 'none';
      this.domContainer.appendChild(div);

      setTimeout(start, offset);
      setTimeout(end, offset + segment.msDuration());

      function start() {
        div.style.display = 'block';
        self.setVisualSegmentOpacity(segment, div);
        segment.didStart();
      }

      function end() {
        div.parentNode.removeChild(div);
        segment.cleanup();
      }
    }
  }, {
    key: 'renderColorSegment',
    value: function renderColorSegment(segment, _ref3) {
      var _ref3$offset = _ref3.offset;
      var offset = _ref3$offset === undefined ? 0 : _ref3$offset;

      var self = this;

      var div = document.createElement('div');
      div.className = 'frampton-video';

      div.style.zIndex = segment.z;

      if (segment.width) {
        div.style.width = div.style.height = segment.width;
      }
      if (segment.top) {
        div.style.top = segment.top;
      }
      if (segment.left) {
        div.style.left = segment.left;
      }

      if (segment.transitionBetweenColors) {
        div.style.transition = 'background-color 5ms';
      }

      var displayStyle = div.style.display || 'block';
      div.style.display = 'none';
      this.domContainer.appendChild(div);

      var framesDataResponseCallback;
      if (!segment.framesData) {
        if (this.log) {
          console.log('loading color frames for: ' + segment.filename);
        }
        this.getJSON(this.videoSourceMaker(segment.filename), function (framesData) {
          segment.setFramesData(framesData);

          if (framesDataResponseCallback) framesDataResponseCallback();
          framesDataResponseCallback = null;
        });
      }

      if (offset > 0) {
        setTimeout(start, offset);
      } else {
        start();
      }

      function start() {
        if (!segment.framesData) {
          framesDataResponseCallback = function framesDataResponseCallback() {
            start();
          };
          return;
        }

        if (self.log) {
          console.log('displaying colors for: ' + segment.filename);
        }

        div.style.display = displayStyle;

        self.setVisualSegmentOpacity(segment, div);

        segment.didStart();

        var msPerFrame;
        var currentFrameIndex = segment.startTime === 0 ? 0 : Math.floor(segment.startTime * 1000 / msPerFrame);
        var lastUpdateLeftoverTime = 0;

        updateMSPerFrame();
        updateColorRender(0);

        segment.addChangeHandler('playbackRate', updateMSPerFrame);

        var fnIdentifier = self.addUpdateFunction(updateColorRender);

        function updateColorRender(timeDelta) {
          var deltaWithLeftoverTime = timeDelta + lastUpdateLeftoverTime;

          var frames = Math.floor(deltaWithLeftoverTime / msPerFrame);
          currentFrameIndex += frames;

          lastUpdateLeftoverTime = deltaWithLeftoverTime - frames * msPerFrame;

          if (currentFrameIndex >= segment.numberOfColors()) {
            if (segment.loop) {
              currentFrameIndex = currentFrameIndex - segment.numberOfColors();
            } else {
              end(fnIdentifier);
              return;
            }
          }

          div.style.backgroundColor = segment.rgb(segment.getColor(currentFrameIndex));

          if (self.log) {
            console.log(window.performance.now() + ': displaying frame ' + currentFrameIndex + ' for color segment - ' + segment.simpleName());
          }
        }

        function updateMSPerFrame() {
          msPerFrame = segment.msDuration() / segment.numberOfColors();
        }

        if (self.log) {
          console.log(window.performance.now() + ': started color segment - ' + segment.simpleName());
        }
      }

      function end(fnIdentifier) {
        div.parentNode.removeChild(div);
        segment.cleanup();

        self.removeUpdateFunctionWithIdentifier(fnIdentifier);

        if (self.log) {
          console.log(window.performance.now() + ': finished color segment - ' + segment.simpleName());
        }
      }
    }
  }, {
    key: 'renderAudioSegment',
    value: function renderAudioSegment(segment, options) {
      if (segment.preferHTMLAudio || options.preferHTMLAudio || this.preferHTMLAudio) {
        this.renderAudioSegmentWithHTMLAudio(segment, options);
      } else {
        this.renderAudioSegmentWithWebAudio(segment, options);
      }
    }

    // helpful web audio documentation: http://www.html5rocks.com/en/tutorials/webaudio/intro/

  }, {
    key: 'renderAudioSegmentWithWebAudio',
    value: function renderAudioSegmentWithWebAudio(segment, _ref4) {
      var _ref4$offset = _ref4.offset;
      var offset = _ref4$offset === undefined ? 0 : _ref4$offset;

      var self = this;

      var Context = window.AudioContext || window.webkitAudioContext;
      var audioContext = new Context();
      var source = audioContext.createBufferSource();
      var sourceStartTime = audioContext.currentTime + offset / 1000;

      var gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      segment.addChangeHandler('volume', function (volume) {
        gainNode.gain.value = volume;
      });

      if (segment.fadeInDuration) {
        gainNode.gain.linearRampToValueAtTime(0, sourceStartTime);
        gainNode.gain.linearRampToValueAtTime(segment.volume, sourceStartTime + segment.fadeInDuration);
      } else {
        gainNode.gain.value = segment.volume;
      }

      if (segment.fadeOutDuration) {
        gainNode.gain.linearRampToValueAtTime(segment.volume, sourceStartTime + segment.getDuration() - segment.fadeOutDuration);
        gainNode.gain.linearRampToValueAtTime(0, sourceStartTime + segment.getDuration());
      }

      source.start(sourceStartTime, segment.startTime, segment.getDuration());

      var request = new XMLHttpRequest();
      request.open('GET', this.videoSourceMaker(segment.filename), true);
      request.responseType = 'arraybuffer';

      request.onload = function () {
        var audioData = request.response;

        audioContext.decodeAudioData(audioData, function (buffer) {
          source.buffer = buffer;
          source.connect(gainNode);

          source.loop = segment.loop;
          if (segment.loop) {
            source.loopStart = segment.startTime;
            source.loopEnd = segment.endTime();
          }

          source.playbackRate.value = segment.playbackRate;
          segment.addChangeHandler('playbackRate', function (playbackRate) {
            source.playbackRate.value = playbackRate;
          });
        }, function (e) {
          if (self.log) {
            console.log('audio decoding erorr: ' + e.err);
          }
        });
      };

      request.send();
    }
  }, {
    key: 'renderAudioSegmentWithHTMLAudio',
    value: function renderAudioSegmentWithHTMLAudio(segment, _ref5) {
      var _ref5$offset = _ref5.offset;
      var offset = _ref5$offset === undefined ? 0 : _ref5$offset;

      var self = this;

      var audio = document.createElement('audio');
      audio.preload = true;
      audio.src = this.videoSourceMaker(segment.filename);
      audio.currentTime = segment.startTime;
      audio.playbackRate = segment.playbackRate;
      segment.addChangeHandler('playbackRate', function (playbackRate) {
        audio.playbackRate = playbackRate;
      });
      audio.volume = segment.volume;
      segment.addChangeHandler('volume', function (volume) {
        audio.volume = volume;
      });

      var segmentDuration = segment.msDuration();
      var expectedStart = window.performance.now() + offset;

      audio.addEventListener('playing', function () {
        var now = window.performance.now();
        var startDelay = now + self.startPerceptionCorrection - expectedStart;

        var endTimeout = segmentDuration;
        if (startDelay > self.startPerceptionCorrection) {
          endTimeout -= startDelay;
        }

        setTimeout(end, endTimeout);

        if (self.log) {
          console.log('audio is playing for ' + segment.filename);
        }
      }, false);

      setTimeout(start, offset - this.startPerceptionCorrection);

      function start() {
        audio.play();

        var fadeInDuration = 1000 * segment.fadeInDuration || self.audioFadeDuration;
        if (fadeInDuration) {
          fadeInDuration = Math.min(fadeInDuration, segmentDuration / 2);

          audio.volume = 0;
          new TWEEN.Tween(audio).to({ volume: segment.volume }, fadeInDuration).start();
        }

        var fadeOutDuration = 1000 * segment.fadeOutDuration || self.audioFadeDuration;
        if (fadeOutDuration) {
          setTimeout(function () {
            new TWEEN.Tween(audio).to({ volume: 0 }, fadeOutDuration).start();
          }, segmentDuration - fadeOutDuration);
        }

        if (self.log) {
          console.log('started playing audio for: ' + segment.filename);
        }

        segment.didStart();
      }

      function end() {
        if (segment.loop) {
          audio.pause();
          audio.currentTime = segment.startTime;
          audio.play();
          setTimeout(end, segmentDuration);
        } else {
          audio.src = '';
          segment.cleanup();
        }
      }
    }

    /// Rendering Helpers

  }, {
    key: 'setVisualSegmentOpacity',
    value: function setVisualSegmentOpacity(segment, el) {
      if (segment.opacity !== 1.0) {
        el.style.opacity = segment.opacity;
      }
      segment.addChangeHandler('opacity', function (opacity) {
        el.style.opacity = opacity;
      });
    }
  }, {
    key: 'getJSON',
    value: function getJSON(url, callback) {
      if (!callback) return;

      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function () {
        var data = JSON.parse(request.responseText);
        callback(data);
      };

      request.send();
    }
  }]);

  return WebRenderer;
}(Renderer);
},{"./dahmer":7,"./renderer":8,"./scheduled-unit":9,"tween.js":25}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaSegment = require('./media-segment');

/// Play some audio!!
/// Dynamic properties on web: volume
module.exports = function (_MediaSegment) {
  _inherits(AudioSegment, _MediaSegment);

  function AudioSegment(options) {
    _classCallCheck(this, AudioSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AudioSegment).call(this, options));

    _this.segmentType = 'audio';

    _this.volume = options.volume || 0.8;
    _this.fadeInDuration = options.fadeInDuration;
    _this.fadeOutDuration = options.fadeOutDuration || _this.fadeInDuration;
    return _this;
  }

  _createClass(AudioSegment, [{
    key: 'copy',
    value: function copy(audioSegment) {
      _get(Object.getPrototypeOf(AudioSegment.prototype), 'copy', this).call(this, audioSegment);

      this.volume = audioSegment.volume;
      this.fadeInDuration = audioSegment.fadeInDuration;
      this.fadeOutDuration = audioSegment.fadeOutDuration;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new AudioSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setVolume',
    value: function setVolume(volume) {
      this.volume = volume;

      this.notifyChangeHandlers('volume', volume);

      return this;
    }
  }, {
    key: 'setFadeDuration',
    value: function setFadeDuration(fadeDuration) {
      return this.setFadeInDuration(fadeDuration).setFadeOutDuration(fadeDuration);
    }
  }, {
    key: 'setFadeInDuration',
    value: function setFadeInDuration(fadeInDuration) {
      this.fadeInDuration = fadeInDuration;

      return this;
    }
  }, {
    key: 'setFadeOutDuration',
    value: function setFadeOutDuration(fadeOutDuration) {
      this.fadeOutDuration = fadeOutDuration;

      return this;
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'audio - ' + this.filename;
    }
  }]);

  return AudioSegment;
}(MediaSegment);
},{"./media-segment":15}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisualSegment = require('./visual-segment');

module.exports = function (_VisualSegment) {
  _inherits(ColorSegment, _VisualSegment);

  function ColorSegment(options) {
    _classCallCheck(this, ColorSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorSegment).call(this, options));

    _this.segmentType = 'color';

    // TODO: abstract this into FramesSegment
    _this.fps = options.fps;
    _this.numberOfFrames = options.numberOfFrames;
    _this.framesData = options.framesData;

    _this.transitionBetweenColors = options.transitionBetweenColors || false;
    return _this;
  }

  _createClass(ColorSegment, [{
    key: 'copy',
    value: function copy(colorSegment) {
      _get(Object.getPrototypeOf(ColorSegment.prototype), 'copy', this).call(this, colorSegment);

      this.fps = colorSegment.fps;
      this.numberOfFrames = colorSegment.numberOfFrames;
      this.framesData = colorSegment.framesData;
      this.transitionBetweenColors = colorSegment.transitionBetweenColors;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new ColorSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setColors',
    value: function setColors(colors) {
      this.colors = colors;
      return this;
    }
  }, {
    key: 'setFramesData',
    value: function setFramesData(framesData) {
      this.framesData = framesData.frames ? framesData.frames : framesData;
      return this;
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'color - ' + this.filename;
    }
  }, {
    key: 'numberOfColors',
    value: function numberOfColors() {
      if (this.numberOfFrames) {
        return this.numberOfFrames;
      }

      return this.framesData ? this.framesData.length : 0;
    }
  }, {
    key: 'getColor',
    value: function getColor(index) {
      if (!this.framesData) {
        return null;
      }

      var colors = this.framesData[index].colors;
      return colors.dominant;
    }
  }, {
    key: 'getPalette',
    value: function getPalette(index) {
      if (!this.framesData) {
        return null;
      }

      var colors = this.framesData[index].colors;
      return colors.palette;
    }
  }, {
    key: 'rgb',
    value: function rgb(color) {
      if (!color) return 'rgb(0, 0, 0)';

      return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
    }
  }]);

  return ColorSegment;
}(VisualSegment);
},{"./visual-segment":22}],13:[function(require,module,exports){
'use strict';

var SequencedSegment = require('./sequenced-segment');

module.exports = function finiteLoopingSegment(segment) {
  var timesToLoop = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  // create the list of cloned segments to loop
  var clonedSegments = [];
  for (var i = 0; i < timesToLoop; i++) {
    clonedSegments.push(i === 0 ? segment : segment.clone());
  }

  options.segments = clonedSegments;

  // create the looping sequence segment
  var loopingSegment = new SequencedSegment(options);

  return loopingSegment;
};
},{"./sequenced-segment":18}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisualSegment = require('./visual-segment');

module.exports = function (_VisualSegment) {
  _inherits(ImageSegment, _VisualSegment);

  function ImageSegment(options) {
    _classCallCheck(this, ImageSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ImageSegment).call(this, options));

    _this.segmentType = 'image';
    return _this;
  }

  _createClass(ImageSegment, [{
    key: 'copy',
    value: function copy(imageSegment) {
      _get(Object.getPrototypeOf(ImageSegment.prototype), 'copy', this).call(this, imageSegment);

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new ImageSegment({}).copy(this);
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'image - ' + this.filename;
    }
  }]);

  return ImageSegment;
}(VisualSegment);
},{"./visual-segment":22}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Segment = require('./segment');

/// abstract superclass for VisualSegment, AudioSegment
/// Dynamic properties on web: playbackRate
module.exports = function (_Segment) {
  _inherits(MediaSegment, _Segment);

  function MediaSegment(options) {
    _classCallCheck(this, MediaSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MediaSegment).call(this, options));

    _this.segmentType = 'media';

    // media config
    _this.filename = options.filename;
    _this.mediaDuration = options.duration;
    _this.audioSampleRate = options.audioSampleRate || 44100;

    // segment config
    _this.startTime = options.startTime || 0;
    _this.duration = _this.mediaDuration - _this.startTime;
    _this.playbackRate = options.playbackRate || 1.0;
    _this.loop = options.loop || false;
    return _this;
  }

  _createClass(MediaSegment, [{
    key: 'copy',
    value: function copy(mediaSegment) {
      _get(Object.getPrototypeOf(MediaSegment.prototype), 'copy', this).call(this, mediaSegment);

      this.filename = mediaSegment.filename;
      this.mediaDuration = mediaSegment.mediaDuration;

      this.startTime = mediaSegment.startTime;
      this.duration = mediaSegment.duration;
      this.playbackRate = mediaSegment.playbackRate;
      this.loop = mediaSegment.loop;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new MediaSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setFilename',
    value: function setFilename(filename) {
      this.filename = filename;
      return this;
    }
  }, {
    key: 'setEndTime',
    value: function setEndTime(endTime) {
      this.startTime = endTime - this.duration;
      return this;
    }
  }, {
    key: 'setStartTime',
    value: function setStartTime(startTime) {
      this.startTime = startTime;
      this.duration = Math.min(this.duration, this.mediaDuration - startTime);
      return this;
    }
  }, {
    key: 'setDuration',
    value: function setDuration(duration, startAtEnd) {
      this.duration = Math.min(duration, this.mediaDuration);

      var maximalStartTime = this.mediaDuration - this.duration;
      if (startAtEnd || this.startTime > maximalStartTime) {
        this.startTime = maximalStartTime;
      }

      return this;
    }
  }, {
    key: 'setPlaybackRate',
    value: function setPlaybackRate(playbackRate) {
      this.playbackRate = playbackRate;

      this.notifyChangeHandlers('playbackRate', playbackRate);

      return this;
    }
  }, {
    key: 'setLoop',
    value: function setLoop(loop) {
      this.loop = loop;

      return this;
    }

    // Generators

  }, {
    key: 'extensionlessName',
    value: function extensionlessName() {
      return this.filename.substring(0, this.filename.lastIndexOf('.'));
    }
  }, {
    key: 'endTime',
    value: function endTime() {
      return this.startTime + this.duration;
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.duration / this.playbackRate;
    }
  }, {
    key: 'msStartTime',
    value: function msStartTime() {
      return this.startTime * 1000;
    }
  }, {
    key: 'msEndTime',
    value: function msEndTime() {
      return this.endTime() * 1000;
    }
  }]);

  return MediaSegment;
}(Segment);
},{"./segment":16}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Segment(options) {
    _classCallCheck(this, Segment);

    this.onStart = options.onStart;
    this.onComplete = options.onComplete;

    this.changeHandlers = {};
  }

  _createClass(Segment, [{
    key: 'copy',
    value: function copy(segment) {
      this.onStart = segment.onStart;
      this.onComplete = segment.onComplete;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new Segment({}).copy(this);
    }

    /// Start and Finish

  }, {
    key: 'didStart',
    value: function didStart() {
      if (this.onStart) {
        this.onStart();
        this.onStart = undefined;
      }
    }
  }, {
    key: 'cleanup',
    value: function cleanup() {
      if (this.onComplete) {
        this.onComplete();
        this.onComplete = undefined;
      }
    }

    /// Chaining Configuration

  }, {
    key: 'setOnStart',
    value: function setOnStart(onStart) {
      this.onStart = onStart;
      return this;
    }
  }, {
    key: 'setOnComplete',
    value: function setOnComplete(onComplete) {
      this.onComplete = onComplete;
      return this;
    }

    /// Change Notification

  }, {
    key: 'addChangeHandler',
    value: function addChangeHandler(propertyName, fn) {
      var handlers = this.getChangeHandlers(propertyName);
      handlers.push(fn);
    }
  }, {
    key: 'notifyChangeHandlers',
    value: function notifyChangeHandlers(propertyName, value) {
      var handlers = this.getChangeHandlers(propertyName);

      for (var i = 0; i < handlers.length; i++) {
        handlers[i](value);
      }
    }
  }, {
    key: 'getChangeHandlers',
    value: function getChangeHandlers(propertyName) {
      var handlers = this.changeHandlers[propertyName];
      if (handlers !== undefined) {
        return handlers;
      }

      handlers = [];
      this.changeHandlers[propertyName] = handlers;

      return handlers;
    }

    /// Generators

  }, {
    key: 'getDuration',
    value: function getDuration() {
      return 0;
    }
  }, {
    key: 'msDuration',
    value: function msDuration() {
      return this.getDuration() * 1000;
    }
  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'plain segment';
    }
  }, {
    key: 'associatedSegments',
    value: function associatedSegments() {
      return null;
    }
  }]);

  return Segment;
}();
},{}],17:[function(require,module,exports){
'use strict';

var VideoSegment = require('./video-segment');
var ImageSegment = require('./image-segment');
var SequencedSegment = require('./sequenced-segment');

module.exports = function sequencedSegmentFromFrames(framesData) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var firstFrameIndex = options.firstFrameIndex || 0;
  var numberOfFrames = options.numberOfFrames || framesData.frames.length;
  var cutVideos = options.cutVideos || false;

  var frameDuration = 1 / framesData.fps;

  // create list of video segments, each segment with duration equal to one frame
  var segments = [];
  for (var i = firstFrameIndex; i < numberOfFrames; i++) {
    var frame = framesData.frames[i];

    if (cutVideos) {
      var videoSegment = new VideoSegment(framesData);
      videoSegment.setStartTime(frame.timecode).setDuration(frameDuration);

      segments.push(videoSegment);
    } else {
      var imageSegment = new ImageSegment({
        filename: frame.imageFilename,
        duration: frameDuration
      });

      segments.push(imageSegment);
    }
  }

  // put segments in given options array to allow arbitrary options-passing to SequencedSegment
  options.segments = segments;

  // create the looping sequence segment
  var sequencedSegment = new SequencedSegment(options);

  return sequencedSegment;
};
},{"./image-segment":14,"./sequenced-segment":18,"./video-segment":21}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Segment = require('./segment');

module.exports = function (_Segment) {
  _inherits(SequencedSegment, _Segment);

  function SequencedSegment() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SequencedSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SequencedSegment).call(this, options));

    _this.segmentType = 'sequence';
    _this.segments = options.segments || [];
    _this.videoOffset = options.videoOffset || 0;
    return _this;
  }

  _createClass(SequencedSegment, [{
    key: 'copy',
    value: function copy(sequencedSegment, recursive) {
      _get(Object.getPrototypeOf(SequencedSegment.prototype), 'copy', this).call(this, sequencedSegment);

      this.segments = [];
      for (var i = 0; i < sequencedSegment.segments.length; i++) {
        var segment = sequencedSegment.segments[i];
        this.segments.push(recursive ? segment.clone() : segment);
      }

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new SequencedSegment().copy(this, true);
    }

    /// Generators

  }, {
    key: 'getSegment',
    value: function getSegment(index) {
      return this.segments[index];
    }
  }, {
    key: 'segmentCount',
    value: function segmentCount() {
      return this.segments.length;
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      var offset = 0;
      for (var i = 0; i < this.segments.length - 1; i++) {
        offset += this.segments[i].getDuration() - this.videoOffset;
      }

      var duration = offset + this.segments[this.segments.length - 1].getDuration();

      return duration;
    }
  }, {
    key: 'msVideoOffset',
    value: function msVideoOffset() {
      return this.videoOffset * 1000;
    }
  }]);

  return SequencedSegment;
}(Segment);
},{"./segment":16}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Segment = require('./segment');

module.exports = function (_Segment) {
  _inherits(StackedSegment, _Segment);

  function StackedSegment() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, StackedSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StackedSegment).call(this, options));

    _this.segmentType = 'stacked';
    _this.segments = options.segments || [];
    _this.stackAllowance = options.stackAllowance || 0.25;
    _this.segmentOffsets = [];
    _this.segmentEndTimes = [];

    var accumulatedOffset = 0;
    for (var i = 0; i < _this.segments.length; i++) {
      _this.segmentOffsets.push(accumulatedOffset);

      var duration = _this.segments[i].getDuration();
      _this.segmentEndTimes.push(accumulatedOffset + duration);

      accumulatedOffset += Math.random() * duration * _this.stackAllowance * 2 + duration * (1 - _this.stackAllowance);
    }
    return _this;
  }

  _createClass(StackedSegment, [{
    key: 'copy',
    value: function copy(stackedSegment, recursive) {
      _get(Object.getPrototypeOf(StackedSegment.prototype), 'copy', this).call(this, stackedSegment);

      this.stackAllowance = stackedSegment.stackAllowance;

      for (var i = 0; i < stackedSegment.segments.length; i++) {
        var segment = stackedSegment.segments[i];
        this.segments.push(recursive ? segment.clone() : segment);

        this.segmentOffsets.push(stackedSegment.segmentOffsets[i]);
        this.segmentEndTimes.push(stackedSegment.segmentEndTimes[i]);
      }

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new StackedSegment().copy(this, true);
    }

    /// Generators

  }, {
    key: 'msSegmentOffset',
    value: function msSegmentOffset(idx) {
      return this.segmentOffsets[idx] * 1000;
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return Math.max.apply(null, this.segmentEndTimes);
    }
  }, {
    key: 'lastSegment',
    value: function lastSegment() {
      var maxEndTime = Math.max.apply(null, this.segmentEndTimes);
      var maxEndTimeIndex = this.segmentEndTimes.indexOf(maxEndTime) || this.segmentEndTimes.length - 1;
      return this.segments[maxEndTimeIndex];
    }
  }]);

  return StackedSegment;
}(Segment);
},{"./segment":16}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Segment = require('./segment');

module.exports = function (_Segment) {
  _inherits(TextSegment, _Segment);

  function TextSegment(options) {
    _classCallCheck(this, TextSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextSegment).call(this, options));

    _this.segmentType = 'text';

    _this.text = options.text || '';
    _this.duration = options.duration || 5;
    _this.font = options.font || 'Times New Roman';
    _this.fontSize = options.fontSize || '24px';
    _this.textAlignment = options.textAlignment || 'left';
    _this.color = options.color || 'black';
    _this.top = options.top;
    _this.left = options.left;
    _this.maxWidth = options.maxWidth;
    _this.z = options.z || 0;
    _this.opacity = options.opacity || 1.0;
    return _this;
  }

  _createClass(TextSegment, [{
    key: 'copy',
    value: function copy(textSegment) {
      _get(Object.getPrototypeOf(TextSegment.prototype), 'copy', this).call(this, textSegment);

      this.text = textSegment.text;
      this.duration = textSegment.duration;
      this.font = textSegment.font;
      this.fontSize = textSegment.fontSize;
      this.textAlignment = textSegment.textAlignment;
      this.color = textSegment.color;
      this.top = textSegment.top;
      this.left = textSegment.left;
      this.maxWidth = textSegment.maxWidth;
      this.z = textSegment.z;
      this.opacity = textSegment.opacity;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new TextSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setText',
    value: function setText(text) {
      this.text = text;
      return this;
    }
  }, {
    key: 'setDuration',
    value: function setDuration(duration) {
      this.duration = duration;
      return this;
    }
  }, {
    key: 'setFont',
    value: function setFont(font) {
      this.font = font;
      return this;
    }
  }, {
    key: 'setFontSize',
    value: function setFontSize(fontSize) {
      this.fontSize = fontSize;
      return this;
    }
  }, {
    key: 'setTextAlignment',
    value: function setTextAlignment(textAlignment) {
      this.textAlignment = textAlignment;
      return this;
    }
  }, {
    key: 'setColor',
    value: function setColor(color) {
      this.color = color;
      return this;
    }
  }, {
    key: 'setTop',
    value: function setTop(top) {
      this.top = top;
      return this;
    }
  }, {
    key: 'setLeft',
    value: function setLeft(left) {
      this.left = left;
      return this;
    }
  }, {
    key: 'setMaxWidth',
    value: function setMaxWidth(maxWidth) {
      this.maxWidth = maxWidth;
      return this;
    }

    // Generators

  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.duration;
    }
  }]);

  return TextSegment;
}(Segment);
},{"./segment":16}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisualSegment = require('./visual-segment');
var AudioSegment = require('./audio-segment');

module.exports = function (_VisualSegment) {
  _inherits(VideoSegment, _VisualSegment);

  function VideoSegment(options) {
    _classCallCheck(this, VideoSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VideoSegment).call(this, options));

    _this.segmentType = 'video';

    _this.audioFadeDuration = options.audioFadeDuration || 0;
    _this.videoFadeDuration = options.videoFadeDuration || 0;

    _this.audioHandleMedia = options.audioHandleMedia;
    _this.audioHandleSegmentOptions = options.audioHandleSegmentOptions || {};
    _this.audioHandleFadeDuration = options.audioHandleFadeDuration || 0.25;
    _this.audioHandleStartTimeOffset = options.audioHandleStartTimeOffset || 0.0;

    if (_this.audioHandleMedia) {
      _this.volume = 0;
    } else if (options.volume && !isNaN(parseFloat(options.volume))) {
      _this.volume = options.volume;
    } else {
      _this.volume = 1.0;
    }
    return _this;
  }

  _createClass(VideoSegment, [{
    key: 'copy',
    value: function copy(videoSegment) {
      _get(Object.getPrototypeOf(VideoSegment.prototype), 'copy', this).call(this, videoSegment);

      this.audioFadeDuration = videoSegment.audioFadeDuration;
      this.videoFadeDuration = videoSegment.videoFadeDuration;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new VideoSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setAudioFadeDuration',
    value: function setAudioFadeDuration(audioFadeDuration) {
      this.audioFadeDuration = audioFadeDuration;
      return this;
    }
  }, {
    key: 'setVideoFadeDuration',
    value: function setVideoFadeDuration(videoFadeDuration) {
      this.videoFadeDuration = videoFadeDuration;
      return this;
    }
  }, {
    key: 'setAudioHandleMedia',
    value: function setAudioHandleMedia(audioHandleMedia) {
      this.audioHandleMedia = audioHandleMedia;
      this.setVolume(0);
      return this;
    }
  }, {
    key: 'setAudioHandleFadeDuration',
    value: function setAudioHandleFadeDuration(audioHandleFadeDuration) {
      this.audioHandleFadeDuration = audioHandleFadeDuration;
      return this;
    }
  }, {
    key: 'setAudioHandleStartTimeOffset',
    value: function setAudioHandleStartTimeOffset(audioHandleStartTimeOffset) {
      this.audioHandleStartTimeOffset = audioHandleStartTimeOffset;
      return this;
    }
  }, {
    key: 'setVolume',
    value: function setVolume(volume) {
      this.volume = volume;

      this.notifyChangeHandlers('volume', volume);

      return this;
    }

    // Generators

  }, {
    key: 'simpleName',
    value: function simpleName() {
      return 'video - ' + this.filename;
    }
  }, {
    key: 'associatedSegments',
    value: function associatedSegments() {
      if (!this.audioHandleMedia) {
        return null;
      }

      var audioHandleOptions = this.audioHandleSegmentOptions;
      for (var key in this.audioHandleMedia) {
        if (this.audioHandleMedia.hasOwnProperty(key)) {
          audioHandleOptions[key] = this.audioHandleMedia[key];
        }
      }

      var audioHandleSegment = new AudioSegment(audioHandleOptions);

      audioHandleSegment.setStartTime(this.startTime + this.audioHandleStartTimeOffset).setDuration(this.getDuration() + this.audioHandleFadeDuration * 2).setFadeDuration(this.audioHandleFadeDuration).setPlaybackRate(this.playbackRate).setLoop(this.loop);

      return [{
        segment: audioHandleSegment,
        offset: -this.audioHandleFadeDuration
      }];
    }
  }]);

  return VideoSegment;
}(VisualSegment);
},{"./audio-segment":11,"./visual-segment":22}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaSegment = require('./media-segment');

/// abstract superclass for Video, Color, Image
/// Dynamic properties on web: opacity
module.exports = function (_MediaSegment) {
  _inherits(VisualSegment, _MediaSegment);

  function VisualSegment(options) {
    _classCallCheck(this, VisualSegment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VisualSegment).call(this, options));

    _this.segmentType = 'visual';

    _this.z = options.z || 0;
    _this.opacity = options.opacity || 1.0;
    _this.width = options.width;
    _this.top = options.top;
    _this.left = options.left;
    return _this;
  }

  _createClass(VisualSegment, [{
    key: 'copy',
    value: function copy(visualSegment) {
      _get(Object.getPrototypeOf(VisualSegment.prototype), 'copy', this).call(this, visualSegment);

      this.z = visualSegment.z;
      this.opacity = visualSegment.opacity;
      this.width = visualSegment.width;
      this.left = visualSegment.left;
      this.top = visualSegment.top;

      return this;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new VisualSegment({}).copy(this);
    }

    // Chaining Configuration

  }, {
    key: 'setOpacity',
    value: function setOpacity(opacity) {
      this.opacity = opacity;
      this.notifyChangeHandlers('opacity', opacity);
      return this;
    }
  }, {
    key: 'setLeft',
    value: function setLeft(left) {
      this.left = left;
      this.notifyChangeHandlers('left', left);
      return this;
    }
  }, {
    key: 'setTop',
    value: function setTop(top) {
      this.top = top;
      this.notifyChangeHandlers('top', top);
      return this;
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.width = width;
      this.notifyChangeHandlers('width', width);
      return this;
    }
  }, {
    key: 'setZ',
    value: function setZ(z) {
      this.z = z;
      this.notifyChangeHandlers('z', z);
      return this;
    }
  }]);

  return VisualSegment;
}(MediaSegment);
},{"./media-segment":15}],23:[function(require,module,exports){
'use strict';

var frampton = require('./frampton');

frampton.WebRenderer = require('./renderer/web-renderer');

module.exports = frampton;
},{"./frampton":6,"./renderer/web-renderer":10}],24:[function(require,module,exports){
/**
 * Natural Compare
 * https://github.com/woollybogger/string-natural-compare
 *
 * @version 1.1.1
 * @copyright 2015 Nathan Woltman
 * @license MIT https://github.com/woollybogger/string-natural-compare/blob/master/LICENSE.txt
 */

(function() {
  'use strict';

  var alphabet;
  var alphabetIndexMap;
  var alphabetIndexMapLength = 0;

  function isNumberCode(code) {
    return code >= 48 && code <= 57;
  }

  function naturalCompare(a, b) {
    var lengthA = (a += '').length;
    var lengthB = (b += '').length;
    var aIndex = 0;
    var bIndex = 0;
    var alphabetIndexA;
    var alphabetIndexB;

    while (aIndex < lengthA && bIndex < lengthB) {
      var charCodeA = a.charCodeAt(aIndex);
      var charCodeB = b.charCodeAt(bIndex);

      if (isNumberCode(charCodeA)) {
        if (!isNumberCode(charCodeB)) {
          return charCodeA - charCodeB;
        }

        var numStartA = aIndex;
        var numStartB = bIndex;

        while (charCodeA === 48 && ++numStartA < lengthA) {
          charCodeA = a.charCodeAt(numStartA);
        }
        while (charCodeB === 48 && ++numStartB < lengthB) {
          charCodeB = b.charCodeAt(numStartB);
        }

        var numEndA = numStartA;
        var numEndB = numStartB;

        while (numEndA < lengthA && isNumberCode(a.charCodeAt(numEndA))) {
          ++numEndA;
        }
        while (numEndB < lengthB && isNumberCode(b.charCodeAt(numEndB))) {
          ++numEndB;
        }

        var numLengthA = numEndA - numStartA;
        var numLengthB = numEndB - numStartB;

        if (numLengthA < numLengthB) {
          return -1;
        }
        if (numLengthA > numLengthB) {
          return 1;
        }

        if (numLengthA) {
          var numA = a.slice(numStartA, numEndA);
          var numB = b.slice(numStartB, numEndB);

          if (numA < numB) {
            return -1;
          }
          if (numA > numB) {
            return 1;
          }
        }

        aIndex = numEndA;
        bIndex = numEndB;
        continue;
      }

      if (charCodeA !== charCodeB) {
        if (
          alphabetIndexMapLength &&
          charCodeA < alphabetIndexMapLength &&
          charCodeB < alphabetIndexMapLength &&
          (alphabetIndexA = alphabetIndexMap[charCodeA]) !== -1 &&
          (alphabetIndexB = alphabetIndexMap[charCodeB]) !== -1
        ) {
          return alphabetIndexA - alphabetIndexB;
        }

        return charCodeA - charCodeB;
      }

      ++aIndex;
      ++bIndex;
    }

    return lengthA - lengthB;
  }

  Object.defineProperties(String, {
    alphabet: {
      get: function() {
        return alphabet;
      },
      set: function(value) {
        alphabet = value;
        alphabetIndexMap = [];
        var i = 0;
        if (alphabet) {
          for (; i < alphabet.length; i++) {
            alphabetIndexMap[alphabet.charCodeAt(i)] = i;
          }
        }
        alphabetIndexMapLength = alphabetIndexMap.length;
        for (i = 0; i < alphabetIndexMapLength; i++) {
          if (i in alphabetIndexMap) continue;
          alphabetIndexMap[i] = -1;
        }
      },
    },
    naturalCompare: {
      value: naturalCompare,
      configurable: true,
      writable: true,
    },
    naturalCaseCompare: {
      value: function(a, b) {
        return naturalCompare(('' + a).toLowerCase(), ('' + b).toLowerCase());
      },
      configurable: true,
      writable: true,
    },
  });

})();

},{}],25:[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Include a performance.now polyfill
(function () {

	if ('performance' in window === false) {
		window.performance = {};
	}

	// IE 8
	Date.now = (Date.now || function () {
		return new Date().getTime();
	});

	if ('now' in window.performance === false) {
		var offset = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart
		                                                                                    : Date.now();

		window.performance.now = function () {
			return Date.now() - offset;
		};
	}

})();

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : window.performance.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time)) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();

TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for (var field in object) {
		_valuesStart[field] = parseFloat(object[field], 10);
	}

	this.to = function (properties, duration) {

		if (duration !== undefined) {
			_duration = duration;
		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : window.performance.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object);
			}

			_onStartCallbackFired = true;

		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.startsWith('+') || end.startsWith('-')) {
						end = start + parseFloat(end, 10);
					} else {
						end = parseFloat(end, 10);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if (_onCompleteCallback !== null) {
					_onCompleteCallback.call(_object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));

		},

		Out: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);

		},

		InOut: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			if ((k *= 2) < 1) {
				return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			}

			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof define === 'function' && define.amd) {

		// AMD
		define([], function () {
			return TWEEN;
		});

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

},{}],26:[function(require,module,exports){

var frampton = require('./node_modules/frampton/dist/web-frampton');
var mediaConfig = require('./media_config.json');
var song = require('./song.json');

var finder = new frampton.MediaFinder(mediaConfig);
var initialDelay = 2000;
var renderer = new frampton.WebRenderer({
  mediaConfig: mediaConfig
});

song.tracks.forEach(function(track, trackIndex) {
  track.forEach(function(el, elIndex) {
    trackIndex = Math.floor(Math.random() * 8);
    var video = getVideo(el, trackIndex);
    var segment = new frampton.VideoSegment(video);
    segment
      .setWidth('33%')
      .setDuration(el.duration / 1000);

    if (trackIndex <= 2) {
      segment.setTop('0%');
    } else if (trackIndex <= 5) {
      segment.setTop('33%');
    } else {
      segment.setTop('67%');
    }

    if (trackIndex % 3 === 0) {
      segment.setLeft('0%');
    } else if (trackIndex % 3 === 1) {
      segment.setLeft('33%');
    } else {
      segment.setLeft('67%');
    }

    renderer.scheduleSegmentRender(segment, initialDelay + el.time);
  });
});

function getVideo(el, trackIndex) {
  var videoIndex = trackIndex + 1;
  var videoName = videoIndex + '.mp4';
  return finder.findVideoWithPatern(videoName);
}

},{"./media_config.json":1,"./node_modules/frampton/dist/web-frampton":23,"./song.json":27}],27:[function(require,module,exports){
module.exports={"tracks":[[{"time":0,"duration":119.79166666666667,"noteNumber":42,"velocity":31,"programNumber":1},{"time":119.79166666666667,"duration":125.00000000000001,"noteNumber":42,"velocity":84,"programNumber":1},{"time":244.79166666666669,"duration":62.5,"noteNumber":38,"velocity":51,"programNumber":1},{"time":244.79166666666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":369.7916666666667,"duration":114.58333333333331,"noteNumber":36,"velocity":7,"programNumber":1},{"time":369.7916666666667,"duration":125,"noteNumber":42,"velocity":77,"programNumber":1},{"time":494.7916666666667,"duration":125.00000000000006,"noteNumber":42,"velocity":70,"programNumber":1},{"time":619.7916666666667,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":744.7916666666667,"duration":109.375,"noteNumber":36,"velocity":7,"programNumber":1},{"time":744.7916666666667,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":869.7916666666667,"duration":67.70833333333337,"noteNumber":38,"velocity":36,"programNumber":1},{"time":869.7916666666667,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":994.7916666666667,"duration":62.5,"noteNumber":38,"velocity":83,"programNumber":1},{"time":994.7916666666667,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":1119.7916666666667,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":1244.7916666666667,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":1369.7916666666667,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":1494.7916666666667,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":1619.7916666666667,"duration":62.5,"noteNumber":38,"velocity":82,"programNumber":1},{"time":1619.7916666666667,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":1744.7916666666667,"duration":109.375,"noteNumber":36,"velocity":6,"programNumber":1},{"time":1744.7916666666667,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":1869.7916666666667,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":1994.7916666666667,"duration":125.00000000000023,"noteNumber":42,"velocity":57,"programNumber":1},{"time":2119.791666666667,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":2244.791666666667,"duration":62.5,"noteNumber":38,"velocity":53,"programNumber":1},{"time":2244.791666666667,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":2369.791666666667,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":2494.791666666667,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":2619.791666666667,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":2744.791666666667,"duration":119.79166666666652,"noteNumber":36,"velocity":8,"programNumber":1},{"time":2744.791666666667,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":2869.791666666667,"duration":67.70833333333348,"noteNumber":38,"velocity":36,"programNumber":1},{"time":2869.791666666667,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":2994.791666666667,"duration":62.5,"noteNumber":38,"velocity":82,"programNumber":1},{"time":2994.791666666667,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":3119.791666666667,"duration":114.58333333333348,"noteNumber":36,"velocity":7,"programNumber":1},{"time":3119.791666666667,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":3244.791666666667,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":3369.791666666667,"duration":114.58333333333348,"noteNumber":36,"velocity":6,"programNumber":1},{"time":3369.791666666667,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":3494.791666666667,"duration":62.5,"noteNumber":38,"velocity":43,"programNumber":1},{"time":3494.791666666667,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":3619.791666666667,"duration":62.5,"noteNumber":38,"velocity":92,"programNumber":1},{"time":3619.791666666667,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":3744.791666666667,"duration":114.58333333333348,"noteNumber":36,"velocity":8,"programNumber":1},{"time":3744.791666666667,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":3869.791666666667,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":3994.791666666667,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":4119.791666666667,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":4244.791666666667,"duration":62.5,"noteNumber":38,"velocity":51,"programNumber":1},{"time":4244.791666666667,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":4369.791666666667,"duration":125,"noteNumber":42,"velocity":88,"programNumber":1},{"time":4494.791666666667,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":4619.791666666667,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":4744.791666666667,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":4869.791666666667,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":4994.791666666667,"duration":125,"noteNumber":42,"velocity":59,"programNumber":1},{"time":5119.791666666667,"duration":119.79166666666697,"noteNumber":36,"velocity":7,"programNumber":1},{"time":5119.791666666667,"duration":125,"noteNumber":42,"velocity":79,"programNumber":1},{"time":5244.791666666667,"duration":62.5,"noteNumber":38,"velocity":58,"programNumber":1},{"time":5244.791666666667,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":5369.791666666667,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":5494.791666666667,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":5619.791666666667,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":5744.791666666667,"duration":114.58333333333303,"noteNumber":36,"velocity":10,"programNumber":1},{"time":5744.791666666667,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":5869.791666666667,"duration":62.5,"noteNumber":38,"velocity":48,"programNumber":1},{"time":5869.791666666667,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":5994.791666666667,"duration":62.5,"noteNumber":38,"velocity":90,"programNumber":1},{"time":5994.791666666667,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":6119.791666666667,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":6244.791666666667,"duration":62.5,"noteNumber":38,"velocity":53,"programNumber":1},{"time":6244.791666666667,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":6369.791666666667,"duration":114.58333333333303,"noteNumber":36,"velocity":8,"programNumber":1},{"time":6369.791666666667,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":6494.791666666667,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":6619.791666666667,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":6744.791666666667,"duration":114.58333333333303,"noteNumber":36,"velocity":7,"programNumber":1},{"time":6744.791666666667,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":6869.791666666667,"duration":67.70833333333303,"noteNumber":38,"velocity":37,"programNumber":1},{"time":6869.791666666667,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":6994.791666666667,"duration":62.5,"noteNumber":38,"velocity":83,"programNumber":1},{"time":6994.791666666667,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":7119.791666666667,"duration":114.58333333333303,"noteNumber":36,"velocity":8,"programNumber":1},{"time":7119.791666666667,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":7244.791666666667,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":7369.791666666667,"duration":98.95833333333303,"noteNumber":36,"velocity":6,"programNumber":1},{"time":7369.791666666667,"duration":125,"noteNumber":42,"velocity":86,"programNumber":1},{"time":7494.791666666667,"duration":62.5,"noteNumber":38,"velocity":44,"programNumber":1},{"time":7494.791666666667,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":7619.791666666667,"duration":62.5,"noteNumber":38,"velocity":88,"programNumber":1},{"time":7619.791666666667,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":7744.791666666667,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":7869.791666666667,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":7994.791666666667,"duration":125,"noteNumber":42,"velocity":59,"programNumber":1},{"time":8119.791666666667,"duration":114.58333333333303,"noteNumber":36,"velocity":6,"programNumber":1},{"time":8119.791666666667,"duration":124.99999999999909,"noteNumber":42,"velocity":83,"programNumber":1},{"time":8244.791666666666,"duration":62.5,"noteNumber":38,"velocity":51,"programNumber":1},{"time":8244.791666666666,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":8369.791666666666,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":8494.791666666666,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":8619.791666666666,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":8744.791666666666,"duration":119.79166666666606,"noteNumber":36,"velocity":6,"programNumber":1},{"time":8744.791666666666,"duration":125,"noteNumber":42,"velocity":77,"programNumber":1},{"time":8869.791666666666,"duration":67.70833333333394,"noteNumber":38,"velocity":35,"programNumber":1},{"time":8869.791666666666,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":8994.791666666666,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":8994.791666666666,"duration":166.66666666666606,"noteNumber":38,"velocity":79,"programNumber":1},{"time":9119.791666666666,"duration":119.79166666666606,"noteNumber":36,"velocity":9,"programNumber":1},{"time":9119.791666666666,"duration":125,"noteNumber":42,"velocity":79,"programNumber":1},{"time":9244.791666666666,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":9369.791666666666,"duration":109.375,"noteNumber":36,"velocity":6,"programNumber":1},{"time":9369.791666666666,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":9494.791666666666,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":9619.791666666666,"duration":62.5,"noteNumber":38,"velocity":90,"programNumber":1},{"time":9619.791666666666,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":9744.791666666666,"duration":114.58333333333394,"noteNumber":36,"velocity":9,"programNumber":1},{"time":9744.791666666666,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":9869.791666666666,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":9994.791666666666,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":10119.791666666666,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":10244.791666666666,"duration":62.5,"noteNumber":38,"velocity":53,"programNumber":1},{"time":10244.791666666666,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":10369.791666666666,"duration":114.58333333333394,"noteNumber":36,"velocity":6,"programNumber":1},{"time":10369.791666666666,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":10494.791666666666,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":10619.791666666666,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":10744.791666666666,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":10869.791666666666,"duration":67.70833333333394,"noteNumber":38,"velocity":37,"programNumber":1},{"time":10869.791666666666,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":10994.791666666666,"duration":62.5,"noteNumber":38,"velocity":81,"programNumber":1},{"time":10994.791666666666,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":11119.791666666666,"duration":119.79166666666606,"noteNumber":36,"velocity":6,"programNumber":1},{"time":11119.791666666666,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":11244.791666666666,"duration":93.75,"noteNumber":42,"velocity":70,"programNumber":1},{"time":11369.791666666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":11494.791666666666,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":11619.791666666666,"duration":62.5,"noteNumber":38,"velocity":77,"programNumber":1},{"time":11619.791666666666,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":11744.791666666666,"duration":114.58333333333394,"noteNumber":36,"velocity":8,"programNumber":1},{"time":11744.791666666666,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":11869.791666666666,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":11994.791666666666,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":12119.791666666666,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":12244.791666666666,"duration":67.70833333333394,"noteNumber":38,"velocity":44,"programNumber":1},{"time":12244.791666666666,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":12369.791666666666,"duration":109.375,"noteNumber":36,"velocity":7,"programNumber":1},{"time":12369.791666666666,"duration":125,"noteNumber":42,"velocity":76,"programNumber":1},{"time":12494.791666666666,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":12619.791666666666,"duration":125,"noteNumber":42,"velocity":51,"programNumber":1},{"time":12744.791666666666,"duration":114.58333333333394,"noteNumber":36,"velocity":10,"programNumber":1},{"time":12744.791666666666,"duration":125,"noteNumber":42,"velocity":76,"programNumber":1},{"time":12869.791666666666,"duration":62.5,"noteNumber":38,"velocity":50,"programNumber":1},{"time":12869.791666666666,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":12994.791666666666,"duration":125,"noteNumber":42,"velocity":51,"programNumber":1},{"time":13119.791666666666,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":13244.791666666666,"duration":125,"noteNumber":42,"velocity":63,"programNumber":1},{"time":13369.791666666666,"duration":98.95833333333394,"noteNumber":36,"velocity":6,"programNumber":1},{"time":13369.791666666666,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":13494.791666666666,"duration":62.5,"noteNumber":38,"velocity":34,"programNumber":1},{"time":13494.791666666666,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":13619.791666666666,"duration":62.5,"noteNumber":38,"velocity":77,"programNumber":1},{"time":13619.791666666666,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":13744.791666666666,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":13869.791666666666,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":13994.791666666666,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":14119.791666666666,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":14244.791666666666,"duration":62.5,"noteNumber":38,"velocity":46,"programNumber":1},{"time":14244.791666666666,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":14369.791666666666,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":14494.791666666666,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":14619.791666666666,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":14744.791666666666,"duration":114.58333333333394,"noteNumber":36,"velocity":7,"programNumber":1},{"time":14744.791666666666,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":14869.791666666666,"duration":62.5,"noteNumber":38,"velocity":49,"programNumber":1},{"time":14869.791666666666,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":14994.791666666666,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":15119.791666666666,"duration":119.79166666666606,"noteNumber":36,"velocity":7,"programNumber":1},{"time":15119.791666666666,"duration":125,"noteNumber":42,"velocity":77,"programNumber":1},{"time":15244.791666666666,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":15369.791666666666,"duration":114.58333333333394,"noteNumber":36,"velocity":6,"programNumber":1},{"time":15369.791666666666,"duration":125,"noteNumber":42,"velocity":85,"programNumber":1},{"time":15494.791666666666,"duration":62.5,"noteNumber":38,"velocity":34,"programNumber":1},{"time":15494.791666666666,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":15619.791666666666,"duration":62.5,"noteNumber":38,"velocity":84,"programNumber":1},{"time":15619.791666666666,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":15744.791666666666,"duration":114.58333333333394,"noteNumber":36,"velocity":8,"programNumber":1},{"time":15744.791666666666,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":15869.791666666666,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":15994.791666666666,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":16119.791666666666,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":16244.791666666666,"duration":62.5,"noteNumber":38,"velocity":46,"programNumber":1},{"time":16244.791666666666,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":16369.791666666666,"duration":109.37499999999818,"noteNumber":36,"velocity":6,"programNumber":1},{"time":16369.791666666666,"duration":124.99999999999818,"noteNumber":42,"velocity":83,"programNumber":1},{"time":16494.791666666664,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":16619.791666666664,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":16744.791666666664,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":16869.791666666664,"duration":62.5,"noteNumber":38,"velocity":53,"programNumber":1},{"time":16869.791666666664,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":16994.791666666664,"duration":62.5,"noteNumber":38,"velocity":92,"programNumber":1},{"time":16994.791666666664,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":17119.791666666664,"duration":114.58333333333212,"noteNumber":36,"velocity":8,"programNumber":1},{"time":17119.791666666664,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":17244.791666666664,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":17369.791666666664,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":17494.791666666664,"duration":62.5,"noteNumber":38,"velocity":36,"programNumber":1},{"time":17494.791666666664,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":17619.791666666664,"duration":62.5,"noteNumber":38,"velocity":78,"programNumber":1},{"time":17619.791666666664,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":17744.791666666664,"duration":119.79166666666788,"noteNumber":36,"velocity":6,"programNumber":1},{"time":17744.791666666664,"duration":125,"noteNumber":42,"velocity":76,"programNumber":1},{"time":17869.791666666664,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":17994.791666666664,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":18119.791666666664,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":18244.791666666664,"duration":67.70833333333212,"noteNumber":38,"velocity":46,"programNumber":1},{"time":18244.791666666664,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":18369.791666666664,"duration":93.75,"noteNumber":36,"velocity":6,"programNumber":1},{"time":18369.791666666664,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":18494.791666666664,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":18619.791666666664,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":18744.791666666664,"duration":119.79166666666788,"noteNumber":36,"velocity":6,"programNumber":1},{"time":18744.791666666664,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":18869.791666666664,"duration":62.5,"noteNumber":38,"velocity":52,"programNumber":1},{"time":18869.791666666664,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":18994.791666666664,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":19119.791666666664,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":19244.791666666664,"duration":62.5,"noteNumber":38,"velocity":55,"programNumber":1},{"time":19244.791666666664,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":19369.791666666664,"duration":119.79166666666788,"noteNumber":36,"velocity":7,"programNumber":1},{"time":19369.791666666664,"duration":125,"noteNumber":42,"velocity":86,"programNumber":1},{"time":19494.791666666664,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":19619.791666666664,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":19744.791666666664,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":19869.791666666664,"duration":67.70833333333212,"noteNumber":38,"velocity":43,"programNumber":1},{"time":19869.791666666664,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":19994.791666666664,"duration":62.5,"noteNumber":38,"velocity":88,"programNumber":1},{"time":19994.791666666664,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":20119.791666666664,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":20244.791666666664,"duration":62.5,"noteNumber":38,"velocity":47,"programNumber":1},{"time":20244.791666666664,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":20369.791666666664,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":20494.791666666664,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":20619.791666666664,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":20744.791666666664,"duration":109.375,"noteNumber":36,"velocity":6,"programNumber":1},{"time":20744.791666666664,"duration":125,"noteNumber":42,"velocity":76,"programNumber":1},{"time":20869.791666666664,"duration":62.5,"noteNumber":38,"velocity":52,"programNumber":1},{"time":20869.791666666664,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":20994.791666666664,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":21119.791666666664,"duration":119.79166666666788,"noteNumber":36,"velocity":8,"programNumber":1},{"time":21119.791666666664,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":21244.791666666664,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":21369.791666666664,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":21494.791666666664,"duration":62.5,"noteNumber":38,"velocity":35,"programNumber":1},{"time":21494.791666666664,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":21619.791666666664,"duration":62.5,"noteNumber":38,"velocity":84,"programNumber":1},{"time":21619.791666666664,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":21744.791666666664,"duration":119.79166666666788,"noteNumber":36,"velocity":9,"programNumber":1},{"time":21744.791666666664,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":21869.791666666664,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":21994.791666666664,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":22119.791666666664,"duration":125,"noteNumber":42,"velocity":86,"programNumber":1},{"time":22244.791666666664,"duration":67.70833333333212,"noteNumber":38,"velocity":47,"programNumber":1},{"time":22244.791666666664,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":22369.791666666664,"duration":114.58333333333212,"noteNumber":36,"velocity":6,"programNumber":1},{"time":22369.791666666664,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":22494.791666666664,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":22619.791666666664,"duration":88.54166666666788,"noteNumber":42,"velocity":56,"programNumber":1},{"time":22744.791666666664,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":22869.791666666664,"duration":67.70833333333212,"noteNumber":38,"velocity":49,"programNumber":1},{"time":22869.791666666664,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":22994.791666666664,"duration":62.5,"noteNumber":38,"velocity":102,"programNumber":1},{"time":22994.791666666664,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":23119.791666666664,"duration":88.54166666666788,"noteNumber":36,"velocity":4,"programNumber":1},{"time":23119.791666666664,"duration":125,"noteNumber":42,"velocity":85,"programNumber":1},{"time":23244.791666666664,"duration":125,"noteNumber":42,"velocity":77,"programNumber":1},{"time":23369.791666666664,"duration":114.58333333333212,"noteNumber":36,"velocity":4,"programNumber":1},{"time":23369.791666666664,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":23494.791666666664,"duration":62.5,"noteNumber":38,"velocity":53,"programNumber":1},{"time":23494.791666666664,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":23619.791666666664,"duration":62.5,"noteNumber":38,"velocity":107,"programNumber":1},{"time":23619.791666666664,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":23744.791666666664,"duration":114.58333333333212,"noteNumber":36,"velocity":4,"programNumber":1},{"time":23744.791666666664,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":23869.791666666664,"duration":125,"noteNumber":42,"velocity":79,"programNumber":1},{"time":23994.791666666664,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":23994.791666666664,"duration":145.83333333333212,"noteNumber":38,"velocity":43,"programNumber":1},{"time":24119.791666666664,"duration":114.58333333333212,"noteNumber":36,"velocity":4,"programNumber":1},{"time":24119.791666666664,"duration":250,"noteNumber":42,"velocity":98,"programNumber":1},{"time":24369.791666666664,"duration":250,"noteNumber":42,"velocity":89,"programNumber":1},{"time":24619.791666666664,"duration":67.70833333333212,"noteNumber":38,"velocity":66,"programNumber":1},{"time":24619.791666666664,"duration":250,"noteNumber":42,"velocity":62,"programNumber":1},{"time":24869.791666666664,"duration":67.70833333333212,"noteNumber":38,"velocity":49,"programNumber":1},{"time":24869.791666666664,"duration":250,"noteNumber":42,"velocity":77,"programNumber":1},{"time":25119.791666666664,"duration":114.58333333333212,"noteNumber":36,"velocity":4,"programNumber":1},{"time":25119.791666666664,"duration":125,"noteNumber":42,"velocity":95,"programNumber":1},{"time":25244.791666666664,"duration":125,"noteNumber":42,"velocity":77,"programNumber":1},{"time":25369.791666666664,"duration":114.58333333333212,"noteNumber":36,"velocity":6,"programNumber":1},{"time":25369.791666666664,"duration":125,"noteNumber":42,"velocity":96,"programNumber":1},{"time":25494.791666666664,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":25619.791666666664,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":25619.791666666664,"duration":135.41666666666788,"noteNumber":38,"velocity":46,"programNumber":1},{"time":25744.791666666664,"duration":114.58333333333576,"noteNumber":36,"velocity":4,"programNumber":1},{"time":25744.791666666664,"duration":125.00000000000364,"noteNumber":42,"velocity":92,"programNumber":1},{"time":25869.791666666668,"duration":62.5,"noteNumber":38,"velocity":59,"programNumber":1},{"time":25869.791666666668,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":25994.791666666668,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":26119.791666666668,"duration":250,"noteNumber":42,"velocity":97,"programNumber":1},{"time":26369.791666666668,"duration":125,"noteNumber":36,"velocity":4,"programNumber":1},{"time":26369.791666666668,"duration":250,"noteNumber":42,"velocity":84,"programNumber":1},{"time":26619.791666666668,"duration":67.70833333333212,"noteNumber":38,"velocity":61,"programNumber":1},{"time":26619.791666666668,"duration":250,"noteNumber":42,"velocity":63,"programNumber":1},{"time":26869.791666666668,"duration":67.70833333333212,"noteNumber":38,"velocity":49,"programNumber":1},{"time":26869.791666666668,"duration":250,"noteNumber":42,"velocity":78,"programNumber":1},{"time":27119.791666666668,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":27119.791666666668,"duration":125,"noteNumber":36,"velocity":4,"programNumber":1},{"time":27244.791666666668,"duration":125,"noteNumber":42,"velocity":77,"programNumber":1},{"time":27369.791666666668,"duration":125,"noteNumber":42,"velocity":90,"programNumber":1},{"time":27494.791666666668,"duration":125,"noteNumber":42,"velocity":76,"programNumber":1},{"time":27619.791666666668,"duration":72.91666666666788,"noteNumber":38,"velocity":47,"programNumber":1},{"time":27619.791666666668,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":27744.791666666668,"duration":119.79166666666788,"noteNumber":36,"velocity":5,"programNumber":1},{"time":27744.791666666668,"duration":125,"noteNumber":42,"velocity":91,"programNumber":1},{"time":27869.791666666668,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":27994.791666666668,"duration":125,"noteNumber":42,"velocity":59,"programNumber":1},{"time":28119.791666666668,"duration":250,"noteNumber":42,"velocity":96,"programNumber":1},{"time":28369.791666666668,"duration":135.41666666666788,"noteNumber":36,"velocity":5,"programNumber":1},{"time":28369.791666666668,"duration":250,"noteNumber":42,"velocity":95,"programNumber":1},{"time":28619.791666666668,"duration":67.70833333333212,"noteNumber":38,"velocity":63,"programNumber":1},{"time":28619.791666666668,"duration":250,"noteNumber":42,"velocity":61,"programNumber":1},{"time":28869.791666666668,"duration":67.70833333333212,"noteNumber":38,"velocity":50,"programNumber":1},{"time":28869.791666666668,"duration":250,"noteNumber":42,"velocity":75,"programNumber":1},{"time":29119.791666666668,"duration":62.5,"noteNumber":38,"velocity":42,"programNumber":1},{"time":29119.791666666668,"duration":109.375,"noteNumber":36,"velocity":5,"programNumber":1},{"time":29119.791666666668,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":29244.791666666668,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":29369.791666666668,"duration":98.95833333333212,"noteNumber":36,"velocity":4,"programNumber":1},{"time":29369.791666666668,"duration":125,"noteNumber":42,"velocity":94,"programNumber":1},{"time":29494.791666666668,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":29619.791666666668,"duration":62.5,"noteNumber":38,"velocity":107,"programNumber":1},{"time":29619.791666666668,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":29744.791666666668,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":29869.791666666668,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":29994.791666666668,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":29994.791666666668,"duration":145.83333333333212,"noteNumber":38,"velocity":39,"programNumber":1},{"time":30119.791666666668,"duration":250,"noteNumber":42,"velocity":93,"programNumber":1},{"time":30369.791666666668,"duration":250,"noteNumber":42,"velocity":102,"programNumber":1},{"time":30619.791666666668,"duration":114.58333333333212,"noteNumber":38,"velocity":63,"programNumber":1},{"time":30619.791666666668,"duration":250,"noteNumber":42,"velocity":78,"programNumber":1},{"time":30869.791666666668,"duration":67.70833333333212,"noteNumber":38,"velocity":51,"programNumber":1},{"time":30869.791666666668,"duration":250,"noteNumber":42,"velocity":70,"programNumber":1},{"time":31119.791666666668,"duration":119.79166666666788,"noteNumber":36,"velocity":4,"programNumber":1},{"time":31119.791666666668,"duration":125,"noteNumber":42,"velocity":88,"programNumber":1},{"time":31244.791666666668,"duration":125,"noteNumber":42,"velocity":79,"programNumber":1},{"time":31369.791666666668,"duration":114.58333333333212,"noteNumber":36,"velocity":5,"programNumber":1},{"time":31369.791666666668,"duration":125,"noteNumber":42,"velocity":89,"programNumber":1},{"time":31494.791666666668,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":31619.791666666668,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":31619.791666666668,"duration":171.875,"noteNumber":38,"velocity":45,"programNumber":1},{"time":31744.791666666668,"duration":119.79166666666788,"noteNumber":36,"velocity":6,"programNumber":1},{"time":31744.791666666668,"duration":125,"noteNumber":42,"velocity":85,"programNumber":1},{"time":31869.791666666668,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":31994.791666666668,"duration":125,"noteNumber":42,"velocity":59,"programNumber":1},{"time":31994.791666666668,"duration":161.45833333333212,"noteNumber":38,"velocity":99,"programNumber":1},{"time":32119.791666666668,"duration":135.41666666666424,"noteNumber":42,"velocity":96,"programNumber":1},{"time":32255.208333333332,"duration":114.58333333333212,"noteNumber":42,"velocity":3,"programNumber":1},{"time":32369.791666666664,"duration":250,"noteNumber":42,"velocity":96,"programNumber":1},{"time":32619.791666666664,"duration":67.70833333333212,"noteNumber":38,"velocity":67,"programNumber":1},{"time":32619.791666666664,"duration":250,"noteNumber":42,"velocity":62,"programNumber":1},{"time":32869.791666666664,"duration":67.70833333333576,"noteNumber":38,"velocity":48,"programNumber":1},{"time":32869.791666666664,"duration":250,"noteNumber":42,"velocity":77,"programNumber":1},{"time":33119.791666666664,"duration":62.5,"noteNumber":38,"velocity":37,"programNumber":1},{"time":33119.791666666664,"duration":114.58333333333576,"noteNumber":36,"velocity":7,"programNumber":1},{"time":33119.791666666664,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":33244.791666666664,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":33369.791666666664,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":33494.791666666664,"duration":125,"noteNumber":42,"velocity":79,"programNumber":1},{"time":33619.791666666664,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":33744.791666666664,"duration":119.79166666666424,"noteNumber":36,"velocity":6,"programNumber":1},{"time":33744.791666666664,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":33869.791666666664,"duration":67.70833333333576,"noteNumber":38,"velocity":37,"programNumber":1},{"time":33869.791666666664,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":33994.791666666664,"duration":62.5,"noteNumber":38,"velocity":88,"programNumber":1},{"time":33994.791666666664,"duration":88.54166666666424,"noteNumber":42,"velocity":60,"programNumber":1},{"time":34119.791666666664,"duration":250,"noteNumber":42,"velocity":80,"programNumber":1},{"time":34369.791666666664,"duration":119.79166666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":34369.791666666664,"duration":250,"noteNumber":42,"velocity":104,"programNumber":1},{"time":34619.791666666664,"duration":114.58333333333576,"noteNumber":38,"velocity":58,"programNumber":1},{"time":34619.791666666664,"duration":250,"noteNumber":42,"velocity":67,"programNumber":1},{"time":34869.791666666664,"duration":72.91666666666424,"noteNumber":38,"velocity":48,"programNumber":1},{"time":34869.791666666664,"duration":250,"noteNumber":42,"velocity":85,"programNumber":1},{"time":35119.791666666664,"duration":78.125,"noteNumber":36,"velocity":3,"programNumber":1},{"time":35119.791666666664,"duration":125,"noteNumber":42,"velocity":89,"programNumber":1},{"time":35244.791666666664,"duration":125,"noteNumber":42,"velocity":87,"programNumber":1},{"time":35369.791666666664,"duration":125,"noteNumber":42,"velocity":108,"programNumber":1},{"time":35494.791666666664,"duration":125,"noteNumber":42,"velocity":88,"programNumber":1},{"time":35619.791666666664,"duration":62.5,"noteNumber":38,"velocity":108,"programNumber":1},{"time":35619.791666666664,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":35744.791666666664,"duration":78.125,"noteNumber":36,"velocity":3,"programNumber":1},{"time":35744.791666666664,"duration":125,"noteNumber":42,"velocity":97,"programNumber":1},{"time":35869.791666666664,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":35994.791666666664,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":36119.791666666664,"duration":250,"noteNumber":42,"velocity":114,"programNumber":1},{"time":36369.791666666664,"duration":250,"noteNumber":42,"velocity":105,"programNumber":1},{"time":36619.791666666664,"duration":72.91666666666424,"noteNumber":38,"velocity":61,"programNumber":1},{"time":36619.791666666664,"duration":250,"noteNumber":42,"velocity":65,"programNumber":1},{"time":36869.791666666664,"duration":67.70833333333576,"noteNumber":38,"velocity":45,"programNumber":1},{"time":36869.791666666664,"duration":250,"noteNumber":42,"velocity":83,"programNumber":1},{"time":37119.791666666664,"duration":119.79166666666424,"noteNumber":36,"velocity":5,"programNumber":1},{"time":37119.791666666664,"duration":125,"noteNumber":42,"velocity":111,"programNumber":1},{"time":37244.791666666664,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":37369.791666666664,"duration":114.58333333333576,"noteNumber":36,"velocity":4,"programNumber":1},{"time":37369.791666666664,"duration":125,"noteNumber":42,"velocity":100,"programNumber":1},{"time":37494.791666666664,"duration":125,"noteNumber":42,"velocity":86,"programNumber":1},{"time":37619.791666666664,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":37619.791666666664,"duration":140.625,"noteNumber":38,"velocity":63,"programNumber":1},{"time":37744.791666666664,"duration":114.58333333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":37744.791666666664,"duration":125,"noteNumber":42,"velocity":103,"programNumber":1},{"time":37869.791666666664,"duration":67.70833333333576,"noteNumber":38,"velocity":62,"programNumber":1},{"time":37869.791666666664,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":37994.791666666664,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":37994.791666666664,"duration":166.66666666666424,"noteNumber":38,"velocity":116,"programNumber":1},{"time":38119.791666666664,"duration":135.41666666666424,"noteNumber":42,"velocity":112,"programNumber":1},{"time":38255.20833333333,"duration":114.58333333333576,"noteNumber":42,"velocity":5,"programNumber":1},{"time":38369.791666666664,"duration":250,"noteNumber":42,"velocity":112,"programNumber":1},{"time":38619.791666666664,"duration":114.58333333333576,"noteNumber":38,"velocity":61,"programNumber":1},{"time":38619.791666666664,"duration":250,"noteNumber":42,"velocity":69,"programNumber":1},{"time":38869.791666666664,"duration":67.70833333333576,"noteNumber":38,"velocity":48,"programNumber":1},{"time":38869.791666666664,"duration":250,"noteNumber":42,"velocity":86,"programNumber":1},{"time":39119.791666666664,"duration":62.5,"noteNumber":38,"velocity":71,"programNumber":1},{"time":39119.791666666664,"duration":119.79166666666424,"noteNumber":36,"velocity":4,"programNumber":1},{"time":39119.791666666664,"duration":125,"noteNumber":42,"velocity":102,"programNumber":1},{"time":39244.791666666664,"duration":125,"noteNumber":42,"velocity":86,"programNumber":1},{"time":39369.791666666664,"duration":125,"noteNumber":42,"velocity":90,"programNumber":1},{"time":39494.791666666664,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":39619.791666666664,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":39744.791666666664,"duration":119.79166666666424,"noteNumber":36,"velocity":4,"programNumber":1},{"time":39744.791666666664,"duration":125,"noteNumber":42,"velocity":102,"programNumber":1},{"time":39869.791666666664,"duration":67.70833333333576,"noteNumber":38,"velocity":65,"programNumber":1},{"time":39869.791666666664,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":39994.791666666664,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":39994.791666666664,"duration":166.66666666666424,"noteNumber":38,"velocity":120,"programNumber":1},{"time":40119.791666666664,"duration":250,"noteNumber":42,"velocity":105,"programNumber":1},{"time":40369.791666666664,"duration":114.58333333333576,"noteNumber":36,"velocity":4,"programNumber":1},{"time":40369.791666666664,"duration":250,"noteNumber":42,"velocity":99,"programNumber":1},{"time":40619.791666666664,"duration":119.79166666666424,"noteNumber":38,"velocity":59,"programNumber":1},{"time":40619.791666666664,"duration":250,"noteNumber":42,"velocity":62,"programNumber":1},{"time":40869.791666666664,"duration":67.70833333333576,"noteNumber":38,"velocity":47,"programNumber":1},{"time":40869.791666666664,"duration":250,"noteNumber":42,"velocity":84,"programNumber":1},{"time":41119.791666666664,"duration":57.29166666666424,"noteNumber":38,"velocity":83,"programNumber":1},{"time":41119.791666666664,"duration":130.20833333332848,"noteNumber":36,"velocity":5,"programNumber":1},{"time":41119.791666666664,"duration":249.99999999999272,"noteNumber":42,"velocity":95,"programNumber":1},{"time":41369.79166666666,"duration":250,"noteNumber":42,"velocity":104,"programNumber":1},{"time":41619.79166666666,"duration":114.58333333333576,"noteNumber":38,"velocity":83,"programNumber":1},{"time":41619.79166666666,"duration":250,"noteNumber":42,"velocity":66,"programNumber":1},{"time":41869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":60,"programNumber":1},{"time":41869.79166666666,"duration":250,"noteNumber":42,"velocity":86,"programNumber":1},{"time":42119.79166666666,"duration":250,"noteNumber":42,"velocity":108,"programNumber":1},{"time":42369.79166666666,"duration":250,"noteNumber":42,"velocity":93,"programNumber":1},{"time":42619.79166666666,"duration":114.58333333333576,"noteNumber":38,"velocity":57,"programNumber":1},{"time":42619.79166666666,"duration":250,"noteNumber":42,"velocity":70,"programNumber":1},{"time":42869.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":47,"programNumber":1},{"time":42869.79166666666,"duration":250,"noteNumber":42,"velocity":87,"programNumber":1},{"time":43119.79166666666,"duration":187.5,"noteNumber":36,"velocity":6,"programNumber":1},{"time":43119.79166666666,"duration":250,"noteNumber":42,"velocity":102,"programNumber":1},{"time":43369.79166666666,"duration":166.66666666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":43369.79166666666,"duration":250,"noteNumber":42,"velocity":106,"programNumber":1},{"time":43619.79166666666,"duration":114.58333333333576,"noteNumber":38,"velocity":82,"programNumber":1},{"time":43619.79166666666,"duration":250,"noteNumber":42,"velocity":67,"programNumber":1},{"time":43869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":62,"programNumber":1},{"time":43869.79166666666,"duration":250,"noteNumber":42,"velocity":82,"programNumber":1},{"time":44119.79166666666,"duration":250,"noteNumber":42,"velocity":109,"programNumber":1},{"time":44369.79166666666,"duration":67.70833333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":44369.79166666666,"duration":250,"noteNumber":42,"velocity":105,"programNumber":1},{"time":44619.79166666666,"duration":119.79166666666424,"noteNumber":38,"velocity":60,"programNumber":1},{"time":44619.79166666666,"duration":250,"noteNumber":42,"velocity":69,"programNumber":1},{"time":44869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":49,"programNumber":1},{"time":44869.79166666666,"duration":250,"noteNumber":42,"velocity":91,"programNumber":1},{"time":45119.79166666666,"duration":171.875,"noteNumber":36,"velocity":4,"programNumber":1},{"time":45119.79166666666,"duration":250,"noteNumber":42,"velocity":100,"programNumber":1},{"time":45369.79166666666,"duration":72.91666666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":45369.79166666666,"duration":78.125,"noteNumber":42,"velocity":95,"programNumber":1},{"time":45619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":74,"programNumber":1},{"time":45619.79166666666,"duration":250,"noteNumber":42,"velocity":80,"programNumber":1},{"time":45869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":61,"programNumber":1},{"time":45869.79166666666,"duration":250,"noteNumber":42,"velocity":96,"programNumber":1},{"time":46119.79166666666,"duration":250,"noteNumber":42,"velocity":118,"programNumber":1},{"time":46369.79166666666,"duration":151.04166666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":46369.79166666666,"duration":250,"noteNumber":42,"velocity":117,"programNumber":1},{"time":46619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":95,"programNumber":1},{"time":46619.79166666666,"duration":250,"noteNumber":42,"velocity":76,"programNumber":1},{"time":46869.79166666666,"duration":62.5,"noteNumber":38,"velocity":70,"programNumber":1},{"time":46869.79166666666,"duration":250,"noteNumber":42,"velocity":95,"programNumber":1},{"time":47119.79166666666,"duration":62.5,"noteNumber":38,"velocity":77,"programNumber":1},{"time":47119.79166666666,"duration":145.83333333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":47119.79166666666,"duration":250,"noteNumber":42,"velocity":103,"programNumber":1},{"time":47369.79166666666,"duration":104.16666666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":47369.79166666666,"duration":250,"noteNumber":42,"velocity":118,"programNumber":1},{"time":47619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":76,"programNumber":1},{"time":47619.79166666666,"duration":250,"noteNumber":42,"velocity":78,"programNumber":1},{"time":47869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":58,"programNumber":1},{"time":47869.79166666666,"duration":250,"noteNumber":42,"velocity":100,"programNumber":1},{"time":48119.79166666666,"duration":250,"noteNumber":42,"velocity":117,"programNumber":1},{"time":48369.79166666666,"duration":93.75,"noteNumber":36,"velocity":3,"programNumber":1},{"time":48369.79166666666,"duration":250,"noteNumber":42,"velocity":110,"programNumber":1},{"time":48619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":99,"programNumber":1},{"time":48619.79166666666,"duration":250,"noteNumber":42,"velocity":80,"programNumber":1},{"time":48869.79166666666,"duration":62.5,"noteNumber":38,"velocity":74,"programNumber":1},{"time":48869.79166666666,"duration":250,"noteNumber":42,"velocity":90,"programNumber":1},{"time":49119.79166666666,"duration":213.54166666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":49119.79166666666,"duration":250,"noteNumber":42,"velocity":115,"programNumber":1},{"time":49369.79166666666,"duration":130.20833333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":49369.79166666666,"duration":250,"noteNumber":42,"velocity":110,"programNumber":1},{"time":49619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":79,"programNumber":1},{"time":49619.79166666666,"duration":250,"noteNumber":42,"velocity":81,"programNumber":1},{"time":49869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":62,"programNumber":1},{"time":49869.79166666666,"duration":250,"noteNumber":42,"velocity":94,"programNumber":1},{"time":50119.79166666666,"duration":250,"noteNumber":42,"velocity":122,"programNumber":1},{"time":50369.79166666666,"duration":161.45833333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":50369.79166666666,"duration":250,"noteNumber":42,"velocity":114,"programNumber":1},{"time":50619.79166666666,"duration":62.5,"noteNumber":38,"velocity":99,"programNumber":1},{"time":50619.79166666666,"duration":250,"noteNumber":42,"velocity":79,"programNumber":1},{"time":50869.79166666666,"duration":62.5,"noteNumber":38,"velocity":74,"programNumber":1},{"time":50869.79166666666,"duration":250,"noteNumber":42,"velocity":94,"programNumber":1},{"time":51119.79166666666,"duration":177.08333333333576,"noteNumber":36,"velocity":4,"programNumber":1},{"time":51119.79166666666,"duration":250,"noteNumber":42,"velocity":102,"programNumber":1},{"time":51369.79166666666,"duration":114.58333333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":51369.79166666666,"duration":250,"noteNumber":42,"velocity":100,"programNumber":1},{"time":51619.79166666666,"duration":114.58333333333576,"noteNumber":38,"velocity":83,"programNumber":1},{"time":51619.79166666666,"duration":250,"noteNumber":42,"velocity":73,"programNumber":1},{"time":51869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":60,"programNumber":1},{"time":51869.79166666666,"duration":250,"noteNumber":42,"velocity":95,"programNumber":1},{"time":52119.79166666666,"duration":250,"noteNumber":42,"velocity":127,"programNumber":1},{"time":52369.79166666666,"duration":125,"noteNumber":36,"velocity":3,"programNumber":1},{"time":52369.79166666666,"duration":250,"noteNumber":42,"velocity":111,"programNumber":1},{"time":52619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":101,"programNumber":1},{"time":52619.79166666666,"duration":250,"noteNumber":42,"velocity":76,"programNumber":1},{"time":52869.79166666666,"duration":62.5,"noteNumber":38,"velocity":74,"programNumber":1},{"time":52869.79166666666,"duration":250,"noteNumber":42,"velocity":94,"programNumber":1},{"time":53119.79166666666,"duration":57.29166666666424,"noteNumber":38,"velocity":76,"programNumber":1},{"time":53119.79166666666,"duration":119.79166666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":53119.79166666666,"duration":250,"noteNumber":42,"velocity":98,"programNumber":1},{"time":53369.79166666666,"duration":166.66666666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":53369.79166666666,"duration":250,"noteNumber":42,"velocity":120,"programNumber":1},{"time":53619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":79,"programNumber":1},{"time":53619.79166666666,"duration":250,"noteNumber":42,"velocity":73,"programNumber":1},{"time":53869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":60,"programNumber":1},{"time":53869.79166666666,"duration":250,"noteNumber":42,"velocity":98,"programNumber":1},{"time":54119.79166666666,"duration":250,"noteNumber":42,"velocity":125,"programNumber":1},{"time":54369.79166666666,"duration":104.16666666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":54369.79166666666,"duration":250,"noteNumber":42,"velocity":105,"programNumber":1},{"time":54619.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":53,"programNumber":1},{"time":54619.79166666666,"duration":250,"noteNumber":42,"velocity":77,"programNumber":1},{"time":54869.79166666666,"duration":62.5,"noteNumber":38,"velocity":75,"programNumber":1},{"time":54869.79166666666,"duration":250,"noteNumber":42,"velocity":93,"programNumber":1},{"time":55119.79166666666,"duration":203.125,"noteNumber":36,"velocity":5,"programNumber":1},{"time":55119.79166666666,"duration":250,"noteNumber":42,"velocity":116,"programNumber":1},{"time":55369.79166666666,"duration":130.20833333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":55369.79166666666,"duration":250,"noteNumber":42,"velocity":108,"programNumber":1},{"time":55619.79166666666,"duration":177.08333333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":55619.79166666666,"duration":250,"noteNumber":42,"velocity":124,"programNumber":1},{"time":55869.79166666666,"duration":104.16666666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":55869.79166666666,"duration":250,"noteNumber":42,"velocity":111,"programNumber":1},{"time":56119.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":104,"programNumber":1},{"time":56119.79166666666,"duration":250,"noteNumber":42,"velocity":84,"programNumber":1},{"time":56369.79166666666,"duration":250,"noteNumber":42,"velocity":47,"programNumber":1},{"time":56619.79166666666,"duration":57.29166666666424,"noteNumber":38,"velocity":54,"programNumber":1},{"time":56619.79166666666,"duration":197.91666666666424,"noteNumber":42,"velocity":119,"programNumber":1},{"time":56619.79166666666,"duration":203.125,"noteNumber":36,"velocity":4,"programNumber":1},{"time":56869.79166666666,"duration":250,"noteNumber":42,"velocity":96,"programNumber":1},{"time":57119.79166666666,"duration":250,"noteNumber":42,"velocity":93,"programNumber":1},{"time":57369.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":46,"programNumber":1},{"time":57369.79166666666,"duration":250,"noteNumber":42,"velocity":63,"programNumber":1},{"time":57619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":67,"programNumber":1},{"time":57619.79166666666,"duration":250,"noteNumber":42,"velocity":76,"programNumber":1},{"time":57869.79166666666,"duration":166.66666666666424,"noteNumber":36,"velocity":4,"programNumber":1},{"time":57869.79166666666,"duration":250,"noteNumber":42,"velocity":108,"programNumber":1},{"time":58119.79166666666,"duration":250,"noteNumber":42,"velocity":108,"programNumber":1},{"time":58369.79166666666,"duration":156.25,"noteNumber":36,"velocity":3,"programNumber":1},{"time":58369.79166666666,"duration":250,"noteNumber":42,"velocity":97,"programNumber":1},{"time":58619.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":72,"programNumber":1},{"time":58619.79166666666,"duration":250,"noteNumber":42,"velocity":63,"programNumber":1},{"time":58869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":56,"programNumber":1},{"time":58869.79166666666,"duration":250,"noteNumber":42,"velocity":79,"programNumber":1},{"time":59119.79166666666,"duration":250,"noteNumber":42,"velocity":104,"programNumber":1},{"time":59369.79166666666,"duration":203.125,"noteNumber":36,"velocity":4,"programNumber":1},{"time":59369.79166666666,"duration":250,"noteNumber":42,"velocity":106,"programNumber":1},{"time":59619.79166666666,"duration":114.58333333333576,"noteNumber":38,"velocity":50,"programNumber":1},{"time":59619.79166666666,"duration":250,"noteNumber":42,"velocity":63,"programNumber":1},{"time":59869.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":44,"programNumber":1},{"time":59869.79166666666,"duration":250,"noteNumber":42,"velocity":76,"programNumber":1},{"time":60119.79166666666,"duration":250,"noteNumber":42,"velocity":111,"programNumber":1},{"time":60369.79166666666,"duration":250,"noteNumber":42,"velocity":97,"programNumber":1},{"time":60619.79166666666,"duration":114.58333333333576,"noteNumber":38,"velocity":73,"programNumber":1},{"time":60619.79166666666,"duration":250,"noteNumber":42,"velocity":67,"programNumber":1},{"time":60869.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":55,"programNumber":1},{"time":60869.79166666666,"duration":250,"noteNumber":42,"velocity":80,"programNumber":1},{"time":61119.79166666666,"duration":250,"noteNumber":42,"velocity":111,"programNumber":1},{"time":61369.79166666666,"duration":114.58333333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":61369.79166666666,"duration":250,"noteNumber":42,"velocity":103,"programNumber":1},{"time":61619.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":55,"programNumber":1},{"time":61619.79166666666,"duration":250,"noteNumber":42,"velocity":66,"programNumber":1},{"time":61869.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":43,"programNumber":1},{"time":61869.79166666666,"duration":250,"noteNumber":42,"velocity":80,"programNumber":1},{"time":62119.79166666666,"duration":104.16666666666424,"noteNumber":36,"velocity":3,"programNumber":1},{"time":62119.79166666666,"duration":250,"noteNumber":42,"velocity":107,"programNumber":1},{"time":62369.79166666666,"duration":125,"noteNumber":36,"velocity":4,"programNumber":1},{"time":62369.79166666666,"duration":250,"noteNumber":42,"velocity":109,"programNumber":1},{"time":62619.79166666666,"duration":114.58333333333576,"noteNumber":38,"velocity":74,"programNumber":1},{"time":62619.79166666666,"duration":250,"noteNumber":42,"velocity":65,"programNumber":1},{"time":62869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":59,"programNumber":1},{"time":62869.79166666666,"duration":250,"noteNumber":42,"velocity":78,"programNumber":1},{"time":63119.79166666666,"duration":250,"noteNumber":42,"velocity":105,"programNumber":1},{"time":63369.79166666666,"duration":250,"noteNumber":42,"velocity":94,"programNumber":1},{"time":63619.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":53,"programNumber":1},{"time":63619.79166666666,"duration":250,"noteNumber":42,"velocity":67,"programNumber":1},{"time":63869.79166666666,"duration":72.91666666666424,"noteNumber":38,"velocity":42,"programNumber":1},{"time":63869.79166666666,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":63994.79166666666,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":63994.79166666666,"duration":171.875,"noteNumber":38,"velocity":103,"programNumber":1},{"time":64119.79166666666,"duration":125,"noteNumber":42,"velocity":111,"programNumber":1},{"time":64244.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":49,"programNumber":1},{"time":64244.79166666666,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":64369.79166666666,"duration":125,"noteNumber":42,"velocity":102,"programNumber":1},{"time":64494.79166666666,"duration":125,"noteNumber":42,"velocity":85,"programNumber":1},{"time":64619.79166666666,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":64619.79166666666,"duration":151.04166666666424,"noteNumber":38,"velocity":104,"programNumber":1},{"time":64744.79166666666,"duration":125,"noteNumber":42,"velocity":104,"programNumber":1},{"time":64744.79166666666,"duration":125,"noteNumber":36,"velocity":3,"programNumber":1},{"time":64869.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":55,"programNumber":1},{"time":64869.79166666666,"duration":125,"noteNumber":42,"velocity":79,"programNumber":1},{"time":64994.79166666666,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":64994.79166666666,"duration":166.66666666666424,"noteNumber":38,"velocity":110,"programNumber":1},{"time":65119.79166666666,"duration":125,"noteNumber":42,"velocity":107,"programNumber":1},{"time":65244.79166666666,"duration":67.70833333333576,"noteNumber":38,"velocity":61,"programNumber":1},{"time":65244.79166666666,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":65369.79166666666,"duration":114.58333333333576,"noteNumber":36,"velocity":3,"programNumber":1},{"time":65369.79166666666,"duration":125,"noteNumber":42,"velocity":106,"programNumber":1},{"time":65494.79166666666,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":65619.79166666666,"duration":125,"noteNumber":42,"velocity":63,"programNumber":1},{"time":65619.79166666666,"duration":151.04166666667152,"noteNumber":38,"velocity":82,"programNumber":1},{"time":65744.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":5,"programNumber":1},{"time":65744.79166666666,"duration":125.00000000001455,"noteNumber":42,"velocity":90,"programNumber":1},{"time":65869.79166666667,"duration":67.70833333332848,"noteNumber":38,"velocity":67,"programNumber":1},{"time":65869.79166666667,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":65994.79166666667,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":65994.79166666667,"duration":166.66666666667152,"noteNumber":38,"velocity":124,"programNumber":1},{"time":66119.79166666667,"duration":125,"noteNumber":42,"velocity":109,"programNumber":1},{"time":66244.79166666667,"duration":67.70833333332848,"noteNumber":38,"velocity":49,"programNumber":1},{"time":66244.79166666667,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":66369.79166666667,"duration":114.58333333332848,"noteNumber":36,"velocity":4,"programNumber":1},{"time":66369.79166666667,"duration":125,"noteNumber":42,"velocity":90,"programNumber":1},{"time":66494.79166666667,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":66619.79166666667,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":66619.79166666667,"duration":151.04166666667152,"noteNumber":38,"velocity":98,"programNumber":1},{"time":66744.79166666667,"duration":114.58333333334303,"noteNumber":36,"velocity":5,"programNumber":1},{"time":66744.79166666667,"duration":125.00000000001455,"noteNumber":42,"velocity":93,"programNumber":1},{"time":66869.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":55,"programNumber":1},{"time":66869.79166666669,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":66994.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":117,"programNumber":1},{"time":66994.79166666669,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":67119.79166666669,"duration":125,"noteNumber":42,"velocity":108,"programNumber":1},{"time":67244.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":59,"programNumber":1},{"time":67244.79166666669,"duration":125,"noteNumber":42,"velocity":87,"programNumber":1},{"time":67369.79166666669,"duration":104.16666666667152,"noteNumber":36,"velocity":3,"programNumber":1},{"time":67369.79166666669,"duration":125,"noteNumber":42,"velocity":106,"programNumber":1},{"time":67494.79166666669,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":67619.79166666669,"duration":125,"noteNumber":42,"velocity":63,"programNumber":1},{"time":67744.79166666669,"duration":119.79166666667152,"noteNumber":36,"velocity":4,"programNumber":1},{"time":67744.79166666669,"duration":125,"noteNumber":42,"velocity":106,"programNumber":1},{"time":67869.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":68,"programNumber":1},{"time":67869.79166666669,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":67994.79166666669,"duration":125,"noteNumber":42,"velocity":63,"programNumber":1},{"time":67994.79166666669,"duration":156.25,"noteNumber":38,"velocity":122,"programNumber":1},{"time":68119.79166666669,"duration":72.91666666667152,"noteNumber":42,"velocity":105,"programNumber":1},{"time":68244.79166666669,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":68369.79166666669,"duration":104.16666666667152,"noteNumber":36,"velocity":8,"programNumber":1},{"time":68369.79166666669,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":68494.79166666669,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":68619.79166666669,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":68744.79166666669,"duration":104.16666666667152,"noteNumber":36,"velocity":8,"programNumber":1},{"time":68744.79166666669,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":68869.79166666669,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":68994.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":56,"programNumber":1},{"time":68994.79166666669,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":69119.79166666669,"duration":125,"noteNumber":42,"velocity":84,"programNumber":1},{"time":69244.79166666669,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":69369.79166666669,"duration":93.75,"noteNumber":36,"velocity":7,"programNumber":1},{"time":69369.79166666669,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":69494.79166666669,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":69619.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":62,"programNumber":1},{"time":69619.79166666669,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":69744.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":8,"programNumber":1},{"time":69744.79166666669,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":69869.79166666669,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":69994.79166666669,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":70119.79166666669,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":70244.79166666669,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":70369.79166666669,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":70494.79166666669,"duration":104.16666666667152,"noteNumber":36,"velocity":9,"programNumber":1},{"time":70494.79166666669,"duration":125,"noteNumber":42,"velocity":76,"programNumber":1},{"time":70619.79166666669,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":70744.79166666669,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":70869.79166666669,"duration":104.16666666667152,"noteNumber":36,"velocity":7,"programNumber":1},{"time":70869.79166666669,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":70994.79166666669,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":71119.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":54,"programNumber":1},{"time":71119.79166666669,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":71244.79166666669,"duration":125,"noteNumber":42,"velocity":83,"programNumber":1},{"time":71369.79166666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":71494.79166666669,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":71619.79166666669,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":71744.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":66,"programNumber":1},{"time":71744.79166666669,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":71869.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":9,"programNumber":1},{"time":71869.79166666669,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":71994.79166666669,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":72119.79166666669,"duration":125,"noteNumber":42,"velocity":54,"programNumber":1},{"time":72244.79166666669,"duration":119.79166666667152,"noteNumber":36,"velocity":8,"programNumber":1},{"time":72244.79166666669,"duration":125,"noteNumber":42,"velocity":76,"programNumber":1},{"time":72369.79166666669,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":72494.79166666669,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":72619.79166666669,"duration":125,"noteNumber":42,"velocity":49,"programNumber":1},{"time":72619.79166666669,"duration":166.66666666667152,"noteNumber":38,"velocity":100,"programNumber":1},{"time":72744.79166666669,"duration":119.79166666667152,"noteNumber":36,"velocity":10,"programNumber":1},{"time":72744.79166666669,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":72869.79166666669,"duration":72.91666666667152,"noteNumber":38,"velocity":57,"programNumber":1},{"time":72869.79166666669,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":72994.79166666669,"duration":93.75,"noteNumber":36,"velocity":7,"programNumber":1},{"time":72994.79166666669,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":73119.79166666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":73244.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":7,"programNumber":1},{"time":73244.79166666669,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":73369.79166666669,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":73494.79166666669,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":73619.79166666669,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":73744.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":8,"programNumber":1},{"time":73744.79166666669,"duration":125,"noteNumber":42,"velocity":81,"programNumber":1},{"time":73869.79166666669,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":73994.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":8,"programNumber":1},{"time":73994.79166666669,"duration":125,"noteNumber":42,"velocity":74,"programNumber":1},{"time":74119.79166666669,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":74244.79166666669,"duration":125,"noteNumber":42,"velocity":53,"programNumber":1},{"time":74369.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":9,"programNumber":1},{"time":74369.79166666669,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":74494.79166666669,"duration":125,"noteNumber":42,"velocity":65,"programNumber":1},{"time":74619.79166666669,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":74744.79166666669,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":74869.79166666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":74994.79166666669,"duration":125,"noteNumber":42,"velocity":82,"programNumber":1},{"time":75119.79166666669,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":75244.79166666669,"duration":104.16666666667152,"noteNumber":36,"velocity":8,"programNumber":1},{"time":75244.79166666669,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":75369.79166666669,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":75494.79166666669,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":75619.79166666669,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":75619.79166666669,"duration":166.66666666667152,"noteNumber":38,"velocity":127,"programNumber":1},{"time":75744.79166666669,"duration":119.79166666667152,"noteNumber":36,"velocity":7,"programNumber":1},{"time":75744.79166666669,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":75869.79166666669,"duration":72.91666666667152,"noteNumber":38,"velocity":49,"programNumber":1},{"time":75869.79166666669,"duration":125,"noteNumber":42,"velocity":63,"programNumber":1},{"time":75994.79166666669,"duration":93.75,"noteNumber":36,"velocity":7,"programNumber":1},{"time":75994.79166666669,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":76119.79166666669,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":76244.79166666669,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":76369.79166666669,"duration":125,"noteNumber":42,"velocity":68,"programNumber":1},{"time":76494.79166666669,"duration":125,"noteNumber":42,"velocity":54,"programNumber":1},{"time":76619.79166666669,"duration":119.79166666667152,"noteNumber":36,"velocity":7,"programNumber":1},{"time":76619.79166666669,"duration":125,"noteNumber":42,"velocity":72,"programNumber":1},{"time":76744.79166666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":76869.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":53,"programNumber":1},{"time":76869.79166666669,"duration":125,"noteNumber":42,"velocity":54,"programNumber":1},{"time":76994.79166666669,"duration":125,"noteNumber":42,"velocity":87,"programNumber":1},{"time":77119.79166666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":77244.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":7,"programNumber":1},{"time":77244.79166666669,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":77369.79166666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":77494.79166666669,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":77619.79166666669,"duration":114.58333333332848,"noteNumber":36,"velocity":7,"programNumber":1},{"time":77619.79166666669,"duration":125,"noteNumber":42,"velocity":80,"programNumber":1},{"time":77744.79166666669,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":77869.79166666669,"duration":125,"noteNumber":42,"velocity":53,"programNumber":1},{"time":77994.79166666669,"duration":125,"noteNumber":42,"velocity":86,"programNumber":1},{"time":78119.79166666669,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":78244.79166666669,"duration":98.95833333332848,"noteNumber":36,"velocity":7,"programNumber":1},{"time":78244.79166666669,"duration":125,"noteNumber":42,"velocity":88,"programNumber":1},{"time":78369.79166666669,"duration":125,"noteNumber":42,"velocity":71,"programNumber":1},{"time":78494.79166666669,"duration":125,"noteNumber":42,"velocity":51,"programNumber":1},{"time":78619.79166666669,"duration":104.16666666667152,"noteNumber":36,"velocity":7,"programNumber":1},{"time":78619.79166666669,"duration":125,"noteNumber":42,"velocity":70,"programNumber":1},{"time":78744.79166666669,"duration":125,"noteNumber":42,"velocity":66,"programNumber":1},{"time":78869.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":50,"programNumber":1},{"time":78869.79166666669,"duration":125,"noteNumber":42,"velocity":50,"programNumber":1},{"time":78994.79166666669,"duration":125,"noteNumber":42,"velocity":86,"programNumber":1},{"time":79119.79166666669,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":79244.79166666669,"duration":125,"noteNumber":42,"velocity":78,"programNumber":1},{"time":79369.79166666669,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":79494.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":59,"programNumber":1},{"time":79494.79166666669,"duration":67.70833333332848,"noteNumber":42,"velocity":51,"programNumber":1},{"time":79619.79166666669,"duration":125,"noteNumber":42,"velocity":56,"programNumber":1},{"time":79744.79166666669,"duration":125,"noteNumber":42,"velocity":49,"programNumber":1},{"time":79869.79166666669,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":79994.79166666669,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":80119.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":31,"programNumber":1},{"time":80119.79166666669,"duration":125,"noteNumber":42,"velocity":47,"programNumber":1},{"time":80244.79166666669,"duration":125,"noteNumber":42,"velocity":57,"programNumber":1},{"time":80369.79166666669,"duration":125,"noteNumber":42,"velocity":51,"programNumber":1},{"time":80494.79166666669,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":80619.79166666669,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":80744.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":36,"programNumber":1},{"time":80744.79166666669,"duration":125,"noteNumber":42,"velocity":50,"programNumber":1},{"time":80869.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":65,"programNumber":1},{"time":80869.79166666669,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":80994.79166666669,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":81119.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":24,"programNumber":1},{"time":81119.79166666669,"duration":125,"noteNumber":42,"velocity":50,"programNumber":1},{"time":81244.79166666669,"duration":125,"noteNumber":42,"velocity":53,"programNumber":1},{"time":81369.79166666669,"duration":125,"noteNumber":42,"velocity":47,"programNumber":1},{"time":81494.79166666669,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":81494.79166666669,"duration":156.25,"noteNumber":38,"velocity":63,"programNumber":1},{"time":81619.79166666669,"duration":125,"noteNumber":42,"velocity":51,"programNumber":1},{"time":81744.79166666669,"duration":72.91666666667152,"noteNumber":38,"velocity":28,"programNumber":1},{"time":81744.79166666669,"duration":125,"noteNumber":42,"velocity":47,"programNumber":1},{"time":81869.79166666669,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":81869.79166666669,"duration":171.875,"noteNumber":38,"velocity":60,"programNumber":1},{"time":81994.79166666669,"duration":135.41666666667152,"noteNumber":42,"velocity":55,"programNumber":1},{"time":82130.20833333336,"duration":114.58333333332848,"noteNumber":42,"velocity":2,"programNumber":1},{"time":82244.79166666669,"duration":250,"noteNumber":42,"velocity":50,"programNumber":1},{"time":82494.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":47,"programNumber":1},{"time":82494.79166666669,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":82744.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":38,"programNumber":1},{"time":82744.79166666669,"duration":250,"noteNumber":42,"velocity":48,"programNumber":1},{"time":82994.79166666669,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":83119.79166666669,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":83244.79166666669,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":83369.79166666669,"duration":125,"noteNumber":42,"velocity":48,"programNumber":1},{"time":83494.79166666669,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":83494.79166666669,"duration":151.04166666667152,"noteNumber":38,"velocity":43,"programNumber":1},{"time":83619.79166666669,"duration":125,"noteNumber":42,"velocity":50,"programNumber":1},{"time":83744.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":28,"programNumber":1},{"time":83744.79166666669,"duration":125,"noteNumber":42,"velocity":47,"programNumber":1},{"time":83869.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":59,"programNumber":1},{"time":83869.79166666669,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":83994.79166666669,"duration":250,"noteNumber":42,"velocity":54,"programNumber":1},{"time":84244.79166666669,"duration":250,"noteNumber":42,"velocity":50,"programNumber":1},{"time":84494.79166666669,"duration":114.58333333332848,"noteNumber":38,"velocity":46,"programNumber":1},{"time":84494.79166666669,"duration":250,"noteNumber":42,"velocity":37,"programNumber":1},{"time":84744.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":37,"programNumber":1},{"time":84744.79166666669,"duration":250,"noteNumber":42,"velocity":49,"programNumber":1},{"time":84994.79166666669,"duration":125,"noteNumber":42,"velocity":60,"programNumber":1},{"time":85119.79166666669,"duration":125,"noteNumber":42,"velocity":49,"programNumber":1},{"time":85244.79166666669,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":85369.79166666669,"duration":125,"noteNumber":42,"velocity":48,"programNumber":1},{"time":85494.79166666669,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":85619.79166666669,"duration":125,"noteNumber":42,"velocity":55,"programNumber":1},{"time":85744.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":30,"programNumber":1},{"time":85744.79166666669,"duration":125,"noteNumber":42,"velocity":49,"programNumber":1},{"time":85869.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":61,"programNumber":1},{"time":85869.79166666669,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":85994.79166666669,"duration":135.41666666667152,"noteNumber":42,"velocity":62,"programNumber":1},{"time":86130.20833333336,"duration":114.58333333332848,"noteNumber":42,"velocity":2,"programNumber":1},{"time":86244.79166666669,"duration":250,"noteNumber":42,"velocity":62,"programNumber":1},{"time":86494.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":49,"programNumber":1},{"time":86494.79166666669,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":86744.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":35,"programNumber":1},{"time":86744.79166666669,"duration":250,"noteNumber":42,"velocity":50,"programNumber":1},{"time":86994.79166666669,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":87119.79166666669,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":87244.79166666669,"duration":125,"noteNumber":42,"velocity":50,"programNumber":1},{"time":87369.79166666669,"duration":125,"noteNumber":42,"velocity":49,"programNumber":1},{"time":87494.79166666669,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":87619.79166666669,"duration":125,"noteNumber":42,"velocity":53,"programNumber":1},{"time":87744.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":28,"programNumber":1},{"time":87744.79166666669,"duration":125,"noteNumber":42,"velocity":51,"programNumber":1},{"time":87869.79166666669,"duration":57.29166666667152,"noteNumber":38,"velocity":61,"programNumber":1},{"time":87869.79166666669,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":87994.79166666669,"duration":250,"noteNumber":42,"velocity":56,"programNumber":1},{"time":88244.79166666669,"duration":192.70833333332848,"noteNumber":36,"velocity":45,"programNumber":1},{"time":88244.79166666669,"duration":250,"noteNumber":42,"velocity":81,"programNumber":1},{"time":88494.79166666669,"duration":67.70833333332848,"noteNumber":38,"velocity":48,"programNumber":1},{"time":88494.79166666669,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":88619.79166666669,"duration":125,"noteNumber":42,"velocity":48,"programNumber":1},{"time":88619.79166666669,"duration":177.08333333332848,"noteNumber":36,"velocity":58,"programNumber":1},{"time":88744.79166666669,"duration":57.291666666656965,"noteNumber":38,"velocity":34,"programNumber":1},{"time":88744.79166666669,"duration":249.99999999998545,"noteNumber":42,"velocity":50,"programNumber":1},{"time":88994.79166666667,"duration":125,"noteNumber":42,"velocity":79,"programNumber":1},{"time":88994.79166666667,"duration":182.29166666667152,"noteNumber":36,"velocity":65,"programNumber":1},{"time":89119.79166666667,"duration":125,"noteNumber":42,"velocity":49,"programNumber":1},{"time":89244.79166666667,"duration":125,"noteNumber":42,"velocity":69,"programNumber":1},{"time":89244.79166666667,"duration":177.08333333332848,"noteNumber":36,"velocity":66,"programNumber":1},{"time":89369.79166666667,"duration":125,"noteNumber":42,"velocity":52,"programNumber":1},{"time":89494.79166666667,"duration":72.91666666667152,"noteNumber":38,"velocity":35,"programNumber":1},{"time":89494.79166666667,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":89619.79166666667,"duration":125,"noteNumber":42,"velocity":73,"programNumber":1},{"time":89619.79166666667,"duration":192.70833333332848,"noteNumber":36,"velocity":62,"programNumber":1},{"time":89744.79166666667,"duration":125,"noteNumber":42,"velocity":47,"programNumber":1},{"time":89869.79166666667,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":89994.79166666667,"duration":192.70833333332848,"noteNumber":36,"velocity":40,"programNumber":1},{"time":89994.79166666667,"duration":250,"noteNumber":42,"velocity":75,"programNumber":1},{"time":90244.79166666667,"duration":192.70833333332848,"noteNumber":36,"velocity":42,"programNumber":1},{"time":90244.79166666667,"duration":250,"noteNumber":42,"velocity":77,"programNumber":1},{"time":90494.79166666667,"duration":67.70833333332848,"noteNumber":38,"velocity":47,"programNumber":1},{"time":90494.79166666667,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":90619.79166666667,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":90619.79166666667,"duration":187.5,"noteNumber":36,"velocity":57,"programNumber":1},{"time":90744.79166666667,"duration":67.70833333332848,"noteNumber":38,"velocity":36,"programNumber":1},{"time":90744.79166666667,"duration":192.70833333332848,"noteNumber":42,"velocity":44,"programNumber":1},{"time":90994.79166666667,"duration":119.79166666667152,"noteNumber":36,"velocity":49,"programNumber":1},{"time":90994.79166666667,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":91119.79166666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":91244.79166666667,"duration":125,"noteNumber":42,"velocity":34,"programNumber":1},{"time":91244.79166666667,"duration":125,"noteNumber":36,"velocity":27,"programNumber":1},{"time":91369.79166666667,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":91494.79166666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":91494.79166666667,"duration":166.66666666667152,"noteNumber":38,"velocity":15,"programNumber":1},{"time":91619.79166666667,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":91619.79166666667,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":91744.79166666667,"duration":98.95833333332848,"noteNumber":38,"velocity":32,"programNumber":1},{"time":91744.79166666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":91869.79166666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":91869.79166666667,"duration":151.04166666667152,"noteNumber":38,"velocity":40,"programNumber":1},{"time":91994.79166666667,"duration":171.875,"noteNumber":36,"velocity":38,"programNumber":1},{"time":91994.79166666667,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":92244.79166666667,"duration":182.29166666667152,"noteNumber":36,"velocity":39,"programNumber":1},{"time":92244.79166666667,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":92494.79166666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":92494.79166666667,"duration":156.25,"noteNumber":38,"velocity":23,"programNumber":1},{"time":92619.79166666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":92619.79166666667,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":92744.79166666667,"duration":114.58333333332848,"noteNumber":38,"velocity":21,"programNumber":1},{"time":92744.79166666667,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":92994.79166666667,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":92994.79166666667,"duration":130.20833333332848,"noteNumber":36,"velocity":29,"programNumber":1},{"time":93119.79166666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":93244.79166666667,"duration":125,"noteNumber":36,"velocity":24,"programNumber":1},{"time":93244.79166666667,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":93369.79166666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":93494.79166666667,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":93619.79166666667,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":93619.79166666667,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":93744.79166666667,"duration":72.91666666667152,"noteNumber":38,"velocity":16,"programNumber":1},{"time":93744.79166666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":93869.79166666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":93869.79166666667,"duration":166.66666666667152,"noteNumber":38,"velocity":32,"programNumber":1},{"time":93994.79166666667,"duration":177.08333333334303,"noteNumber":36,"velocity":35,"programNumber":1},{"time":93994.79166666667,"duration":250.00000000001455,"noteNumber":42,"velocity":39,"programNumber":1},{"time":94244.79166666669,"duration":182.29166666667152,"noteNumber":36,"velocity":36,"programNumber":1},{"time":94244.79166666669,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":94494.79166666669,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":94494.79166666669,"duration":156.25,"noteNumber":38,"velocity":24,"programNumber":1},{"time":94619.79166666669,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":94619.79166666669,"duration":130.20833333332848,"noteNumber":36,"velocity":25,"programNumber":1},{"time":94744.79166666669,"duration":72.91666666665697,"noteNumber":38,"velocity":21,"programNumber":1},{"time":94744.79166666669,"duration":249.99999999998545,"noteNumber":42,"velocity":27,"programNumber":1},{"time":94994.79166666667,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":94994.79166666667,"duration":130.20833333332848,"noteNumber":36,"velocity":30,"programNumber":1},{"time":95119.79166666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":95244.79166666667,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":95244.79166666667,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":95369.79166666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":95494.79166666667,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":95494.79166666667,"duration":140.625,"noteNumber":38,"velocity":19,"programNumber":1},{"time":95619.79166666667,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":95619.79166666667,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":95744.79166666667,"duration":125,"noteNumber":38,"velocity":16,"programNumber":1},{"time":95744.79166666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":95869.79166666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":95869.79166666667,"duration":166.66666666667152,"noteNumber":38,"velocity":32,"programNumber":1},{"time":95994.79166666667,"duration":171.875,"noteNumber":36,"velocity":32,"programNumber":1},{"time":95994.79166666667,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":96244.79166666667,"duration":177.08333333332848,"noteNumber":36,"velocity":33,"programNumber":1},{"time":96244.79166666667,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":96494.79166666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":96494.79166666667,"duration":156.25,"noteNumber":38,"velocity":23,"programNumber":1},{"time":96619.79166666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":96619.79166666667,"duration":130.20833333332848,"noteNumber":36,"velocity":23,"programNumber":1},{"time":96744.79166666667,"duration":114.58333333332848,"noteNumber":38,"velocity":21,"programNumber":1},{"time":96744.79166666667,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":96994.79166666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":96994.79166666667,"duration":145.83333333332848,"noteNumber":36,"velocity":30,"programNumber":1},{"time":97119.79166666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":97244.79166666667,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":97244.79166666667,"duration":125,"noteNumber":36,"velocity":26,"programNumber":1},{"time":97369.79166666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":97494.79166666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":97494.79166666667,"duration":130.20833333332848,"noteNumber":38,"velocity":20,"programNumber":1},{"time":97619.79166666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":97619.79166666667,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":97744.79166666667,"duration":125,"noteNumber":38,"velocity":16,"programNumber":1},{"time":97744.79166666667,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":97869.79166666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":97869.79166666667,"duration":166.66666666667152,"noteNumber":38,"velocity":33,"programNumber":1},{"time":97994.79166666667,"duration":166.66666666667152,"noteNumber":36,"velocity":39,"programNumber":1},{"time":97994.79166666667,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":98244.79166666667,"duration":177.08333333332848,"noteNumber":36,"velocity":39,"programNumber":1},{"time":98244.79166666667,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":98494.79166666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":98494.79166666667,"duration":156.25,"noteNumber":38,"velocity":24,"programNumber":1},{"time":98619.79166666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":98619.79166666667,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":98744.79166666667,"duration":72.91666666667152,"noteNumber":38,"velocity":21,"programNumber":1},{"time":98744.79166666667,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":98994.79166666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":98994.79166666667,"duration":130.20833333332848,"noteNumber":36,"velocity":30,"programNumber":1},{"time":99119.79166666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":99244.79166666667,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":99244.79166666667,"duration":125,"noteNumber":36,"velocity":24,"programNumber":1},{"time":99369.79166666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":99494.79166666667,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":99494.79166666667,"duration":130.20833333332848,"noteNumber":38,"velocity":20,"programNumber":1},{"time":99619.79166666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":99619.79166666667,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":99744.79166666667,"duration":72.91666666667152,"noteNumber":38,"velocity":17,"programNumber":1},{"time":99744.79166666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":99869.79166666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":99869.79166666667,"duration":166.66666666667152,"noteNumber":38,"velocity":33,"programNumber":1},{"time":99994.79166666667,"duration":166.66666666667152,"noteNumber":36,"velocity":35,"programNumber":1},{"time":99994.79166666667,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":100244.79166666667,"duration":177.08333333332848,"noteNumber":36,"velocity":37,"programNumber":1},{"time":100244.79166666667,"duration":250,"noteNumber":42,"velocity":45,"programNumber":1},{"time":100494.79166666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":100494.79166666667,"duration":156.25,"noteNumber":38,"velocity":23,"programNumber":1},{"time":100619.79166666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":100619.79166666667,"duration":130.20833333332848,"noteNumber":36,"velocity":25,"programNumber":1},{"time":100744.79166666667,"duration":72.91666666665697,"noteNumber":38,"velocity":21,"programNumber":1},{"time":100744.79166666667,"duration":249.99999999998545,"noteNumber":42,"velocity":26,"programNumber":1},{"time":100994.79166666666,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":100994.79166666666,"duration":130.20833333332848,"noteNumber":36,"velocity":29,"programNumber":1},{"time":101119.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":101244.79166666666,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":101244.79166666666,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":101369.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":101494.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":101494.79166666666,"duration":130.20833333332848,"noteNumber":38,"velocity":17,"programNumber":1},{"time":101619.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":101619.79166666666,"duration":125,"noteNumber":36,"velocity":27,"programNumber":1},{"time":101744.79166666666,"duration":125,"noteNumber":38,"velocity":16,"programNumber":1},{"time":101744.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":101869.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":101869.79166666666,"duration":166.66666666667152,"noteNumber":38,"velocity":33,"programNumber":1},{"time":101994.79166666666,"duration":166.66666666667152,"noteNumber":36,"velocity":32,"programNumber":1},{"time":101994.79166666666,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":102244.79166666666,"duration":72.91666666667152,"noteNumber":36,"velocity":33,"programNumber":1},{"time":102244.79166666666,"duration":250,"noteNumber":42,"velocity":1,"programNumber":1},{"time":102494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":102494.79166666666,"duration":156.25,"noteNumber":38,"velocity":20,"programNumber":1},{"time":102619.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":102619.79166666666,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":102744.79166666666,"duration":72.91666666667152,"noteNumber":38,"velocity":18,"programNumber":1},{"time":102744.79166666666,"duration":250,"noteNumber":42,"velocity":28,"programNumber":1},{"time":102994.79166666666,"duration":125,"noteNumber":42,"velocity":46,"programNumber":1},{"time":102994.79166666666,"duration":130.20833333332848,"noteNumber":36,"velocity":24,"programNumber":1},{"time":103119.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":103244.79166666666,"duration":125,"noteNumber":36,"velocity":41,"programNumber":1},{"time":103244.79166666666,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":103369.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":103494.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":103494.79166666666,"duration":140.625,"noteNumber":38,"velocity":24,"programNumber":1},{"time":103619.79166666666,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":103619.79166666666,"duration":130.20833333332848,"noteNumber":36,"velocity":27,"programNumber":1},{"time":103744.79166666666,"duration":125,"noteNumber":38,"velocity":24,"programNumber":1},{"time":103744.79166666666,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":103869.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":103869.79166666666,"duration":156.25,"noteNumber":38,"velocity":38,"programNumber":1},{"time":103994.79166666666,"duration":151.04166666667152,"noteNumber":36,"velocity":32,"programNumber":1},{"time":103994.79166666666,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":104244.79166666666,"duration":177.08333333332848,"noteNumber":36,"velocity":33,"programNumber":1},{"time":104244.79166666666,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":104494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":104494.79166666666,"duration":166.66666666667152,"noteNumber":38,"velocity":18,"programNumber":1},{"time":104619.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":104619.79166666666,"duration":125,"noteNumber":36,"velocity":35,"programNumber":1},{"time":104744.79166666666,"duration":109.375,"noteNumber":38,"velocity":17,"programNumber":1},{"time":104744.79166666666,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":104994.79166666666,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":104994.79166666666,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":105119.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":105244.79166666666,"duration":119.79166666667152,"noteNumber":36,"velocity":36,"programNumber":1},{"time":105244.79166666666,"duration":125,"noteNumber":42,"velocity":34,"programNumber":1},{"time":105369.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":105494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":105494.79166666666,"duration":140.625,"noteNumber":38,"velocity":23,"programNumber":1},{"time":105619.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":105619.79166666666,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":105744.79166666666,"duration":72.91666666667152,"noteNumber":38,"velocity":23,"programNumber":1},{"time":105744.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":105869.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":105869.79166666666,"duration":166.66666666667152,"noteNumber":38,"velocity":40,"programNumber":1},{"time":105994.79166666666,"duration":171.875,"noteNumber":36,"velocity":28,"programNumber":1},{"time":105994.79166666666,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":106244.79166666666,"duration":182.29166666667152,"noteNumber":36,"velocity":30,"programNumber":1},{"time":106244.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":106494.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":106494.79166666666,"duration":166.66666666667152,"noteNumber":38,"velocity":18,"programNumber":1},{"time":106619.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":106619.79166666666,"duration":125,"noteNumber":36,"velocity":37,"programNumber":1},{"time":106744.79166666666,"duration":72.91666666667152,"noteNumber":38,"velocity":17,"programNumber":1},{"time":106744.79166666666,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":106994.79166666666,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":106994.79166666666,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":107119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":107244.79166666666,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":107244.79166666666,"duration":125,"noteNumber":36,"velocity":24,"programNumber":1},{"time":107369.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":107494.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":107494.79166666666,"duration":140.625,"noteNumber":38,"velocity":22,"programNumber":1},{"time":107619.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":107619.79166666666,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":107744.79166666666,"duration":125,"noteNumber":38,"velocity":22,"programNumber":1},{"time":107744.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":107869.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":107869.79166666666,"duration":156.25,"noteNumber":38,"velocity":38,"programNumber":1},{"time":107994.79166666666,"duration":171.875,"noteNumber":36,"velocity":27,"programNumber":1},{"time":107994.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":108244.79166666666,"duration":177.08333333332848,"noteNumber":36,"velocity":27,"programNumber":1},{"time":108244.79166666666,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":108494.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":108494.79166666666,"duration":156.25,"noteNumber":38,"velocity":17,"programNumber":1},{"time":108619.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":108619.79166666666,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":108744.79166666666,"duration":78.125,"noteNumber":38,"velocity":16,"programNumber":1},{"time":108744.79166666666,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":108994.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":108994.79166666666,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":109119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":109244.79166666666,"duration":119.79166666667152,"noteNumber":36,"velocity":39,"programNumber":1},{"time":109244.79166666666,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":109369.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":109494.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":109494.79166666666,"duration":140.625,"noteNumber":38,"velocity":23,"programNumber":1},{"time":109619.79166666666,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":109619.79166666666,"duration":130.20833333332848,"noteNumber":36,"velocity":26,"programNumber":1},{"time":109744.79166666666,"duration":67.70833333332848,"noteNumber":38,"velocity":23,"programNumber":1},{"time":109744.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":109869.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":109869.79166666666,"duration":156.25,"noteNumber":38,"velocity":39,"programNumber":1},{"time":109994.79166666666,"duration":166.66666666667152,"noteNumber":36,"velocity":24,"programNumber":1},{"time":109994.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":110244.79166666666,"duration":177.08333333332848,"noteNumber":36,"velocity":34,"programNumber":1},{"time":110244.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":110494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":110494.79166666666,"duration":166.66666666667152,"noteNumber":38,"velocity":18,"programNumber":1},{"time":110619.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":110619.79166666666,"duration":125,"noteNumber":36,"velocity":35,"programNumber":1},{"time":110744.79166666666,"duration":72.91666666667152,"noteNumber":38,"velocity":17,"programNumber":1},{"time":110744.79166666666,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":110994.79166666666,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":110994.79166666666,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":111119.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":111244.79166666666,"duration":119.79166666667152,"noteNumber":36,"velocity":36,"programNumber":1},{"time":111244.79166666666,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":111369.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":111494.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":111494.79166666666,"duration":166.66666666667152,"noteNumber":38,"velocity":25,"programNumber":1},{"time":111619.79166666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":111619.79166666666,"duration":130.20833333332848,"noteNumber":36,"velocity":24,"programNumber":1},{"time":111744.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":30,"programNumber":1},{"time":111744.79166666666,"duration":124.99999999998545,"noteNumber":42,"velocity":26,"programNumber":1},{"time":111869.79166666664,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":111869.79166666664,"duration":145.83333333332848,"noteNumber":38,"velocity":34,"programNumber":1},{"time":111994.79166666664,"duration":171.875,"noteNumber":36,"velocity":30,"programNumber":1},{"time":111994.79166666664,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":112244.79166666664,"duration":182.29166666667152,"noteNumber":36,"velocity":30,"programNumber":1},{"time":112244.79166666664,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":112494.79166666664,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":112494.79166666664,"duration":156.25,"noteNumber":38,"velocity":18,"programNumber":1},{"time":112619.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":112619.79166666664,"duration":125,"noteNumber":36,"velocity":39,"programNumber":1},{"time":112744.79166666664,"duration":72.91666666667152,"noteNumber":38,"velocity":17,"programNumber":1},{"time":112744.79166666664,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":112994.79166666664,"duration":125,"noteNumber":42,"velocity":47,"programNumber":1},{"time":112994.79166666664,"duration":130.20833333332848,"noteNumber":36,"velocity":24,"programNumber":1},{"time":113119.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":113244.79166666664,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":113244.79166666664,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":113369.79166666664,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":113494.79166666664,"duration":140.625,"noteNumber":38,"velocity":23,"programNumber":1},{"time":113494.79166666664,"duration":177.08333333332848,"noteNumber":42,"velocity":23,"programNumber":1},{"time":113619.79166666664,"duration":67.70833333332848,"noteNumber":36,"velocity":41,"programNumber":1},{"time":113744.79166666664,"duration":125,"noteNumber":38,"velocity":18,"programNumber":1},{"time":113744.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":113869.79166666664,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":113869.79166666664,"duration":166.66666666667152,"noteNumber":38,"velocity":37,"programNumber":1},{"time":113994.79166666664,"duration":171.875,"noteNumber":36,"velocity":40,"programNumber":1},{"time":113994.79166666664,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":114244.79166666664,"duration":177.08333333332848,"noteNumber":36,"velocity":40,"programNumber":1},{"time":114244.79166666664,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":114494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":114494.79166666664,"duration":156.25,"noteNumber":38,"velocity":28,"programNumber":1},{"time":114619.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":114619.79166666664,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":114744.79166666664,"duration":109.375,"noteNumber":38,"velocity":25,"programNumber":1},{"time":114744.79166666664,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":114994.79166666664,"duration":125,"noteNumber":36,"velocity":37,"programNumber":1},{"time":114994.79166666664,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":115119.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":115244.79166666664,"duration":125,"noteNumber":36,"velocity":35,"programNumber":1},{"time":115244.79166666664,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":115369.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":115494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":115494.79166666664,"duration":130.20833333332848,"noteNumber":38,"velocity":16,"programNumber":1},{"time":115619.79166666664,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":115619.79166666664,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":115744.79166666664,"duration":125,"noteNumber":38,"velocity":19,"programNumber":1},{"time":115744.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":115869.79166666664,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":115869.79166666664,"duration":156.25,"noteNumber":38,"velocity":39,"programNumber":1},{"time":115994.79166666664,"duration":171.875,"noteNumber":36,"velocity":38,"programNumber":1},{"time":115994.79166666664,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":116244.79166666664,"duration":182.29166666667152,"noteNumber":36,"velocity":28,"programNumber":1},{"time":116244.79166666664,"duration":250,"noteNumber":42,"velocity":45,"programNumber":1},{"time":116494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":116494.79166666664,"duration":156.25,"noteNumber":38,"velocity":28,"programNumber":1},{"time":116619.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":116619.79166666664,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":116744.79166666664,"duration":109.375,"noteNumber":38,"velocity":25,"programNumber":1},{"time":116744.79166666664,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":116994.79166666664,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":116994.79166666664,"duration":125,"noteNumber":36,"velocity":35,"programNumber":1},{"time":117119.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":117244.79166666664,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":117244.79166666664,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":117369.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":117494.79166666664,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":117494.79166666664,"duration":130.20833333332848,"noteNumber":38,"velocity":18,"programNumber":1},{"time":117619.79166666664,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":117619.79166666664,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":117744.79166666664,"duration":72.91666666667152,"noteNumber":38,"velocity":20,"programNumber":1},{"time":117744.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":117869.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":117869.79166666664,"duration":166.66666666667152,"noteNumber":38,"velocity":37,"programNumber":1},{"time":117994.79166666664,"duration":171.875,"noteNumber":36,"velocity":24,"programNumber":1},{"time":117994.79166666664,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":118244.79166666664,"duration":182.29166666667152,"noteNumber":36,"velocity":25,"programNumber":1},{"time":118244.79166666664,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":118494.79166666664,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":118494.79166666664,"duration":156.25,"noteNumber":38,"velocity":28,"programNumber":1},{"time":118619.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":118619.79166666664,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":118744.79166666664,"duration":109.375,"noteNumber":38,"velocity":25,"programNumber":1},{"time":118744.79166666664,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":118994.79166666664,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":118994.79166666664,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":119119.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":119244.79166666664,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":119244.79166666664,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":119369.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":119494.79166666664,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":119494.79166666664,"duration":130.20833333332848,"noteNumber":38,"velocity":16,"programNumber":1},{"time":119619.79166666664,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":119619.79166666664,"duration":125,"noteNumber":36,"velocity":34,"programNumber":1},{"time":119744.79166666664,"duration":125,"noteNumber":38,"velocity":19,"programNumber":1},{"time":119744.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":119869.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":119869.79166666664,"duration":166.66666666667152,"noteNumber":38,"velocity":35,"programNumber":1},{"time":119994.79166666664,"duration":156.25,"noteNumber":36,"velocity":39,"programNumber":1},{"time":119994.79166666664,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":120244.79166666664,"duration":177.08333333332848,"noteNumber":36,"velocity":40,"programNumber":1},{"time":120244.79166666664,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":120494.79166666664,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":120494.79166666664,"duration":156.25,"noteNumber":38,"velocity":27,"programNumber":1},{"time":120619.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":120619.79166666664,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":120744.79166666664,"duration":109.375,"noteNumber":38,"velocity":24,"programNumber":1},{"time":120744.79166666664,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":120994.79166666664,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":120994.79166666664,"duration":125,"noteNumber":36,"velocity":35,"programNumber":1},{"time":121119.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":121244.79166666664,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":121244.79166666664,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":121369.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":121494.79166666664,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":121494.79166666664,"duration":130.20833333332848,"noteNumber":38,"velocity":16,"programNumber":1},{"time":121619.79166666664,"duration":125,"noteNumber":36,"velocity":41,"programNumber":1},{"time":121619.79166666664,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":121744.79166666664,"duration":125,"noteNumber":38,"velocity":19,"programNumber":1},{"time":121744.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":121869.79166666664,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":121869.79166666664,"duration":156.25,"noteNumber":38,"velocity":37,"programNumber":1},{"time":121994.79166666664,"duration":156.25,"noteNumber":36,"velocity":37,"programNumber":1},{"time":121994.79166666664,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":122244.79166666664,"duration":182.29166666667152,"noteNumber":36,"velocity":27,"programNumber":1},{"time":122244.79166666664,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":122494.79166666664,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":122494.79166666664,"duration":156.25,"noteNumber":38,"velocity":28,"programNumber":1},{"time":122619.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":122619.79166666664,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":122744.79166666664,"duration":109.375,"noteNumber":38,"velocity":24,"programNumber":1},{"time":122744.79166666664,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":122994.79166666664,"duration":125,"noteNumber":42,"velocity":47,"programNumber":1},{"time":122994.79166666664,"duration":125,"noteNumber":36,"velocity":35,"programNumber":1},{"time":123119.79166666664,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":123244.79166666664,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":123244.79166666664,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":123369.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":123494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":123494.79166666664,"duration":130.20833333332848,"noteNumber":38,"velocity":16,"programNumber":1},{"time":123619.79166666664,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":123619.79166666664,"duration":125,"noteNumber":36,"velocity":37,"programNumber":1},{"time":123744.79166666664,"duration":125,"noteNumber":38,"velocity":17,"programNumber":1},{"time":123744.79166666664,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":123869.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":123869.79166666664,"duration":156.25,"noteNumber":38,"velocity":36,"programNumber":1},{"time":123994.79166666664,"duration":171.875,"noteNumber":36,"velocity":43,"programNumber":1},{"time":123994.79166666664,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":124244.79166666664,"duration":182.29166666667152,"noteNumber":36,"velocity":24,"programNumber":1},{"time":124244.79166666664,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":124494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":124494.79166666664,"duration":156.25,"noteNumber":38,"velocity":28,"programNumber":1},{"time":124619.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":124619.79166666664,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":124744.79166666664,"duration":109.375,"noteNumber":38,"velocity":26,"programNumber":1},{"time":124744.79166666664,"duration":296.875,"noteNumber":42,"velocity":25,"programNumber":1},{"time":124994.79166666664,"duration":67.70833333332848,"noteNumber":36,"velocity":35,"programNumber":1},{"time":125119.79166666664,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":125244.79166666664,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":125244.79166666664,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":125369.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":125494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":125494.79166666664,"duration":145.83333333332848,"noteNumber":38,"velocity":32,"programNumber":1},{"time":125619.79166666664,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":125619.79166666664,"duration":125,"noteNumber":36,"velocity":27,"programNumber":1},{"time":125744.79166666664,"duration":104.16666666667152,"noteNumber":38,"velocity":26,"programNumber":1},{"time":125744.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":125869.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":125869.79166666664,"duration":156.25,"noteNumber":38,"velocity":41,"programNumber":1},{"time":125994.79166666664,"duration":166.66666666667152,"noteNumber":36,"velocity":32,"programNumber":1},{"time":125994.79166666664,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":126244.79166666664,"duration":177.08333333332848,"noteNumber":36,"velocity":34,"programNumber":1},{"time":126244.79166666664,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":126494.79166666664,"duration":109.375,"noteNumber":38,"velocity":22,"programNumber":1},{"time":126494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":126619.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":126619.79166666664,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":126744.79166666664,"duration":109.375,"noteNumber":38,"velocity":21,"programNumber":1},{"time":126744.79166666664,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":126994.79166666664,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":126994.79166666664,"duration":130.20833333332848,"noteNumber":36,"velocity":29,"programNumber":1},{"time":127119.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":127244.79166666664,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":127244.79166666664,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":127369.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":127494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":127619.79166666664,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":127619.79166666664,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":127744.79166666664,"duration":67.70833333332848,"noteNumber":38,"velocity":24,"programNumber":1},{"time":127744.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":127869.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":127869.79166666664,"duration":156.25,"noteNumber":38,"velocity":41,"programNumber":1},{"time":127994.79166666664,"duration":171.875,"noteNumber":36,"velocity":30,"programNumber":1},{"time":127994.79166666664,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":128244.79166666664,"duration":177.08333333332848,"noteNumber":36,"velocity":41,"programNumber":1},{"time":128244.79166666664,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":128494.79166666664,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":128494.79166666664,"duration":156.25,"noteNumber":38,"velocity":21,"programNumber":1},{"time":128619.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":128619.79166666664,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":128744.79166666664,"duration":72.91666666667152,"noteNumber":38,"velocity":21,"programNumber":1},{"time":128744.79166666664,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":128994.79166666664,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":128994.79166666664,"duration":130.20833333332848,"noteNumber":36,"velocity":29,"programNumber":1},{"time":129119.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":129244.79166666664,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":129244.79166666664,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":129369.79166666664,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":129494.79166666664,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":129494.79166666664,"duration":135.41666666667152,"noteNumber":38,"velocity":20,"programNumber":1},{"time":129619.79166666664,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":129619.79166666664,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":129744.79166666664,"duration":67.70833333332848,"noteNumber":38,"velocity":25,"programNumber":1},{"time":129744.79166666664,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":129869.79166666664,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":129869.79166666664,"duration":156.25,"noteNumber":38,"velocity":43,"programNumber":1},{"time":129994.79166666664,"duration":171.875,"noteNumber":36,"velocity":37,"programNumber":1},{"time":129994.79166666664,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":130244.79166666664,"duration":177.08333333332848,"noteNumber":36,"velocity":37,"programNumber":1},{"time":130244.79166666664,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":130494.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":130494.79166666664,"duration":156.25,"noteNumber":38,"velocity":24,"programNumber":1},{"time":130619.79166666664,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":130619.79166666664,"duration":130.20833333332848,"noteNumber":36,"velocity":25,"programNumber":1},{"time":130744.79166666664,"duration":72.91666666665697,"noteNumber":38,"velocity":20,"programNumber":1},{"time":130744.79166666664,"duration":249.99999999998545,"noteNumber":42,"velocity":28,"programNumber":1},{"time":130994.79166666663,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":130994.79166666663,"duration":130.20833333334303,"noteNumber":36,"velocity":29,"programNumber":1},{"time":131119.79166666663,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":131244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":40,"programNumber":1},{"time":131244.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":131369.79166666663,"duration":125,"noteNumber":42,"velocity":30,"programNumber":1},{"time":131494.79166666663,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":131494.79166666663,"duration":130.20833333334303,"noteNumber":38,"velocity":21,"programNumber":1},{"time":131619.79166666663,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":131619.79166666663,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":131744.79166666663,"duration":104.16666666665697,"noteNumber":38,"velocity":25,"programNumber":1},{"time":131744.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":131869.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":131869.79166666663,"duration":151.04166666665697,"noteNumber":38,"velocity":43,"programNumber":1},{"time":131994.79166666663,"duration":171.875,"noteNumber":36,"velocity":33,"programNumber":1},{"time":131994.79166666663,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":132244.79166666663,"duration":182.29166666665697,"noteNumber":36,"velocity":34,"programNumber":1},{"time":132244.79166666663,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":132494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":132494.79166666663,"duration":156.25,"noteNumber":38,"velocity":22,"programNumber":1},{"time":132619.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":132619.79166666663,"duration":130.20833333334303,"noteNumber":36,"velocity":24,"programNumber":1},{"time":132744.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":21,"programNumber":1},{"time":132744.79166666663,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":132994.79166666663,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":132994.79166666663,"duration":130.20833333334303,"noteNumber":36,"velocity":28,"programNumber":1},{"time":133119.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":133244.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":133244.79166666663,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":133369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":133494.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":133619.79166666663,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":133619.79166666663,"duration":130.20833333334303,"noteNumber":36,"velocity":27,"programNumber":1},{"time":133744.79166666663,"duration":72.91666666668607,"noteNumber":38,"velocity":15,"programNumber":1},{"time":133744.79166666663,"duration":125.0000000000291,"noteNumber":42,"velocity":30,"programNumber":1},{"time":133869.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":133869.79166666666,"duration":156.25,"noteNumber":38,"velocity":34,"programNumber":1},{"time":133994.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":33,"programNumber":1},{"time":133994.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":134244.79166666666,"duration":177.08333333334303,"noteNumber":36,"velocity":31,"programNumber":1},{"time":134244.79166666666,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":134494.79166666666,"duration":109.375,"noteNumber":38,"velocity":24,"programNumber":1},{"time":134494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":134619.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":134619.79166666666,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":134744.79166666666,"duration":72.91666666665697,"noteNumber":38,"velocity":21,"programNumber":1},{"time":134744.79166666666,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":134994.79166666666,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":134994.79166666666,"duration":130.20833333334303,"noteNumber":36,"velocity":28,"programNumber":1},{"time":135119.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":135244.79166666666,"duration":125,"noteNumber":36,"velocity":24,"programNumber":1},{"time":135244.79166666666,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":135369.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":135494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":135494.79166666666,"duration":135.41666666665697,"noteNumber":38,"velocity":20,"programNumber":1},{"time":135619.79166666666,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":135619.79166666666,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":135744.79166666666,"duration":67.70833333334303,"noteNumber":38,"velocity":25,"programNumber":1},{"time":135744.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":135869.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":135869.79166666666,"duration":151.04166666665697,"noteNumber":38,"velocity":41,"programNumber":1},{"time":135994.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":36,"programNumber":1},{"time":135994.79166666666,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":136244.79166666666,"duration":166.66666666665697,"noteNumber":42,"velocity":42,"programNumber":1},{"time":136244.79166666666,"duration":177.08333333331393,"noteNumber":36,"velocity":38,"programNumber":1},{"time":136494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":136494.79166666663,"duration":156.25,"noteNumber":38,"velocity":29,"programNumber":1},{"time":136619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":49,"programNumber":1},{"time":136619.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":136744.79166666663,"duration":104.16666666665697,"noteNumber":38,"velocity":26,"programNumber":1},{"time":136744.79166666663,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":136994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":36,"programNumber":1},{"time":136994.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":137119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":137244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":32,"programNumber":1},{"time":137244.79166666663,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":137369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":137494.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":23,"programNumber":1},{"time":137494.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":137619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":38,"programNumber":1},{"time":137619.79166666663,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":137744.79166666663,"duration":93.75,"noteNumber":38,"velocity":32,"programNumber":1},{"time":137744.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":137869.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":137994.79166666663,"duration":145.83333333334303,"noteNumber":36,"velocity":43,"programNumber":1},{"time":137994.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":138244.79166666663,"duration":166.66666666665697,"noteNumber":36,"velocity":44,"programNumber":1},{"time":138244.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":138494.79166666663,"duration":62.5,"noteNumber":38,"velocity":28,"programNumber":1},{"time":138494.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":138619.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":138619.79166666663,"duration":125,"noteNumber":36,"velocity":34,"programNumber":1},{"time":138744.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":24,"programNumber":1},{"time":138744.79166666663,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":138994.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":138994.79166666663,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":139119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":139244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":37,"programNumber":1},{"time":139244.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":139369.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":139494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":139494.79166666663,"duration":166.66666666665697,"noteNumber":38,"velocity":24,"programNumber":1},{"time":139619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":34,"programNumber":1},{"time":139619.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":139744.79166666663,"duration":93.75,"noteNumber":38,"velocity":31,"programNumber":1},{"time":139744.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":139869.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":139869.79166666663,"duration":145.83333333334303,"noteNumber":38,"velocity":33,"programNumber":1},{"time":139994.79166666663,"duration":145.83333333334303,"noteNumber":36,"velocity":39,"programNumber":1},{"time":139994.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":140244.79166666663,"duration":166.66666666665697,"noteNumber":36,"velocity":40,"programNumber":1},{"time":140244.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":140494.79166666663,"duration":72.91666666665697,"noteNumber":38,"velocity":16,"programNumber":1},{"time":140494.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":140619.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":140619.79166666663,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":140744.79166666663,"duration":72.91666666665697,"noteNumber":38,"velocity":17,"programNumber":1},{"time":140744.79166666663,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":140994.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":140994.79166666663,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":141119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":141244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":34,"programNumber":1},{"time":141244.79166666663,"duration":125,"noteNumber":42,"velocity":33,"programNumber":1},{"time":141369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":141494.79166666663,"duration":125,"noteNumber":36,"velocity":43,"programNumber":1},{"time":141494.79166666663,"duration":125,"noteNumber":42,"velocity":75,"programNumber":1},{"time":141619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":52,"programNumber":1},{"time":141619.79166666663,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":141744.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":141869.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":141869.79166666663,"duration":145.83333333334303,"noteNumber":38,"velocity":33,"programNumber":1},{"time":141994.79166666663,"duration":151.04166666668607,"noteNumber":36,"velocity":37,"programNumber":1},{"time":141994.79166666663,"duration":250.0000000000291,"noteNumber":42,"velocity":39,"programNumber":1},{"time":142244.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":47,"programNumber":1},{"time":142244.79166666666,"duration":250,"noteNumber":42,"velocity":44,"programNumber":1},{"time":142494.79166666666,"duration":67.70833333334303,"noteNumber":38,"velocity":28,"programNumber":1},{"time":142494.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":142619.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":142619.79166666666,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":142744.79166666666,"duration":104.16666666665697,"noteNumber":38,"velocity":25,"programNumber":1},{"time":142744.79166666666,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":142994.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":36,"programNumber":1},{"time":142994.79166666666,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":143119.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":143244.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":31,"programNumber":1},{"time":143244.79166666666,"duration":125,"noteNumber":42,"velocity":33,"programNumber":1},{"time":143369.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":143494.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":143494.79166666666,"duration":166.66666666665697,"noteNumber":38,"velocity":22,"programNumber":1},{"time":143619.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":37,"programNumber":1},{"time":143619.79166666666,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":143744.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":30,"programNumber":1},{"time":143744.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":143869.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":143869.79166666666,"duration":145.83333333334303,"noteNumber":38,"velocity":34,"programNumber":1},{"time":143994.79166666666,"duration":145.83333333334303,"noteNumber":36,"velocity":43,"programNumber":1},{"time":143994.79166666666,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":144244.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":44,"programNumber":1},{"time":144244.79166666666,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":144494.79166666666,"duration":104.16666666665697,"noteNumber":38,"velocity":29,"programNumber":1},{"time":144494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":144619.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":144619.79166666666,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":144744.79166666666,"duration":67.70833333334303,"noteNumber":38,"velocity":26,"programNumber":1},{"time":144744.79166666666,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":144994.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":36,"programNumber":1},{"time":144994.79166666666,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":145119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":145244.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":38,"programNumber":1},{"time":145244.79166666666,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":145369.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":19,"programNumber":1},{"time":145369.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":145494.79166666666,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":145494.79166666666,"duration":125,"noteNumber":42,"velocity":64,"programNumber":1},{"time":145619.79166666666,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":145619.79166666666,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":145744.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":145869.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":145994.79166666666,"duration":145.83333333334303,"noteNumber":36,"velocity":41,"programNumber":1},{"time":145994.79166666666,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":146244.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":40,"programNumber":1},{"time":146244.79166666666,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":146494.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":146494.79166666666,"duration":156.25,"noteNumber":38,"velocity":28,"programNumber":1},{"time":146619.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":146619.79166666666,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":146744.79166666666,"duration":67.70833333334303,"noteNumber":38,"velocity":26,"programNumber":1},{"time":146744.79166666666,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":146994.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":146994.79166666666,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":147119.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":147244.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":35,"programNumber":1},{"time":147244.79166666666,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":147369.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":147494.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":147494.79166666666,"duration":166.66666666665697,"noteNumber":38,"velocity":21,"programNumber":1},{"time":147619.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":147619.79166666666,"duration":156.25,"noteNumber":42,"velocity":40,"programNumber":1},{"time":147869.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":35,"programNumber":1},{"time":147869.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":147994.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":33,"programNumber":1},{"time":147994.79166666666,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":148244.79166666666,"duration":177.08333333334303,"noteNumber":36,"velocity":32,"programNumber":1},{"time":148244.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":148494.79166666666,"duration":62.5,"noteNumber":38,"velocity":26,"programNumber":1},{"time":148494.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":148619.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":148619.79166666666,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":148744.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":31,"programNumber":1},{"time":148744.79166666666,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":148994.79166666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":148994.79166666666,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":149119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":149244.79166666666,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":149244.79166666666,"duration":125,"noteNumber":36,"velocity":26,"programNumber":1},{"time":149369.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":149494.79166666666,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":149494.79166666666,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":149619.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":46,"programNumber":1},{"time":149619.79166666666,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":149744.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":149869.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":149994.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":38,"programNumber":1},{"time":149994.79166666666,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":150244.79166666666,"duration":177.08333333334303,"noteNumber":36,"velocity":39,"programNumber":1},{"time":150244.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":150494.79166666666,"duration":62.5,"noteNumber":38,"velocity":25,"programNumber":1},{"time":150494.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":150619.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":150619.79166666666,"duration":125,"noteNumber":36,"velocity":27,"programNumber":1},{"time":150744.79166666666,"duration":67.70833333334303,"noteNumber":38,"velocity":24,"programNumber":1},{"time":150744.79166666666,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":150994.79166666666,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":150994.79166666666,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":151119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":151244.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":151244.79166666666,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":151369.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":151494.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":151619.79166666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":151619.79166666666,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":151744.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":151869.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":35,"programNumber":1},{"time":151869.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":151994.79166666666,"duration":156.25,"noteNumber":36,"velocity":35,"programNumber":1},{"time":151994.79166666666,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":152244.79166666666,"duration":192.70833333334303,"noteNumber":36,"velocity":32,"programNumber":1},{"time":152244.79166666666,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":152494.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":33,"programNumber":1},{"time":152494.79166666666,"duration":125,"noteNumber":42,"velocity":18,"programNumber":1},{"time":152619.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":27,"programNumber":1},{"time":152619.79166666666,"duration":125,"noteNumber":42,"velocity":15,"programNumber":1},{"time":152744.79166666666,"duration":250,"noteNumber":42,"velocity":14,"programNumber":1},{"time":152994.79166666666,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":152994.79166666666,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":153119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":153244.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":33,"programNumber":1},{"time":153244.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":153369.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":153494.79166666666,"duration":125,"noteNumber":36,"velocity":35,"programNumber":1},{"time":153494.79166666666,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":153619.79166666666,"duration":125,"noteNumber":36,"velocity":61,"programNumber":1},{"time":153619.79166666666,"duration":125,"noteNumber":42,"velocity":62,"programNumber":1},{"time":153744.79166666666,"duration":67.70833333334303,"noteNumber":38,"velocity":26,"programNumber":1},{"time":153744.79166666666,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":153869.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":153869.79166666666,"duration":156.25,"noteNumber":38,"velocity":39,"programNumber":1},{"time":153994.79166666666,"duration":171.875,"noteNumber":36,"velocity":33,"programNumber":1},{"time":153994.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":154244.79166666666,"duration":177.08333333334303,"noteNumber":36,"velocity":28,"programNumber":1},{"time":154244.79166666666,"duration":250,"noteNumber":42,"velocity":35,"programNumber":1},{"time":154494.79166666666,"duration":62.5,"noteNumber":38,"velocity":24,"programNumber":1},{"time":154494.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":154619.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":154619.79166666666,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":154744.79166666666,"duration":67.70833333334303,"noteNumber":38,"velocity":24,"programNumber":1},{"time":154744.79166666666,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":154994.79166666666,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":154994.79166666666,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":155119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":155244.79166666666,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":155244.79166666666,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":155369.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":155494.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":41,"programNumber":1},{"time":155494.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":155619.79166666666,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":155619.79166666666,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":155744.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":155869.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":37,"programNumber":1},{"time":155869.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":155994.79166666666,"duration":156.25,"noteNumber":36,"velocity":38,"programNumber":1},{"time":155994.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":156244.79166666666,"duration":177.08333333334303,"noteNumber":36,"velocity":39,"programNumber":1},{"time":156244.79166666666,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":156494.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":35,"programNumber":1},{"time":156494.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":156619.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":156619.79166666666,"duration":125,"noteNumber":36,"velocity":27,"programNumber":1},{"time":156744.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":30,"programNumber":1},{"time":156744.79166666666,"duration":250,"noteNumber":42,"velocity":27,"programNumber":1},{"time":156994.79166666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":156994.79166666666,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":157119.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":157244.79166666666,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":157244.79166666666,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":157369.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":157494.79166666666,"duration":125,"noteNumber":36,"velocity":41,"programNumber":1},{"time":157494.79166666666,"duration":125,"noteNumber":42,"velocity":51,"programNumber":1},{"time":157619.79166666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":157619.79166666666,"duration":140.625,"noteNumber":36,"velocity":40,"programNumber":1},{"time":157744.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":157869.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":157994.79166666666,"duration":166.66666666665697,"noteNumber":36,"velocity":36,"programNumber":1},{"time":157994.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":158244.79166666666,"duration":62.5,"noteNumber":38,"velocity":25,"programNumber":1},{"time":158244.79166666666,"duration":250,"noteNumber":42,"velocity":22,"programNumber":1},{"time":158494.79166666666,"duration":125,"noteNumber":42,"velocity":33,"programNumber":1},{"time":158494.79166666666,"duration":156.25,"noteNumber":38,"velocity":39,"programNumber":1},{"time":158619.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":158619.79166666666,"duration":125,"noteNumber":36,"velocity":25,"programNumber":1},{"time":158744.79166666666,"duration":78.125,"noteNumber":38,"velocity":32,"programNumber":1},{"time":158744.79166666666,"duration":250,"noteNumber":42,"velocity":24,"programNumber":1},{"time":158994.79166666666,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":158994.79166666666,"duration":156.25,"noteNumber":42,"velocity":43,"programNumber":1},{"time":159244.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":43,"programNumber":1},{"time":159244.79166666666,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":159369.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":159494.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":159619.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":39,"programNumber":1},{"time":159619.79166666666,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":159744.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":159869.79166666666,"duration":125,"noteNumber":42,"velocity":19,"programNumber":1},{"time":159994.79166666666,"duration":145.83333333334303,"noteNumber":36,"velocity":46,"programNumber":1},{"time":159994.79166666666,"duration":250,"noteNumber":42,"velocity":37,"programNumber":1},{"time":160244.79166666666,"duration":156.25,"noteNumber":36,"velocity":45,"programNumber":1},{"time":160244.79166666666,"duration":250,"noteNumber":42,"velocity":37,"programNumber":1},{"time":160494.79166666666,"duration":57.291666666656965,"noteNumber":38,"velocity":32,"programNumber":1},{"time":160494.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":160619.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":50,"programNumber":1},{"time":160619.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":160744.79166666666,"duration":250,"noteNumber":42,"velocity":24,"programNumber":1},{"time":160994.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":42,"programNumber":1},{"time":160994.79166666666,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":161119.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":161244.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":40,"programNumber":1},{"time":161244.79166666666,"duration":125,"noteNumber":42,"velocity":32,"programNumber":1},{"time":161369.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":161494.79166666666,"duration":125,"noteNumber":36,"velocity":55,"programNumber":1},{"time":161494.79166666666,"duration":125,"noteNumber":42,"velocity":59,"programNumber":1},{"time":161619.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":65,"programNumber":1},{"time":161619.79166666666,"duration":125,"noteNumber":42,"velocity":58,"programNumber":1},{"time":161744.79166666666,"duration":125,"noteNumber":42,"velocity":32,"programNumber":1},{"time":161869.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":161994.79166666666,"duration":145.83333333334303,"noteNumber":36,"velocity":42,"programNumber":1},{"time":161994.79166666666,"duration":250,"noteNumber":42,"velocity":37,"programNumber":1},{"time":162244.79166666666,"duration":250,"noteNumber":42,"velocity":21,"programNumber":1},{"time":162494.79166666666,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":162494.79166666666,"duration":166.66666666665697,"noteNumber":38,"velocity":38,"programNumber":1},{"time":162619.79166666666,"duration":114.58333333331393,"noteNumber":36,"velocity":49,"programNumber":1},{"time":162619.79166666666,"duration":124.9999999999709,"noteNumber":42,"velocity":24,"programNumber":1},{"time":162744.79166666663,"duration":250,"noteNumber":42,"velocity":23,"programNumber":1},{"time":162994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":162994.79166666663,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":163119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":163244.79166666663,"duration":109.375,"noteNumber":36,"velocity":54,"programNumber":1},{"time":163244.79166666663,"duration":125,"noteNumber":42,"velocity":34,"programNumber":1},{"time":163369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":163494.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":163619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":43,"programNumber":1},{"time":163619.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":163744.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":163869.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":163994.79166666663,"duration":145.83333333334303,"noteNumber":36,"velocity":50,"programNumber":1},{"time":163994.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":164244.79166666663,"duration":156.25,"noteNumber":36,"velocity":49,"programNumber":1},{"time":164244.79166666663,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":164494.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":31,"programNumber":1},{"time":164494.79166666663,"duration":125,"noteNumber":42,"velocity":19,"programNumber":1},{"time":164619.79166666663,"duration":114.58333333334303,"noteNumber":36,"velocity":52,"programNumber":1},{"time":164619.79166666663,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":164744.79166666663,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":164994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":42,"programNumber":1},{"time":164994.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":165119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":165244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":43,"programNumber":1},{"time":165244.79166666663,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":165369.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":165494.79166666663,"duration":83.33333333334303,"noteNumber":36,"velocity":49,"programNumber":1},{"time":165494.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":165619.79166666663,"duration":104.16666666665697,"noteNumber":36,"velocity":55,"programNumber":1},{"time":165619.79166666663,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":165744.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":165869.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":165994.79166666663,"duration":135.41666666665697,"noteNumber":36,"velocity":47,"programNumber":1},{"time":165994.79166666663,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":166244.79166666663,"duration":250,"noteNumber":42,"velocity":21,"programNumber":1},{"time":166494.79166666663,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":166494.79166666663,"duration":166.66666666665697,"noteNumber":38,"velocity":38,"programNumber":1},{"time":166619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":166619.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":166744.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":32,"programNumber":1},{"time":166744.79166666663,"duration":250,"noteNumber":42,"velocity":23,"programNumber":1},{"time":166994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":40,"programNumber":1},{"time":166994.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":167119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":167244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":167244.79166666663,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":167369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":167494.79166666663,"duration":125,"noteNumber":42,"velocity":19,"programNumber":1},{"time":167619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":46,"programNumber":1},{"time":167619.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":167744.79166666663,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":167869.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":167994.79166666663,"duration":145.83333333334303,"noteNumber":36,"velocity":43,"programNumber":1},{"time":167994.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":168244.79166666663,"duration":156.25,"noteNumber":36,"velocity":42,"programNumber":1},{"time":168244.79166666663,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":168494.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":168619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":49,"programNumber":1},{"time":168619.79166666663,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":168744.79166666663,"duration":250,"noteNumber":42,"velocity":24,"programNumber":1},{"time":168994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":168994.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":169119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":169244.79166666663,"duration":109.375,"noteNumber":36,"velocity":55,"programNumber":1},{"time":169244.79166666663,"duration":125,"noteNumber":42,"velocity":33,"programNumber":1},{"time":169369.79166666663,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":169494.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":43,"programNumber":1},{"time":169494.79166666663,"duration":119.79166666665697,"noteNumber":42,"velocity":63,"programNumber":1},{"time":169614.58333333328,"duration":119.79166666665697,"noteNumber":36,"velocity":113,"programNumber":1},{"time":169614.58333333328,"duration":130.20833333331393,"noteNumber":42,"velocity":82,"programNumber":1},{"time":169744.7916666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":169869.7916666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":169994.7916666666,"duration":156.25,"noteNumber":36,"velocity":54,"programNumber":1},{"time":169994.7916666666,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":170244.7916666666,"duration":57.291666666656965,"noteNumber":38,"velocity":31,"programNumber":1},{"time":170244.7916666666,"duration":276.04166666665697,"noteNumber":42,"velocity":21,"programNumber":1},{"time":170619.7916666666,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":170619.7916666666,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":170744.7916666666,"duration":104.16666666665697,"noteNumber":38,"velocity":25,"programNumber":1},{"time":170744.7916666666,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":170994.7916666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":170994.7916666666,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":171119.7916666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":171244.7916666666,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":171244.7916666666,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":171369.7916666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":171494.7916666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":171494.7916666666,"duration":130.20833333334303,"noteNumber":38,"velocity":16,"programNumber":1},{"time":171619.7916666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":171619.7916666666,"duration":125,"noteNumber":36,"velocity":43,"programNumber":1},{"time":171744.7916666666,"duration":125,"noteNumber":38,"velocity":21,"programNumber":1},{"time":171744.7916666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":171869.7916666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":171869.7916666666,"duration":156.25,"noteNumber":38,"velocity":37,"programNumber":1},{"time":171994.7916666666,"duration":171.875,"noteNumber":36,"velocity":29,"programNumber":1},{"time":171994.7916666666,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":172244.7916666666,"duration":177.08333333334303,"noteNumber":36,"velocity":29,"programNumber":1},{"time":172244.7916666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":172494.7916666666,"duration":72.91666666665697,"noteNumber":38,"velocity":14,"programNumber":1},{"time":172494.7916666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":172619.7916666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":172619.7916666666,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":172744.7916666666,"duration":72.91666666665697,"noteNumber":38,"velocity":14,"programNumber":1},{"time":172744.7916666666,"duration":250,"noteNumber":42,"velocity":26,"programNumber":1},{"time":172994.7916666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":172994.7916666666,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":173119.7916666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":173244.7916666666,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":173244.7916666666,"duration":125,"noteNumber":36,"velocity":44,"programNumber":1},{"time":173369.7916666666,"duration":57.291666666656965,"noteNumber":38,"velocity":17,"programNumber":1},{"time":173369.7916666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":173494.7916666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":173494.7916666666,"duration":156.25,"noteNumber":38,"velocity":34,"programNumber":1},{"time":173619.7916666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":173619.7916666666,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":173744.7916666666,"duration":125,"noteNumber":38,"velocity":27,"programNumber":1},{"time":173744.7916666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":173869.7916666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":173869.7916666666,"duration":140.625,"noteNumber":38,"velocity":24,"programNumber":1},{"time":173994.7916666666,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":173994.7916666666,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":174119.7916666666,"duration":67.70833333334303,"noteNumber":38,"velocity":22,"programNumber":1},{"time":174119.7916666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":174244.7916666666,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":174244.7916666666,"duration":125,"noteNumber":36,"velocity":26,"programNumber":1},{"time":174369.7916666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":174494.7916666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":174494.7916666666,"duration":145.83333333334303,"noteNumber":38,"velocity":34,"programNumber":1},{"time":174619.7916666666,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":174619.7916666666,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":174744.7916666666,"duration":67.70833333334303,"noteNumber":38,"velocity":25,"programNumber":1},{"time":174744.7916666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":174869.7916666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":174869.7916666666,"duration":156.25,"noteNumber":38,"velocity":41,"programNumber":1},{"time":174994.7916666666,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":174994.7916666666,"duration":125,"noteNumber":36,"velocity":41,"programNumber":1},{"time":175119.7916666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":175119.7916666666,"duration":166.66666666665697,"noteNumber":38,"velocity":16,"programNumber":1},{"time":175244.7916666666,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":175244.7916666666,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":175369.7916666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":175494.7916666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":175494.7916666666,"duration":145.83333333334303,"noteNumber":38,"velocity":38,"programNumber":1},{"time":175619.7916666666,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":175619.7916666666,"duration":130.20833333334303,"noteNumber":36,"velocity":26,"programNumber":1},{"time":175744.7916666666,"duration":72.91666666668607,"noteNumber":38,"velocity":19,"programNumber":1},{"time":175744.7916666666,"duration":125.0000000000291,"noteNumber":42,"velocity":25,"programNumber":1},{"time":175869.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":175869.79166666663,"duration":166.66666666665697,"noteNumber":38,"velocity":36,"programNumber":1},{"time":175994.79166666663,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":175994.79166666663,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":176119.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":176244.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":176244.79166666663,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":176369.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":24,"programNumber":1},{"time":176369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":176494.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":38,"programNumber":1},{"time":176494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":176619.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":176619.79166666663,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":176744.79166666663,"duration":125,"noteNumber":38,"velocity":23,"programNumber":1},{"time":176744.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":176869.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":176869.79166666663,"duration":140.625,"noteNumber":38,"velocity":19,"programNumber":1},{"time":176994.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":176994.79166666663,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":177119.79166666663,"duration":72.91666666665697,"noteNumber":38,"velocity":16,"programNumber":1},{"time":177119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":177244.79166666663,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":177244.79166666663,"duration":125,"noteNumber":36,"velocity":37,"programNumber":1},{"time":177369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":177494.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":177619.79166666663,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":177619.79166666663,"duration":125,"noteNumber":36,"velocity":44,"programNumber":1},{"time":177744.79166666663,"duration":72.91666666665697,"noteNumber":38,"velocity":19,"programNumber":1},{"time":177744.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":177869.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":177869.79166666663,"duration":156.25,"noteNumber":38,"velocity":37,"programNumber":1},{"time":177994.79166666663,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":177994.79166666663,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":178119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":178244.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":178244.79166666663,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":178369.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":22,"programNumber":1},{"time":178369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":178494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":178494.79166666663,"duration":151.04166666665697,"noteNumber":38,"velocity":40,"programNumber":1},{"time":178619.79166666663,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":178619.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":178744.79166666663,"duration":125,"noteNumber":38,"velocity":24,"programNumber":1},{"time":178744.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":178869.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":178869.79166666663,"duration":140.625,"noteNumber":38,"velocity":19,"programNumber":1},{"time":178994.79166666663,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":178994.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":179119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":179119.79166666663,"duration":166.66666666665697,"noteNumber":38,"velocity":17,"programNumber":1},{"time":179244.79166666663,"duration":125,"noteNumber":42,"velocity":33,"programNumber":1},{"time":179244.79166666663,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":179369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":179369.79166666663,"duration":177.08333333334303,"noteNumber":38,"velocity":30,"programNumber":1},{"time":179494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":179619.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":179619.79166666663,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":179744.79166666663,"duration":72.91666666665697,"noteNumber":38,"velocity":19,"programNumber":1},{"time":179744.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":179869.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":179869.79166666663,"duration":156.25,"noteNumber":38,"velocity":36,"programNumber":1},{"time":179994.79166666663,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":179994.79166666663,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":180119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":180244.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":180244.79166666663,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":180369.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":21,"programNumber":1},{"time":180369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":180494.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":39,"programNumber":1},{"time":180494.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":180619.79166666663,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":180619.79166666663,"duration":140.625,"noteNumber":36,"velocity":35,"programNumber":1},{"time":180744.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":180869.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":180869.79166666663,"duration":135.41666666665697,"noteNumber":38,"velocity":18,"programNumber":1},{"time":180994.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":180994.79166666663,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":181119.79166666663,"duration":72.91666666665697,"noteNumber":38,"velocity":15,"programNumber":1},{"time":181119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":181244.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":181244.79166666663,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":181369.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":30,"programNumber":1},{"time":181369.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":181494.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":181494.79166666663,"duration":145.83333333334303,"noteNumber":38,"velocity":38,"programNumber":1},{"time":181619.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":181619.79166666663,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":181744.79166666663,"duration":72.91666666665697,"noteNumber":38,"velocity":18,"programNumber":1},{"time":181744.79166666663,"duration":151.04166666665697,"noteNumber":42,"velocity":27,"programNumber":1},{"time":181994.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":181994.79166666663,"duration":125,"noteNumber":36,"velocity":39,"programNumber":1},{"time":182119.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":182244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":36,"programNumber":1},{"time":182244.79166666663,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":182369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":182494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":182619.79166666663,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":182619.79166666663,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":182744.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":29,"programNumber":1},{"time":182744.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":182869.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":182994.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":182994.79166666663,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":183119.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":30,"programNumber":1},{"time":183119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":183244.79166666663,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":183244.79166666663,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":183369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":183494.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":31,"programNumber":1},{"time":183494.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":183619.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":45,"programNumber":1},{"time":183619.79166666663,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":183744.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":183869.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":183994.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":183994.79166666663,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":184119.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":26,"programNumber":1},{"time":184119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":184244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":33,"programNumber":1},{"time":184244.79166666663,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":184369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":184494.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":184619.79166666663,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":184619.79166666663,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":184744.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":29,"programNumber":1},{"time":184744.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":184869.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":184994.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":184994.79166666663,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":185119.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":23,"programNumber":1},{"time":185119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":185244.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":185244.79166666663,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":185369.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":185494.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":185619.79166666663,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":185619.79166666663,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":185744.79166666663,"duration":67.70833333334303,"noteNumber":38,"velocity":24,"programNumber":1},{"time":185744.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":185869.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":185994.79166666663,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":185994.79166666663,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":186119.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":26,"programNumber":1},{"time":186119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":186244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":40,"programNumber":1},{"time":186244.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":186369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":186494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":186619.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":186619.79166666663,"duration":125,"noteNumber":36,"velocity":37,"programNumber":1},{"time":186744.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":29,"programNumber":1},{"time":186744.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":186869.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":186994.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":186994.79166666663,"duration":125,"noteNumber":36,"velocity":28,"programNumber":1},{"time":187119.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":31,"programNumber":1},{"time":187119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":187244.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":43,"programNumber":1},{"time":187244.79166666663,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":187369.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":187494.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":27,"programNumber":1},{"time":187494.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":187619.79166666663,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":187619.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":187744.79166666663,"duration":130.20833333334303,"noteNumber":42,"velocity":11,"programNumber":1},{"time":187874.99999999997,"duration":119.79166666665697,"noteNumber":42,"velocity":11,"programNumber":1},{"time":187994.79166666663,"duration":151.04166666665697,"noteNumber":36,"velocity":30,"programNumber":1},{"time":187994.79166666663,"duration":250,"noteNumber":42,"velocity":32,"programNumber":1},{"time":188244.79166666663,"duration":171.875,"noteNumber":36,"velocity":35,"programNumber":1},{"time":188244.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":188494.79166666663,"duration":57.291666666656965,"noteNumber":38,"velocity":31,"programNumber":1},{"time":188494.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":188619.79166666663,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":188619.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":188744.79166666663,"duration":114.58333333334303,"noteNumber":36,"velocity":61,"programNumber":1},{"time":188744.79166666663,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":188869.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":188994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":36,"programNumber":1},{"time":188994.79166666663,"duration":125,"noteNumber":42,"velocity":35,"programNumber":1},{"time":189119.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":189244.79166666663,"duration":130.20833333334303,"noteNumber":36,"velocity":33,"programNumber":1},{"time":189244.79166666663,"duration":130.20833333334303,"noteNumber":42,"velocity":48,"programNumber":1},{"time":189374.99999999997,"duration":119.79166666665697,"noteNumber":42,"velocity":40,"programNumber":1},{"time":189374.99999999997,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":189494.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":189619.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":189744.79166666663,"duration":161.45833333334303,"noteNumber":36,"velocity":30,"programNumber":1},{"time":189744.79166666663,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":189994.79166666663,"duration":62.5,"noteNumber":38,"velocity":31,"programNumber":1},{"time":189994.79166666663,"duration":250,"noteNumber":42,"velocity":21,"programNumber":1},{"time":190244.79166666663,"duration":125,"noteNumber":42,"velocity":31,"programNumber":1},{"time":190244.79166666663,"duration":161.45833333334303,"noteNumber":38,"velocity":26,"programNumber":1},{"time":190369.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":190369.79166666663,"duration":125,"noteNumber":36,"velocity":34,"programNumber":1},{"time":190494.79166666663,"duration":78.125,"noteNumber":38,"velocity":27,"programNumber":1},{"time":190494.79166666663,"duration":250,"noteNumber":42,"velocity":24,"programNumber":1},{"time":190744.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":42,"programNumber":1},{"time":190744.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":190869.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":190994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":43,"programNumber":1},{"time":190994.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":191119.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":191244.79166666663,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":191369.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":39,"programNumber":1},{"time":191369.79166666663,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":191494.79166666663,"duration":62.5,"noteNumber":38,"velocity":28,"programNumber":1},{"time":191494.79166666663,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":191619.79166666663,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":191744.79166666663,"duration":145.83333333334303,"noteNumber":36,"velocity":46,"programNumber":1},{"time":191744.79166666663,"duration":250,"noteNumber":42,"velocity":39,"programNumber":1},{"time":191994.79166666663,"duration":166.66666666665697,"noteNumber":36,"velocity":45,"programNumber":1},{"time":191994.79166666663,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":192244.79166666663,"duration":62.5,"noteNumber":38,"velocity":31,"programNumber":1},{"time":192244.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":192369.79166666663,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":192369.79166666663,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":192494.79166666663,"duration":62.5,"noteNumber":38,"velocity":27,"programNumber":1},{"time":192494.79166666663,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":192744.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":192744.79166666663,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":192869.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":192994.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":40,"programNumber":1},{"time":192994.79166666663,"duration":125,"noteNumber":42,"velocity":33,"programNumber":1},{"time":193119.79166666663,"duration":145.83333333334303,"noteNumber":42,"velocity":25,"programNumber":1},{"time":193369.79166666663,"duration":119.79166666665697,"noteNumber":36,"velocity":62,"programNumber":1},{"time":193369.79166666663,"duration":125,"noteNumber":42,"velocity":61,"programNumber":1},{"time":193494.79166666663,"duration":125,"noteNumber":42,"velocity":34,"programNumber":1},{"time":193619.79166666663,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":193744.79166666663,"duration":140.625,"noteNumber":36,"velocity":53,"programNumber":1},{"time":193744.79166666663,"duration":250,"noteNumber":42,"velocity":38,"programNumber":1},{"time":193994.79166666663,"duration":250,"noteNumber":42,"velocity":22,"programNumber":1},{"time":194244.79166666663,"duration":125,"noteNumber":42,"velocity":45,"programNumber":1},{"time":194244.79166666663,"duration":161.45833333334303,"noteNumber":38,"velocity":57,"programNumber":1},{"time":194369.79166666663,"duration":119.79166666668607,"noteNumber":36,"velocity":43,"programNumber":1},{"time":194369.79166666663,"duration":125.0000000000291,"noteNumber":42,"velocity":26,"programNumber":1},{"time":194494.79166666666,"duration":250,"noteNumber":42,"velocity":24,"programNumber":1},{"time":194744.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":54,"programNumber":1},{"time":194744.79166666666,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":194869.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":194994.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":50,"programNumber":1},{"time":194994.79166666666,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":195119.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":195244.79166666666,"duration":62.5,"noteNumber":38,"velocity":34,"programNumber":1},{"time":195244.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":195369.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":56,"programNumber":1},{"time":195369.79166666666,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":195494.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":195619.79166666666,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":195744.79166666666,"duration":145.83333333334303,"noteNumber":36,"velocity":43,"programNumber":1},{"time":195744.79166666666,"duration":250,"noteNumber":42,"velocity":42,"programNumber":1},{"time":195994.79166666666,"duration":161.45833333334303,"noteNumber":36,"velocity":43,"programNumber":1},{"time":195994.79166666666,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":196244.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":196369.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":47,"programNumber":1},{"time":196369.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":196494.79166666666,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":196744.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":56,"programNumber":1},{"time":196744.79166666666,"duration":130.20833333331393,"noteNumber":42,"velocity":43,"programNumber":1},{"time":196874.99999999997,"duration":119.79166666665697,"noteNumber":42,"velocity":25,"programNumber":1},{"time":196994.79166666663,"duration":114.58333333334303,"noteNumber":36,"velocity":56,"programNumber":1},{"time":196994.79166666663,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":197119.79166666663,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":197244.79166666663,"duration":93.75,"noteNumber":36,"velocity":48,"programNumber":1},{"time":197244.79166666663,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":197369.79166666663,"duration":104.16666666665697,"noteNumber":36,"velocity":58,"programNumber":1},{"time":197369.79166666663,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":197494.79166666663,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":197619.79166666663,"duration":62.5,"noteNumber":38,"velocity":37,"programNumber":1},{"time":197619.79166666663,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":197744.79166666663,"duration":135.41666666665697,"noteNumber":36,"velocity":60,"programNumber":1},{"time":197744.79166666663,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":197994.79166666663,"duration":62.5,"noteNumber":38,"velocity":36,"programNumber":1},{"time":197994.79166666663,"duration":250,"noteNumber":42,"velocity":22,"programNumber":1},{"time":198244.79166666663,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":198244.79166666663,"duration":161.45833333334303,"noteNumber":38,"velocity":56,"programNumber":1},{"time":198369.79166666663,"duration":119.79166666668607,"noteNumber":36,"velocity":55,"programNumber":1},{"time":198369.79166666663,"duration":125.0000000000291,"noteNumber":42,"velocity":30,"programNumber":1},{"time":198494.79166666666,"duration":62.5,"noteNumber":38,"velocity":33,"programNumber":1},{"time":198494.79166666666,"duration":250,"noteNumber":42,"velocity":24,"programNumber":1},{"time":198744.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":54,"programNumber":1},{"time":198744.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":198869.79166666666,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":198994.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":54,"programNumber":1},{"time":198994.79166666666,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":199119.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":199244.79166666666,"duration":125,"noteNumber":42,"velocity":19,"programNumber":1},{"time":199369.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":59,"programNumber":1},{"time":199369.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":199494.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":199619.79166666666,"duration":125,"noteNumber":42,"velocity":20,"programNumber":1},{"time":199744.79166666666,"duration":140.625,"noteNumber":36,"velocity":55,"programNumber":1},{"time":199744.79166666666,"duration":250,"noteNumber":42,"velocity":41,"programNumber":1},{"time":199994.79166666666,"duration":151.04166666665697,"noteNumber":36,"velocity":55,"programNumber":1},{"time":199994.79166666666,"duration":250,"noteNumber":42,"velocity":40,"programNumber":1},{"time":200244.79166666666,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":200369.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":43,"programNumber":1},{"time":200369.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":200494.79166666666,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":200744.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":54,"programNumber":1},{"time":200744.79166666666,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":200869.79166666666,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":200994.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":50,"programNumber":1},{"time":200994.79166666666,"duration":125,"noteNumber":42,"velocity":34,"programNumber":1},{"time":201119.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":201244.79166666666,"duration":125,"noteNumber":36,"velocity":57,"programNumber":1},{"time":201244.79166666666,"duration":125,"noteNumber":42,"velocity":67,"programNumber":1},{"time":201369.79166666666,"duration":114.58333333334303,"noteNumber":36,"velocity":127,"programNumber":1},{"time":201369.79166666666,"duration":125,"noteNumber":42,"velocity":88,"programNumber":1},{"time":201494.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":201619.79166666666,"duration":62.5,"noteNumber":38,"velocity":36,"programNumber":1},{"time":201619.79166666666,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":201744.79166666666,"duration":161.45833333334303,"noteNumber":36,"velocity":45,"programNumber":1},{"time":201744.79166666666,"duration":250,"noteNumber":42,"velocity":43,"programNumber":1},{"time":201994.79166666666,"duration":250,"noteNumber":42,"velocity":21,"programNumber":1},{"time":202244.79166666666,"duration":88.54166666665697,"noteNumber":38,"velocity":38,"programNumber":1},{"time":202244.79166666666,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":202369.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":52,"programNumber":1},{"time":202369.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":202494.79166666666,"duration":250,"noteNumber":42,"velocity":22,"programNumber":1},{"time":202744.79166666666,"duration":119.79166666665697,"noteNumber":36,"velocity":47,"programNumber":1},{"time":202744.79166666666,"duration":125,"noteNumber":42,"velocity":34,"programNumber":1},{"time":202869.79166666666,"duration":125,"noteNumber":42,"velocity":19,"programNumber":1},{"time":202994.79166666666,"duration":109.375,"noteNumber":36,"velocity":51,"programNumber":1},{"time":202994.79166666666,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":203119.79166666666,"duration":125,"noteNumber":42,"velocity":18,"programNumber":1},{"time":203244.79166666666,"duration":125,"noteNumber":42,"velocity":14,"programNumber":1},{"time":203369.79166666666,"duration":109.375,"noteNumber":36,"velocity":48,"programNumber":1},{"time":203369.79166666666,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":203494.79166666666,"duration":125,"noteNumber":42,"velocity":15,"programNumber":1},{"time":203619.79166666666,"duration":130.20833333334303,"noteNumber":42,"velocity":13,"programNumber":1},{"time":203750,"duration":114.58333333334303,"noteNumber":36,"velocity":46,"programNumber":1},{"time":203750,"duration":250,"noteNumber":42,"velocity":25,"programNumber":1},{"time":204000,"duration":145.83333333334303,"noteNumber":36,"velocity":44,"programNumber":1},{"time":204000,"duration":244.79166666668607,"noteNumber":42,"velocity":25,"programNumber":1},{"time":204244.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":204369.7916666667,"duration":119.79166666665697,"noteNumber":36,"velocity":48,"programNumber":1},{"time":204369.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":204494.7916666667,"duration":140.625,"noteNumber":42,"velocity":27,"programNumber":1},{"time":204744.7916666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":204744.7916666667,"duration":125,"noteNumber":36,"velocity":32,"programNumber":1},{"time":204869.7916666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":204994.7916666667,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":204994.7916666667,"duration":125,"noteNumber":36,"velocity":34,"programNumber":1},{"time":205119.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":205244.7916666667,"duration":62.5,"noteNumber":38,"velocity":38,"programNumber":1},{"time":205244.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":205369.7916666667,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":205369.7916666667,"duration":130.20833333334303,"noteNumber":36,"velocity":30,"programNumber":1},{"time":205494.7916666667,"duration":125,"noteNumber":38,"velocity":23,"programNumber":1},{"time":205494.7916666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":205619.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":205619.7916666667,"duration":140.625,"noteNumber":38,"velocity":18,"programNumber":1},{"time":205744.7916666667,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":205744.7916666667,"duration":125,"noteNumber":36,"velocity":44,"programNumber":1},{"time":205869.7916666667,"duration":72.91666666665697,"noteNumber":38,"velocity":16,"programNumber":1},{"time":205869.7916666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":205994.7916666667,"duration":125,"noteNumber":42,"velocity":34,"programNumber":1},{"time":205994.7916666667,"duration":125,"noteNumber":36,"velocity":36,"programNumber":1},{"time":206119.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":206244.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":206244.7916666667,"duration":145.83333333334303,"noteNumber":38,"velocity":39,"programNumber":1},{"time":206369.7916666667,"duration":125,"noteNumber":36,"velocity":45,"programNumber":1},{"time":206369.7916666667,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":206494.7916666667,"duration":67.70833333334303,"noteNumber":38,"velocity":19,"programNumber":1},{"time":206494.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":206619.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":206619.7916666667,"duration":166.66666666665697,"noteNumber":38,"velocity":37,"programNumber":1},{"time":206744.7916666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":206744.7916666667,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":206869.7916666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":206869.7916666667,"duration":140.625,"noteNumber":38,"velocity":26,"programNumber":1},{"time":206994.7916666667,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":206994.7916666667,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":207119.7916666667,"duration":67.70833333334303,"noteNumber":38,"velocity":22,"programNumber":1},{"time":207119.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":207244.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":207244.7916666667,"duration":151.04166666665697,"noteNumber":38,"velocity":39,"programNumber":1},{"time":207369.7916666667,"duration":125,"noteNumber":36,"velocity":37,"programNumber":1},{"time":207369.7916666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":207494.7916666667,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":207619.7916666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":207619.7916666667,"duration":140.625,"noteNumber":38,"velocity":18,"programNumber":1},{"time":207744.7916666667,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":207744.7916666667,"duration":125,"noteNumber":36,"velocity":43,"programNumber":1},{"time":207869.7916666667,"duration":72.91666666665697,"noteNumber":38,"velocity":16,"programNumber":1},{"time":207869.7916666667,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":207994.7916666667,"duration":119.79166666665697,"noteNumber":36,"velocity":44,"programNumber":1},{"time":207994.7916666667,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":208119.7916666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":208244.7916666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":208244.7916666667,"duration":151.04166666665697,"noteNumber":38,"velocity":37,"programNumber":1},{"time":208369.7916666667,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":208369.7916666667,"duration":125,"noteNumber":36,"velocity":40,"programNumber":1},{"time":208494.7916666667,"duration":125,"noteNumber":38,"velocity":19,"programNumber":1},{"time":208494.7916666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":208619.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":208619.7916666667,"duration":161.45833333334303,"noteNumber":38,"velocity":36,"programNumber":1},{"time":208744.7916666667,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":208744.7916666667,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":208869.7916666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":208994.7916666667,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":208994.7916666667,"duration":125,"noteNumber":36,"velocity":27,"programNumber":1},{"time":209119.7916666667,"duration":67.70833333334303,"noteNumber":38,"velocity":20,"programNumber":1},{"time":209119.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":209244.7916666667,"duration":62.5,"noteNumber":38,"velocity":38,"programNumber":1},{"time":209244.7916666667,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":209369.7916666667,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":209369.7916666667,"duration":125,"noteNumber":36,"velocity":34,"programNumber":1},{"time":209494.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":209619.7916666667,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":209744.7916666667,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":209744.7916666667,"duration":125,"noteNumber":36,"velocity":42,"programNumber":1},{"time":209869.7916666667,"duration":72.91666666665697,"noteNumber":38,"velocity":16,"programNumber":1},{"time":209869.7916666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":209994.7916666667,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":209994.7916666667,"duration":125,"noteNumber":36,"velocity":41,"programNumber":1},{"time":210119.7916666667,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":210244.7916666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":210244.7916666667,"duration":145.83333333334303,"noteNumber":38,"velocity":37,"programNumber":1},{"time":210369.7916666667,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":210369.7916666667,"duration":125,"noteNumber":36,"velocity":38,"programNumber":1},{"time":210494.7916666667,"duration":72.91666666665697,"noteNumber":38,"velocity":20,"programNumber":1},{"time":210494.7916666667,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":210619.7916666667,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":210619.7916666667,"duration":161.45833333334303,"noteNumber":38,"velocity":35,"programNumber":1},{"time":210744.7916666667,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":210744.7916666667,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":210869.7916666667,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":210869.7916666667,"duration":145.83333333334303,"noteNumber":38,"velocity":27,"programNumber":1},{"time":210994.7916666667,"duration":119.79166666668607,"noteNumber":36,"velocity":44,"programNumber":1},{"time":210994.7916666667,"duration":125.0000000000291,"noteNumber":42,"velocity":33,"programNumber":1},{"time":211119.79166666672,"duration":67.70833333334303,"noteNumber":38,"velocity":22,"programNumber":1},{"time":211119.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":211244.79166666672,"duration":62.5,"noteNumber":38,"velocity":38,"programNumber":1},{"time":211244.79166666672,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":211369.79166666672,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":211369.79166666672,"duration":125,"noteNumber":36,"velocity":33,"programNumber":1},{"time":211494.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":211619.79166666672,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":211619.79166666672,"duration":130.20833333334303,"noteNumber":38,"velocity":19,"programNumber":1},{"time":211744.79166666672,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":211744.79166666672,"duration":125,"noteNumber":36,"velocity":41,"programNumber":1},{"time":211869.79166666672,"duration":72.91666666665697,"noteNumber":38,"velocity":15,"programNumber":1},{"time":211869.79166666672,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":211994.79166666672,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":211994.79166666672,"duration":125,"noteNumber":36,"velocity":39,"programNumber":1},{"time":212119.79166666672,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":212244.79166666672,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":212369.79166666672,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":212369.79166666672,"duration":135.41666666665697,"noteNumber":36,"velocity":25,"programNumber":1},{"time":212494.79166666672,"duration":72.91666666665697,"noteNumber":38,"velocity":18,"programNumber":1},{"time":212494.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":212619.79166666672,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":212619.79166666672,"duration":161.45833333334303,"noteNumber":38,"velocity":35,"programNumber":1},{"time":212744.79166666672,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":212744.79166666672,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":212869.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":212994.79166666672,"duration":125,"noteNumber":42,"velocity":37,"programNumber":1},{"time":212994.79166666672,"duration":125,"noteNumber":36,"velocity":31,"programNumber":1},{"time":213119.79166666672,"duration":67.70833333334303,"noteNumber":38,"velocity":21,"programNumber":1},{"time":213119.79166666672,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":213244.79166666672,"duration":62.5,"noteNumber":38,"velocity":38,"programNumber":1},{"time":213244.79166666672,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":213369.79166666672,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":213369.79166666672,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":213494.79166666672,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":213619.79166666672,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":213744.79166666672,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":213744.79166666672,"duration":125,"noteNumber":36,"velocity":41,"programNumber":1},{"time":213869.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":213869.79166666672,"duration":166.66666666665697,"noteNumber":38,"velocity":15,"programNumber":1},{"time":213994.79166666672,"duration":125,"noteNumber":42,"velocity":38,"programNumber":1},{"time":213994.79166666672,"duration":125,"noteNumber":36,"velocity":37,"programNumber":1},{"time":214119.79166666672,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":214244.79166666672,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":214244.79166666672,"duration":145.83333333334303,"noteNumber":38,"velocity":37,"programNumber":1},{"time":214369.79166666672,"duration":125,"noteNumber":42,"velocity":42,"programNumber":1},{"time":214369.79166666672,"duration":125,"noteNumber":36,"velocity":44,"programNumber":1},{"time":214494.79166666672,"duration":125,"noteNumber":38,"velocity":18,"programNumber":1},{"time":214494.79166666672,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":214619.79166666672,"duration":125,"noteNumber":42,"velocity":22,"programNumber":1},{"time":214619.79166666672,"duration":166.66666666665697,"noteNumber":38,"velocity":36,"programNumber":1},{"time":214744.79166666672,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":214744.79166666672,"duration":125,"noteNumber":36,"velocity":29,"programNumber":1},{"time":214869.79166666672,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":214869.79166666672,"duration":145.83333333334303,"noteNumber":38,"velocity":26,"programNumber":1},{"time":214994.79166666672,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":214994.79166666672,"duration":125,"noteNumber":36,"velocity":30,"programNumber":1},{"time":215119.79166666672,"duration":67.70833333334303,"noteNumber":38,"velocity":22,"programNumber":1},{"time":215119.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":215244.79166666672,"duration":125,"noteNumber":42,"velocity":21,"programNumber":1},{"time":215244.79166666672,"duration":161.45833333334303,"noteNumber":38,"velocity":40,"programNumber":1},{"time":215369.79166666672,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":215369.79166666672,"duration":125,"noteNumber":36,"velocity":27,"programNumber":1},{"time":215494.79166666672,"duration":125,"noteNumber":42,"velocity":27,"programNumber":1},{"time":215619.79166666672,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":215619.79166666672,"duration":140.625,"noteNumber":38,"velocity":19,"programNumber":1},{"time":215744.79166666672,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":215744.79166666672,"duration":125,"noteNumber":36,"velocity":39,"programNumber":1},{"time":215869.79166666672,"duration":140.625,"noteNumber":42,"velocity":26,"programNumber":1},{"time":215869.79166666672,"duration":151.04166666665697,"noteNumber":38,"velocity":24,"programNumber":1},{"time":216119.79166666672,"duration":67.70833333334303,"noteNumber":38,"velocity":24,"programNumber":1},{"time":216119.79166666672,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":216244.79166666672,"duration":62.5,"noteNumber":38,"velocity":43,"programNumber":1},{"time":216244.79166666672,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":216369.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":60,"programNumber":1},{"time":216369.79166666672,"duration":125,"noteNumber":42,"velocity":46,"programNumber":1},{"time":216494.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":216619.79166666672,"duration":125,"noteNumber":42,"velocity":25,"programNumber":1},{"time":216744.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":48,"programNumber":1},{"time":216744.79166666672,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":216869.79166666672,"duration":62.5,"noteNumber":38,"velocity":30,"programNumber":1},{"time":216869.79166666672,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":216994.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":45,"programNumber":1},{"time":216994.79166666672,"duration":125,"noteNumber":42,"velocity":41,"programNumber":1},{"time":217119.79166666672,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":217244.79166666672,"duration":125,"noteNumber":42,"velocity":26,"programNumber":1},{"time":217369.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":53,"programNumber":1},{"time":217369.79166666672,"duration":125,"noteNumber":42,"velocity":46,"programNumber":1},{"time":217494.79166666672,"duration":67.70833333334303,"noteNumber":38,"velocity":30,"programNumber":1},{"time":217494.79166666672,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":217619.79166666672,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":217744.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":58,"programNumber":1},{"time":217744.79166666672,"duration":125,"noteNumber":42,"velocity":49,"programNumber":1},{"time":217869.79166666672,"duration":67.70833333334303,"noteNumber":38,"velocity":23,"programNumber":1},{"time":217869.79166666672,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":217994.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":61,"programNumber":1},{"time":217994.79166666672,"duration":125,"noteNumber":42,"velocity":40,"programNumber":1},{"time":218119.79166666672,"duration":62.5,"noteNumber":38,"velocity":26,"programNumber":1},{"time":218119.79166666672,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":218244.79166666672,"duration":62.5,"noteNumber":38,"velocity":44,"programNumber":1},{"time":218244.79166666672,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":218369.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":56,"programNumber":1},{"time":218369.79166666672,"duration":125,"noteNumber":42,"velocity":43,"programNumber":1},{"time":218494.79166666672,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":218619.79166666672,"duration":125,"noteNumber":42,"velocity":23,"programNumber":1},{"time":218744.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":47,"programNumber":1},{"time":218744.79166666672,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":218869.79166666672,"duration":67.70833333334303,"noteNumber":38,"velocity":30,"programNumber":1},{"time":218869.79166666672,"duration":125,"noteNumber":42,"velocity":28,"programNumber":1},{"time":218994.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":41,"programNumber":1},{"time":218994.79166666672,"duration":125,"noteNumber":42,"velocity":39,"programNumber":1},{"time":219119.79166666672,"duration":125,"noteNumber":42,"velocity":29,"programNumber":1},{"time":219244.79166666672,"duration":125,"noteNumber":42,"velocity":24,"programNumber":1},{"time":219369.79166666672,"duration":119.79166666665697,"noteNumber":36,"velocity":54,"programNumber":1},{"time":219369.79166666672,"duration":125,"noteNumber":42,"velocity":44,"programNumber":1},{"time":219494.79166666672,"duration":125,"noteNumber":42,"velocity":15,"programNumber":1},{"time":219619.79166666672,"duration":62.5,"noteNumber":38,"velocity":26,"programNumber":1},{"time":219619.79166666672,"duration":125,"noteNumber":42,"velocity":16,"programNumber":1},{"time":219744.79166666672,"duration":166.66666666665697,"noteNumber":36,"velocity":60,"programNumber":1},{"time":219744.79166666672,"duration":250,"noteNumber":42,"velocity":45,"programNumber":1},{"time":219994.79166666672,"duration":192.70833333334303,"noteNumber":36,"velocity":45,"programNumber":1},{"time":219994.79166666672,"duration":250,"noteNumber":42,"velocity":58,"programNumber":1},{"time":220244.79166666672,"duration":125,"noteNumber":42,"velocity":36,"programNumber":1},{"time":220244.79166666672,"duration":166.66666666665697,"noteNumber":38,"velocity":23,"programNumber":1},{"time":220369.79166666672,"duration":125,"noteNumber":36,"velocity":61,"programNumber":1},{"time":220369.79166666672,"duration":130.20833333334303,"noteNumber":42,"velocity":48,"programNumber":1},{"time":220500.00000000006,"duration":2281.25,"noteNumber":42,"velocity":53,"programNumber":1}]]}
},{}]},{},[26]);
