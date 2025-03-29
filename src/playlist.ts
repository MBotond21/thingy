import { Track } from "./track";

export interface Playlist {
    PlaylistID: number;
    OwnerID: number;
    Owner?: { Username: string }
    PlaylistName: string;
    Description?: string;
    PlaylistCover?: Blob;
    Tracks?: Track[];
    Private: boolean;
}