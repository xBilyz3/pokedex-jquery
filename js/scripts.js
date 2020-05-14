var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // add new pokemon  when modified with the correct type of data
  // and Object.keys()of the parameter are equal to the specific keys
  function add(pokemonObject) {
    if (typeof pokemonObject === 'object' && (Object.keys(pokemonObject) === 'name' || 'height' || 'types')) {
      repository.push(pokemonObject);
    }
  }

  // pokemon types change font color
  function getTextColor(pokemonType) {
    return ' <div ' + 'class="' + pokemonType + '" >' + pokemonType + '</div>';
  }

  // create pokemon button inside of an unordered list
  function addListItem(pokemon) {
    // create <li> element
    var $listItem = document.createElement('li');
    // create a button that contains inside the <li> an shows the pokemon name
    var $button = document.createElement('button');
    $button.innerText = pokemon.name;
    $button.classList.add('pokemon-button');
    // append the button to the <li>
    $listItem.appendChild($button);
    // append the <li> to the unordered list
    $pokemonList.appendChild($listItem);

    // add an event listener to each button that logs pokemon name to the console
    $button.addEventListener('click', function(event) {
      showDetails(pokemon);
    });
  }

  // return the whole repository
  function getAll() {
    return repository;
  }


  // Loading Data from an external api
  function loadList() {
    return fetch(apiUrl).then(function(response) {
      return response.json();
    }).then(function(json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    });
  }

  function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return fetch(url).then(function(response) {
      return response.json();
    }).then(function(details) {
      // Now we add the details to the item
      pokemon.imageUrl = details.sprites.front_default;
      pokemon.height = details.height;
      pokemon.types = details.types[1].type.name;
    }).catch(function(e) {
      console.error(e);
    });
  }

 function showLoadingMessage() {
 }

 //

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

 function showModal(pokemon) {
  var $modalContainer = document.querySelector('#modal-container');

  // Clear all existing modal content
  $modalContainer.innerHTML = '';

  var modal = document.createElement('div');
  modal.classList.add('modal');

  var modalheader = document.createElement('div');
  modalheader.classList.add('modal-header');

  var modalbody = document.createElement('div');
  modalbody.classList.add('modal-body');

  // Add the new modal content
  var closeButtonElement = document.createElement('button');
  closeButtonElement.classList.add('modal-close');
  closeButtonElement.innerText = 'X';
  closeButtonElement.addEventListener('click', hideModal);

  var namePokemon = document.createElement('h1');
  namePokemon.innerText = pokemon.name;

  var heightPokemon = document.createElement('p');
  heightPokemon.innerText ='height: ' + pokemon.height;

  var typesPokemon = document.createElement('p');
  typesPokemon.innerText ='type: ' + pokemon.types;

  var imgPokemon = document.createElement('img');
  imgPokemon.src = pokemon.imageUrl;

  modal.appendChild(modalheader);
	modalheader.appendChild(closeButtonElement);
  modalheader.appendChild(namePokemon);
  modal.appendChild(modalbody);
  modalbody.appendChild(heightPokemon);
  modalbody.appendChild(typesPokemon);
  modalbody.appendChild(imgPokemon);
  $modalContainer.appendChild(modal);

  $modalContainer.classList.add('is-visible');
}

function hideModal() {
  var $modalContainer = document.querySelector('#modal-container');
  $modalContainer.classList.remove('is-visible');
}

window.addEventListener('keydown', (e) => {
  var $modalContainer = document.querySelector('#modal-container');
  if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
    hideModal();
  }
});

var $modalContainer = document.querySelector('#modal-container');
$modalContainer.addEventListener('click', (e) => {
  // Since this is also triggered when clicking INSIDE the modal
  // We only want to close if the user clicks directly on the overlay
  var target = e.target;
  if (target === $modalContainer) {
    hideModal();
  }
});

  // exposed public functions
  return {
    add: add,
    addListItem: addListItem,
    getAll: getAll,
    getTextColor: getTextColor,
    hideModal: hideModal,
    showDetails: showDetails,
    showModal: showModal,
    loadList: loadList,
		loadDetails: loadDetails
  };
})();

var $pokemonList = document.querySelector('.pokemon-list');

// append each pokemon of the repository to the function addListItemp
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
