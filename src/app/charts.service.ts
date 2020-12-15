import { Injectable } from '@angular/core';

import * as Chart from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  canvas: any;
  ctx: any;

  font: string = "#27292B";
  lines: string = "#b0b0b0";

  
  color2:any[] =["#2A9D8F", "#E9C46A"];
  color3:any[] =["#2A9D8F", "#8AB17D", "#E9C46A"];
  color4:any[] =["287271", "#2A9D8F","#8AB17D",  "#E9C46A"];
  color5:any[] =["287271", "#2A9D8F","#8AB17D",  "#E9C46A", "#EFB366"];
  color6:any[] =["#275C62", "287271", "#2A9D8F","#8AB17D",  "#E9C46A", "#EFB366"];
  color7:any[] =["#275C62", "287271", "#2A9D8F","#8AB17D",  "#E9C46A", "#EFB366", "#F4A261"];
  color8:any[] =["#264653", "#275C62", "287271", "#2A9D8F","#8AB17D",  "#E9C46A", "#EFB366", "#F4A261"];
  color9:any[] =["#264653", "#275C62", "287271", "#2A9D8F","#8AB17D",  "#E9C46A", "#EFB366", "#F4A261", "#EE8959"];
  color10:any[] =["#264653", "#275C62", "287271", "#2A9D8F","#8AB17D",  "#E9C46A", "#EFB366", "#F4A261", "#EE8959", "#E76F51"];

  constructor() { }

  makeAllGraphs(words, num_messages, users, emote, images, links, reaction, ats){
    if(users.length > 3){
      this.odGraph(users, num_messages,  this.calc_color(users.length), "messages");
    }
    else{
      this.msgGraph(users, num_messages, this.calc_color(users.length), "messages");
    }
    
    if(links.length > 0){
      var urls = []; var nums = [];
      for(var i = 0; i < links.length; ++i){
        urls[i] = links[i][0];
        nums[i] = links[i][1];
      }
      this.tdGraph(users, urls, nums, this.calc_color(urls.length), "links");
    }

    if(emote.length > 0){
      var emoji = []; var num = [];
      for(var i = 0; i < emote.length; ++i){
        emoji[i] = emote[i][0];
        num[i] = emote[i][1];
      }
      this.tdGraph(users, emoji, num, this.calc_color(emoji.length), "emojis");
    }

    if(reaction.length > 0){
      var react = []; var numr = [];
      for(var i = 0; i < reaction.length; ++i){
        react[i] = reaction[i][0];
        numr[i] = reaction[i][1];
      }
      this.tdGraph(users, react, numr, this.calc_color(react.length), "reactions");
    }

    if(Math.max(ats[0], ats[1]) > 0){
      this.odGraph(users, ats, this.calc_color(users.length), "tags");
    }
    if(Math.max(images[0], images[1]) > 0)
      this.odGraph(users, images, this.calc_color(users.length), "images");

    for (var i = 1; i < words.length+1; ++i) {
      if(Math.max(words[i-1][1][0],words[i-1][1][1]) > 0){
        var v = document.createElement('DIV');
        v.className = "small_stat"; //class="small_stat"
        v.innerHTML = "<canvas id=\"word" + i + "\"  height=\"200\"></canvas>"; //<canvas id="word1"></canvas>
        document.getElementsByClassName('small_grid')[0].appendChild(v);
      }
    }
    this.wordGraphs(users, words, this.calc_color(users.length));
  }

  calc_color(number):string[]{
    switch(number){
      case 2:
        return this.color2;
        break;
      case 3:
        return this.color3;
        break;
      case 4:
        return this.color4;
        break;
      case 5:
        return this.color5;
        break;
      case 6:
        return this.color6;
        break;
      case 7:
        return this.color7;
        break;
      case 8:
        return this.color8;
        break;
      case 9:
        return this.color9;
        break;
      case 10:
        return this.color10;
        break;
      default:
        return this.color10;
        break;
    }
  }

  odGraph(users, data, colors, id){
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
    type: 'bar',
    data: {
    labels: users,
    datasets: [{
    label: "number of " + id,
    data: data,
    backgroundColor: colors,
    borderWidth: [0, 0]
    }]
    },
    options: {
      title: {
      display: true,
      text:  "number of " + id
      },
      scales: {
				xAxes: [{
					barPercentage: 1,
					ticks: {
						fontColor: this.font
					},
					gridLines: {
						color: this.lines
					}
				}],
			  yAxes: [{
				ticks: {
          beginAtZero: true,
          stepSize: 1,
				  fontColor: this.font
				},
				gridLines: {
					zeroLineColor: this.lines,
					color: this.lines
				}
			  }]
      },
			legend: {
				display:false
			},
    responsive: false,
    display: true
    }
    });
  }

  tdGraph(users, call, numbers, colors, id){
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
    type: 'bar',
    data: {
    labels: call,
    datasets: [{
    label: id + " sent",
    data: numbers,
    backgroundColor: colors,
    borderWidth: [0, 0]
    }]
    },
    options: {
      title: {
      display: true,
      text: id + " sent"
      },
      scales: {
				xAxes: [{
					barPercentage: 1,
					ticks: {
						fontColor: this.font
					},
					gridLines: {
						color: this.lines
					}
				}],
			  yAxes: [{
				ticks: {
          beginAtZero: true,
          stepSize: 1,
				  fontColor: this.font
				},
				gridLines: {
					zeroLineColor: this.lines,
					color: this.lines
				}
			  }]
			},
			legend: {
				display:false
			},
    responsive: false,
    display: true
    }
    });
  }

  msgGraph(users, num_messages, colors, id){
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
    type: 'bar',
    data: {
    labels: users,
    datasets: [{
    label: 'Division of ' + id,
    data: num_messages,
    backgroundColor: colors,
    borderWidth: [0, 0]
    }]
    },
    options: {
      title: {
      display: true,
      text: 'Division of' + id
      },
    legend: {
    display: true,
    position:'bottom'
    },
    responsive: false,
    display: true
    }
    });
  }

  wordGraphs(users, words, colors){
    var ids = ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10"];
    //var j = 0;
    for(var i = 0; i < words.length; ++i){
      if(Math.max(words[i][1][0],words[i][1][1]) > 0){
        this.canvas = document.getElementById(ids[i]);
        this.ctx = this.canvas.getContext('2d');
        const myChart = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: users,
          datasets: [{
          label: "Uses of \"" + words[i][0] + "\"",
          data: words[i][1],
          backgroundColor: colors,
        borderWidth: 0
        }]
        },
        options: {
          title: {
            display: true,
            text: "Uses of \"" + words[i][0] + "\""
            },
        legend: {
          display:false
        },
        responsive: true,
        display: true
        }
        });
      }
    }
  }

}
