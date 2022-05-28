import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { activeAccountService } from "../../../kiosk_portal/services/account_service";

const ConfirmAccountPage=()=>{
    const [searchParams, setSearchParams] = useSearchParams();
    let navigate = useNavigate();
    const activeAccount=()=>{
        activeAccountService(searchParams.get("id"),searchParams.get("uuid")).then((response)=>{
            toast.success(response.message)
            navigate("/signin")
        }).catch(({response})=>{
            toast.error(response.data.message)
            navigate("/signin")
        })
    }
    useEffect(() => {
        activeAccount()
        return () => {};
      }, []);
    return (
        <>
            
        </>
    )
}
export default ConfirmAccountPage