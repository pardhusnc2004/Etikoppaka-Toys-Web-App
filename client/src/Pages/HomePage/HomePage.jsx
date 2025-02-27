import axios from 'axios';
import React, { useEffect, useState } from 'react'

const HomePage = () => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/items')
                setItems(response.data.Items)
            } catch (error) {
                console.log(error.message)
            }            
        }
        fetchData();
    }, [])
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
                        {items.length && items.map((item, index) => (
                            <tr>
                                <td>{index+1}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>
                                    {item.images && item.images.map((img, imgIndex) => (
                                        <span>{img}</span>
                                    ))}
                                </td>
                                <td>{item.available? "Available": "Not Available"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HomePage