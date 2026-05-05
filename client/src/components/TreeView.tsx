import { useCallback, useState } from "react";
import type { TreebeardNode } from "../utils/treeUtils";
import type { GraphNode } from "../types/crawler";
import TreeBranch from "./TreeBranch";

interface TreeViewProps {
  data: TreebeardNode | null;
  onSelect: (node: GraphNode, url: string) => void;
}

export default function TreeView({ data, onSelect }: TreeViewProps) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [expandedSet, setExpandedSet] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (data?.url) initial.add(data.url);
    if (data?.children) {
      for (const child of data.children) {
        if (child.url) initial.add(child.url);
      }
    }
    return initial;
  });
  const handleNodeSelect = useCallback(
    (node: TreebeardNode) => {
      setActiveUrl(node.url || null);
      if (node.originalNode && node.url) {
        onSelect(node.originalNode, node.url);
      } else if (node.url) {
        const fallbackNode: GraphNode = {
          title: node.name,
          data: "No additional data (uncrawled link)",
          children: [],
        };
        onSelect(fallbackNode, node.url);
      }
    },
    [onSelect]
  );

  
  const handleToggle = useCallback((node: TreebeardNode) => {
    const key = node.url || node.name;
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  if (!data) {
    return (
      <div className="text-gray-700 text-center py-12 text-sm">
        No tree data available
      </div>
    );
  }

  return (
    <div className="bg-white overflow-auto p-6">
      <div className="flex justify-center">
        <TreeBranch
          node={data}
          activeUrl={activeUrl}
          onSelect={handleNodeSelect}
          expandedSet={expandedSet}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}