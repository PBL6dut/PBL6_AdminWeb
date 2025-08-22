import { Sidebar } from "../components/Sidebar"
// import { Content } from "../components/Content"
import { Outlet } from "react-router-dom"

export const MainLayout = () => {
    return (
        <div>
            <Sidebar />
            <Outlet />
        </div>
    )
}