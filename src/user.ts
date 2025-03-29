import { Followed } from "./followed";
import { Playlist } from "./playlist";

export interface User{
    Id: number;
    Email: string;
    Username: string;
    Pfp: Blob | null;
    Description: string | null;
    Playlists: Playlist[];
    Followed: Followed[];
}