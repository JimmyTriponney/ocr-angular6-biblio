import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import Datasnapshot = firebase.database.DataSnapshot;

@Injectable()
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  emitBooks(){
    this.booksSubject.next( this.books );
  }

  constructor() {
    this.getBooks();
  }

  createNewBook(newBook: Book){
    console.log('start : createNewBook');
    this.books.push( newBook );
    console.log('in : createNewBook');
    this.saveBooks();
    this.emitBooks();
    console.log('end : createNewBook');
  }

  removeBook(book: Book){
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if( bookEl === book ){
          return true;
        }
      }
    );
    this.books.splice( bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  getBooks(){
    firebase.database().ref('/books')
      .on('value', (data: Datasnapshot) => {
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });
  }

  getSingleBook(id: number){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/'+id)
          .once('value')
          .then(
            (data: Datasnapshot) => { resolve(data.val()); },
            error => { reject(error); }
          );
      }
    );
  }

  saveBooks(){
    firebase.database().ref('/books').set( this.books )
      .then(
        (val) => { console.log('complet'); console.log(val);},
        (reason) => { console.log('rejected'); console.log(reason); }
      );
  }
}
