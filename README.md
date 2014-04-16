# daisy-resources

Get a data representation of a DAISY 2.02 book from parsing its files

## Examples
```js
var resources = require('daisy-resources');

var book = resources('./path/to/book');
book.getFlow(function(err, flow) {
  // Do something with the DAISY flow
});

book.getSmil(function(err, smilFiles) {
  // Do something with your list of SMIL files
});
```
