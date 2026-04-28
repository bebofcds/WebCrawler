import { useMemo } from "react";
import {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
    ReactFlow,
} from "@xyflow/react";
import type {
    Node,
    Edge,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import '@xyflow/react/dist/style.css';
import type { GraphData, GraphNode } from "../types/crawler";

interface TreeAreaProps {
    graph: GraphData | undefined;
    selectedNode: GraphNode | null;
    onNodeClick: (node: GraphNode) => void;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (
    nodes: Node[],
    edges: Edge[],
    direction: "TB" | "LR" = "TB"
) => {

    dagreGraph.setGraph({
        rankdir: direction,
        nodesep: 80,
        ranksep: 100,
        marginx: 20,
        marginy: 20,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 300, height: 60 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 100,
                y: nodeWithPosition.y - 30,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

const TreeArea = ({ graph, selectedNode, onNodeClick }: TreeAreaProps) => {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        if (!graph) return { nodes: [], edges: [] };

        const flowNodes: Node[] = [];
        const flowEdges: Edge[] = [];
        const nodeMap = new Map<string, GraphNode>();

        Object.entries(graph).forEach(([url, nodeData]) => {
            nodeMap.set(url, nodeData);
            flowNodes.push({
                id: url,
                type: "default",
                position: { x: 0, y: 0 },
                data: {
                    label: nodeData.title || new URL(url).hostname,
                    originalNode: nodeData,
                    url,
                },
                style: {
                    background: selectedNode === nodeData ? "#e0e7ff" : "#ffffff",
                    border: selectedNode === nodeData ? "2px solid #4f46e5" : "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: "500",
                    width: "200px",
                    textAlign: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                },
            });
        });

        Object.entries(graph).forEach(([parentUrl, parentNode]) => {
            parentNode.children.forEach(([childUrl, depth]) => {
                if (nodeMap.has(childUrl)) {
                    flowEdges.push({
                        id: `${parentUrl}->${childUrl}`,
                        source: parentUrl,
                        target: childUrl,
                        type: "smoothstep",
                        animated: false,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: "#94a3b8",
                            width: 16,
                            height: 16,
                        },
                        style: { stroke: "#cbd5e1", strokeWidth: 1.5 },
                    });
                }
            });
        });

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            flowNodes,
            flowEdges,
            "TB"
        );

        return { nodes: layoutedNodes, edges: layoutedEdges };
    }, [graph, selectedNode]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Update nodes when initialNodes changes (e.g., selectedNode changes)
    useMemo(() => {
        if (initialNodes.length > 0) {
            setNodes(initialNodes);
            setEdges(initialEdges);
        }
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    const onNodeClickHandler = (_: React.MouseEvent, node: Node) => {
        const originalNode = node.data?.originalNode as GraphNode;
        if (originalNode) {
            onNodeClick(originalNode);
        }
    };

    if (!graph || Object.keys(graph).length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
                No graph data available
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-125 bg-gray-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClickHandler}
                fitView
                attributionPosition="bottom-left"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                zoomOnScroll={true}
                panOnScroll={false}
                panOnDrag={true}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
                <Controls showInteractive={false} />
                <Background color="#e2e8f0" gap={16} size={1} />
            </ReactFlow>
        </div>
    );
};

export default TreeArea;