import { createContext, useEffect, useState } from "react";
import { User } from "../user";
import { Playlist } from "../playlist";

interface AuthContextState {
    user: User | null;
    reg: (Email: string, Username: string, Password: string) => Promise<string | undefined>;
    login: (Email: string, Password: string) => Promise<string | undefined>;
    profile: () => void;
    update: (Description?: string, Pfp?: Blob) => void;
    logout: () => void;
    like: (trackId: string) => void;
    getPlaylist: (PlaylistID: number) => Promise<Playlist | undefined>;
    createPlaylist: (PlaylistName: string, Private: boolean, Description?: string, PlaylistCover?: File) => void;
    getUser: (id: number) => Promise<Object | undefined>;
    streamPic: (pic: File) => void;
    addToPlaylist: (trackId: string[], playlistId: number[]) => void;
}

export const AuthContext = createContext<AuthContextState>({
    user: null,
    reg: async () => undefined,
    login: async () => undefined,
    profile: () => { },
    update: () => { },
    logout: () => { },
    like: () => { },
    getPlaylist: async () => undefined,
    createPlaylist: () => { },
    getUser: async () => undefined,
    streamPic: () => { },
    addToPlaylist: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");

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
                body: formData,
            });
    
            if (!response.ok) throw new Error("Upload failed");
    
            const data = await response.json();
            
            setUser({
                Id: data.UserID,
                Email: data.Email,
                Username: data.Username,
                Pfp: data.Pfp ? new Blob([new Uint8Array(data.Pfp.data)], { type: "image/png" }) : null,
                Description: data.Description,
                Playlists: data.Playlists
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
            localStorage.setItem("accessToken", data.accessToken);
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
            console.log(data);

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
            // const PlaylistCover = pic ? Array.from(new Uint8Array(pic)) : undefined;
            const f = new FormData();
            f.append("PlaylistName", PlaylistName);
            if(PlaylistCover) f.append("PlaylistCover", PlaylistCover);
            if(Description) f.append("Description", Description);
            f.append("Private", Private.toString());
            const response = await fetch(`http://localhost:3000/playlists?owner=${user?.Id}`, {
                method: 'POST',
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
            console.log(PlaylistCover?.size)
            alert(e.message);
        }
    }

    const getPlaylists = async () => {
        try {
            const response = await fetch("http://localhost:3000/playlists?includeFullTracks=true", {
                method: "GET",
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
                Playlists: rep
            });

        } catch (e: any) {
            console.log(e.message);
            setUser(null);
            localStorage.removeItem("authToken");
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
            console.log(data);

            // const p = await getPfp(data.UserID);

            setUser({
                Id: data.UserID,
                Email: data.Email,
                Username: data.Username,
                Pfp: data.Pfp ? new Blob([new Uint8Array(data.Pfp.data)], { type: "image/png" }) : null,
                Description: data.Description,
                Playlists: data.Playlists
            });
            console.log("Profile updated successfully");
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
            
            console.log(data);

            return data;

        } catch (e: any) {
            console.log(e.message);
            return undefined;
        }
    }

    return (
        <AuthContext.Provider value={{ user, reg, login, profile, update, logout, like, getPlaylist, createPlaylist, getUser, streamPic, addToPlaylist }}>
            {children}
        </AuthContext.Provider>
    );
}