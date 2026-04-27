
import { FiSearch } from 'react-icons/fi'
import History from '../components/History'
import useNode from '../hooks/useNode'

const Home = () => {
    const { loading, history } = useNode()
    return (
        <div className='w-full  p-7 h-fit flex justify-center items-center'>
            <div className="w-full  p-7 h-fit flex justify-center items-center">
                <div className="w-full">
                    <h1 className="text-3xl font-bold text-center ">Crawl Any Website You Want</h1>
                    <div className="w-[50%] p-2 m-auto border flex justify-between items-center 
        rounded-full mt-10">

                        <input
                            type="text"
                            placeholder="http://wikipedia.org..."
                            className="  m-1 w-full outline-none px-5" />

                        <div className=" text-2xl  p-3 bg-blue-600 rounded-full text-white mr-5 cursor-pointer">
                            <FiSearch />
                        </div>
                    </div>

                    <div className='font-bold text-gray-700'>
                        Scraped Websites
                    </div>
                    <History history={history} />

                </div>

                {loading &&
                    <>
                        <div
                            className="fixed left-0 right-0 top-0 bottom-0 
       bg-black opacity-75">

                        </div>

                        <div className="z-20 text-white 
       fixed left-15  text-4xl font-bold bottom-10">
                            loading...
                        </div>

                    </>
                }
            </div>
        </div>
    )
}

export default Home