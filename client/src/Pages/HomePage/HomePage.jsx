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

    return (
        <div className='text-center'>
            <div className='flex flex-row gap-2'>
                <table className='text-center min-w-full text-slate-200'>
                    <thead>
                        <tr>
                            <th>S. NO</th>
                            <th>Item Name</th>
                            <th>Item Description</th>
                            <th>Item Images</th>
                            <th className='cursor-pointer' onClick={handleItemsSort}>Item Availability</th>
                            {isAdmin? <th>Actions</th>: null}
                        </tr>
                    </thead>
                    <tbody>
                        {items?.length && items.map((item, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td className='flex justify-center items-center'>
                                    <img src={item.images? item.images[0]: ""} width={"100px"} alt={item.name} />
                                </td>
                                <td>
                                    {isAdmin? <input type="checkbox" checked={item.available} onChange={() => {handleItemAvailability(item)}} />:
                                    item.available? "Yes":"No"}
                                </td>
                                {isAdmin? <td>
                                    <FontAwesomeIcon className='px-2' onClick={() => navigate(`/update-item/${item._id}`)} icon={faPencilSquare} />
                                    <FontAwesomeIcon className='px-2' icon={faTrashCan} onClick={() => setShowPopUp(item._id)} />
                                </td>: null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <button className='btn' onClick={() => setFetchAgain(true)}>fetchAgain</button>
            </div>
            {showPopUp !== null && (
                <PopUp message="Are you sure you want to delete this item?" _id={showPopUp} setShowPopUp={setShowPopUp} />
            )}
        </div>
    )
}

export default HomePage