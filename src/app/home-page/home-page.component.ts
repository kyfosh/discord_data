import { Component, OnInit, ɵinlineInterpolate } from '@angular/core';

import { ChartsService } from '../charts.service';
import { DataService } from '../data.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  num_users: number;
  type: string = "";
  

  calls: number[] = [0,0,0,0];
  reactions: any[];
  words: any[];
  num_messages: any[];
  users: string[];
  emote: any[];
  images: any[];
  links: any[];
  at: number[];

  loading: boolean = false; // Flag variable 
  file: File = null; // Variable to store file 
  text: string;

  
  ifURL:boolean = true;
  ifEmote:boolean = true;
  ifImages:boolean = true;
  ifReact:boolean = true;
  ifTag:boolean = true;


  constructor(private chart: ChartsService, private data: DataService) { 
    this.ready();
  }

  ready(){
    this.text = this.data.text;
    this.start(this.data.words, this.data.ppl, this.data.ppl.length);
    this.load()
  }

  hope(){
    this.chart.makeAllGraphs(this.words, this.num_messages, this.users, this.emote, this.images, this.links,this.reactions, this.at);

  }

  onChange(event) { 
    this.file = event.target.files[0]; 
  } 

  load() { 
    this.run();
    
    this.ifURL = (this.links.length > 0 ? true : false);
    this.ifEmote = (this.emote.length > 0 ? true : false);
    this.ifImages = ((this.images[0] != 0 || this.images[0] != 0) ? true : false);
    this.ifReact = (this.reactions.length > 0 ? true : false);
    this.ifTag = ((this.at[0] != 0 || this.at[0] != 0) ? true : false);

    //make into shorter arrays if necessary before. maybe do it when adding to array
    this.reactions = this.shortenArray(this.reactions, 10);
    this.links = this.shortenArray(this.links,10);
    this.emote = this.shortenArray(this.emote, 10);
  } 

  shortenArray(arr, num): any[]{
    if(arr.length > num){
      arr.sort((a,b)=>{
        if (a[1] === b[1]) {
          return 0;
      }
      else {
          return (a[1] > b[1]) ? -1 : 1;
      }
      });
      return arr.slice(0,num);
    }
    else
      return arr;
  }

  start(words, usernames, n_users) {
    this.words = new Array(words.length);//list of words to search for
    this.num_users = n_users;
    for(var i = 0; i < words.length; ++i){
        this.words[i] = [words[i], this.create_array(this.num_users)];//set up words array
    }
    this.num_messages = new Array(this.num_users); //array of how many users there are
    this.users = [];
    for(var i =0; i < usernames.length; ++i){
      this.users[i] = usernames[i];
      this.num_messages[i] = 0;
    }
    this.emote = [];//array of emojis and how often theyre used
    this.images = this.create_array(this.num_users);//array of # of images a user sends
    this.links = [];//array of links and how many users used them
    this.reactions = [];//array of reactionsand how many users used them
    this.at = this.create_array(this.num_users);//array of # of times a user is @'d
    this.calls = [0,0,0];

    console.log("before running:")
    console.log(this.words);
    console.log(this.num_messages);
    console.log(this.users);
    console.log(this.emote);
    console.log(this.images);
    console.log(this.links);
    console.log(this.at);
    console.log(this.calls);
    console.log(this.reactions);
}

create_array(len){//creates array filled with zeros to allow proper incrementation instead of incrementing trash values
  var temp = [];
  for(var i = 0; i < len; ++i){
      temp[i] = 0;
  }
  return temp;
}

run(){
  var date_pattern = new RegExp("\[[0-9]{2}-[A-Z][a-z]{2}-[0-9]{2} [0-9]{2}:[0-9]{2} (AM|PM)\]"); //[09-Dec-20 04:10 PM] NAME#0000
  var normal_text = new RegExp("[^((\0)|(\n)|(\r))]");//anything that isnt an enter or null character
  var attached = new RegExp("(\{[A-Z][a-z]+\})");

  //var j = 0;//keep track of line # inside text file
  var cur_user = -1;
  var lines = this.text.split("\n");
  var data;
  //lines.forEach((data) => {
  for(var j = 0; j < lines.length; ++j){
    data = lines[j];
    //process text file line by line
    if(date_pattern.test(data.substring(0,20))){
      var name = data.substring(data.indexOf("]")+2).trim();//grab name from line
      var date = data.substring(0, data.indexOf("]")+1);//grab date from line

      //TO DO:log date of message
      cur_user = -1;
      for(var h = 0; h < this.users.length; ++h){//go through the users array to find cur user
        if(this.users[h] == name){
          cur_user = h;
        }
      }
          
      if(cur_user >= 0){
        this.num_messages[cur_user]++; //increment total num of messages for that user
      }
      else{
        console.log("ERROR: USER NOT FOUND");
      }
    }
      else if(j == 2){ //states type of message and other users
        if(data.includes("Private")){
          this.type = "private";
        }
        else if(data.includes("Group")){
          this.type = "group";
        }
        else{
          this.type = "server";
        }
      }
      else if(attached.test(data)){
        //console.log("{} line: " + data + "\n " + (data.includes("{Attachments}")));
        if(data.includes("{Reactions}")){
          this.store_reactions(lines[j+1]);
          j += 2;
        }
        else if(data.includes("{Attachments}")){
          this.images[cur_user]++;
          j += 2;
        }
        else{
          for(var h = 1; j+h < lines.length; ++h){
            if(!normal_text.test(lines[j+h])){
              j += h;
              break;
            }
          }
        }
        //console.log("to line: " + lines[h]);
      }
      else if(j > 6  && j < lines.length-4 && normal_text.test(data)){//message lines
          //console.log("in message line: " + data);
          if(cur_user >= 0){
            this.search_message(cur_user, data);
          }
      }
   }

  console.log("after running");
  console.log(this.words);
  console.log(this.num_messages);
  console.log(this.users);
  console.log(this.emote);
  console.log(this.images);
  console.log(this.links);
  console.log(this.at);
  console.log(this.calls);
  console.log(this.reactions);
}

search_message(user, message){
  //search for call
  if(this.type != "server" && message.includes("Started a call that lasted ")){
    var num = message.substring(27);
    num = num.substring(0, num.indexOf(" "));
    this.calls[0]++;//total # of calls made
    this.calls[1] += parseInt(num); //total mins in call
    if(num > this.calls[2]){
      this.calls[2] = num;
    }
  }
  else{
    //see if message contains word
    var og_len = message.length;
    var temp;

    for(var i = 0; i < this.words.length; i++){
      temp = message.toLowerCase();
      if(temp.includes(this.words[i][0])){
        this.words[i][1][user] += ((og_len - temp.replaceAll(this.words[i][0], "").length) / this.words[i][0].length);
      }
    }

    //check if message includes an image
    var has_image = false;
    if(message.includes(".png") || message.includes(".gif") || message.includes("jpeg") || message.includes(".jpg")){
        has_image = true;
        this.images[user]++;
    }

    //search message for links
    var wo_link = this.searchLink(message,has_image);
    //search message for emojis
    this.searchEmoji(wo_link, user);

    //search for @
    if(this.type != "private"){
      for(var i = 0; i < this.users.length; i++){
        if(message.includes("@" + this.users[i].substring(0,this.users[i].length-5))){
          //console.log("has an @: " + message);
          this.at[i]++;
        }
      }
    }
  }
}

store_reactions(line){
  var action = false;
  var counter = new RegExp("\([0-9]+\)");
  line.split(" ").forEach((word) =>{
    if(word.trim() != "" && counter.test(word) != true){
      for(var k = 0; k < this.reactions.length; ++k){//copied from links
        if(this.reactions[k][0] == word){
          this.reactions[k][1]++;//emote is in this.reactions array and increase number of times used
          action = true;
        }//otherwise this.reactions doesnt include this emote already
      }
      if(!action){//bc no action was taken, add emote to array
        this.reactions.push([word,1]);//add emote to array and increment usage
      }
    }
  });
}

searchLink(message, has_image):string{
  var url = new RegExp("(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/|www\.)([a-z]+|[A-Z]+|[0-9]+|.*|\-*)(\.com|\.net|\.org|\.gov|\.edu|\.int|\.ca|\.co|\.[a-z]{2})");
  var action = false;
  if(url.test(message) && !has_image){
    var link_name = url.exec(message)[2];
    for(var i = 0; i < this.links.length; ++i){//copied from emote so if changes made to that make changes here as well !!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if(this.links[i][0] == link_name){
          this.links[i][1]++;//link is in this.links array and increase number of times used
          action = true;
        }//otherwise this.links doesnt include this link already
    }
    if(!action){//bc no action was taken, add emote to array
      this.links.push([link_name,1]);//add link to array and increment usage
    }
    var index = Math.min(message.indexOf("http"), message.indexOf("www"));
    if(index > 0){
      var temp = message.substring(index).trim();
      if(temp.indexOf(" ") < 0){
        return message.substring(0, index);
      }
      else{
        return message.substring(0, index) + temp.substring(temp.indexOf(" "));
      }
    }
    else{
      if(!message.includes(" ")){
        return "";
      }
      else{
        return message.substring(message.indexOf(" "));
      }
    }
  }
  return message;
}

searchEmoji(wo_link, user){
    //search for emojis
    var emoji_text = new RegExp("(\u00a9|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])(\ud83c[\udffb-\udfff])*");//discord emotes
    var emoticon = new RegExp("(OTL|0\-0|O\-O|(o\-o)|0_0|o_o|O_O|uwu|UwU|;\-;|T\-T|T_T|:o|:D|(:\)[\)]*)|\(:)+");
    var action = false;
    while(emoji_text.test(wo_link) || emoticon.test(wo_link)){
      //console.log("message: " + wo_link + "Emoji: 1)" + emoji_text.test(wo_link) + " 2)" + emoticon.test(wo_link));
      var emote_used = ( emoji_text.exec(wo_link) != null ? emoji_text.exec(wo_link)[0] : emoticon.exec(wo_link)[0]);
      if(emote_used.includes(":)")){
        emote_used = ":)";
      }
      //console.log(emote_used);
      for(var i = 0; i < this.emote.length; ++i){
          if(this.emote[i][0] == emote_used){
              this.emote[i][1]++;//emote is in this.emote array and increase number of times used
              action = true;
          }//otherwise this.emote doesnt include this emote already
      }
      if(!action && emote_used != ":"){//bc no action was taken, add emote to array
          this.emote.push([emote_used,1]);
      }
      wo_link = wo_link.replace(emote_used, "");
    }
}


  ngOnInit(): void {
    if(this.calls[2] > 0 && this.calls[1] > 0)
      this.calls[3] = this.calls[2]/this.calls[1];
    setTimeout(() => {
      this.hope();
    }, 0);
  }

}
