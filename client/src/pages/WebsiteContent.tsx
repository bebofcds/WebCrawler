import { useParams } from "react-router-dom";
import useNode from "../hooks/useNode";
import transformGraph from "../utils/transformGraph";
import ForceGraph2D from "react-force-graph-2d";
import { useMemo, useRef, useEffect, useState } from "react";

const WebsiteContent = () => {
  const { id } = useParams();
  const { history, loading } = useNode();
  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedGraphNode, setSelectedGraphNode] = useState<any>(null);

  const selectedNode = history?.find((item) => String(item._id) === String(id));

  const graphData = useMemo(() => {
    if (!selectedNode?.result?.graph) return { nodes: [], links: [] };
    try {
      return transformGraph(selectedNode.result.graph);
    } catch (err) {
      console.error(err);
      return { nodes: [], links: [] };
    }
  }, [selectedNode?.result?.graph]);

  // Responsive container size for the graph
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      setDimensions({ width, height });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Auto‑fit the graph after data loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (graphRef.current) graphRef.current.zoomToFit(400);
    }, 200);
    return () => clearTimeout(timer);
  }, [graphData, dimensions]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!selectedNode) return <div className="p-4">Node not found</div>;

  // Helper to get node display title
  const getNodeTitle = (node: any) => node.title || node.id;

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "8px 16px", borderBottom: "1px solid #ccc", background: "#f9f9f9" }}>
        <h2 style={{ margin: 0 }}>{selectedNode.result.title}</h2>
        <small style={{ color: "#666" }}>{selectedNode._id}</small>
      </div>

      {/* Main content: 2/3 graph + 1/3 info panel */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Graph container (2/3 width) */}
        <div
          ref={containerRef}
          style={{ flex: "2", position: "relative", background: "#fafafa" }}
        >
          {dimensions.width > 0 && dimensions.height > 0 && (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              width={dimensions.width}
              height={dimensions.height}
              nodeLabel={getNodeTitle}
              nodeColor={(node) => (node === selectedGraphNode ? "#ff5722" : "#3b82f6")}
              linkColor={() => "#aaa"}
              linkWidth={1}
              onNodeClick={(node) => {
                setSelectedGraphNode(node);
                console.log("Clicked node:", node);
              }}
              onEngineStop={() => graphRef.current?.zoomToFit(400)}
            />
          )}
        </div>

        <div
          style={{
            flex: "1",
            borderLeft: "1px solid #ddd",
            padding: "16px",
            overflowY: "auto",
            background: "#fff",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Node Information</h3>
          {selectedGraphNode ? (
            <div>
              <p>
                <strong>ID:</strong> {selectedGraphNode.id}
              </p>
              <p>
                <strong>Title:</strong> {selectedGraphNode.title || "—"}
              </p>
              <p>
                <strong>Connections:</strong>{" "}
                {
                  graphData.links.filter(
                    (l) => l.source.id === selectedGraphNode.id || l.target.id === selectedGraphNode.id
                  ).length
                }
              </p>
              <button
                onClick={() => setSelectedGraphNode(null)}
                style={{
                  marginTop: "12px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Clear selection
              </button>
            </div>
          ) : (
            <div>
              <p>Click on any node in the graph to see its details here.</p>
              <hr />
              <h4>Current Page Node</h4>
              <p>
                <strong>ID:</strong> {selectedNode._id}
              </p>
              <p>
                <strong>Title:</strong> {selectedNode.result.title}
              </p>
              <p>
                <strong>Total nodes in graph:</strong> {graphData.nodes.length}
              </p>
              <p>
                <strong>Total links:</strong> {graphData.links.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteContent;