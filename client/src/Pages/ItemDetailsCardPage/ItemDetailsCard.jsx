import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const VITE_MY_SERVER_URL = import.meta.env.VITE_MY_SERVER_URL

const ItemDetailsCard = () => {
    const { _id } = useParams()
    const [item, setItem] = useState(null)
    const [goToHome, setGoToHome] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`${VITE_MY_SERVER_URL}/api/v1/items/${_id}`)
                setItem(response.data.Item)
                toast.success(response.data.message)
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchItem()
    }, [_id])

    useEffect(() => {
        if(goToHome) {
            navigate('/')
            setGoToHome(false)
        }
    }, [goToHome])

    return (
        <div className="flex justify-center items-center flex-grow text-white p-6">
            {item ? (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-center">
                    <h2 className="text-3xl font-bold text-primary mb-4">{item.name}</h2>
                    <div className="flex flex-col items-center gap-4">
                        <div className="carousel w-full rounded-lg shadow-md border border-gray-700">
                            {item.images?.map((img, index) => (
                                <div key={index} id={`slide${index}`} className="carousel-item relative w-full">
                                    <img src={img} alt={`Item ${index}`} className="w-full object-cover rounded-lg" />
                                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                        <a href={`#slide${index === 0 ? item.images.length - 1 : index - 1}`} className="btn btn-circle">❮</a>
                                        <a href={`#slide${index === item.images.length - 1 ? 0 : index + 1}`} className="btn btn-circle">❯</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-300 text-lg">{item.description}</p>
                        <p className={`text-lg font-semibold ${item.available ? "text-green-400" : "text-red-400"}`}>
                            {item.available ? "Available" : "Unavailable"}
                        </p>
                        <button
                            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-all"
                            onClick={() => setGoToHome(true)}
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400 text-xl">Loading item details...</p>
            )}
        </div>
    )
}

export default ItemDetailsCard