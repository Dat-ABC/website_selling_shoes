import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch = useDispatch();
    const { featureImageList } = useSelector((state) => state.commonFeature);

    console.log(uploadedImageUrl, "uploadedImageUrl");

    function handleUploadFeatureImage() {
        dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getFeatureImages());
                setImageFile(null);
                setUploadedImageUrl("");
            }
        });
    }

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch]);

    console.log(featureImageList, "featureImageList");

    return (
        <div className="w-full h-full p-6">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Quản lý banner</h2>
                <div className="w-full">
                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isCustomStyling={true}
                    />
                    <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
                        Tải lên
                    </Button>
                </div>
                <div className="grid gap-6 mt-8">
                    {featureImageList && featureImageList.length > 0
                        ? featureImageList.map((featureImgItem) => (
                            <div key={featureImgItem._id} className="relative w-full">
                                <img
                                    src={featureImgItem.image}
                                    alt="Feature banner"
                                    className="w-full h-[400px] object-cover rounded-lg"
                                />
                            </div>
                        ))
                        : null}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
