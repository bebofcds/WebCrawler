import { useContext } from "react"
import { NodeContext } from "../context/DataContext"


const useNode = () => {
    const context = useContext(NodeContext)

    if(!context) {
        throw new Error("context error")
    }

    return context;
}

export default useNode;