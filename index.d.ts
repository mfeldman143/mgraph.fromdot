declare module "mgraph.fromdot" {
  import { Graph } from "mgraph.graph";

  /**
   * Loads a graph from a DOT string.
   *
   * @param dotGraph - A graph in DOT format
   * @param appendTo - Optional: an existing graph to append to
   * @returns The graph loaded with DOT data
   */
  export default function fromDot(dotGraph: string, appendTo?: Graph): Graph;
}