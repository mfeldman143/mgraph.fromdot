import { describe, test, expect } from 'vitest';
import fromDot from '../index.js';

describe('mgraph.fromdot', () => {
  test('it can load an empty graph', () => {
    const graph = fromDot('graph G {}');
    expect(graph.getNodesCount()).toBe(0);
    expect(graph.getLinksCount()).toBe(0);
  });

  test('it loads graph with edges only', () => {
    const graph = fromDot('digraph G { a -> b }');
    expect(graph.getNodesCount()).toBe(2);
    expect(graph.getLinksCount()).toBe(1);
    
    const nodeA = graph.getNode('a');
    const nodeB = graph.getNode('b');
    expect(nodeA.id).toBe('a');
    expect(nodeB.id).toBe('b');
  });

  test('graph with separate node declarations', () => {
    const graph = fromDot('digraph G { a; b; a -> b }');
    expect(graph.getNodesCount()).toBe(2);
    expect(graph.getLinksCount()).toBe(1);
  });

  test('it can parse node attributes', () => {
    const graph = fromDot(`digraph {
      25 -> 26;
      25 [fontname="Palatino-Bold" shape=box size=0];
    }`);
    
    const data25 = graph.getNode(25).data;
    expect(data25.fontname).toBe('Palatino-Bold');
    expect(data25.shape).toBe('box');
    expect(data25.size).toBe(0);
  });

  test('it keeps node attributes when appending edges', () => {
    const graph = fromDot(`digraph {
      25 [fontname="Palatino-Bold" shape=box size=0];
      25 -> 26;
    }`);
    
    const data25 = graph.getNode(25).data;
    expect(data25.fontname).toBe('Palatino-Bold');
    expect(data25.shape).toBe('box');
    expect(data25.size).toBe(0);
  });

  test('it can parse nodes that start with numbers', () => {
    const graph = fromDot(`digraph {
      anvaka -> 5am;
    }`);
    
    expect(graph.getNode('anvaka')).toBeTruthy();
    expect(graph.getNode('5am')).toBeTruthy();
  });

  test('it can parse edge attributes', () => {
    const graph = fromDot(`digraph {
      25 -> 26 [style=dotted width=2];
    }`);
    
    const linkData = graph.getLink(25, 26).data;
    expect(linkData.style).toBe('dotted');
    expect(linkData.width).toBe(2);
  });

  test('it can parse negative attribute values', () => {
    const graph = fromDot(`digraph {
      hello ["count"=-633];
    }`);
    
    expect(graph.getNode('hello').data.count).toBe(-633);
  });

  test('it can parse attributes with arrays', () => {
    const graph = fromDot(`digraph {
      hello ["position"="[1,2,3]"];
    }`);
    
    expect(graph.getNode('hello').data.position).toEqual([1, 2, 3]);
  });
});