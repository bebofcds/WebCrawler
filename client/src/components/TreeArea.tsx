// TreeArea.tsx (updated)
import { useMemo, useEffect } from "react";
import {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    ReactFlow,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import '@xyflow/react/dist/style.css';
import type { GraphData, GraphNode } from "../types/crawler";

interface TreeAreaProps {
    graph: GraphData | undefined;
    selectedNode: GraphNode | null;
    onNodeClick: (node: GraphNode) => void;
    rootUrl?: string | null;
}

const getLayoutedElementsWithStrictLevels = (
    nodes: Node[],
    edges: Edge[],
    levels: Map<string, number>,
    levelHeight: number = 120,
    direction: "TB" | "LR" = "TB"
) => {
    if (direction !== "TB") {
        // For simplicity we enforce TB; you can extend to LR later.
        console.warn("Only 'TB' direction is supported for strict level alignment.");
    }

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
        rankdir: direction,
        nodesep: 80,
        ranksep: levelHeight,      // vertical separation between levels
        marginx: 30,
        marginy: 30,
        ranker: "tight-tree",      // keeps nodes in their assigned ranks
    });

    // Add nodes with fixed rank = depth level
    nodes.forEach((node) => {
        const depth = levels.get(node.id) ?? 0;
        dagreGraph.setNode(node.id, {
            width: 200,
            height: 60,
            rank: depth,           // enforce exact rank
        });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    // Extract X positions from dagre, but completely override Y based on depth
    const layoutedNodes = nodes.map((node) => {
        const pos = dagreGraph.node(node.id);
        const depth = levels.get(node.id) ?? 0;
        return {
            ...node,
            position: {
                x: pos.x - 100,           // center the node (width 200 / 2)
                y: depth * levelHeight,   // strict Y based on depth level
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

const TreeArea = ({ graph, selectedNode, onNodeClick, rootUrl }: TreeAreaProps) => {
    // 1. Compute depth levels using BFS from rootUrl
    const { nodes: initialNodes, edges: initialEdges, levels } = useMemo(() => {
        if (!graph || !rootUrl) return { nodes: [], edges: [], levels: new Map<string, number>() };

        const flowNodes: Node[] = [];
        const flowEdges: Edge[] = [];
        const levelsMap = new Map<string, number>();
        const visited = new Set<string>();

        const queue: { url: string; depth: number }[] = [{ url: rootUrl, depth: 0 }];

        while (queue.length) {
            const { url, depth } = queue.shift()!;
            if (visited.has(url) || !graph[url]) continue;
            visited.add(url);
            levelsMap.set(url, depth);

            const nodeData = graph[url];

            // Create React Flow node
            flowNodes.push({
                id: url,
                type: "default",
                position: { x: 0, y: 0 },
                data: {
                    label: nodeData.title || new URL(url).hostname,
                    originalNode: nodeData,
                    depth,
                },
                style: {
                    background: selectedNode === nodeData
                        ? "#e0e7ff"
                        : `hsl(${depth * 40}, 70%, 92%)`,
                    border: selectedNode === nodeData
                        ? "2px solid #4f46e5"
                        : "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    width: "200px",
                    textAlign: "center",
                    cursor: "pointer",
                },
            });

            // Create edges to children (only if child exists in graph)
            nodeData.children.forEach(([childUrl]) => {
                if (!graph[childUrl]) return;
                flowEdges.push({
                    id: `${url}->${childUrl}`,
                    source: url,
                    target: childUrl,
                    type: "smoothstep",
                    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
                    style: { stroke: "#cbd5e1", strokeWidth: 1.5 },
                });
                queue.push({ url: childUrl, depth: depth + 1 });
            });
        }

        return { nodes: flowNodes, edges: flowEdges, levels: levelsMap };
    }, [graph, rootUrl, selectedNode]);

    // 2. Apply layout with strict levels (Y coordinate forced by depth)
    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
        if (initialNodes.length === 0) return { nodes: [], edges: [] };
        return getLayoutedElementsWithStrictLevels(
            initialNodes,
            initialEdges,
            levels,
            130,      // levelHeight = spacing between rows
            "TB"
        );
    }, [initialNodes, initialEdges, levels]);

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [layoutedNodes, layoutedEdges]);

    const onNodeClickHandler = (_: React.MouseEvent, node: Node) => {
        const originalNode = node.data?.originalNode as GraphNode;
        if (originalNode) onNodeClick(originalNode);
    };

    if (!graph || !rootUrl) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
                No graph data available
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[500px]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClickHandler}
                nodesDraggable={false}
                fitView
                attributionPosition="bottom-left"
            >
                <Controls showInteractive={false} />
                <Background color="#e2e8f0" gap={16} size={1} />
            </ReactFlow>
        </div>
    );
};

export default TreeArea;