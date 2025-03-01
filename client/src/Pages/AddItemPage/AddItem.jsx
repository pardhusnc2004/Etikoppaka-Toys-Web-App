import { faBox, faFileAlt, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AddItem = () => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])
    const [files, setFiles] = useState([])
    const [isUploading, setIsUploading] = useState(false)

    const handleFileUpload = (e) => {
        const uploadedFiles = e.target.files;
        let newFiles = []
        // console.log(uploadedFiles)
        for(let i=0; i<uploadedFiles.length; i++) {
            newFiles.push(uploadedFiles[i])
        }
        setFiles(newFiles)
    }

    const handleSingleFileUploadToCloudinary = async (file) => {
        try {
            const fileData = new FormData();
            fileData.append("file", file)
            fileData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
            fileData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
            const response = await axios.post(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, fileData, { withCredentials: false, headers: { "Content-Type": "multipart/form-data" } })
            const responseData = await response.data;
            return responseData.url
        } catch (error) {
            toast.error(error.message)
            return null
        }
    }

    const handleUploadFilesToCloudinary = async () => {
        setIsUploading(true)
        let uploadedImageURLs = []
        await Promise.all(files.map(async(file, index) => {
            const url = await handleSingleFileUploadToCloudinary(file)
            uploadedImageURLs.push(url)
        }));
        setImages(uploadedImageURLs)
        setIsUploading(false)
        return uploadedImageURLs;
    }
    
    useEffect(() => {
       handleAddItemToDB()
    }, [images])

    const handleAddItem = async () => {
        await handleUploadFilesToCloudinary()
    }

    const handleAddItemToDB = async() => {
        try {
            const response = await axios.post('http://localhost:4000/api/v1/items', {
                name: name,
                description: description,
                images: images
            })
            toast.success(response.data.message)
            console.log(response.data.Item)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col space-y-4 p-4 max-w-sm mx-auto text-slate-400">
            <label className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <FontAwesomeIcon style={{ paddingLeft: "19px" }} icon={faBox} />
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Name of the item" 
                    className="w-full pl-10 pr-3 py-2 focus:outline-none bg-transparent" 
                />
            </label>

            <label className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <FontAwesomeIcon style={{ paddingLeft: "19px" }} icon={faFileAlt} />
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Description of the item" 
                    className="w-full pl-10 pr-3 py-2 focus:outline-none bg-transparent" 
                />
            </label>

            <label className="relative flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <FontAwesomeIcon style={{ paddingLeft: "19px" }} icon={faUpload} />
                <input 
                    type="file" 
                    multiple 
                    onChange={handleFileUpload} 
                    className="w-full pl-10 pr-3 py-2 focus:outline-none bg-transparent" 
                />
            </label>

            <div>
                {files.length > 0 && files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                        <span>{file.name}</span>
                        <span>
                            <button 
                                className="text-red-800" 
                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </span>
                    </div>
                ))}
            </div>

            <button 
                className="btn bg-green-700 text-white py-2 rounded-lg" 
                disabled={isUploading} 
                onClick={handleAddItem}
            >
                {isUploading ? "Uploading..." : "Add Item"}
            </button>
        </div>
    )
}

export default AddItem