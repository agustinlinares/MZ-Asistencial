import { Outlet } from "react-router-dom";
import AdminHeader from "@components/_layout/AdminHeader/AdminHeader";
import AdminMenu from "@components/_layout/AdminMenu/AdminMenu";

const AdminLayout = () => {
    return (
        <main id="admin-content">           
            <div className="admin-content">
                <AdminMenu />
                <div className="inner-content">
                    <AdminHeader />
                    <div className="body-content">
                        <Outlet />
                    </div>
                    
                </div>
                
            </div>
        </main>
    );
};

export default AdminLayout;
