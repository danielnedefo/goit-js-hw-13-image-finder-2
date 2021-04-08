import _ from 'lodash'
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';

const loadBtn = document.querySelector('.load-btn')
const mainUl = document.querySelector('.gallery')
const API_KEY = '20962496-895dd0bdb01e3709ca8fdfb85';
const URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&q='

const searchParams = {
  search: "",
  page: 1,
  perPage: 12
};


 function search(item) {
  const mainUrl = `${URL}${item}&page=${searchParams.page}&per_page=12&key=${API_KEY}`
  const fetchItem = fetch(mainUrl)
   fetchItem
     .then(response => {
       if (!response.ok) {
       throw new Error('There is some error here')
       }
       return response.json()
     })
     .then(result => {
       const cards = result.hits.map(itemGet).join('')
       mainUl.innerHTML = cards
      })
     .catch(err => console.log(err))
   
   loadBtn.addEventListener('click', function (e) {
   searchParams.page += 1
     e.preventDefault()
     const mainUrl = `${URL}${item}&page=${searchParams.page}&per_page=12&key=${API_KEY}`
     const fetchImage = fetch(mainUrl)
     fetchImage
     .then(response => {
       if (!response.ok) {
       throw new Error('There is some error here')
       }
       return response.json()
     })
     .then(result => {
       const newImg = result.hits.map(itemGet)
       mainUl.insertAdjacentHTML('beforeend', newImg)
       const lastVisiblePhoto = document.querySelector('.gallery-item:last-child')
       const scrollValue = lastVisiblePhoto.offsetTop + lastVisiblePhoto.clientHeight + 20;
       window.scrollTo({
              behavior: 'smooth',
              top:scrollValue

})

     })
     .catch(err => console.log(err))
   })
}

async function loadMore(item) {
  searchParams.page += 1;
  const mainUrl = `${URL}${item}&page=${searchParams.page}&per_page=12&key=${API_KEY}`
  const fetch = await fetch(mainUrl)
}

const form = document.querySelector('.search-form')
const butnSubm = form.querySelector('[type="submit"]')
const input = document.querySelector('[name="query"]')
form.addEventListener('submit', function (e) {
  e.preventDefault()
  const inputValue = input.value;
  search(inputValue)

  loadBtn.classList.remove('hide')
})

function itemGet(item) {
  const { webformatURL, likes, views, comments, downloads } = item;
  const markUp = `<li class="gallery-item"><div class="photo-card">
  <img src="${webformatURL}" alt="" />

  <div class="stats">
    <p class="stats-item">
      <i class="material-icons">thumb_up</i>
      ${likes}
    </p>
    <p class="stats-item">
      <i class="material-icons">visibility</i>
      ${views}
    </p>
    <p class="stats-item">
      <i class="material-icons">comment</i>
      ${comments}
    </p>
    <p class="stats-item">
      <i class="material-icons">cloud_download</i>
      ${downloads}
    </p>
  </div>
</div>
</li>`
 
  return markUp
}

function infiniteScroll() {
  const options = {
    threshold:0.2
  }
  async function observerCallback(entries,observer) {
    const elem = entries[0];
    if (elem.isIntersecting) {
      observer.unobserve(elem.target)
      await loadMore()
      const last = document.querySelector('.gallery-item:last-child')
      observer.observe(last)
    }
    
  }
  const lastVisiblePhoto = document.querySelector('.gallery-item:last-child')
  const observer = new IntersectionObserver(observerCallback, options)
  observer.observe(lastVisiblePhoto)
}