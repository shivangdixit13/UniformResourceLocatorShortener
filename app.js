// Function to select an element or throw an error if not found
const selectElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) return element;
  throw new Error(`Cannot find the element ${selector}`);
};

// Selecting necessary DOM elements
const form = selectElement("form");
const input = selectElement("input[type='text']");
const result = selectElement(".result");

// Toggle hamburger menu functionality
const hamburger = selectElement(".hamburger");
const navMenu = selectElement(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Function to shorten URL asynchronously
async function shortenUrl(url) {
  try {
    const response = await fetch('https://smolurl.com/api/links', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "url": url })

    });
     //console.log(response);
    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }

    const data = await response.json();
    console.log(data);

    if (data.data && data.data.short_url) {
      const newUrl = document.createElement('div');
      newUrl.classList.add('item');
      newUrl.innerHTML = `
        <p>${data.data.short_url}</p>
        <button class="newUrl-btn">Copy</button>
      `;
      result.prepend(newUrl);

      const copyBtn = newUrl.querySelector('.newUrl-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(data.data.short_url)
          .then(() => {
            alert('URL copied to clipboard');
          })
          .catch(err => {
            console.error('Failed to copy URL', err);
          });
      });

      input.value = ''; // Clear input field after successful submission
    } else {
      console.error('No short URL found in response');
    }
  } catch (error) {
    console.error('Error shortening URL:', error.message);
  }
}

// Event listener for form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission
  
  const url = input.value.trim(); // Trim and get input value
  
  if (url) {
    shortenUrl(url); // Call shortenUrl function with the input URL
  } else {
    console.error('Please enter a valid URL');
  }
});
