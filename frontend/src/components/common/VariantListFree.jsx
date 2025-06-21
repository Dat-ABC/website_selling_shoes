import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function VariantListFree({ value, onChange }) {
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [stock, setStock] = useState('');

    // Debug log whenever variants change
    useEffect(() => {
        console.log('Current variants in VariantListFree:', value);
    }, [value]);

    const handleAddVariant = () => {
        if (!stock) {
            toast.error("Vui lòng điền số lượng");
            return;
        }

        const newVariant = {
            color: color.trim(),
            size: size.trim(),
            stock: parseInt(stock, 10)
        };

        // Create new array with existing variants plus new one
        const updatedVariants = [...value, newVariant];
        console.log('Updating variants:', updatedVariants);

        onChange(updatedVariants);

        // Reset inputs
        setColor('');
        setSize('');
        setStock('');
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Màu sắc"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="border p-2"
                />
                <Input
                    type="text"
                    placeholder="Kích thước"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="border p-2"
                />
                <Input
                    type="number"
                    placeholder="Số lượng tồn kho"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="border p-2 w-32"
                />
                <Button
                    type="button"
                    onClick={handleAddVariant}
                    className="bg-primary text-white px-2 py-1 rounded"
                >
                    Thêm
                </Button>
            </div>
            <div>
                {value.length === 0 ? (
                    <p>Chưa có biến thể</p>
                ) : (
                    <ul className="space-y-2">
                        {value.map((variant, idx) => (
                            <li key={idx} className="flex justify-between border p-2">
                                <span>{variant.color} - {variant.size}</span>
                                <span>Số lượng: {variant.stock}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}