# mgraph.fromdot

Load DOT files into mgraph.graph

[![build status](https://img.shields.io/travis/yourusername/mgraph.fromdot.svg)](https://travis-ci.org/yourusername/mgraph.fromdot)

## Usage

### Via CDN

You can get the library from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/mgraph.fromdot/dist/mgraph.fromDot.js"></script>```
When loaded from a CDN the library is available as the global variable fromDot.

Via npm
Install the package using npm:

npm install mgraph.fromdot
Then, in your code:

// Using ES modules:
import fromDot from 'mgraph.fromdot';

// Or with CommonJS:
const fromDot = require('mgraph.fromdot');
After the library is loaded, it is straightforward to use:

// Load an empty graph:
const emptyGraph = fromDot('digraph G {}');

// Load a graph with edges only:
const twoEdgesGraph = fromDot('digraph G { a -> b }');

// The above graph is equivalent to:
const sameAsAbove = fromDot('digraph G { a; b; a -> b }');

// You can also "append" to an existing graph:
fromDot('digraph B { a -> b }', emptyGraph);

// Now, emptyGraph is no longer empty:
console.log(emptyGraph.getLinksCount()); // returns 1
console.log(emptyGraph.getNodesCount()); // returns 2

## License
BSD 3-Clause