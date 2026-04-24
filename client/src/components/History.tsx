import { Link, useNavigate } from "react-router-dom"

const History = ({ history }: { history: any[] }) => {
    return (
        <div className="flex flex-wrap gap-5">
            {history.map((data: any, index: number) => {

                const graph = data.result.graph
                const title = data.result.title
                const navigate = useNavigate()
                const rootUrl = Object.keys(graph)[0]
                const rootNode = graph[rootUrl]

                return (
                    <div key={index} 
                    onClick={() => {
                        navigate(`/${data._id}`)
                    }}
                    className="mb-4 grow border rounded-lg p-6  cursor-pointer ">

                        <Link to={`${rootUrl}`} className=" text-blue-600 underline">
                            <h2>{title}</h2>
                        </Link>

                        <div className="ml-4">
                            {rootNode.children.slice(0, 20).map((child: string, i: number) => (
                                <div key={i}>
                                    <Link to={`/page?url=${child}`}>
                                        {child}
                                    </Link>
                                </div>
                            ))}
                        </div>

                    </div>
                )
            })}
        </div>
    )
}

export default History