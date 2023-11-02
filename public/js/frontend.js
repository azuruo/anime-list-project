function removeAnime(event) {
  event.preventDefault();

  // Display a confirmation dialog
  const isConfirmed = window.confirm('Are you sure you want to remove this anime from your list?');

  // If the user clicks "Cancel", exit the function without removing the anime
  if (!isConfirmed) {
    return;
  }

  // Get the anime ID from the button's data attribute
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
          // Locate the closest <li> element to the button and remove it
          const listItem = event.target.closest('li');
          if (listItem) {
              listItem.remove();
          }
      }
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const removeButtons = document.querySelectorAll('.removeAnimeButton');
  removeButtons.forEach((button) => {
      button.addEventListener('click', removeAnime);
  });
});
