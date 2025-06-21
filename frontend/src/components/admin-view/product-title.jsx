import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({ product, setFormData, setOpenCreateProductsDialog, setCurrentEditedId, handleDelete }) {
    return (
        <Card className="h-full flex flex-col">
            <div className="relative aspect-square">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <CardContent className="flex flex-col flex-grow p-4">
                <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                            {product.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {product.brand}
                        </span>
                    </div>
                    <p className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(product.price)}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                            setOpenCreateProductsDialog(true);
                            setCurrentEditedId(product._id);
                            setFormData(product);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDelete(product._id)}
                    >
                        Xóa
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default AdminProductTile;
