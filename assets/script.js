//homemade object for storing values recieved back
aniShow{
    title: "",
    date: "",
    facts: [],
    backImg: "",
    cardImg: "",

}
//declare an array for storing the homemade objects recieved from the get
var aniArry = [];
//pull data from the jikan API and store in the aniShow, then push on the aniArry
$.get(`https://api.jikan.moe/v4/anime/${queryStr}`, (data) => {
//code

});