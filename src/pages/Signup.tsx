import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router"
import { AuthContext } from "../contexts/AuthContext";

export default function Signup() {
    const navigate = useNavigate();
    const { reg } = useContext(AuthContext);
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [psw, setPsw] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res = await reg(email, username, psw);
        setError(res);
        if(!res) navigate('/login');
    }

    useEffect(() => {
        setError(undefined);
    }, [email, username, psw]);

    return <>
        <main className="w-full h-full flex justify-center items-center">
            <div className="bg-222  w-4/5 h-4/5 lg:w-2/4 xl:w-1/4 rounded-lg">
                <div className="w-full h-1/3 flex items-center justify-center">
                    <img src="/vite.svg" alt="site" onClick={() => navigate("/")} className="w-1/3 h-1/3 hover:cursor-pointer hue-rotate-90 rotate-6" />
                </div>
                <form className="w-full h-full">
                    <div className="formElement">
                        <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4 text-white" required />
                    </div>
                    <div className="formElement">
                        <input type="text" name="uname" placeholder="Username" onChange={(e) => setUsername(e.target.value)} className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4 text-white" required />
                    </div>
                    <div className="formElement">
                        <input type="password" name="psw" placeholder="Password" onChange={(e) => setPsw(e.target.value)} className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4 text-white" required />
                    </div>
                    <button className="btn w-1/4 min-w-fit ml-f-1/4" onClick={handleSubmit} >Sign up</button>
                    <p className="text-red-600 w-full text-center mt-2">{error}</p>
                </form>
            </div>
        </main>
    </>
}