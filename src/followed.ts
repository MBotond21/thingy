
export interface Followed {
    FollowedID: number;
    PlaylistID?: number;
    TypeID?: number;
    Type: "Playlist" | "Artist" | "Album";
}