import { useDispatch } from "react-redux";
import engFlag from "../../../../assetss/images/brtsh.jpg"; 
import geoFlag from "../../../../assetss/images/geo.jpg"; 
import { siteTranslateAction } from "../../../../store/translate";

const Language = ({language}) => {
    const dispatch = useDispatch()
    return (
        <div style={{ marginLeft: "15px" }}>
            {language === "ka" ? (
                <img
                    src={engFlag}
                    alt="English"
                    onClick={() => dispatch(siteTranslateAction.changeLanguage("en"))}
                    style={{
                        cursor: "pointer",
                        height: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                    }}
                />
            ) : (
                <img
                    src={geoFlag}
                    alt="Georgian"
                    onClick={() => dispatch(siteTranslateAction.changeLanguage("ka"))}
                    style={{
                        cursor: "pointer",
                        height: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                    }}
                />
            )}
        </div>
    )
}

export default Language