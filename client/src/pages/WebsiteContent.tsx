// WebsiteContent.tsx
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import type { CrawlResult, GraphNode, GraphData } from "../types/crawler";
import FailedLinks from "../components/FailedLinks";
import TreeArea from "../components/TreeArea";

const WebsiteContent = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CrawlResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const graph = data?.result?.graph;
  const title = data?.result?.title || "Untitled Map";
  const rootUrl = graph ? Object.keys(graph)[0] : null;

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // Fetch crawl data by ID
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No ID provided");
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get<CrawlResult>(`http://localhost:8000/history?id=${id}`);
        setData(res.data);
        setSelectedNode(null);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load this crawl. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen w-full p-6 ">
      {loading && <Loading />}
      {error && <Error message={error} />}
      {!loading && !error && data && (
        <div className="w-full max-w-400 mx-auto">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
              {rootUrl && (
                <div className="mt-2 text-sm text-gray-500">
                  Root:{" "}
                  <a
                    href={rootUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline font-mono"
                  >
                    {rootUrl}
                  </a>
                </div>
              )}
            </div>
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 transition"
            >
              <FaRegArrowAltCircleLeft />
              Back to home
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 min-h-[70vh]">
            <div className="lg:w-2/3 w-full rounded-xl shadow-md overflow-hidden border border-gray-200">
              <TreeArea
                graph={graph}
                selectedNode={selectedNode}
                onNodeClick={setSelectedNode}
              />
            </div>

            <div className="lg:w-1/3 w-full space-y-6">
                     {data.failed_links && data.failed_links.length > 0 && (
                <FailedLinks data={data} />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Node Details
                </h2>
                {selectedNode ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Title
                      </label>
                      <p className="text-gray-800 font-medium wrap-break-word">
                        {selectedNode.title || "Untitled"}
                      </p>
                    </div>
                    <div>
                      <div
                        className="text-sm"
                      >
                        {selectedNode.data}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Children
                      </label>
                      <p className="text-gray-700 text-sm">
                        {selectedNode.children.length} outgoing link(s)
                      </p>
                      {selectedNode.children.length > 0 && (
                        <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 rounded p-2 text-xs">
                          {selectedNode.children.map(([childUrl, depth], idx) => (
                            <div key={idx} className="truncate py-0.5">
                              <span className="text-gray-500">→</span>{" "}
                              <span className="font-mono">{childUrl}</span>
                              <span className="text-gray-400 ml-2">(depth: {depth})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>Click on any node in the tree to see details</p>
                  </div>
                )}
              </div>

 

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteContent;