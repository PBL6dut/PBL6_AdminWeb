import { useLocation } from "react-router-dom"

export const useContextName = () => {
    const { pathname } = useLocation()
    return pathname.replace("/dashboard/", "")
}