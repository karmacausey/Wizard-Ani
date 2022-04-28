const $carousel = $("#innerCarousel");
//pull data from the jikan API and store in aniShow object, then push on the aniArry
$.get(`https://cors-anywhere.herokuapp.com/https://api.jikan.moe/v4/anime`, (data) => {                
    console.log(data.data.length)
    //loop through data and build anime objects, then build carousel div tags from objects
    for(let i = 0; i < data.data.length; i++){           
        //build div strings for carousel
        const $carouselDiv = $(`<div class=\"carousel-item\"><img src=\"${data.data[i].images.jpg.large_image_url}\" class=\"d-block w-100\" alt=\"...\"></div>`);
        if(i === 0){
            $carouselDiv.addClass("active");
        }
            const $carouselCaptionDiv = $(`<div class=\"carousel-caption d-none d-md-block\">
            <h1>${data.data[i].title}</h1>
            <h3>RATING:${data.data[i].rating}</h3>
            <p>SYNOPSIS: ${data.data[i].synopsis}</p>
            <p>BACKGROUND: ${data.data[i].background}</p>
            <a href=\"${data.data[i].trailer.url}\">view trailer</a>
            </div>`);
            $carouselCaptionDiv.appendTo($carouselDiv);
        $carouselDiv.appendTo($carousel)
    }        
});

/*  
    example div
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5>Second slide label</h5>
        <p>Some representative placeholder content for the second slide.</p>
    </div>*/
