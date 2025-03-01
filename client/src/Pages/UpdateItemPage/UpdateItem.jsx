import { faBox, faFileAlt, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
                const response = await axios.get(`https://etikoppaka-toys-web-app.onrender.com/api/v1/items/${_id}`)
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

    const handleUpdateItem = async () => {
        await handleUploadFilesToCloudinary()
    }

    useEffect(() => {
        handleUpdateItemToDB()
    }, [finalFiles])

    const handleUpdateItemToDB = async() => {
        try {
            const response = await axios.put(`https://etikoppaka-toys-web-app.onrender.com/api/v1/items/${item._id}`, {
                name: name,
                description: description,
                images: finalFiles
            })
            toast.success(response.data.message)
        } catch (error) {
            if(item) {
                toast.error(error.message)
            }
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
        } else {
            setFinalFiles([...files])
        }
        setFiles([...files, ...uploadedImageURLs])
        setFinalFiles([...files, ...uploadedImageURLs])
        setIsUploading(false)
        return uploadedImageURLs;
    }

    const handleFileUpload = (e) => {
        const uploadedFiles = e.target.files;
        let newFiles = []
        // console.log(uploadedFiles)
        for(let i=0; i<uploadedFiles.length; i++) {
            newFiles.push(uploadedFiles[i])
        }
        setFilesBeforeCloudinaryUpload(newFiles)
    }



    return (
        <div className="flex flex-col space-y-4 p-4 max-w-sm mx-auto text-slate-400">
            {item? <div className='py-3 flex flex-col gap-3 rounded-md'>
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
                    {files && files.map((file, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                            <span>
                                <img width={"100px"} src={file} />
                            </span>
                            <span>
                                <button className='btn bg-red-800' onClick={() => {
                                    let tmpFiles = files.filter(val => val != file)
                                    setFiles(tmpFiles)
                                }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </span>
                        </div>
                    ))}
                    {filesBeforeCloudinaryUpload && filesBeforeCloudinaryUpload.map((file, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                            <span>{file.name}</span>
                            <span>{file.type}</span>
                            <span>
                                <button className='btn bg-red-800' onClick={() => {
                                    let tmpFiles = filesBeforeCloudinaryUpload.filter(val => val != file)
                                    setFilesBeforeCloudinaryUpload(tmpFiles)
                                }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
                <button className='btn bg-green-700 text-white py-2 rounded-lg' disabled={isUploading} onClick={handleUpdateItem}>
                    {isUploading? "Uploading....":"Update Item"}
                </button>
            </div>: <div className="flex flex-col space-y-4 p-4 max-w-sm mx-auto text-slate-400">Invalid Item</div>}
        </div>
    )
}

export default UpdateItem