// test/index.js
import { test } from 'tap';
import fromDot from '../index.js';

test('it can load an empty graph', t => {
  const graph = fromDot('graph G {}');
  t.equal(graph.getNodesCount(), 0, 'No nodes');
  t.equal(graph.getLinksCount(), 0, 'No links');
  t.end();
});

test('it loads graph with edges only', t => {
  const graph = fromDot('digraph G { a -> b }');
  t.equal(graph.getNodesCount(), 2, 'two nodes');
  t.equal(graph.getLinksCount(), 1, 'one link');
  const nodeA = graph.getNode('a');
  const nodeB = graph.getNode('b');
  t.equal(nodeA.id, 'a', 'Node a exists');
  t.equal(nodeB.id, 'b', 'Node b exists');
  t.end();
});

test('graph with separate node declarations', t => {
  const graph = fromDot('digraph G { a; b; a -> b }');
  t.equal(graph.getNodesCount(), 2, 'two nodes');
  t.equal(graph.getLinksCount(), 1, 'one link');
  t.end();
});

test('it can parse node attributes', t => {
  const graph = fromDot(`digraph {
      25 -> 26;
      25 [fontname="Palatino-Bold" shape=box size=0];
  }`);
  const data25 = graph.getNode(25).data;
  t.equal(data25.fontname, 'Palatino-Bold', 'font is here');
  t.equal(data25.shape, 'box', 'shape is here');
  t.equal(data25.size, 0, 'size is here');
  t.end();
});

test('it keeps node attributes when appending edges', t => {
  const graph = fromDot(`digraph {
      25 [fontname="Palatino-Bold" shape=box size=0];
      25 -> 26;
  }`);
  const data25 = graph.getNode(25).data;
  t.equal(data25.fontname, 'Palatino-Bold', 'font is here');
  t.equal(data25.shape, 'box', 'shape is here');
  t.equal(data25.size, 0, 'size is here');
  t.end();
});

test('it can parse nodes that start with numbers', t => {
  const graph = fromDot(`digraph {
      anvaka -> 5am;
  }`);
  t.ok(graph.getNode('anvaka'), 'anvaka was created');
  t.ok(graph.getNode('5am'), '5am was created');
  t.end();
});

test('it can parse edge attributes', t => {
  const graph = fromDot(`digraph {
      25 -> 26 [style=dotted width=2];
  }`);
  const linkData = graph.getLink(25, 26).data;
  t.equal(linkData.style, 'dotted', 'style attribute is present');
  t.equal(linkData.width, 2, 'width attribute is present');
  t.end();
});

test('it can parse negative attribute values', t => {
  const graph = fromDot(`digraph {
      hello ["count"=-633];
  }`);
  t.equal(graph.getNode('hello').data.count, -633, 'negative value parsed');
  t.end();
});

test('it can parse attributes with arrays', t => {
  const graph = fromDot(`digraph {
      hello ["position"="[1,2,3]"];
  }`);
  t.same(graph.getNode('hello').data.position, [1, 2, 3], 'array value parsed');
  t.end();
});
