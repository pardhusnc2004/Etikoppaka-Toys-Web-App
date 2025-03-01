import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'

const PopUp = ({ message, _id, setShowPopUp }) => {

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/v1/items/${_id}`)
            toast.success(response.data.message)
            setShowPopUp(null)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='container size-18 bg-white flex p-6 gap-5 flex-col'>
                <div>
                    {message}
                </div>
                <div className='flex flex-row items-center justify-center gap-4'>
                    <span><button className='btn bg-red-800' onClick={() => setShowPopUp(null)}>No</button></span>
                    <span><button className='btn bg-green-700' onClick={handleDelete}>Yes</button></span>
                </div>
            </div>
        </div>
    )
}

export default PopUp