const darkModeBtn = document.querySelectorAll('.dark-mode-btn'),
      moonBtn = document.querySelector('#moon-btn'),
      sunBtn = document.querySelector('#sun-btn'),
      rndCity = document.querySelector('#rnd-city'),
      cityInputContainer = document.querySelector('#city-input-container'),
      calcResult = document.querySelector('#calc-result'),
      workSelect = document.querySelector('#work-select'),
      lengthSelect = document.querySelector('#length-select');

// ====== Dark mode button
for (let i = 0; i < darkModeBtn.length; i++) {
  darkModeBtn[i].addEventListener('click', event => {
    moonBtn.classList.toggle('hidden');
    sunBtn.classList.toggle('hidden');

    if (moonBtn.classList.contains('hidden')) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });
}

// ====== Autocomplete functionality
const createAutoComplete = ({root}) => {
  root.innerHTML = `
    <input id="city-input" type="text" placeholder="">
    <div class="dropdown-container hidden"></div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown-container');

  const onInput = async event => {
    event.target.setAttribute('placeholder', 'Search for your city');
    const searchTerm = event.target.value;

    if (searchTerm) {
      const results = await locations.filter(location => 
        location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      if (!results.length) {
        dropdown.classList.add('hidden');
        return;
      };
  
      dropdown.innerHTML = '';
      dropdown.classList.remove('hidden');

      for (let result of results) {
        const choice = document.createElement('a');
  
        choice.classList.add('dropdown-item');
        choice.innerHTML = `${result.city}, ${result.state}`;

        choice.addEventListener('click', () => {
          dropdown.classList.add('hidden');
          input.value = result.city;
          rndCity.innerHTML = result.city;
          workSelect.removeAttribute('disabled');
          lengthSelect.removeAttribute('disabled');
        });
  
        dropdown.appendChild(choice);
      };
    } else {
      dropdown.classList.add('hidden');
    };
  };
  input.addEventListener('input', debounce(onInput));

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      dropdown.classList.add('hidden');
    };
  });
}

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

createAutoComplete({
  root: cityInputContainer
})

// ====== Page inititialization
const getCity = () => {
  return locations[Math.floor(Math.random() * 5977)].city;
}

let chosenCity = getCity();
rndCity.innerHTML = chosenCity;
document.querySelector('#city-input').setAttribute('placeholder', chosenCity);

// ====== Calculator functionality
const calcEarnings = () => {
  if (workSelect.value && lengthSelect.value) {
    let result = (15 + (Math.floor(Math.random() * 20) + 1) * workSelect.value);
    if (parseInt(lengthSelect.value) === 0) {
      result += Math.floor(Math.random() * 10) + 1;
    } else {
      result = Math.pow(result, lengthSelect.value);
    };
    calcResult.innerHTML = `$${result}`;
  }
}

workSelect.addEventListener('change', () => {
  calcEarnings();
})

lengthSelect.addEventListener('change', () => {
  calcEarnings();
})