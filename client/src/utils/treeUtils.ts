import type { GraphData, GraphNode } from "../types/crawler";

export interface TreebeardNode {
  name: string;
  children?: TreebeardNode[];
  originalNode?: GraphNode;
  url?: string;
}

export function buildTreebeardData(
  graph: GraphData,
  rootUrl: string,
  maxDepth = 4
): TreebeardNode | null {
  const rootNode = graph[rootUrl];
  if (!rootNode) return null;

  const visited = new Set<string>();

  function dfs(url: string, depth: number): TreebeardNode | null {
    if (depth > maxDepth || visited.has(url)) return null;
    visited.add(url);

    const node = graph[url];
    if (!node) return null;

    const children: TreebeardNode[] = [];
    for (const [childUrl] of node.children) {
      if (graph[childUrl]) {
        const childNode = dfs(childUrl, depth + 1);
        if (childNode) children.push(childNode);
      } else {
        children.push({
          name: childUrl,
          children: [],
          url: childUrl,
        });
      }
    }

    return {
      name: node.title || url,
      children: children.length ? children : undefined,
      originalNode: node,
      url,
    };
  }

  return dfs(rootUrl, 0);
}