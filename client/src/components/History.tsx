import { useNavigate } from "react-router-dom";

interface HistoryItem {
    _id: string;
    result: {
        title?: string;
        graph?: Record<string, { children: string[] }>;
    };
}

interface HistoryProps {
    history: HistoryItem[];
}

const History = ({ history }: HistoryProps) => {
    const navigate = useNavigate();

    if (!history || history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-2xl">
                <p className="text-gray-500 text-lg">No history yet.</p>
                <p className="text-gray-400 text-sm">Start by creating your first mind map!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((data) => {
                const graph: any = data.result?.graph;
                const title = data.result?.title || "Untitled Map";
                const rootUrl = graph ? Object.keys(graph)[0] : null;
                const rootNode = rootUrl ? graph[rootUrl] : null;
                const children = rootNode?.children ?? [];

                return (
                    <div
                        key={data._id}
                        onClick={() => navigate(`/${data._id}`)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                navigate(`/${data._id}`);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        className="group relative rounded-2xl border border-transparent
                        hover:border-slate-600 transition-all duration-300 cursor-pointer overflow-hidden"
                    >

                        <div className="p-5">
                            <h2 className="text-xl font-bold  truncate
                             ">
                                {title}
                            </h2>

                            {rootUrl && (
                                <p className="text-xs text-blue-500 underline mt-1 truncate ">
                                    {rootUrl}
                                </p>
                            )}

                            {children.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Top links · {children.length} total
                                    </p>
                                    <ul className="space-y-1.5 border-l ml-2 border-slate-600">
                                        {children.slice(0, 5).map((child: any, idx: any) => (
                                            <li
                                                key={idx}
                                                className="text-sm text-blue-600 underline truncate 
                                                pl-2 
                                                transition-colors"
                                            >
                                                {child}
                                            </li>
                                        ))}
                                        {children.length > 5 && (
                                            <li className="text-xs text-gray-400 italic pl-2">
                                                +{children.length - 5} more
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {children.length === 0 && (
                                <div className="mt-4 text-sm text-gray-400 italic">
                                    No child nodes previewed
                                </div>
                            )}

                            <div className="mt-4  flex justify-end">
                                <span className="text-white bg-black p-2 px-4 rounded-lg text-sm opacity-0
                                 group-hover:opacity-100 transition-opacity duration-200">
                                    View details →
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default History;