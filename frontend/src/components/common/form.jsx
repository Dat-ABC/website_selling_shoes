// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import VariantListFree from "./VariantListFree";



function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText }) {

    function renderInputsByComponentType(getControlItem) {
        let element = null;

        const value = formData[getControlItem.name] || ''

        switch (getControlItem.componentType) {
            case 'input':
                element = (
                    <Input
                        type={getControlItem.type}
                        name={getControlItem.name}
                        id={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        value={value}
                        onChange={(event) => {
                            setFormData({
                                ...formData,
                                [getControlItem.name]: event.target.value
                            });
                        }}
                    // onChange={getControlItem.onChange}
                    // className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                );
                break;
            case 'select':
                element = (
                    <Select onValueChange={
                        (value) => {
                            setFormData({
                                ...formData,
                                [getControlItem.name]: value
                            });
                        }
                    } value={value}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getControlItem.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                getControlItem.options &&
                                    getControlItem.options.length > 0 ?
                                    getControlItem.options.map(optionItem => <SelectItem key={optionItem.id} value={optionItem.id}>{optionItem.label}</SelectItem>) : null
                            }
                        </SelectContent>
                    </Select>
                );
                break;
            case 'textarea':
                element = (
                    <Textarea
                        name={getControlItem.name}
                        id={getControlItem.id}
                        placeholder={getControlItem.placeholder}
                        value={value}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value
                            });
                        }}
                    />
                );
                break;
            case "variantListFree":
                const field = getControlItem.name;
                return (
                    <VariantListFree
                        value={formData[field] || []}
                        onChange={(v) => setFormData({ ...formData, [field]: v })}
                    />
                );
            // Add more cases for other component types as needed
            default:
                element = (
                    <Input
                        type={getControlItem.type}
                        name={getControlItem.name}
                        id={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        value={value}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value
                            });
                        }}
                    // onChange={getControlItem.onChange}
                    // className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                );
        }
        return element;
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
                {/* {formControls.map((control, index) => {
                    const { type, label, name, placeholder, value, onChange } = control;
                    return (
                        <div key={index} className="grid w-full gap-1.5">
                            <label className="text-sm font-medium mb-1" htmlFor={name}>{label}</label>
                            <input
                                type={type}
                                name={name}
                                id={name}
                                placeholder={placeholder}
                                value={value}
                                onChange={onChange}
                                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    );
                }
                )} */}

                {
                    formControls.map(controlItem => <div className="grid w-full gap-1.5" key={controlItem.name}>
                        <Label className="mb-1">{controlItem.label}</Label>
                        {
                            renderInputsByComponentType(controlItem)
                        }
                    </div>)
                }
            </div>
            <Button className="mt-2 w-full" type="submit" onClick={onSubmit}>
                {
                    buttonText || 'Submit'
                }
            </Button>
        </form>
    )
}

export default CommonForm;