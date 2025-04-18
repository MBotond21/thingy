import { Album } from "./album";

export interface Artist{
    id: string;
    name: string;
    website: string;
    join_date: string;
    image: string;
    albums?: Album[];
}