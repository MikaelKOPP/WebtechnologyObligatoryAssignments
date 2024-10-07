let currentPage = 1;
const postsPerPage = 9;
let isLoading = false;

function createPostCard(todo) {
  const postCard = document.createElement('div');  // reserves space
  postCard.classList.add('post-card');
  postCard.innerHTML = `
        <h2 class="post-title">${todo.title}</h2>
        <p class="post-body">Status: ${
      todo.completed ? 'Completed' : 'Not Completed'}</p>
    `;
  return postCard;
}

function fetchPosts() {
  if (isLoading) return;
  isLoading = true;

  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';
  // example json from teacher
  fetch(`https://jsonplaceholder.typicode.com/todos?_page=${
            currentPage}&_limit=${postsPerPage}`)
      .then(response => {
        console.log('Response status:', response.status);
        // error hanlding
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(todos => {
        console.log('Fetched info:', todos);
        const postsContainer = document.getElementById('posts-container');

        if (todos.length === 0) {
          loadingElement.textContent = 'No more info boxes to load.';
          return;
        }

        todos.forEach(todo => {
          const postCard = createPostCard(todo);
          postsContainer.appendChild(postCard);
        });

        currentPage++;
        isLoading = false;
      })
      .catch(error => {
        console.error('Error fetching info:', error);
        loadingElement.textContent =
            'error loading info boxes. Please try again later.';
        isLoading = false;
      });
}

// determines whether close to bottom
function isScrollNearBottom() {
  return window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200;
}

// calls for new api-call
function handleScroll() {
  if (isScrollNearBottom()) {
    fetchPosts();
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  fetchPosts();
});

// listens for scroll by user
window.addEventListener('scroll', handleScroll);

console.log('page1.js loaded');