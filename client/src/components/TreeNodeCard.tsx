import type { TreebeardNode } from "../utils/treeUtils";
import { shortLabel } from "../utils/utiles";

interface TreeNodeCardProps {
    node: TreebeardNode;
    isActive: boolean;
    onSelect: (node: TreebeardNode) => void;
    onToggle: (node: TreebeardNode) => void;
    isExpanded: boolean;
    hasChildren: boolean;
}

function TreeNodeCard({
    node,
    isActive,
    onSelect,
    onToggle,
    isExpanded,
    hasChildren,
}: TreeNodeCardProps) {
    return (
        <div className="flex flex-col items-center min-w-0">
            <button
                onClick={() => onSelect(node)}
                title={node.url || node.name}
                className={`
          px-3 py-1.5 text-xs font-medium rounded-lg border
          max-w-40 whitespace-nowrap overflow-hidden text-ellipsis
          transition-all duration-100 cursor-pointer
          ${isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300"
                    }
        `}
            >
                {shortLabel(node.name)}
            </button>

            {hasChildren && (
                <button
                    onClick={() => onToggle(node)}
                    className="mt-1 text-[10px] font-semibold
                     text-gray-600 bg-gray-100 border
                      border-gray-300 rounded-full px-2 
                    py-0.5 cursor-pointer"
                >
                    {isExpanded ? "−" : `+${node.children!.length}`}
                </button>
            )}
        </div>
    );
}

export default TreeNodeCard;