let request;
if(window.XMLHttpRequest) {
    request = new XMLHttpRequest;
} else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
}

class pageBtn {
    constructor (pageNum) {
        this.pageNum = pageNum;
    }
    render () {
        return `<button class="pageBtn" id="page${this.pageNum}" onclick="changePage(event)">${this.pageNum}</button>`;
    }
}

class movieItem {
    constructor (movie) {
        this.title = movie.Title;
        this.year = movie.Year;
        this.type = movie.Type;
        this.poster = movie.Poster == "N/A"? "assets/noimage.png": movie.Poster ;
    } 
    render() {
        return `<div id="movieItem">
                    <img src="${this.poster}">
                    <div>
                        <p>${this.type}</p>
                        <h4>${this.title}</h4>
                        <p>${this.year}</p>
                        <button onclick="showInfo(event)">Details</button>
                    </div>
                </div>`
    }
}

class FilmInfo {
    constructor (movie) {
        this.title = movie.Title;
        this.released = movie.Released;
        this.genre = movie.Genre;
        this.country = movie.Country;
        this.director = movie.Director;
        this.writer = movie.Writer;
        this.actors = movie.Actors;
        this.awards = movie.Awards;
        this.poster = movie.Poster == "N/A" ? "assets/noimage.png": movie.Poster ;
    }
    render() {
        return `<div id="movieInfo">
                    <img src="${this.poster}">
                    <div>
                        <h3>${this.title}</h3>
                        <p>Released: ${this.released}</p>
                        <p>Genre: ${this.genre}</p>
                        <p>Country: ${this.country}</p>
                        <p>Director: ${this.director}</p>
                        <p>Writer: ${this.writer}</p>     
                        <p>Actors: ${this.actors}</p>
                        <p>Awards: ${this.awards}</p>                   
                    </div>
                </div>`;
    }
}

let pagination = document.querySelector("#paginationContainer"),
movies = document.querySelector("#movieList"),
fInfo = document.querySelector("#filmInfo"),
page;

function searchMovie() {
    pagination.innerHTML = '';
    movies.innerHTML = '';
    fInfo.innerHTML = '';
    let title = document.querySelector("#title").value;
    let type = document.querySelector("#type").value;
    request.open("GET", `https://www.omdbapi.com/?&s=${title}&Type=${type}&apikey=95992181`);
    request.onload = function(){
    if (request.status == 200)
        {
            let res = JSON.parse(request.response);
            if (res.Response == "True") {
                let pages = Math.ceil(parseInt(res.totalResults)/10);
                page = res.Search;
                for (let i=1; i<=pages; i++){
                    pagination.innerHTML+=new pageBtn(i).render();
                }
                document.querySelector("#page1").classList.add("active");
                page.forEach(movie => {
                    movies.innerHTML += new movieItem(movie).render();
                });
            }
            else {
                alert(`Movie "${title}" is not found!`)
            }         
        }
    }
    request.send();
}

function changePage(event) {
    document.querySelector(".active").classList.remove("active");
    event.srcElement.classList.add("active");
    let num = event.srcElement.innerText;
    let title = document.querySelector("#title").value;
    let type = document.querySelector("#type").value;
    request.open("GET", `https://www.omdbapi.com/?&s=${title}&Type=${type}&Page=${num}&apikey=95992181`);
    request.onload = function(){
    if (request.status == 200)
        {
            let response = JSON.parse(request.response);
            page = response.Search;
            movies.innerHTML='';
            page.forEach(movie => {
                movies.innerHTML += new movieItem(movie).render();
            });         
        }
    }
    request.send();
}

function showInfo(event) {
    let parent = document.querySelector("#movieList").children;
    let index = Array.prototype.indexOf.call(parent, event.srcElement.parentElement.parentElement);
    request.open("GET", `https://www.omdbapi.com/?&i=${page[index].imdbID}&apikey=95992181`);
    request.onload = function(){
        if (request.status == 200)
            {
                let response = JSON.parse(request.response);
                fInfo.innerHTML = new FilmInfo(response).render();
            }
        }
    request.send();
}