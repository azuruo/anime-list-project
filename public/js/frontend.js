function displayMessage(msg) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = msg;
  messageElement.style.display = 'block';
  setTimeout(() => {
      messageElement.style.display = 'none';
  }, 3000); // Hide the message after 3 seconds
}

function removeAnime(event) {
  event.preventDefault();

  // Display a confirmation dialog
  const isConfirmed = window.confirm('Are you sure you want to remove this anime from your list?');
  if (!isConfirmed) {
      return;
  }

  const animeId = event.target.getAttribute('data-animeid');

  fetch(`/anime/remove-from-my-list/${animeId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then((response) => response.json())
  .then((data) => {
      if (data.message === 'Anime removed from your list') {
          const listItem = event.target.closest('li');
          if (listItem) {
              listItem.remove();
          }
          displayMessage('Anime removed from your list!');
      }
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

function addAnime(event) {
  event.preventDefault();
  
  const animeId = event.target.getAttribute('data-animeid');
  
  fetch(`/anime/add-to-my-list/${animeId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then((response) => response.json())
  .then((data) => {
      if (data.message === 'Anime added to your list') {
          window.location.href = '/search?query='; // Redirects to the list of all animes
      } else if (data.message === 'Anime already in your list') {
          // Handle the case when anime is already in the list, e.g., display a message
      }
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

function confirmDeletion() {
  return confirm('Are you sure you want to remove this anime from the database?');
}

document.addEventListener('DOMContentLoaded', function () {
  const removeButtons = document.querySelectorAll('.removeAnimeButton');
  removeButtons.forEach((button) => {
      button.addEventListener('click', removeAnime);
  });

  const addButtons = document.querySelectorAll('.addAnimeButton');
  addButtons.forEach((button) => {
      button.addEventListener('click', addAnime);
  });
});
