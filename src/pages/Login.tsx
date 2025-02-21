import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router"
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [psw, setPsw] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);

    const { login } = useContext(AuthContext);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const res = await login(email, psw);
        setError(res);
        console.log(history);
        if (!res) history.back();
    }

    useEffect(() => {
        setError(undefined);
    }, [email, psw]);

    return <>
        <div className="bg-222 w-4/5 h-4/5 lg:w-2/4 xl:w-1/4 rounded-lg m-auto">
            <div className="w-full h-1/3 flex items-center justify-center">
                <img src="/vite.svg" alt="site" onClick={() => navigate("/")} className="w-1/3 h-1/3 hover:cursor-pointer hue-rotate-90 rotate-6" />
            </div>
            <form className="w-full h-full">
                <div className="formElement">
                    <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4 text-white" required />
                </div>
                <div className="formElement">
                    <input type="password" name="psw" placeholder="Password" onChange={(e) => setPsw(e.target.value)} className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4 text-white" required />
                </div>
                <button type="submit" className="btn w-1/4 min-w-fit ml-f-1/4" onClick={handleSubmit} >Login</button>
                <p className="mt-1 text-mute w-full text-center">Don't have an account yet? <a onClick={() => navigate("/signup")} className="text-blue-500 hover:cursor-pointer ">Sign up</a></p>
                <p className="text-red-600 w-full text-center mt-2">{error}</p>
            </form>
        </div>
    </>
}