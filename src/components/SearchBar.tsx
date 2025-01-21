export default function SearchBar() {
    return <>
        <div className="search-cont w-2/5 md:w-1/4">
            <div>
                <div className="absolute inset-y-0 start-1/5 md:start-2/5 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="text" id="term" placeholder="Search" className="w-full"/>
            </div>
        </div>
    </>
}