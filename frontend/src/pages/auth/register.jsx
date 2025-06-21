import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/components/config";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { toast } from "sonner";

const initialState = {
    username: '',
    email: '',
    password: '',
    // confirmPassword: '',
    // role: 'user', // Default role
};


function AuthRegister() {

    const [formData, setFormData] = useState(initialState);
    // const [formErrors, setFormErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log('Register form data:', formData);

    function onSubmit(event) {
        event.preventDefault();
        dispatch(registerUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message);

                navigate('/auth/login')
            }
            else {
                toast.error(data?.payload?.message || "Email đã được sử dụng, vui lòng sử dụng email khác");
            }
        })
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Tạo tài khoản mới</h1>
                <p>Đã có tài khoản rồi
                    <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/login'>Đăng nhập</Link>
                </p>
            </div>
            <CommonForm
                formControls={registerFormControls}
                buttonText={'Đăng ký'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default AuthRegister