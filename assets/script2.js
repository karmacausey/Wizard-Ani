function main(){
    //add listener to the submit button
    const $submit = $("#userSubmit")
    $submit.click(searchAni);
//pull data from the jikan API and build a carousel obect using jquery to 
//dynamically build the html tags
$.get(`https://api.jikan.moe/v4/anime/?min_score=8.8`, (data) => {
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
//saved for later https://cors-anywhere.herokuapp.com/
function searchAni(){
    let searchParam = "/https://api.jikan.moe/v4/anime/?";
    const $search = $("#search");
    const $carousel = $("#innerCarousel");
    $carousel.empty();//empty previous carousel
    //set search parameter string based on user radio button selection and input
    if($("#type").prop("checked")){
        searchParam += `type=${$search.prop("value")}`;
    }else if($("#rating").prop("checked")){
        searchParam += `rating=${$search.prop("value")}`;
    }else if($("#min_score").prop("checked")){
        searchParam += `min_score=${$search.prop("value")}`;
    }
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
        //set the top of the modal to the name of the show
        $modalTitle.text(title)
        //build the card item shown in the modal with detailed data pulled about the show
        const $cardImg = $(`<img id=\"cardImg\" src=\"${data.data.images.jpg.large_image_url}\" class=\"card-img-top\" alt=\"...\">`);
        const $aniCardBody = $(`<div class=\"card-body\" id=\"aniCardBody\">
        <h3 class=\"card-title display-3\">${title}</h3>
        <p class=\"card-text\">RATING: ${data.data.rating}</p>
        <p class=\"card-text\">POPULARITY RANK: ${data.data.popularity}</p>
        <p class=\"card-text\">NUMBER OF EPISODES: ${data.data.episodes}</p>       
        <p class=\"card-text\">AIRED: ${data.data.aired.prop.from.year} to ${data.data.aired.prop.to.year}</p>
        <p class=\"card-text\">STATUS: ${data.data.status}</p>
        <p class=\"card-text\">ABOUT: ${data.data.synopsis}</p>
        <a href=\"${data.data.url}\" target=\"_blank\">MORE INFO</a><br>
        <a href=\"${data.data.trailer.url}\" target=\"_blank\">TRAILER</a>      
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
