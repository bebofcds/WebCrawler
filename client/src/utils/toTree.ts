// Convert a generic DAG into a tree (by removing extra incoming links)
const toTree = (graphData: { nodes: any[], links: any[] }, rootId: string) => {
  const nodeMap = new Map(graphData.nodes.map(n => [n.id, n]));
  const childToParent = new Map(); // keep only first parent

  const filteredLinks = graphData.links.filter(link => {
    if (!childToParent.has(link.target)) {
      childToParent.set(link.target, link.source);
      return true;
    }
    return false; // drop duplicate parent links
  });

  return { nodes: graphData.nodes, links: filteredLinks };
};

export default toTree