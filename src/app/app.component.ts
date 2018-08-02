import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(){
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyAjx-PosOe6_Zf6f0KvyDK5D94-we4Yo5Y",
      authDomain: "ocr-ng6-biblio.firebaseapp.com",
      databaseURL: "https://ocr-ng6-biblio.firebaseio.com",
      projectId: "ocr-ng6-biblio",
      storageBucket: "ocr-ng6-biblio.appspot.com",
      messagingSenderId: "739227446911"
    };
    firebase.initializeApp(config);
  }

}
