import { IBook } from "./IBook";


export class Book implements IBook {
    constructor(public id: number,public title: string,public author: string,public cover : string,public synopsis : string,public price : number){}
    
    public toString(): string {
        return `${this.id} + ${this.title} + ${this.author} + ${this.cover} + ${this.synopsis} + ${this.price}`
    }
}