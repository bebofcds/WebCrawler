import React from 'react'

const Loading = () => {
    return (
        <>
            <div className="fixed inset-0 bg-black opacity-75"></div>

            <div className="z-20 text-white fixed left-10 bottom-10 text-4xl font-bold">
                loading...
            </div>
        </>
    )
}

export default Loading