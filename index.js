// index.js
import parseDot from 'dotparser';
import createGraph from 'mgraph.graph';

/**
 * Loads a graph from a DOT string.
 *
 * @param {string} dotGraph - A graph in DOT format.
 * @param {object} [appendTo] - Optional: an existing graph to append to.
 * @returns {object} The graph (an instance of mgraph.graph) loaded with DOT data.
 */
export default function fromDot(dotGraph, appendTo) {
  const dotAST = parseDot(dotGraph);
  if (dotAST.length > 1 && appendTo !== undefined) {
    throw new Error(
      'Dot file contains multiple graphs. Cannot use `appendTo` in this case'
    );
  }
  if (!appendTo) {
    appendTo = createGraph();
  }
  return loadOne(appendTo, dotAST[0]);
}

function loadOne(graph, ast) {
  loadSubgraph(graph, ast);
  return graph;
}

function loadSubgraph(graph, ast) {
  const { children } = ast;
  if (!children) return graph;
  let addedNodes = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === 'edge_stmt') {
      addedNodes = addedNodes.concat(processEdgeStatement(graph, child));
    } else if (child.type === 'node_stmt') {
      addedNodes = addedNodes.concat(processNodeStatement(graph, child));
    } else if (child.type === 'subgraph') {
      addedNodes = addedNodes.concat(loadSubgraph(graph, child));
    }
  }
  return addedNodes;
}

function processEdgeStatement(graph, edgeAST) {
  const { edge_list, attr_list } = edgeAST;
  if (edge_list.length === 0) return [];
  const first = addNode(graph, edge_list[0]);
  let addedNodes = [].concat(first);
  const attributes = parseAttributesAsData(attr_list);
  let prevNodes = first;
  for (let i = 1; i < edge_list.length; i++) {
    const nextNodes = addNode(graph, edge_list[i]);
    addedNodes = addedNodes.concat(nextNodes);
    addLink(graph, prevNodes, nextNodes, attributes);
    prevNodes = nextNodes;
  }
  return addedNodes;
}

function processNodeStatement(graph, nodeStatement) {
  return addNode(graph, nodeStatement.node_id, nodeStatement.attr_list);
}

function addNode(graph, nodeAST, attributesList) {
  if (nodeAST.type === 'node_id') {
    const data = mergeNodeDataIfNeeded(
      parseAttributesAsData(attributesList),
      graph.getNode(nodeAST.id)
    );
    // If no extra data, simply add the node:
    graph.addNode(nodeAST.id, data || undefined);
    return [nodeAST.id];
  } else if (nodeAST.type === 'subgraph') {
    return loadSubgraph(graph, nodeAST);
  }
}

function addLink(graph, from, to, data) {
  for (let i = 0; i < from.length; i++) {
    for (let j = 0; j < to.length; j++) {
      graph.addLink(from[i], to[j], data);
    }
  }
}

function parseAttributesAsData(attributesList) {
  if (!attributesList || attributesList.length === 0) return undefined;
  const data = Object.create(null);
  for (let i = 0; i < attributesList.length; i++) {
    const attr = attributesList[i];
    if (attr.type !== 'attr' || attr.id === undefined) continue;
    // If the attribute value appears to be an array, try to parse it as JSON.
    const maybeArray =
      typeof attr.eq === 'string' &&
      attr.eq.startsWith('[') &&
      attr.eq.endsWith(']');
    if (maybeArray) {
      try {
        attr.eq = JSON.parse(attr.eq);
      } catch (e) {
        // ignore parsing errors; keep the string
      }
    }
    data[attr.id] = attr.eq;
  }
  return data;
}

function mergeNodeDataIfNeeded(newData, oldNode) {
  if (!oldNode || !oldNode.data) return newData;
  return Object.assign(oldNode.data, newData);
}
