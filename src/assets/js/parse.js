class parse {
    /**
     * 
     * ----Class Variables----
     * this.
     * 
     * 
     * -----Class Arrays----
     * this.words         - 3d array holds words, users # of uses
     * this.num_messages  - 1d array, holds total number of usesrs messages
     * this.users         - 1d array, list of uses and is ordered the same way every other thing with users is
     * this.emote         - 3d array holds emoji text, users # of uses
     * this.images        - 1d array, list of num of images each user has sent
     * this.links         - 2d array holds websites and number of links to it
     * 
     * Array Layouts
     * -----------this.words && this.emote-----------
     * [[word, [# USER1, # USER2, ... ,#USERN]],
     *  [word, [# USER1, # USER2, ... ,#USERN]],
     *  [word, [# USER1, # USER2, ... ,#USERN]]]
     * 
     * this.words[i][0] = word at pos i
     * this.words[i][1] = array of users usage of word i
     * this.words[i][1][0] = user 0's use of word i
     * 
     * 
     */
    constructor(words, username, file, num_users) {
        this.words = new Array(words.length);//list of words to search for
        for(var i = 0; i < words.length; ++i){
            this.words[i] = [words[i], this.create_array(this.num_users)];//set up words array
        }
        this.file = file;
        this.num_messages = new Array(num_users); //array of how many users there are
        this.users = [];
        this.users[0] = username;
        this.emote = [];//array of emojis and which users used them
        this.images = this.create_array(this.num_users);//array of # of images a user sends
        this.links = [];//array of links and how many users used them

        console.log("before running:")
        console.log(this.words);
        console.log(this.num_messages);
        console.log(this.users);
        console.log(this.emote);
        console.log(this.images);
        console.log(this.links);
    }

    run(){
        const reader = new FileReader();
        var date_pattern = new RegExp("\[[0-9]{2}-[A-Z][a-z]{2}-[0-9]{2} [0-9]{2}:[0-9]{2} (AM|PM)\]"); //[09-Dec-20 04:10 PM] NAME#0000
        var normal_text = new RegExp("[^((\0)|(\n))]");//anything that isnt an enter or null character
        

        var j = 0;//keep track of line # inside text file
        var cur_user;
        jQuery.get("messages.txt", (data) => {
            console.log("INSIDE FILE");
            cur_user = -1;
            //process text file line by line
            if(date_pattern.test(data.subString(0,20))){
                var name = data.substring(data.indexOf("]")+2);//grab name from line

                console.log("is reading date line in file");
                console.log(name); //BigPoppa44#sdlkjl or me

                var date = data.substring(0, data.indexOf("]")+1);//grab date from line

                console.log(date); // date string []

                //TO DO:log date of message
                for(var h = 0; h < this.users.length; ++h){//go through the users array to find cur user
                    if(this.users[h] = name){//ENSURE THIS IS GRABBING THE CORRECT USER !!!!!!!!!!!!!!!!!!!!!!!!
                        cur_user = h;
                    }
                }
                this.num_messages[cur_user][1]++; //increment total num of messages for that user

                console.log(cur_user); // 0 or 1
                console.log(this.num_messages[cur_user][1]);// # of messages each
            }
            else if(j == 2){ //states type of message and other users
                if(data.contains("Private")){
                    this.num_messages[0] = [this.users[0], 0];
                    this.num_messages[1] = [data.substring(data.indexOf("/")+2), 0];
                    this.users[1] = data.substring(data.indexOf("/")+2);

                    console.log("is inside private messages");
                    console.log(this.num_messages);//array of users with 0
                    console.log(this.users);
                }
                else{
                    //TO DO: reads more users names
                    for(var i = 0; i < num_users; ++i){//for more than 2 users implement the following USE .SPLIT
                        //this.num_messages[i] = [, 0]
                        //this.users[i] = name;
                    }
                }
            }
            else if(j > 6 && normal_text.test(data)){//message lines
                console.log("in message line");
                console.log(data);
            }
            j++;//increment j bc you are moving onto the next line
         });

        console.log("after running");
        console.log(this.words);
        console.log(this.num_messages);
        console.log(this.users);
        console.log(this.emote);
        console.log(this.images);
        console.log(this.links);
    }

    create_array(len){//creates array filled with zeros to allow proper incrementation instead of incrementing trash values
        var temp = [];
        for(var i = 0; i < len; ++i){
            temp[i] = 0;
        }
        return temp;
    }

    search_message(user, message){
        //see if message contains word
        for(var i = 0; i < this.words.length; i++){
            if(message.contains(this.words[i][0])){
                this.words[i][1][user]++;
            }
        }

        //search for emojis
        //declare in class ?? more efficient so only declared once !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var emoji_text = new RegExp(":([a-z]|[0-9])+(_*([a-z]|[0-9])+)+:(:([a-z]|[0-9])+(-*([a-z]|[0-9])+)+:)*");//discord emotes
        var emoticon = new RegExp("(\( ͡° ͜ʖ ͡°\)|¯\\_\(ツ\)_\/¯|\(╯°□°）╯︵ ┻━┻|OTL|0-0|O-O|o-o|0_0|o_o|O_O|uwu|UwU|;-;|T-T|T_T)");
        var action = false;
        if(emoji_text.test(message) || emoticon.test(message)){
            for(var i = 0; i < this.emote.length; ++i){//should cancel if empty !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                if((this.emote[i][0] == emoji_text.exec(message)) || (this.emote[i][0] == emoticon.exec(message))){
                    this.emote[i][1][user]++;//emote is in this.emote array and increase number of times user used it
                    action = true;
                }//otherwise this.emote doesnt include this emote already
            }
            if(!action){//bc no action was taken, add emote to array
                var emote_used = ( emoji_text.exec(message) != null ? emoji_text.exec(message) : emoteicon.exec(message));
                this.emote.push([emote_used,this.create_array(this.num_users)]);
                this.emote[this.emote.length-1][1][user]++ // incrementing users emoji use !!!!!!!!!!ensure ur not indexing past the end !!!!!!!!!!!!!!!!!!!!!!!!!
            }
        }

        //check if message includes an image
        var has_image = false;
        if(message.includes(".png") || message.includes(".gif") || message.includes("jpeg") || message.includes(".jpg")){
            has_image = true;
            this.images[user]++;
        }

        //search message for links
        var end_url = new RegExp("(\.com|\.net|\.org|\.gov|\.edu|\.int|\.ca|\.co|\.[a-z]{2})");
        action = false;
        if((end_url.test(message) && this.num_messages.includes("www.")) && !has_image){
            var link_name = message.substring(message.indexOf("www.")+4, message.indexOf(end_url.exec(message)));//ensure this is grabbing the right NAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            for(var i = 0; i < this.links.length; ++i){//copied from emote so if changes made to that make changes here as well !!!!!!!!!!!!!!!!!!!!!!!!!!!!
                if(this.links[i][0] == link_name){
                    this.links[i][1]++;//link is in this.links array and increase number of times used
                    action = true;
                }//otherwise this.links doesnt include this link already
            }
            if(!action){//bc no action was taken, add emote to array
                this.links.push([link_name,1]);//add link to array and increment usage
            }
        }

        //search for call ?
        //search for @ ONLY IMPLEMENT FOR MULTIPLE PPL PASS FUNCTION EXTRA PARAMETER
    }


}