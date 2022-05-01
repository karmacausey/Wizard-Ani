function main(){
    //add listener to the buttons
    const $submit = $("#userSubmit")
    $submit.click(searchAni);
    const $tv = $("#tv");
    $tv.click(function(){
        typeSearch("tv");
    });
    const $movie = $("#movie");
    $movie.click(function(){
        typeSearch("movie");
    });
    const $ova = $("#ova");
    $ova.click(function(){
        typeSearch("ova");
    });
    const $special = $("#special");
    $special.click(function(){
        typeSearch("special");
    });
    const $ona = $("#ona");
    $ona.click(function(){
        typeSearch("ona");
    });
    const $music = $("#music");
    $music.click(function(){
        typeSearch("music");
    });
    const $G = $("#G");
    $G.click(function(){
        ratingSearch("G");
    });
    const $PG13 = $("#PG-13");
    $PG13.click(function(){
        ratingSearch("PG-13");
    });
    const $R17 = $("#R17");
    $R17.click(function(){
        ratingSearch("R - 17+");
    });
    const $Rplus = $("#Rplus");    
    $Rplus.click(function(){
        ratingSearch("R+");
    });
    const $Rx = $("#Rx");
    $Rx.click(function(){
        ratingSearch("Rx");
    });
//pull data from the jikan API and build a carousel obect using jquery to 
//dynamically build the html tags
$.get(`https://api.jikan.moe/v4/anime?min_score=8.8`, (data) => {
    //grab the carousel container from the index page   
    const $carousel = $("#innerCarousel");    
    console.log(data.data.length) //for debugging purposes
    //loop through data and build carousel div tags and inner content
    for (let i = 0; i < data.data.length; i++) {
        //build carousel image div with image link from api        
        const $carouselDiv = $(`<div class=\"carousel-item\"><img src=\"${data.data[i].images.jpg.large_image_url}\" class=\"d-block carouselImg\" alt=\"...\"></div>`);
        //since the first item in the carousel has to be active, add active class when i === 0
        if (i === 0) {
            $carouselDiv.addClass("active");
        }
        //error check if there is no english title info returned
        let name = data.data[i].title;
        if (data.data[i].title_english != null) {
            name = data.data[i].title_english;
        }
        //build carousel text content with a button for further data about each show and a rating label
        const $carouselCaptionDiv = $(`<div class=\"carousel-caption position-absolute top-25 start-25 end-25 bottom-50 bg-light text-dark bg-opacity-50\">
        <h1 id=\"${data.data[i].mal_id}\" type=\"button\" class=\"btn btn-dark opacity-100 btn-lg\" data-bs-toggle=\"modal\" data-bs-target=\"#aniModal\">${name}</h1>
        <h5 class=\"opacity-100\">RATING: ${data.data[i].rating}</h5>        
        </div>`);
        //append the parts of the carousel to the carousel pulled at top of page
        $carouselCaptionDiv.appendTo($carouselDiv);
        $carouselDiv.appendTo($carousel)
        const $aniTitleH1 = $(`#${data.data[i].mal_id}`);
        //add click event listener to the button that opens the modal with further info
        //this function will execute a new api request for info based on the mal_id which
        //was stored in the ID of the H1 tag above.
        $aniTitleH1.click(displayAnimeInfo);
    }
});
}

//click function that sets the search box value, clicks type radio button, then calls the searchAni function
function typeSearch(str){
    const $search = $("#search");
    $search.val(str);
    const $type = $("#type");
    $type.prop("checked", true);    
    searchAni();
}

//click function that sets the search box value, clicks rating radio button, then calls the searchAni function
function ratingSearch(str){
    const $search = $("#search");
    $search.val(str);
    const $rating = $("#rating");
    $rating.prop("checked", true);   
    searchAni();
}

function searchAni(){    
    let searchParam = "https://api.jikan.moe/v4/anime?";
    const $search = $("#search");
    const $carousel = $("#innerCarousel");
    const errorChkType = ["tv", "movie", "ova", "special", "ona", "music"];
    const errorChkRating = ["G", "PG-13", "R - 17+", "R+", "Rx"];    
    
    //set search parameter string based on user radio button selection and input
    if($("#title").prop("checked")){
        searchParam += `q=${$search.prop("value")}`;
    }else if($("#type").prop("checked") && errorChkType.indexOf($search.prop("value")) !== -1){
        searchParam += `type=${$search.prop("value")}`;
    }else if($("#rating").prop("checked") && errorChkRating.indexOf($search.prop("value")) !== -1){
        searchParam += `rating=${$search.prop("value")}`;
    }else if($("#min_score").prop("checked") && ($search.prop("value") > 8.5 && $search.prop("value") < 9.3)){
        searchParam += `min_score=${$search.prop("value")}`;
    }else{
        $search.val("");
        alert("Please make a valid entry")
        return null;
    }
    $carousel.empty();//empty previous carousel
    $.get(searchParam, (data) => {
    console.log(data.data.length) //for debugging purposes
    //loop through data and build carousel div tags and inner content
    for (let i = 0; i < data.data.length; i++) {
        //build carousel image div with image link from api        
        const $carouselDiv = $(`<div class=\"carousel-item\"><img src=\"${data.data[i].images.jpg.large_image_url}\" class=\"d-block carouselImg\" alt=\"...\"></div>`);
        //since the first item in the carousel has to be active, add active class when i === 0
        if (i === 0) {
            $carouselDiv.addClass("active");
        }
        //error check if there is no english title info returned
        let name = data.data[i].title;
        if (data.data[i].title_english != null) {
            name = data.data[i].title_english;
        }
        //build carousel text content with a button for further data about each show and a rating label
        const $carouselCaptionDiv = $(`<div class=\"carousel-caption position-absolute start-0 top-0 bg-light text-dark bg-opacity-50\">
        <h1 id=\"${data.data[i].mal_id}\" type=\"button\" class=\"btn btn-dark opacity-100 btn-lg\" data-bs-toggle=\"modal\" data-bs-target=\"#aniModal\">${name}</h1>
        <h5 class=\"opacity-100\">RATING: ${data.data[i].rating}</h5>        
        </div>`);
        //append the parts of the carousel to the carousel pulled at top of page
        $carouselCaptionDiv.appendTo($carouselDiv);
        $carouselDiv.appendTo($carousel)
        const $aniTitleH1 = $(`#${data.data[i].mal_id}`);
        //add click event listener to the button that opens the modal with further info
        //this function will execute a new api request for info based on the mal_id which
        //was stored in the ID of the H1 tag above.
        $aniTitleH1.click(displayAnimeInfo);
    }
    $search.val("");
});
}
//call main to start page
main();
//called when the H1/button is clicked inside the carousel
function displayAnimeInfo() {
    //get the anime based on the ID that was stored as the H1's id
    const $modal = $("#aniModal");
    const $modalTitle = $("#aniModalLabel");
    const $card = $("#aniCard");
    $.get(`https://api.jikan.moe/v4/anime/${this.id}`, (data) => {
        let title = data.data.title
        //check if there is an english title(this value comes back null occaisonally)
        //otherwise use the generic title value
        if (data.data.title_english != null) {
            title = data.data.title_english
        }
        //error check for null trailer values
        let trailerAnchor = `<a href=\"${data.data.trailer.url}\" target=\"_blank\">TRAILER</a>`;
        if (data.data.trailer.url === null){
            trailerAnchor = `<p>TRAILER NOT AVAILABLE</p>`
        }
        //set the top of the modal to the name of the show
        $modalTitle.text(title)
        //build the card item shown in the modal with detailed data pulled about the show
        const $cardImg = $(`<img id=\"cardImg\" src=\"${data.data.images.jpg.large_image_url}\" class=\"card-img-top w-25\" alt=\"...\">`);
        const $aniCardBody = $(`<div class=\"card-body\" id=\"aniCardBody\">
        <h3 class=\"card-title display-3\">${title}</h3>
        <p class=\"card-text\">RATING: ${data.data.rating}</p>
        <p class=\"card-text\">POPULARITY RANK: ${data.data.popularity}</p>
        <p class=\"card-text\">NUMBER OF EPISODES: ${data.data.episodes}</p>       
        <p class=\"card-text\">AIRED: ${data.data.aired.prop.from.year} to ${data.data.aired.prop.to.year}</p>
        <p class=\"card-text\">STATUS: ${data.data.status}</p>
        <p class=\"card-text\">ABOUT: ${data.data.synopsis}</p>
        <a href=\"${data.data.url}\" target=\"_blank\">MORE INFO</a><br>
        ${trailerAnchor}
        </div>`);
        $cardImg.appendTo($card);
        $aniCardBody.appendTo($card);
    });
    $modal.show();//make the modal visible to the user
    $closeBtn = $("#closeModal");
    //add a click function to the close button of the modal that will 
    //make it not visible and clear the card data out for next time
    $closeBtn.click(function () {
        $modal.hide();
        $card.empty();
    });
}
