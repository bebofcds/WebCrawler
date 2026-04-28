// Strongly typed graph structure
 export interface GraphNode {
  title: string;
  data: string;
  children: Array<[string, number]>; // [url, depth] pairs
}

export interface GraphData {
  [url: string]: GraphNode;
}

export interface CrawlResult {
  _id?: string;
  result: {
    title: string;
    graph: GraphData;
  };
  failed_links?: string[];
}