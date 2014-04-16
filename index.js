var fs = require('fs'),
  path = require('path'),
  cheerio = require('cheerio'),
  async = require('async');

function DaisyResource(daisyPath) {
  if (!(this instanceof DaisyResource)) {
    return new DaisyResource(daisyPath);
  }

  this.root = daisyPath;
  this.ncc = path.join(daisyPath, 'ncc.html');
  this._cache = {};
};

DaisyResource.prototype.getSmils = function getSmils(cb) {
  var cache = this._cache;
  if ('smils' in cache) {
    return process.nextTick(function() { cb(null, cache.smils); });
  }

  this.getFlow(function(err, flow) {
    if (err) return cb(err);

    var present = {};
    var smils = flow.reduce(function(smils, ref) {
      if (!(ref.smil in present)) {
        present[ref.smil] = true;
        return smils.concat(ref.smil);
      } else {
        return smils;
      }
    }, []);

    cache.smils = smils;
    cb(null, smils);
  });
};

DaisyResource.prototype.getFlow = function getFlow(cb) {
  var cache = this._cache;
  if ('flow' in cache) {
    return process.nextTick(function() { cb(null, cache.flow); });
  }

  fs.readFile(this.ncc, 'utf8', function(err, data) {
    if (err) return cb(err);

    var anchors = [];
    var $ = cheerio.load(data);
    $('a').each(function(i, link) {
      var ref = link.attribs.href.split('#');
      anchors.push({ smil: ref[0], fragment: ref[1] });
    });

    cache.flow = anchors;
    cb(null, anchors);
  });
};

DaisyResource.prototype.getAudioFiles = function getAudioFiles(cb) {
  var cache = this._cache;
  if ('audio' in cache) {
    return process.nextTick(function() { cb(null, cache.audio); });
  }

  var root = this.root;
  function readAudio(smil, transform) {
    var files = [];
    fs.readFile(path.join(root, smil), 'utf8', function(err, content) {
      if (err) return transform(err);
      var $ = cheerio.load(content);
      $('audio').each(function(i, audio) {
        var src = audio.attribs.src;
        if (files.indexOf(src) === -1) {
          files.push(src);
        }
      });

      transform(null, files);
    });
  }

  this.getSmils(function(err, smils) {
    if (err) return cb(err);

    async.map(smils, readAudio, function(err, files) {
      if (err) return cb(err);

      var present = {};
      var ordered = files.reduce(function(old, val) {
        val.forEach(function(audioFile) {
          if (!(audioFile in present)) {
            present[audioFile] = true;
            old.push(audioFile);
          }
        });
        return old;
      }, []);

      cb(null, ordered);
    });
  });
};

module.exports = DaisyResource;
