<!-- README.md -->
# mgraph.fromdot

Modern DOT file parser for JavaScript — Load Graphviz DOT files into mgraph.graph

[![npm version](https://img.shields.io/npm/v/mgraph.fromdot.svg)](https://www.npmjs.com/package/mgraph.fromdot)
[![License](https://img.shields.io/npm/l/mgraph.fromdot.svg)](https://github.com/mfeldman143/mgraph.fromdot/blob/main/LICENSE)

## About This Project

**mgraph.fromdot** is a modern ES module refactoring of **ngraph.fromdot**, originally developed by [Andrei Kashcha](https://github.com/anvaka). This project retains the functionality of the original library while updating it to modern JavaScript standards.

This project is **not affiliated with or endorsed by Andrei Kashcha**, and any modifications are the responsibility of the maintainers of **mgraph.fromdot**.

## Installation

### Via npm

```bash
npm install mgraph.fromdot
```

### Via CDN
```html
<script src="https://cdn.jsdelivr.net/npm/mgraph.fromdot/dist/mgraph.fromdot.umd.min.js"></script>
```
When loaded from a CDN, the library is available as the global variable `mgraphFromDot`.

## Usage
### ES Modules (Recommended)
```javascript
import fromDot from 'mgraph.fromdot';

// Load an empty graph
const emptyGraph = fromDot('digraph G {}');

// Load a graph with edges only
const twoEdgesGraph = fromDot('digraph G { a -> b }');

// The above graph is equivalent to
const sameAsAbove = fromDot('digraph G { a; b; a -> b }');
```

### CommonJS
```javascript
const fromDot = require('mgraph.fromdot').default;
```

### TypeScript
```typescript
import fromDot from 'mgraph.fromdot';
import { Graph } from 'mgraph.graph';

const graph: Graph = fromDot('digraph G { a -> b }');
```

### CDN Usage
```html
<script src="https://cdn.jsdelivr.net/npm/mgraph.fromdot/dist/mgraph.fromdot.umd.min.js"></script>
<script>
  const graph = mgraphFromDot('digraph G { a -> b }');
</script>
```

## Advanced Usage
### Appending to Existing Graphs
```javascript
import fromDot from 'mgraph.fromdot';
import createGraph from 'mgraph.graph';

const existingGraph = createGraph();
existingGraph.addNode('existing');

// Append DOT data to existing graph
fromDot('digraph B { a -> b }', existingGraph);

console.log(existingGraph.getLinksCount()); // returns 1
console.log(existingGraph.getNodesCount()); // returns 3 (existing + a + b)
```

### Parsing Attributes
```javascript
const graph = fromDot(`
  digraph G {
    node1 [label="My Node" color="red" weight=5];
    node2 [shape=box];
    node1 -> node2 [style=dotted weight=2];
  }
`);

// Access node attributes
const node1 = graph.getNode('node1');
console.log(node1.data.label);  // "My Node"
console.log(node1.data.color);  // "red"
console.log(node1.data.weight); // 5

// Access edge attributes
const link = graph.getLink('node1', 'node2');
console.log(link.data.style);   // "dotted"
console.log(link.data.weight);  // 2
```

### Complex DOT Files
```javascript
const complexGraph = fromDot(`
  digraph G {
    rankdir=LR;
    
    subgraph cluster_0 {
      label="Process #1";
      style=filled;
      color=lightgrey;
      a0 -> a1 -> a2 -> a3;
    }
    
    subgraph cluster_1 {
      label="Process #2";
      b0 -> b1 -> b2 -> b3;
    }
    
    start -> a0;
    start -> b0;
    a1 -> b3;
    b2 -> a3;
    a3 -> end;
    b3 -> end;
  }
`);
```

## Framework Integration
### React
```jsx
import { useEffect, useState } from 'react';
import fromDot from 'mgraph.fromdot';

function GraphComponent({ dotString }) {
  const [graph, setGraph] = useState(null);
  
  useEffect(() => {
    const parsedGraph = fromDot(dotString);
    setGraph(parsedGraph);
  }, [dotString]);
  
  return <div>{/* Render your graph */}</div>;
}
```

### Vue
```vue
<script setup>
import { ref, watch } from 'vue';
import fromDot from 'mgraph.fromdot';

const props = defineProps(['dotString']);
const graph = ref(null);

watch(() => props.dotString, (newDot) => {
  graph.value = fromDot(newDot);
}, { immediate: true });
</script>
```

## API
### fromDot(dotString, appendTo?)
Parameters:

*   `dotString` (string) - A graph in DOT format
*   `appendTo` (Graph, optional) - An existing `mgraph.graph` instance to append to

Returns:

*   `Graph` - An `mgraph.graph` instance loaded with DOT data

Throws:

*   `Error` - If DOT string contains multiple graphs and `appendTo` is provided

## Supported DOT Features

*   ✅ Directed and undirected graphs
*   ✅ Node declarations with attributes
*   ✅ Edge declarations with attributes
*   ✅ Subgraphs and clusters
*   ✅ Node and edge styling attributes
*   ✅ Numeric and string attribute values
*   ✅ Array attribute values (JSON format)
*   ✅ Comments

## Part of the mgraph Ecosystem

*   `mgraph.graph` - Core graph data structure
*   `mgraph.events` - Event system
*   `mgraph.forcelayout` - Force-directed layouts
*   `mgraph.generators` - Graph generators
*   `mgraph.fromdot` - DOT file parser ← You are here
*   `mgraph.merge` - Object merging utility
*   `mgraph.random` - Seeded random numbers

## License
This project is released under the BSD 3-Clause License, in compliance with the original `ngraph.fromdot` licensing terms. See `LICENSE` for details.

## Contributing
Issues and pull requests are welcome on GitHub.

## Credits
Original `ngraph.fromdot` by Andrei Kashcha.
Modern `mgraph.fromdot` maintained by Michael Feldman.

This updated README:
*   ✅ Fixes the CDN URLs and global variable names
*   ✅ Adds proper badges and links
*   ✅ Shows comprehensive usage examples
*   ✅ Includes TypeScript examples
*   ✅ Shows framework integration (React, Vue)
*   ✅ Documents the API properly
*   ✅ Lists supported DOT features
*   ✅ Mentions the mgraph ecosystem
*   ✅ Adds proper attribution and licensing info
