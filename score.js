
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
