var path = require('path'),
  res = require('..'),
  test = require('tape');

var test1 = res(path.join(__dirname, './test1'));
test('Get Flow', function(t) {
  t.plan(1);
  test1.getFlow(function(err, flow) {
    t.deepEqual(flow, [
      { smil: 'fbfw0001.smil', fragment: 'skvf00005' },
      { smil: 'fbfw0002.smil', fragment: 'skvf00007' },
      { smil: 'fbfw0003.smil', fragment: 'skvf00009' },
      { smil: 'fbfw0005.smil', fragment: 'skvf00013' },
      { smil: 'fbfw0005.smil', fragment: 'skvf00014' },
      { smil: 'fbfw0005.smil', fragment: 'skvf00015' },
      { smil: 'fbfw0005.smil', fragment: 'skvf00016' }
    ]);
  });
});

test('Get SMIL files', function(t) {
  t.plan(1);
  test1.getSmils(function(err, smils) {
    t.deepEqual(smils, [
      'fbfw0001.smil',
      'fbfw0002.smil',
      'fbfw0003.smil',
      'fbfw0005.smil',
    ]);
  });
});
