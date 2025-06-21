import { Link } from "react-router-dom"
import { use, useState } from "react";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/components/config";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { loginUser } from "@/store/auth-slice";

const initialState = {
    email: '',
    password: '',
    // confirmPassword: '',
    // role: 'user', // Default role
};


function AuthLogin() {

    const [formData, setFormData] = useState(initialState);
    // const [formErrors, setFormErrors] = useState({});

    const dispatch = useDispatch();

    function onSubmit(event) {
        event.preventDefault();
        console.log('Login form data:', formData);

        dispatch(loginUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message);
            } else {
                toast.error(data?.payload?.message || "Đăng nhập thất bại");
            }
        });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Đăng nhập</h1>
                <p>Không có tài khoản
                    <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/register'>Đăng ký</Link>
                </p>
            </div>
            <CommonForm
                formControls={loginFormControls}
                buttonText={'Đăng nhập'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default AuthLogin