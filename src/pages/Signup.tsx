import { useNavigate } from "react-router"

export default function Signup() {
    const navigate = useNavigate();

    return <>
        <div className="formPage">
            <div className="w-full h-1/3 flex items-center justify-center">
                <img src="/vite.svg" alt="site" onClick={() => navigate("/")} className="w-1/3 h-1/3 hover:cursor-pointer" />
            </div>
            <form className="w-full h-full">
                <div className="formElement">
                    <input type="email" name="email" placeholder="Email" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                </div>
                <div className="formElement">
                    <input type="text" name="uname" placeholder="Username" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                </div>
                <div className="formElement">
                    <input type="password" name="psw" placeholder="Password" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                </div>
                <button className="btn w-1/4 min-w-fit ml-f-1/4" >Sign up</button>
            </form>
        </div>
    </>
}