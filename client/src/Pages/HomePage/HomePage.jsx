import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const HomePage = () => {
    const [items, setItems] = useState(null);
    const [updateInitialized, setUpdateInitialized] = useState(false)
    useEffect(() => {
        setUpdateInitialized(false)
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/items')
                setItems(response.data.Items)
            } catch (error) {
                console.log(error.message)
            }            
        }
        fetchData();
    }, [updateInitialized])
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
                            <th>Item Availability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.length && items.map((item, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>
                                    {item.images && item.images.map((img, imgIndex) => (
                                        <img key={imgIndex} src={img} alt={item.name} />
                                    ))}
                                </td>
                                <td>
                                    <input type="checkbox" defaultChecked={item.available} onChange={() => {handleItemAvailability(item)}} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HomePage