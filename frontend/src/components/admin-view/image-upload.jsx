import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
    imageFile,
    setImageFile,
    imageLoadingState,
    uploadedImageUrl,
    setUploadedImageUrl,
    setImageLoadingState,
    isEditMode,
    isCustomStyling = false,
}) {
    const inputRef = useRef(null);

    console.log(isEditMode, "isEditMode");

    function handleImageFileChange(event) {
        console.log(event.target.files, "event.target.files");
        const selectedFile = event.target.files?.[0];
        console.log(selectedFile);

        if (selectedFile) setImageFile(selectedFile);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage() {
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const BACKEND_URL = import.meta.BACKEND_URL || "http://localhost:3000"

    async function uploadImageToCloudinary() {
        setImageLoadingState(true);
        const data = new FormData();
        data.append("my_file", imageFile);
        const response = await axios.post(
            `${BACKEND_URL}/api/admin/products/upload-image`,
            data
        );
        console.log(response, "response");

        if (response?.data?.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false);
        }
    }

    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);

    return (
        <div
            className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
        >
            <Label className="block mb-2 text-lg font-semibold">Tải hình ảnh lên</Label>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
            ${isEditMode ? "opacity-60" : ""} p-4 rounded-lg border-2 border-dashed }`}
            >
                <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                />
                {!imageFile ? (
                    <Label
                        htmlFor="image-upload"
                        className={`${isEditMode ? "cursor-not-allowed" : ""}flex flex-col justify-center items-center h-32 cursor-pointer }`}
                    >
                        <UploadCloudIcon className="mb-2 w-10 h-10 text-muted-foreground" />
                        <span>Kéo và thả hoặc nhấp để tải hình ảnh lên</span>
                    </Label>
                ) : imageLoadingState ? (
                    <Skeleton className="h-10 bg-gray-100" />
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FileIcon className="mr-2 w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{imageFile.name}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="w-4 h-4" />
                            <span className="sr-only">Xóa tệp</span>
                        </Button>
                    </div>
                )
                }
            </div >
        </div >
    );
}

export default ProductImageUpload;
