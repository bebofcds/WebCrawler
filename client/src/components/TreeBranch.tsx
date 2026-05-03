import type { TreebeardNode } from "../utils/treeUtils";
import { VerticalLine } from "../utils/utiles";
import TreeNodeCard from "./TreeNodeCard";

interface TreeBranchProps {
    node: TreebeardNode;
    activeUrl: string | null;
    onSelect: (node: TreebeardNode) => void;
    expandedSet: Set<string>;
    onToggle: (node: TreebeardNode) => void;
}

function TreeBranch({
    node,
    activeUrl,
    onSelect,
    expandedSet,
    onToggle,
}: TreeBranchProps) {
    const nodeKey = node.url || node.name;
    const hasChildren = !!(node.children && node.children.length > 0);
    const isExpanded = expandedSet.has(nodeKey);
    const isActive = node.url === activeUrl;

    return (
        <div className="flex flex-col items-center min-w-0">
            <TreeNodeCard
                node={node}
                isActive={isActive}
                onSelect={onSelect}
                onToggle={onToggle}
                isExpanded={isExpanded}
                hasChildren={hasChildren}
            />

            {hasChildren && isExpanded && (
                <div className="flex flex-col items-center w-full">
                    <VerticalLine />

                    <div className="relative w-full">
                        <div className="flex justify-center gap-3 pt-1 flex-nowrap items-start">
                            {node.children!.map((child, idx) => (
                                <div
                                    key={child.url || child.name + idx}
                                    className="flex flex-col items-center min-w-0 shrink"
                                >
                                    <VerticalLine />
                                    <TreeBranch
                                        node={child}
                                        activeUrl={activeUrl}
                                        onSelect={onSelect}
                                        expandedSet={expandedSet}
                                        onToggle={onToggle}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default TreeBranch