import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';
import Datasnapshot = firebase.database.DataSnapshot;
import { resolve } from 'url';

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
    this.books.push( newBook );
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File){
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/'+almostUniqueFileName+file.name).put(file);
        upload.on( firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement...');
          },
          error => {
            console.log('Erreur lors du chargement du fichier : '+error);
            reject();
          },
          () => {
            resolve( upload.snapshot.downloadURL );
          }
        );
      }
    );

  }

  removeBook(book: Book){
    if( book.photo ){
      const storageRef = firebase.storage().refFromURL( book.photo );
      storageRef.delete().then(
        () => {
          console.log('Photo supprimé !');
        },
        error => {
          console.log('Une erreur est survenue lors de la suppression de l\'image : '+error);
        }
      );
    }

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
