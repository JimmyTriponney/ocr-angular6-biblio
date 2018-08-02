import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.scss']
})
export class SingleBookComponent implements OnInit {

  book: Book;

  constructor(private bookService: BooksService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.book = new Book('', '');
    const id = this.route.snapshot.params['id'];
    this.bookService.getSingleBook(+id)
      .then(
        (book: Book) => {
          this.book = book;
        }
      );
  }

  onBack(){
    this.router.navigate(['/books']);
  }

}
