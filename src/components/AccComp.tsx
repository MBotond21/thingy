import { useNavigate } from "react-router";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { TrackContext } from "../contexts/MusicContext";

export default function AccComp() {
    const navigate = useNavigate();
    const { user, profile, logout } = useContext(AuthContext);
    const { setActive } = useContext(TrackContext)
    const loggedin = !!user?.Username;
    const [pfp, setPfp] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            await profile();
        }
        load();
    }, []);

    useEffect(() => {
        if(user?.Pfp){
            const url = URL.createObjectURL(user.Pfp);
            setPfp(url);

            return () => URL.revokeObjectURL(url);
        }else{
            setPfp('default.png');
        }
    }, [user]);

    const handleLogout = useCallback(() => {
        setActive('info');
        logout();
      }, [logout]);

    return <>
        <div className="acc">
            {
                loggedin ? (
                    <div className="relative group">
                            <button className="peer">
                                <img src={pfp} alt="pfp" className="peer size-14 rounded-full shadow-xl" />
                            </button>

                            <div className="absolute z-10 right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg hidden peer-focus:block group-hover:block">
                                <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200" onClick={() => navigate('/account')}>
                                    Details
                                </button>
                                <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                ) : (
                    <>
                        <button className="btn hidden md:block" onClick={() => navigate("/signup")}>Signup</button>
                        <button className="btn hidden md:block" onClick={() => navigate("/login")}>Login</button>
                        <div className="relative md:hidden group z-50">
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
                    </>
                )
            }
        </div>
    </>
}