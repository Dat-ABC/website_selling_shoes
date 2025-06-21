import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/components/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VariantListFree from "@/components/common/VariantListFree";


import {
    addNewProduct,
    deleteProduct,
    editProduct,
    fetchAllProducts,
} from "@/store/admin/products-slice";
import AdminProductTile from "@/components/admin-view/product-title";
import { toast } from "sonner";

// const initialFormData = {
//     image: null,
//     title: '',
//     description: '',
//     category: '',
//     brand: '',
//     price: '',
//     salePrice: '',
//     totalStock: ''
// }

const initialFormData = {
    image: null,
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    variants: [],    // mảng { color, size, stock }
    averageReview: 0,
};

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] =
        useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { productList } = useSelector((state) => state.adminProducts);
    const dispatch = useDispatch();

    // Log current form data
    console.log('Form data before submit:', formData);
    console.log('Variants before submit:', formData.variants);

    const handleVariantsChange = (newVariants) => {
        setFormData(prev => ({
            ...prev,
            variants: newVariants
        }));
        console.log("Updated formData with variants:", formData); // Debug log
    };

    function onSubmit(event) {
        event.preventDefault();

        // Log state before submission
        console.log('Submitting form data:', formData);
        console.log('Current variants:', formData.variants);

        const submitData = {
            ...formData,
            image: uploadedImageUrl,
            // Ensure variants are included and not overwritten
            variants: formData.variants || []
        };

        if (!submitData.variants.length) {
            toast.error("Vui lòng thêm ít nhất một biến thể cho sản phẩm");
            return;
        }

        currentEditedId !== null
            ? dispatch(
                editProduct({
                    id: currentEditedId,
                    formData: submitData,
                })
            ).then((data) => {
                console.log(data, "edit");

                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                }
            })
            : dispatch(
                addNewProduct(submitData)
            ).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductsDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    toast.success("Thêm sản phẩm thành công");
                }
            });
    }

    function handleDelete(getCurrentProductId) {
        dispatch(deleteProduct(getCurrentProductId)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
            }
        });
    }

    function isFormValid() {
        const requiredFields = ['title', 'price', 'image'];
        const hasRequiredFields = requiredFields.every(field => Boolean(formData[field]));

        // Kiểm tra xem có ít nhất một variant không
        const hasVariants = Array.isArray(formData.variants) && formData.variants.length > 0;

        return hasRequiredFields && hasVariants;
    }

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    console.log(formData, "productList");

    return (
        <Fragment>
            <div className="w-full h-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Quản lý sản phẩm</h2>
                    <Button onClick={() => setOpenCreateProductsDialog(true)}>
                        Thêm sản phẩm mới
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {productList && productList.length > 0
                        ? productList.map((productItem) => (
                            <AdminProductTile
                                key={productItem._id}
                                setFormData={setFormData}
                                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                                setCurrentEditedId={setCurrentEditedId}
                                product={productItem}
                                handleDelete={handleDelete}
                            />
                        ))
                        : null}
                </div>
                <Sheet
                    open={openCreateProductsDialog}
                    onOpenChange={() => {
                        setOpenCreateProductsDialog(false);
                        setCurrentEditedId(null);
                        setFormData(initialFormData);
                    }}
                >
                    <SheetContent side="right" className="overflow-auto">
                        <SheetHeader>
                            <SheetTitle>
                                {currentEditedId !== null ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                            </SheetTitle>
                        </SheetHeader>
                        <ProductImageUpload
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            uploadedImageUrl={uploadedImageUrl}
                            setUploadedImageUrl={setUploadedImageUrl}
                            setImageLoadingState={setImageLoadingState}
                            imageLoadingState={imageLoadingState}
                            isEditMode={currentEditedId !== null}
                        />
                        <div className="py-6">
                            <CommonForm
                                onSubmit={onSubmit}
                                formData={formData}
                                setFormData={setFormData}
                                buttonText={currentEditedId !== null ? "Sửa" : "Thêm"}
                                formControls={addProductFormElements}
                                isBtnDisabled={!isFormValid()}
                            >
                                {/* Thêm VariantListFree vào trong CommonForm */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium">Biến thể sản phẩm</label>
                                    <VariantListFree
                                        value={formData.variants}
                                        onChange={handleVariantsChange}
                                    />
                                </div>
                            </CommonForm>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </Fragment>
    );
}

export default AdminProducts;