import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const UpdateItem = () => {
    const { _id } = useParams()
    const [item, setItem] = useState(null)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [filesBeforeCloudinaryUpload, setFilesBeforeCloudinaryUpload] = useState([])
    const [files, setFiles] = useState(null)
    const [finalFiles, setFinalFiles] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/v1/items/${_id}`)
                toast.success(response.data.message)
                setItem(response.data.Item)
                setFiles(response.data.Item.images)
                setName(response.data.Item.name)
                setDescription(response.data.Item.description)
            } catch (error) {
                toast.error(error.message)
                toast.error("Invalid update request")
                navigate("/")
            }            
        }
        fetchItem();
    }, [_id, navigate])

    const handleAddItem = async () => {
        await handleUploadFilesToCloudinary()
    }

    useEffect(() => {
        if(finalFiles.length != 0) {
            handleUpdateItemToDB()
        }
    }, [finalFiles])

    const handleUpdateItemToDB = async() => {
        try {
            const response = await axios.put(`http://localhost:4000/api/v1/items/${item._id}`, {
                name: name,
                description: description,
                images: finalFiles
            })
            toast.success(response.data.message)
            console.log(response.data.Item)
        } catch (error) {
            toast.error(error.message)
        }
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
        if(filesBeforeCloudinaryUpload.length > 0) {
            await Promise.all(filesBeforeCloudinaryUpload.map(async(file, index) => {
                const url = await handleSingleFileUploadToCloudinary(file)
                uploadedImageURLs.push(url)
            }));
        }
        setFiles([...files, ...uploadedImageURLs])
        setFinalFiles([...files, ...uploadedImageURLs])
        setIsUploading(false)
        return uploadedImageURLs;
    }

    const handleFileUpload = (e) => {
        const uploadedFiles = e.target.files;
        let newFiles = []
        console.log(uploadedFiles)
        for(let i=0; i<uploadedFiles.length; i++) {
            newFiles.push(uploadedFiles[i])
        }
        setFilesBeforeCloudinaryUpload(newFiles)
    }



    return (
        <div>
            {item? <div className='py-3 flex flex-col gap-3 rounded-md'>
                <div>
                    <div><input type="text" placeholder='Name of the item: ' defaultValue={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div><input type="text" placeholder='Description of the item: ' defaultValue={description} onChange={(e) => setDescription(e.target.value)} /></div>
                    <div><input type="file" multiple onChange={(e) => handleFileUpload(e)} /></div>
                </div>
                <div className=''>
                    {files && files.map((file, index) => (
                        <div key={index} className='flex gap-3'>
                            <span>
                                <img width={"100px"} src={file} />
                            </span>
                            <span><button className='btn bg-red-800' onClick={() => {
                                let tmpFiles = files.filter(val => val != file)
                                setFiles(tmpFiles)
                            }}>X</button></span>
                        </div>
                    ))}
                    <div className='py-3'></div>
                        {filesBeforeCloudinaryUpload && filesBeforeCloudinaryUpload.map((file, index) => (
                        <div key={index} className='flex gap-3'>
                            <span>{file.name}</span>
                            <span>{file.type}</span>
                            <span><button className='btn bg-red-800' onClick={() => {
                                let tmpFiles = filesBeforeCloudinaryUpload.filter(val => val != file)
                                setFilesBeforeCloudinaryUpload(tmpFiles)
                            }}>X</button></span>
                        </div>
                    ))}
                </div>
                <div className='py-3'>
                    <button className='btn bg-green-700' disabled={isUploading} onClick={handleAddItem}>
                        {isUploading? "Uploading....":"Update Item"}
                    </button>
                </div>
            </div>: <div>Invalid Item</div>}
        </div>
    )
}

export default UpdateItem