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
        console.log(uploadedFiles)
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
            const response = await axios.post(import.meta.env.VITE_CLOUDINARY_UPLOAD_URL, fileData)
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
        if(images.length != 0) {
            handleAddItemToDB()
        }
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
        <div className='py-3 flex flex-col gap-3 rounded-md'>
            <div>
                <div><input type="text" placeholder='Name of the item: ' onChange={(e) => setName(e.target.value)} /></div>
                <div><input type="text" placeholder='Description of the item: ' onChange={(e) => setDescription(e.target.value)} /></div>
                <div><input type="file" multiple onChange={(e) => handleFileUpload(e)} /></div>
            </div>
            <div className=''>
                {files && files.map((file, index) => (
                    <div key={index}>
                        <span>{file.name}</span>
                        <span>{file.type}</span>
                        <span><button className='btn bg-red-800' onClick={() => {
                            let tmpFiles = files.filter(val => val != file)
                            setFiles(tmpFiles)
                        }}>X</button></span>
                    </div>
                ))}
            </div>
            <div className='py-3'>
                <button className='btn bg-green-700' disabled={isUploading || files.length === 0} onClick={handleAddItem}>
                    {isUploading? "Uploading....":"Add Item"}
                </button>
            </div>
        </div>
    )
}

export default AddItem