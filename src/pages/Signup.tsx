export default function Signup(){
    return <>
        <div className="formPage">
            <form className="w-full h-full mt-40">
                <div className="formElement">
                    <input type="email" name="email" placeholder="Email" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                </div>
                <div className="formElement">
                    <input type="text" name="uname" placeholder="Username" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                </div>
                <div className="formElement">
                    <input type="password" name="psw" placeholder="Password" className="rounded-lg p-2 w-4/5 ml-1/10 border-2 outline-none transition-all bg-333 border-white focus:border-yellow-400 mb-4" required />
                </div>
                <button className="btn w-1/4 ml-f-1/4" >Sign up</button>
            </form>
        </div>
    </>
}