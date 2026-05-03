import type { GraphNode } from "../types/crawler";

interface NodeDetailsPanelProps {
  selectedNode: GraphNode | null;
  selectedUrl?: string;
}

export default function NodeDetailsPanel({ selectedNode, selectedUrl }: NodeDetailsPanelProps) {
  if (!selectedNode) {
    return (
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Node Details
        </h2>
        <div className="text-center py-8 text-gray-400">
          <p>Click on any node in the tree to see details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Node Details
      </h2>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            URL
          </label>
          <p className="text-gray-700 text-sm break-all font-mono">
            {selectedUrl}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Title
          </label>
          <p className="text-gray-800 font-medium">
            {selectedNode.title || "Untitled"}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Data / Description
          </label>
          <div className="text-sm text-gray-700 ">
            {selectedNode.data || "No content extracted."}
          </div>
        </div>
      </div>
    </div>
  );
}