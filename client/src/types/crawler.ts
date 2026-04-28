// Shared TypeScript types for the WebCrawler project

/** A single node in the raw crawl graph returned by the backend */
export interface GraphNode {
  title: string;
  data: string;
  children: string[];
}

/** The full crawl result document stored in MongoDB */
export interface CrawlResult {
  _id: string;
  result: {
    graph: Record<string, GraphNode>;
    title: string;
  };
}

/** A history list item (same shape, used in /history response) */
export interface HistoryItem extends CrawlResult {}

/** A recursive tree node built from the flat graph */
export interface TreeNode {
  url: string;
  title: string;
  depth: number;
  children: TreeNode[];
}

/** Force-graph node shape */
export interface GraphVizNode {
  id: string;
  title: string;
}

/** Force-graph link shape */
export interface GraphVizLink {
  source: string;
  target: string;
}
