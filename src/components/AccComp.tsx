import { useNavigate } from "react-router";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AccComp(){
    const navigate = useNavigate();

    return<>
        <div className="acc">
            <button className="btn hidden md:block" onClick={() => navigate("/signup")}>Signup</button>
            <button className="btn hidden md:block" onClick={() => navigate("/login")}>Login</button>
            <div className="relative md:hidden group">
                <button className="btn peer">
                    <FontAwesomeIcon icon={faBars} />
                </button>

                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg hidden peer-focus:block group-hover:block">
                    <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200" onClick={() => navigate("/signup")}>
                        Signup
                    </button>
                    <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200" onClick={() => navigate("/login")}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    </>
}