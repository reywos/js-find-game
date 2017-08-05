var Game = function(){
  var data = {
    scoreRight:     0,
    counter:        0,
    imgs:           [],
    imgsCount:      30,
    introTemp:      '#t_intro',
    startTemp:      '#t_start',
    selectionTemp:  '#t_selection',
    gridTemp:       '#t_grid',
    countingTemp:   '#t_counting',
    rightTemp:      '#t_right',
    wrongTemp:      '#t_wrong',
    guessTemp:      '#t_guess',
    scoreTemp:      '#t_score',
  }

  function rendering() {
    view(!data.start, data.introTemp);
    view(data.countingShow, data.countingTemp);
    view(data.guessShow, data.guessTemp);
    view(data.grid, data.gridTemp);
    view(data.selectionShow, data.selectionTemp);
    view(data.right, data.rightTemp);
    view(data.wrong, data.wrongTemp);
    view(data.score, data.scoreTemp);
  }

  function view(bool, temp) {
    return bool ? inDom(temp).style.display = 'block' : inDom(temp).style.display = 'none';
  }

  function randomizer(min,max) {
    return ~~(Math.random() * (max - min)) + min;
  }

  function randomFirstImg() {
    return randomizer(1, data.imgsCount);
  }

  function addFirstImages() {
    data.imgs.unshift(randomFirstImg());
  }

  function startGame() {
    function addImgToArray(array) {
      do {
        var randomNum = randomizer(1, data.imgsCount);
        var arrIndexOfRand = array[array.indexOf(randomNum)];
        if(arrIndexOfRand != randomNum) {
          array.unshift(randomNum);
          return;
        }
      } while (arrIndexOfRand == randomNum);   
    }

    function divWidthDependingOnImgs(array) {
      if(array.length > 9) {
        inDom('.grid').style.width = '480px';
      }
    }

    function arrayShuffle() {
      return Math.random();
    }

    function prevenImgCursor(el) {
      inDom(el).forEach(i => i.classList.add('non-active'));
    }

    function counterInit(htmlCounter, counterData) {
      var count = htmlCounter.innerText = counterData;
      htmlCounter.innerText = count--;
      var counterInterval = setInterval(() => {
        if(htmlCounter.innerText > 0) {
          htmlCounter.innerText = count--;
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(counterInterval);
        selections(); // Скрываем картинки и начинаем выбирать
      }, counterData * 1000);
    }

    function addImgToTheGrid(arr) {
      arr.sort(arrayShuffle).forEach(i => {
        inDom('.grid').innerHTML += `
          <div class="grid-item" data-img="${i}">
            <img src="img/${i}.jpg">
            <div class="walls"></div>
            <div class="hard-walls"></div>
          </div>
        `;
      });
    }

    data.score = true;
    data.counter += 1;
    data.start = true;
    data.countingShow = true;
    data.grid = true;
    data.selectionShow = false;
    data.right = false;
    data.wrong = false;
    data.guessShow = false;
    inDom('.grid').innerHTML = '';
    inDom('#score-right').innerHTML = data.scoreRight;
    addImgToArray(data.imgs);
    divWidthDependingOnImgs(data.imgs);
    rendering();
    counterInit(inDom('#counter'), data.counter);
    addImgToTheGrid(data.imgs)
    prevenImgCursor('.grid-item');
  }

  function selections() {
    data.countingShow = false;
    data.selectionShow = true;
    data.guessShow = true;
    rendering();
    imageThatNeedGuess(); 
    inDom('.grid-item').forEach(i => i.classList.remove('non-active'));
    inDom('.walls').forEach(i => i.style.display = 'block');
  }

  function imageThatNeedGuess() {
    var randImg = data.imgs[randomizer(0, data.imgs.length)];
    var html = `<img data-guess="${randImg}" src="img/${randImg}.jpg">`;
    inDom('#t_guess').innerHTML = html;
    select();
  }

  function select() {
    var selectedImg = inDom('#t_guess').querySelector('img').getAttribute('data-guess');
    var rightAnswerWall = inDom(`[data-img="${selectedImg}"]`).querySelector('.walls');

    inDom('.grid-item').forEach(i => {
      i.addEventListener('click', (e) => {
        if(e.target.getAttribute('data-img') === selectedImg) { 
          data.right = true;
          data.wrong = false;
          data.scoreRight++;
        } else { 
          data.wrong = true;
          data.right = false;
          data.scoreRight = 0;
          data.imgs = [];
          data.imgs.unshift(randomFirstImg());
          data.counter = 0;
        }
        data.selectionShow = false;
        inDom('.grid-item').forEach(i => i.style.pointerEvents = 'none');
        rendering();
        rightAnswerWall.style.display = 'none';
      });
    });
  }

  return {
    startGame,
    init() {
      rendering();
      addFirstImages()
    }
  }

}();


