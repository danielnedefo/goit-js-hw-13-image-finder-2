import markUpFunction from'./markUp.hbs'
const params = {
  search: '',
  page: 1,
  perPage:12
}

const form = document.querySelector('.search-form')
const loadBtn = document.querySelector('.load-btn')
const mainUl = document.querySelector('.gallery')
const input = document.querySelector('[name="query"]')

function searchUrl({ search, page, perPage }) {
  const url = "https://pixabay.com/api/";
  const API_KEY = '20962496-895dd0bdb01e3709ca8fdfb85';
  const PHOTO_PARAMS = "image_type=photo&orientation=horizontal"
  const mainUrl = `${url}?${PHOTO_PARAMS}&q=${search}&page=${page}&per_page=${perPage}&key=${API_KEY}`;
  return mainUrl
}
console.log(searchUrl(params))

form.addEventListener('submit', async function (e) {
  e.preventDefault()
  params.search = input.value;
  params.page = 1
  try {
    const cards = await makeCArds()
    mainUl.innerHTML = cards
  } catch (error) {
    console.log(error)
  }
})

async function makeCArds() {
  try {
    const hotUrl = searchUrl(params)
    console.log(hotUrl)
    const { data } = await fetch(hotUrl)
    const createCard = markUpFunction(data.hits)
    return { createCard }
  } catch (error) {
    console.log(error)
  }
}