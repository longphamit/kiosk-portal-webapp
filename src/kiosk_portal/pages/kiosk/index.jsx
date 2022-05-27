import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
import KioskTable from "../../components/tables/kiosk_table";


const KioskPage = () => {
    const partyId = localStorageGetUserIdService()
    return (
        <>
            {partyId ? <KioskTable partyId={partyId} /> : null}
        </>)
}
export default KioskPage;