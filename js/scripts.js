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

  // return the whole repository
  function getAll() {
    return repository;
  }

  var $pokemonList = $('.pokemon-list');

  // create pokemon button inside of an unordered list
  function addListItem(pokemon) {
    // create <li> element
    var $listItem = $('<li></li>');
    // create a button that contains inside the <li> an shows the pokemon name
    var $button = $('<button class="pokemon-button">' + pokemon.name + '</button>');
    // append the button to the <li>
    $listItem.append($button);
    // append the <li> to the <ul>
    $pokemonList.append($listItem);
    // add an event listener to each button that logs pokemon name to the console
    $button.on('click', function(event) {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return $.ajax(apiUrl, {
        dataType: 'json'
      })
      .then(function(json) {
        json.results.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item,
          };
          add(pokemon);
        });
      }).catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return $.ajax(url, {
        dataType: 'json'
      })
      .then(function(details) {
        // Now we add the details to the item
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.types = details.types.map(function(pokemon) {
          return pokemon.type.name;
        });
      })
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

  function showModal(pokemon) {
    // blurred background behind the modal
    var $mainContent = $('#main-contant');
    $mainContent.addClass('is-blurred');

    var $modalContainer = $('#modal-container');
    $modalContainer.addClass('is-visible');

    // Clear all existing modal content
    $($modalContainer).html('');

    // Modal structure
    var modal = $('<div class="modal"></div>');
    var modalheader = $('<div class="modal-header"></div>');
    var modalbody = $('<div class="modal-body"></div>');

    // Add the new modal content
    var namePokemon = $('<h1>' + pokemon.name + '</h1>');

    var heigthPokemontext = $('<h2>' + 'height' + '</h2>');
    var heightPokemon = $('<p>' + pokemon.height + '</p>');

    var typesPokemontext = $('<h2>' + 'types' + '</h2>');
    var typesPokemon1 = $('<p class="' + pokemon.types[0] + '">' + pokemon.types[0] + '</p>');
    var typesPokemon2 = $('<p class="' + pokemon.types[1] + '">' + pokemon.types[1] + '</p>');

    var imgContainer = $('<div id="img-container"></div>');
    var imgPokemon = $('<div class="image"><img src="' + pokemon.imageUrl + '"></div>');
    var imgCircle =$('<div class="circle"></div>');
    var imgCircle0 =$('<div class="image-circle" style="animation-delay: -3s"></div>');
    var imgCircle0 =$('<div class="image-circle" style="animation-delay: -3s"></div>');
    var imgCircle1 =$('<div class="image-circle" style="animation-delay: -2s"></div>');
    var imgCircle2 =$('<div class="image-circle" style="animation-delay: -1s"></div>');
    var imgCircle3 =$('<div class="image-circle" style="animation-delay: 0s"></div>');

    imgContainer.append(imgPokemon);
    imgContainer.append(imgCircle, imgCircle0, imgCircle1, imgCircle2, imgCircle3);


    var closeButtonElement = $('<button class="modal-close">✖</button>');
    // to close the Modal by pressing the Close Button
    $(closeButtonElement).click(function() {
      $($mainContent).removeClass('is-blurred'); $($modalContainer).removeClass('is-visible', 'animate__animated animate__bounce');
    });

    // to close the modal by pressing ESC
    $(document).on('keydown', function(event) {
      if (event.key == "Escape") {
        $($mainContent).removeClass('is-blurred');
        $($modalContainer).removeClass('is-visible');
      }
    });

    // to close the Modal by pressing outside the modal
    $(document).mouseup(function(e) {
      var modal = $(".modal");
      if (!modal.is(e.target) && modal.has(e.target).length === 0) {
        $($mainContent).removeClass('is-blurred');
        $($modalContainer).removeClass('is-visible');
      }
    });

    modal.append(modalheader);
    modalheader.append(imgContainer);
    modalheader.append(closeButtonElement);
    modal.append(modalbody);
    modalbody.append(namePokemon);
    modalbody.append(heigthPokemontext);
    modalbody.append(heightPokemon);
    modalbody.append(typesPokemontext);
    modalbody.append(typesPokemon1);
    modalbody.append(typesPokemon2);
    $modalContainer.append(modal);
  }

  // exposed public functions
  return {
    add: add,
    addListItem: addListItem,
    getAll: getAll,
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
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
