import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "../user";
import { Playlist } from "../playlist";

type UpdatePlaylistParams = {
    PlaylistName?: string;
    Description?: string;
    PlaylistCover?: File;
    Private?: boolean;
};

interface ApiContextState {
    user: User | null;
    reg: (Email: string, Username: string, Password: string) => Promise<string | undefined>;
    login: (Email: string, Password: string) => Promise<string | undefined>;
    profile: () => void;
    update: (Description?: string, Pfp?: Blob) => void;
    logout: () => void;
    like: (trackId: string) => void;
    getPlaylist: (PlaylistID: number) => Promise<Playlist | undefined>;
    createPlaylist: (PlaylistName: string, Private: boolean, Description?: string, PlaylistCover?: File) => void;
    updatePlaylist: (PlaylistId: number, update: UpdatePlaylistParams) => void;
    getUser: (id: number) => Promise<Object | undefined>;
    streamPic: (pic: File) => void;
    addToPlaylist: (trackId: string[], playlistId: number[]) => void;
    search: (term: string) => void;
    autoComplete: Record<string, any[]> | undefined;
    setAutoComplete: Dispatch<SetStateAction<Record<string, any[]> | undefined>>;
    searchPlaylists: (term: string) => Promise<Playlist[]>;
    follow: (FollowedID: number, Type: string) => void;
    unfollow: (FollowedID: number) => void;
    deletePlaylist: (id: number) => void;
}

export const ApiContext = createContext<ApiContextState>({
    user: null,
    reg: async () => undefined,
    login: async () => undefined,
    profile: () => { },
    update: () => { },
    logout: () => { },
    like: () => { },
    getPlaylist: async () => undefined,
    createPlaylist: () => { },
    updatePlaylist: async () => { },
    getUser: async () => undefined,
    streamPic: () => { },
    addToPlaylist: () => { },
    search: () => { },
    autoComplete: undefined,
    setAutoComplete: () => { },
    searchPlaylists: async () => [],
    follow: async () => {},
    unfollow: async () => {},
    deletePlaylist: async () => {},
});

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");
    const [refresh, setRefresh] = useState<string>("");
    const [autoComplete, setAutoComplete] = useState<Record<string, any[]>>();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) setToken(accessToken);
    }, []);

    const streamPic = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`http://localhost:3000/users/pic/${user?.Id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            console.log(data);

            const rep = data.Playlists.map((playlist: any) => ({
                ...playlist,
                PlaylistCover: playlist.PlaylistCover ? new Blob([new Uint8Array(playlist.PlaylistCover.data)], { type: "image/png" }) : null
            }));


            setUser({
                Id: data.UserID,
                Email: data.Email,
                Username: data.Username,
                Pfp: data.Pfp ? new Blob([new Uint8Array(data.Pfp.data)], { type: "image/png" }) : null,
                Description: data.Description,
                Playlists: rep,
                Follows: [],
            });

        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    const reg = async (Email: string, Username: string, Password: string): Promise<string | undefined> => {
        try {
            const response = await fetch('http://localhost:3000/users/register', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email, Username, Password }),
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            return undefined;

        } catch (e: any) {
            return e.message;
        }
    }

    const login = async (Email: string, Password: string) => {
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email, Password }),
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            const data = await response.json();
            setToken(data.accessToken);
            setRefresh(data.refreshToken);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refresh", data.refreshToken);
            return undefined;

        } catch (e: any) {
            return e.message;
        }
    }

    const getLikedId = () => {
        return user?.Playlists.filter((o) => o.PlaylistName === "Liked")[0].PlaylistID;
    }

    const like = async (TrackId: string) => {
        try {
            const id = getLikedId();
            const response = await fetch(`http://localhost:3000/playlists/${id}/add/${TrackId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            const data = await response.json();

        } catch (e: any) {
            console.log(e.message);
        }
    }

    const addToPlaylist = async (trackId: string[], playlistIds: number[]) => {
        try {
            const response = await fetch(`http://localhost:3000/playlists/add?trackId=${encodeURIComponent(trackId.join(','))}&playlistIds=${encodeURIComponent(playlistIds.join(','))}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            const data = await response.json();
            return data;

        } catch (e: any) {
            console.log(e.message);
        }
    }

    const createPlaylist = async (PlaylistName: string, Private: boolean, Description?: string, PlaylistCover?: File) => {
        try {
            const f = new FormData();
            f.append("PlaylistName", PlaylistName);
            if (PlaylistCover) f.append("PlaylistCover", PlaylistCover);
            if (Description) f.append("Description", Description);
            f.append("Private", Private.toString());
            const response = await fetch(`http://localhost:3000/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
                body: f,
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            const data = await response.json();

            const nData = {
                ...data,
                PlaylistCover: data.PlaylistCover ? new Blob([new Uint8Array(data.PlaylistCover.data)], { type: "image/png" }) : null
            }

            user?.Playlists.push(nData);

        } catch (e: any) {
            alert(e.message);
        }
    }

    const getPlaylist = async (PlaylistID: number) => {
        try {
            const response = await fetch(`http://localhost:3000/playlists/${PlaylistID}?includeFullTracks=true`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            const data = await response.json();

            return {
                ...data,
                PlaylistCover: data.PlaylistCover ? new Blob([new Uint8Array(data.PlaylistCover.data)], { type: "image/png" }) : null
            };

        } catch (e: any) {
            console.log(e.message);
            return undefined
        }
    }

    const updatePlaylist = async (PlaylistId: number, update: UpdatePlaylistParams) => {
        try {
            const f = new FormData();
            if (update.PlaylistName) f.append("PlaylistName", update.PlaylistName);
            if (update.Description) f.append("Description", update.Description);
            if (update.PlaylistCover) f.append("PlaylistCover", update.PlaylistCover);
            if (update.Private !== undefined) f.append("Private", update.Private.toString());     

            const response = await fetch(`http://localhost:3000/playlists/${PlaylistId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
                body: f,
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            const data = await response.json();

            const nData = {
                ...data,
                PlaylistCover: data.PlaylistCover ? new Blob([new Uint8Array(data.PlaylistCover.data)], { type: "image/png" }) : null
            }

            user!.Playlists = user!.Playlists.map((o) => o.PlaylistID == nData.PlaylistID ? nData : o);

        } catch (e: any) {
            alert(e.message);
        }
    }

    const profile = async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error("Unable to validate user");

            const data = await response.json();

            const rep = data.Playlists.map((playlist: any) => ({
                ...playlist,
                PlaylistCover: playlist.PlaylistCover ? new Blob([new Uint8Array(playlist.PlaylistCover.data)], { type: "image/png" }) : null
            }));

            setUser({
                Id: data.UserID,
                Email: data.Email,
                Username: data.Username,
                Pfp: data.Pfp ? new Blob([new Uint8Array(data.Pfp.data)], { type: "image/png" }) : null,
                Description: data.Description,
                Playlists: rep,
                Follows: data.Follows,
            });

        } catch (e: any) {
            try {
                const response = await fetch("http://localhost:3000/auth/refresh", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${refresh || localStorage.getItem("refresh")}`,
                    },
                });

                if (!response.ok) throw new Error("Unable to validate user");

                const data = await response.json();

                setToken(data.accessToken);
                setToken(data.refreshToken);

                profile();

            } catch (e: any) {
                setUser(null);
                localStorage.removeItem("authToken");
                localStorage.removeItem("refresh");
            }
        }
    }

    const update = async (Description?: string, Pfp?: Blob) => {
        try {
            let PfpBuffer: ArrayBuffer | undefined;
            if (Pfp) {
                PfpBuffer = await Pfp.arrayBuffer();
            }

            const response = await fetch(`http://localhost:3000/users/${user?.Id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Description,
                    Pfp: PfpBuffer ? Array.from(new Uint8Array(PfpBuffer)) : undefined,
                }),
            });

            if (!response.ok) throw new Error("Unable to validate user");

            const data = await response.json();

            // const p = await getPfp(data.UserID);

            const rep = data.Playlists.map((playlist: any) => ({
                ...playlist,
                PlaylistCover: playlist.PlaylistCover ? new Blob([new Uint8Array(playlist.PlaylistCover.data)], { type: "image/png" }) : null
            }));

            console.log(rep);

            setUser({
                Id: data.UserID,
                Email: data.Email,
                Username: data.Username,
                Pfp: data.Pfp ? new Blob([new Uint8Array(data.Pfp.data)], { type: "image/png" }) : null,
                Description: data.Description,
                Playlists: rep,
                Follows: [],
            });
        } catch (e: any) {
            console.error(e.message);
        }
    };

    const logout = () => {
        if (confirm("Are you sure you want to log out?")) {
            setUser(null);
            setToken("");
            localStorage.removeItem("accessToken");
        }
    }

    const getUser = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/users/other/${id}`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            const data = await response.json();

            return data;

        } catch (e: any) {
            console.log(e.message);
            return undefined;
        }
    }

    const search = async (term: string) => {
        console.log("searching " + term);
        setAutoComplete(undefined);
        const response = await fetch(
            `http://localhost:3000/search?term=${term}&userId=${user?.Id}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        setAutoComplete(data);
    }

    const searchPlaylists = async (term: string) => {
        try {
            const response = await fetch(`http://localhost:3000/search/playlist?term=${term}&userId=${user?.Id}`);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            return data;

        } catch (e: any) {
            console.log(e.message);
        }
    }

    const follow = async (FollowedID: number, Type: string) => {
        console.log("following");
    
        try {
            const response = await fetch(`http://localhost:3000/followed`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ FollowedID, Type }),
            });
    
            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }
    
            const data = await response.json();
    
            setUser(prevUser => {
                if (prevUser) {
                    return {
                        ...prevUser,
                        Follows: [...prevUser.Follows, data],
                    };
                }
                return prevUser;
            });
    
        } catch (e: any) {
            console.log(e.message);
        }
    };    

    const unfollow = async (FollowedID: number) => {
        console.log("unfollowing");
        
        try {
            const response = await fetch(`http://localhost:3000/followed/${FollowedID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            setUser(prevUser => {
                if (prevUser) {
                  return {
                    ...prevUser,
                    Follows: prevUser.Follows.filter((o) => o.FollowedID != FollowedID),
                  };
                }
                return prevUser;
              });              

        } catch (e: any) {
            console.log(e.message);
        }
    }

    const deletePlaylist = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/playlists/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token || localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) {
                const e = await response.json();
                throw new Error(e.message);
            }

            user!.Playlists = user!.Playlists.filter((o) => o.PlaylistID != id);

        } catch (e: any) {
            console.log(e.message);
        }
    }

    return (
        <ApiContext.Provider value={{ user, reg, login, profile, update, logout, like, getPlaylist, createPlaylist, updatePlaylist, getUser, streamPic, addToPlaylist, search, autoComplete, setAutoComplete, searchPlaylists, follow, unfollow, deletePlaylist }}>
            {children}
        </ApiContext.Provider>
    );
}