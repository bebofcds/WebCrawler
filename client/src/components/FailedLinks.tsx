

const FailedLinks = ({data} : {data : any}) => {
  return (
           <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="font-medium text-red-700">Failed to crawl ({data.failed_links.length}):</p>
              <ul className="mt-2 text-sm text-red-600 break-all">
                {data.failed_links.slice(0, 5).map((link : any, idx : any) => (
                  <li key={idx}>{link}</li>
                ))}
                {data.failed_links.length > 5 && (
                  <li className="text-xs italic">+{data.failed_links.length - 5} more</li>
                )}
              </ul>
            </div>
  )
}

export default FailedLinks