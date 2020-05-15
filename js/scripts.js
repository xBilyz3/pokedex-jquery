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
  // querySelector to Bootstrap Grid Container
  var $pokemonGrid = $('#gridContainer');
  // create pokemon button inside of Bootstrap Grid Container
  function addcolumnItem(pokemon) {
    // create <li> element
    var $columnItem = $('<li id="PokemonList"></li>');
    // add Class to the make the Button fit on Small ≥576px Screens
    $columnItem.addClass('col-12 col-sm-6 py-3 px-3');
    // add Class to the make the Button fit on all other Screens
    $columnItem.addClass('col-md-4');
    // create a button that contains inside the <li> an shows the pokemon name
    var $button = $('<button type="button" data-toggle="modal" data-target="#exampleModalCenter"></button>');
    $button.addClass('btn btn-block');

    $button.text(pokemon.name);
    // append the button to the <li>
    $columnItem.append($button);
    // append the <li> to the Bootstrap Grid Container
    $pokemonGrid.append($columnItem);
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

    var $modalContainer = $('.modal-dialog');
    // Clear all existing modal content
    $($modalContainer).html('');
    // Modal structure
    var modal = $('<div class="modal-content"></div>');
    var modalheader = $('<div class="modal-header"></div>');
    var modalbody = $('<div class="modal-body"></div>');
    var modalclose = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>')

    // Add the new modal content
    var namePokemon = $('<h1>' + pokemon.name + '</h1>');

    var heigthPokemontext = $('<h2>' + 'height' + '</h2>');
    var heightPokemon = $('<p>' + pokemon.height + '</p>');

    var typesPokemontext = $('<h2>' + 'types' + '</h2>');
    var typesPokemon1 = $('<p>' + pokemon.types[0] + '</p>');
    var typesPokemon2 = $('<p id="' + pokemon.types[1] + '">' + pokemon.types[1] + '</p>');


    // Add the image animation with changing colors by types
    var imgContainer = $('<div id="img-container"></div>');
    var imgPokemon = $('<div class="image"><img src="' + pokemon.imageUrl + '"></div>');
    var imgCircle = $('<div class="image-circle"></div>');
    imgCircle.addClass(pokemon.types[0])
    var imgCircle0 = $('<div class="image-circle" style="animation-delay: -3s"></div>');
    imgCircle0.addClass(pokemon.types[0])
    var imgCircle1 = $('<div class="image-circle" style="animation-delay: -2s"></div>');
    imgCircle1.addClass(pokemon.types[0])
    var imgCircle2 = $('<div class="image-circle" style="animation-delay: -1s"></div>');
    imgCircle2.addClass(pokemon.types[0])
    var imgCircle3 = $('<div class="image-circle" style="animation-delay: 0s"></div>');
    imgCircle3.addClass(pokemon.types[0])

    imgContainer.append(imgPokemon);
    imgContainer.append(imgCircle, imgCircle0, imgCircle1, imgCircle2, imgCircle3);

    modal.append(modalbody);
    modalbody.append(modalclose);
    modalbody.append(imgContainer);
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
    addcolumnItem: addcolumnItem,
    getAll: getAll,
    showDetails: showDetails,
    showModal: showModal,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

var $pokemonList = $('.pokemon-list');
// append each pokemon of the repository to the function addcolumnItem
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addcolumnItem(pokemon);
  });
});

// Search function in the bottom Navbar
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#gridContainer *").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
