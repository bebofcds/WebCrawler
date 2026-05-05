import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import History from '../components/History'
import Error from '../components/Error'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'

const Home = () => {
    const nativate = useNavigate();
    const [history, setHistory] = useState([]);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    useEffect(() => {
        setTimeout(() => {
            setError('')
        }, 5000)
    }, [error])


    const handleUrlReq = async () => {
        if (!url) {
            setError("the url is required")
            return;
        }
        setLoading(true)
        try {
            const res = await axios.post("http://localhost:8000/crawl", { url, depth: 4 })
            console.log(res.data);
            nativate(`/${res.data._id}`)
        } catch (error: any) {
            console.error(error.response);
            setError("Failed to get crawl this url")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fatchData = async () => {

            setLoading(true)
            try {
                const res = await axios.get("http://localhost:8000/history")
                setHistory(res.data.history)

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        }
        fatchData()
    }, [])

    return (
        <div className='w-full  p-7 h-fit flex justify-center items-center'>

            {error && <Error message={error} />}
            <div className="w-full  p-7 h-fit flex justify-center items-center">
                <div className="w-full">
                    <h1 className="text-3xl font-bold text-center ">Crawl Any Website You Want</h1>
                    <div className="w-[50%] p-2 m-auto border flex justify-between items-center 
        rounded-full mt-10">

                        <input
                            type="text"
                            placeholder="http://wikipedia.org..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="  m-1 w-full outline-none px-5" />

                        <div
                            onClick={handleUrlReq}
                            className=" text-2xl  p-3 bg-blue-600 rounded-full text-white mr-5 cursor-pointer">
                            <FiSearch />
                        </div>
                    </div>

                    <div className='font-bold text-gray-700'>
                        Scraped Websites
                    </div>
                    <History history={history} />

                </div>

                {loading &&
                  <Loading/>
                }
            </div>
        </div>
    )
}

export default Home