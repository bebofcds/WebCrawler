import { createContext, useState, useEffect } from "react";
import axios from "axios";

interface INode {
    _id: string;
    result: {
        graph: Record<string, { title: string, data: string, children: string[] }>;
        title: string;
    };
}

interface IDataContext {
    loading: boolean;
    history: INode[];
}

export const NodeContext = createContext<IDataContext | null>(null);

const NodeProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<INode[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8000/history");
                setHistory(res.data.history);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <NodeContext.Provider value={{ loading, history }}>
            {children}
        </NodeContext.Provider>
    );
};

export default NodeProvider;