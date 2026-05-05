import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { CrawlResult, GraphNode } from "../types/crawler";

import Error from "../components/Error";
import Loading from "../components/Loading";
import FailedLinks from "../components/FailedLinks";
import Header from "../components/Header";
import TreeView from "../components/TreeView";
import NodeDetailsPanel from "../components/NodeDetailsPanel";
import { buildTreebeardData, outgoing } from "../utils/treeUtils";
import Outgoing from "../components/Outgoing";

export default function WebsiteContent(){
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CrawlResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>();


  const graph = data?.result?.graph;
  const title = data?.result?.title || "Untitled Map";
  const rootUrl = graph ? Object.keys(graph)[0] : null;
  

  const treeData = graph && rootUrl
    ? buildTreebeardData(graph, rootUrl, 4)
    : null;

  
  const handleNodeSelect = (node: GraphNode, url: string) => {
    setSelectedNode(node);
    setSelectedUrl(url);
  };

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

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
        setSelectedUrl(undefined);
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
    <div className="min-h-screen w-full p-6">
      {loading && <Loading />}
      {error && <Error message={error} />}

      {!loading && !error && data && (
        <div className="w-full max-w-400 mx-auto">



          <Header title={title} rootUrl={rootUrl} />



          <div className="flex flex-col lg:flex-row gap-6 min-h-[70vh]">
            <div className="lg:w-2/3 w-full overflow-hidden">

              <TreeView data={treeData} onSelect={handleNodeSelect} />
                           {
              outgoing && outgoing.size > 0 && (
                   <Outgoing outgoing={outgoing}/>
              )
             }

            </div>

            <div className="lg:w-1/3 w-full space-y-6">
              {data.failed_links && data.failed_links.length > 0 && (
                <FailedLinks data={data} />
              )}



              <NodeDetailsPanel selectedNode={selectedNode} selectedUrl={selectedUrl} />


            </div>
          </div>
        </div>
      )}
    </div>
  );
}