import { Outlet } from 'react-router-dom';
import AdminSideBar from './sidebar';
import AdminHeader from './header';
import { useState } from 'react';


function AdminLayout() {
    const [openSiderbar, setOpenSiderbar] = useState(false)

    return (
        <div className="flex min-h-screen w-full">

            <AdminSideBar open={openSiderbar} setOpen={setOpenSiderbar} />

            <div className="flex flex-1 flex-col">
                <AdminHeader setOpen={setOpenSiderbar} />
                <main className='flex flex-1 bg-muted/40 px-4 md:p-6'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout;