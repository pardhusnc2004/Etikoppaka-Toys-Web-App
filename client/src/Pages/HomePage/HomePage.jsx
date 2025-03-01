import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import PopUp from '../../Components/PopUp/PopUp';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { useSearch } from '../../Contexts/SearchContext'

const HomePage = () => {
    const { isAdmin } = useAuth()
    const [items, setItems] = useState(null);
    const [updateInitialized, setUpdateInitialized] = useState(false)
    const [showPopUp, setShowPopUp] = useState(null)
    const navigate = useNavigate()
    const [fetchAgain, setFetchAgain] = useState(false)
    const [areSorted, setAreSorted] = useState(false)
    const { searchQuery } = useSearch()

    useEffect(() => {
        if(searchQuery == "") {
            setFetchAgain(true)
        } else {
            let newItems = items.filter(item => (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())))
            setItems(newItems)
        }
    }, [searchQuery])

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/items')
            setItems(response.data.Items)
        } catch (error) {
            console.log(error.message)
        }            
    }

    useEffect(() => {
        setUpdateInitialized(false)
        fetchData();
    }, [updateInitialized])

    useEffect(() => {
        if(fetchAgain) {
            setFetchAgain(false)
            fetchData()
        }
    }, [fetchAgain])

    const handleItemAvailability = (item) => {
        const updateItemAvailability = async () => {
            try {
                const response = await axios.put(`http://localhost:4000/api/v1/items/${item._id}`, {
                    name: item.name,
                    description: item.description,
                    images: item.images,
                    available: !item.available
                })
                toast.success(response.data.message)
                setUpdateInitialized(true)
            } catch (error) {
                toast.error(error.message)
            }
        }
        updateItemAvailability()
    }

    const handleItemsSort = () => {
        if(areSorted) {
            let tmpSortedItems = items.sort((a, b) => (b.available? 1:0) - (a.available? 1:0))
            setItems(tmpSortedItems)
            setAreSorted(false)
        } else {
            let tmpSortedItems = items.sort((a, b) => (a.available? 1:0) - (b.available? 1:0))
            setItems(tmpSortedItems)
            setAreSorted(true)
        }
    }

    const handleAddItem = () => {
        navigate("/add-item")
    }

    return (
        <div className='text-center'>
            <div className="w-full overflow-x-auto">
                <table className="w-full border border-gray-700 rounded-lg text-center text-slate-200">
                    <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="p-3 border border-gray-700 whitespace-nowrap">S. NO</th>
                        <th className="p-3 border border-gray-700 whitespace-nowrap">Item Name</th>
                        <th className="p-3 border border-gray-700 whitespace-nowrap">Item Description</th>
                        <th className="p-3 border border-gray-700 whitespace-nowrap">Item Images</th>
                        <th
                        className="p-3 border border-gray-700 cursor-pointer whitespace-nowrap"
                        onClick={handleItemsSort}
                        >
                        Item Availability
                        </th>
                        {isAdmin && <th className="p-3 border border-gray-700 whitespace-nowrap">Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {items?.length > 0 ? (
                        items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="p-3 border border-gray-700">{index + 1}</td>
                            <td className="p-3 border border-gray-700">{item.name}</td>
                            <td className="p-3 border border-gray-700 truncate max-w-xs">{item.description}</td>
                            <td className="p-3 border border-gray-700 flex justify-center items-center">
                            <img
                                src={item.images ? item.images[0] : ""}
                                width="80px"
                                className="rounded-md shadow"
                                alt={item.name}
                            />
                            </td>
                            <td className="p-3 border border-gray-700">
                            {isAdmin ? (
                                <input
                                type="checkbox"
                                checked={item.available}
                                onChange={() => handleItemAvailability(item)}
                                />
                            ) : (
                                item.available ? "Yes" : "No"
                            )}
                            </td>
                            {isAdmin && (
                                <td className="p-3 border border-gray-700 text-center">
                                    <button
                                        className="px-3 py-1 bg-blue-800 text-white rounded-md hover:bg-blue-600 transition"
                                        onClick={() => navigate(`/update-item/${item._id}`)}
                                    >
                                    <   FontAwesomeIcon icon={faPencilSquare} />
                                    </button>
                                    <button
                                        className="ml-3 px-3 py-1 bg-red-800 text-white rounded-md hover:bg-red-600 transition"
                                        onClick={() => setShowPopUp(item._id)}
                                    >
                                    <   FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                </td>
                            )}
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={isAdmin ? 6 : 5} className="p-4 text-gray-400">
                            No items found
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className='flex gap-3 justify-center py-3'>
                <button className='btn' onClick={() => setFetchAgain(true)}>fetchAgain</button>
                {isAdmin? <div>
                    <button onClick={handleAddItem} className="btn bg-green-800 hover:bg-green-700">Add Item</button>
                </div>: null}
            </div>
            {showPopUp !== null && (
                <PopUp message="Are you sure you want to delete this item?" _id={showPopUp} setShowPopUp={setShowPopUp} />
            )}
        </div>
    )
}

export default HomePage