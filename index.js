var fs = require('fs'),
  path = require('path'),
  cheerio = require('cheerio');

function DaisyResource(daisyPath) {
  if (!(this instanceof DaisyResource)) {
    return new DaisyResource(daisyPath);
  }

  this.ncc = path.join(daisyPath, 'ncc.html');
};

DaisyResource.prototype.getSmils = function getSmils(cb) {
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

    cb(null, smils);
  });
};

DaisyResource.prototype.getFlow = function getFlow(cb) {
  fs.readFile(this.ncc, 'utf8', function(err, data) {
    if (err) return cb(err);

    var anchors = [];
    var $ = cheerio.load(data);
    $('a').each(function(i, link) {
      var ref = link.attribs.href.split('#');
      anchors.push({ smil: ref[0], fragment: ref[1] });
    });

    cb(null, anchors);
  });
};

module.exports = DaisyResource;
