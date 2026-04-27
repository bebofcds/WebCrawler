// utils/transformGraph.ts
const transformGraph = (
  graph: Record<string, { data: string; children: string[] }>
) => {
  const nodes: { id: string; title: string }[] = [];
  const links: { source: string; target: string }[] = [];
  const allNodeIds = new Set<string>();

  // First pass: collect all node IDs (keys + children)
  Object.keys(graph).forEach((url) => {
    allNodeIds.add(url);
    graph[url].children.forEach((child) => allNodeIds.add(child));
  });

  // Create nodes for every ID
  allNodeIds.forEach((id) => {
    nodes.push({
      id,
      title: graph[id]?.data || id, // fallback to URL if missing
    });
  });

  // Create links
  Object.keys(graph).forEach((url) => {
    graph[url].children.forEach((child) => {
      links.push({ source: url, target: child });
    });
  });

  return { nodes, links };
};

export default transformGraph;