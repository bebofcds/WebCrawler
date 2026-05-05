 export interface GraphNode {
  title: string;
  data: string;
  children: Array<[string, number]>; 
}


export interface GraphData {
  [url: string]: GraphNode;
}

export interface CrawlResult {
  _id?: string;
  base_url: string 
  result: {
    title: string;
    graph: GraphData;
  };
  failed_links?: string[];
}


