export interface IBook{
    id: number;
    title: string;
    author: string;
    cover: string;
    synopsis: string;
    price: number;

    toString() : string;
}
