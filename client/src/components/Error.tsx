import { MdErrorOutline } from "react-icons/md"

const Error = ({message }: {message : string}) => {
  return (
    <div className=" fixed right-10 flex justify-center items-center gap-2 top-10 p-3 px-4 bg-red-500
     text-white rounded-lg">
        <MdErrorOutline  className=" text-3xl"/>
        {message}
    </div>
  )
}

export default Error