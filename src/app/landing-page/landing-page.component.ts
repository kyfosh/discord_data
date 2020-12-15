import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  user:string;
  friends:string;
  words:string;
  issue:boolean = false;

  loading: boolean = false; // Flag variable 
  file: File = null; // Variable to store file 

  constructor(private data: DataService, private router: Router) {
    this.data.ppl = [];
    this.data.words = [];
    data.text = "";
   }

  splitFriends(){
    return this.friends.split(",");
  }

  splitWords(){
    return this.words.split(",");
  }

  launch(){
    if(this.user != null  && this.friends != null){
      if(this.words == null){
        this.words = "game, nice, gg, omg";
      }
      this.issue = false;
      this.upload();
      
    }
    else{
      this.issue = true;
    }
  }

  onChange(event) { 
    this.file = event.target.files[0]; 
  } 

  upload() { 
    this.loading = !this.loading; 
    this.file.text().then((data) =>{
      this.saveData();
      this.data.text = data;
      this.router.navigateByUrl('/data');
    });
  }


  saveData(){
    var j = 1;
    this.data.ppl[0] = this.user.trim();
    this.splitFriends().forEach((word)=>{
      this.data.ppl[j] = word.trim();
      ++j;
    });
    j = 0;
    this.splitWords().forEach((word)=>{
      this.data.words[j] = word.trim().toLowerCase();
      ++j;
    });

  }

  ngOnInit(): void {
  }

}
