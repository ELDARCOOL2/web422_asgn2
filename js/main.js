let page = 1;
const perPage = 10;
let link = 'https://glorious-scrubs-dog.cyclic.app/';

function loadMovieData(title = null) {
    if (title) {
        fetch(link + `api/movies?page=${page}&perPage=${perPage}&title=${title}`).then((res) => {
            return res.json()
        }).then((data) => {
            const pagination = document.querySelector('.pagination');
            pagination.classList.add("d-none");
            createTR(data);
            viewModal(data);
        })
    } else {
        fetch(link + `api/movies?page=${page}&perPage=${perPage}`).then((res) => {
            return res.json();
        }).then((data) => {
            createTR(data);
            viewModal(data);
        })

    }
}

function createTR(data){
    let numOfRows = `
    ${data.map(movie => (
      `<tr data-id=${movie._id}>
          <td>${movie.year}</td>
          <td>${movie.title}</td>
          <td>${movie.plot ? movie.plot : 'N\\A'}</td>
          <td>${movie.rated ? movie.rated : 'N\\A'}</td>
          <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
      </tr>`
    )).join('')}`;

    document.querySelector('#moviesTable tbody').innerHTML = numOfRows;
    document.querySelector('#current-page').innerHTML = page;
}

function showcmt(data){
    return `
    <strong>Directed By:</strong> ${data.directors.join(',')}<br><br>
    <p>${data.fullplot}</p>
    <strong>Cast:</strong> ${data.cast ? data.cast.join(',') : 'N\\A'}<br><br>
    <strong>Awards:</strong> ${data.awards.text}<br>
    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
    `;
}

function viewModal(data){
    document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
        row.addEventListener('click', (e) => {
            let m_id = row.getAttribute('data-id');
            fetch(link + `/api/movies/${m_id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                let cmt = "";
                if(data.poster){
                    cmt = `<img class="img-fluid w-100" src="${data.poster}"><br><br>`;
                    cmt += showcmt(data);
                }
                else{
                    cmt = showcmt(data);
                }
                

                document.querySelector('#detailsModal .modal-title').innerHTML = data.title;
                document.querySelector('#detailsModal .modal-body').innerHTML = cmt;

                let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                    backdrop: 'static', 
                    keyboard: false, 
                    focus: true, 
                  });
  
                  myModal.show();
            })
        })
    })
}

document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        page = 1;
        loadMovieData(document.querySelector('#title').value);
    });

    document.querySelector('#clearForm').addEventListener('click', (event) => { 
        document.querySelector('#title').value = ""
        loadMovieData();
    });
    document.querySelector('#previous-page').addEventListener('click', (event) => {
        if(page > 1)
            page--;
        loadMovieData();
    });

    document.querySelector('#next-page').addEventListener('click', (event) => {
        page++;
        loadMovieData();
    });

   
});