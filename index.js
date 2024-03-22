const URL_RANDOM = "https://clientes.api.greenborn.com.ar/public-random-word";

const $wordRandom = document.querySelector(".word");
const $containerLettersForm = document.querySelector(".container_letters");
const $fragment = document.createDocumentFragment();
const $inputTries = document.querySelectorAll(".input_radio");
const $misTakes = document.querySelector(".mistakes");

async function getData() {
  try {
    const res = await fetch(URL_RANDOM);
    const json = await res.json();
    const wordJson = json[0];
    const word = quitarAcentos(wordJson);
    const randomWord = word.split("");
    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    return { word, randomWord };
  } catch (err) {
    const message = err.statusText || "Ocurrio un error";
    throw new Error(message);
  }
}

function quitarAcentos(palabra) {
  return palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function gueessWord() {
  try {
    const { word, randomWord } = await getData();
    const wordArray = word.split("");
    let i = 0;
    const answerWord = [];
    const mistakes = new Set(); // para llevar el conteo de las letras incorectas
    randomWord.sort((a, b) => Math.random() - 0.5);
    console.log(word);
    randomWord.forEach((el, index) => {
      const $input = document.createElement("input");
      $input.classList = "input_letters";
      $input.type = "text";
      $input.maxLength = "1";
      $input.id = index;
      $input.autocomplete = "off";

      $fragment.appendChild($input);
    });

    document.addEventListener("keyup", (e) => {
      if (e.target.matches(".input_letters")) {
        if (e.target.nextElementSibling) e.target.nextElementSibling.focus();
        if (e.target.value) {
          const id = e.target.id;
          const value = e.target.value;

          if (wordArray[id] === value) {
            answerWord[id] = value;
            const answerWordstring = answerWord.join("");
            if (word === answerWordstring) {
              alert("felicidades has ganado");
              location.reload();
            }
          } else {
            let variableContrlMisTakes = false;
            if (i < $inputTries.length) {
              $inputTries[i].checked = true;
              i++;

              wordArray.forEach((el) => {
                if (value === el) {
                  variableContrlMisTakes = true;
                }
              });
              variableContrlMisTakes || mistakes.add(value);

              const mistakesArray = [...mistakes];

              $misTakes.innerHTML = mistakesArray;
            } else {
              alert(`lo siento no has acertado la respuesta es: "${word}"`);
              location.reload();
            }
          }
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.matches(".random")) {
        location.reload();
      }
      if (e.target.matches(".reset")) {
        $inputTries.forEach((el) => {
          el.checked = false;
          i = 0;
        });
        mistakes.clear();
        const mistakesArray = [...mistakes];
        $misTakes.innerHTML = mistakesArray;

        const $inputs = document.querySelectorAll(".input_letters");
        $inputs.forEach((el) => {
          el.value = "";
        });
      }
    });

    $wordRandom.innerHTML = randomWord.join("");
    $containerLettersForm.appendChild($fragment);
  } catch (err) {
    console.log(err.message);
  }
}
gueessWord();
