import { Track } from "./track";

export interface Album{
    id: string;
    name: string;
    artist_id: string;
    artist_name: string;
    releasedate: string;
    image: string;
    tracks?: Track[];
}