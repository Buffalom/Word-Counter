$(function(){
  // Get URL-Parameter
  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

  // Delete empty Array-Elements
  Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  // Average Count
  function calcStats(words) {
    var stats = {};

    var sum = 0;
    var sumChar = 0;
    var longWord = {
      'word': '',
      'count': 0
    };
    words.forEach(function(word) {
      sum += word.count;
      sumChar += word.word.length;
      if (word.word.length > longWord.word.length) {
        longWord = word;
      }
    }, this);
    stats.sum = sum;
    stats.sumChar = sumChar;
    stats.avg = Math.round((sum / words.length) * 100) / 100;
    stats.avgChar = Math.round((sumChar / words.length) * 100) / 100;
    stats.longWord = longWord;
    stats.readTime = Math.round(sum / 275) + " min";

    return stats;
  }

  // Sort Array
  function sortByCountAsc(a, b){
    var a = a.count;
    var b = b.count; 
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }
  function sortByCountDesc(a, b){
    var a = a.count;
    var b = b.count; 
    return ((a > b) ? -1 : ((a < b) ? 1 : 0));
  }
  function sortByWordAsc(a, b){
    var a = a.word;
    var b = b.word; 
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }
  function sortByWordDesc(a, b){
    var a = a.word;
    var b = b.word; 
    return ((a > b) ? -1 : ((a < b) ? 1 : 0));
  }

  // Print Words
  function printWords(words) {
    var code = "";
    var x = 0;
    while (x < words.length) {
      code += "<tr><td>" + words[x].word + "</td><td>" + words[x].count + "</td></tr>";
      x++;
    }
    $('.word-table > tbody').html(code);
  }

  // Print Stats
  function printStats(words) {
    var code = "";
    words.sort(sortByCountDesc);
    var stats = calcStats(words);
    code += "<tr><th>Words</th><td>" + stats.sum + "</td><td></td></tr>";
    code += "<tr><th>Characters</th><td>" + stats.sumChar + "</td><td></td></tr>";
    code += "<tr><th>Average Count</th><td>" + stats.avg + "</td><td></td></tr>";
    code += "<tr><th>Average Characters</th><td>" + stats.avgChar + "</td><td></td></tr>";
    code += "<tr><th>Longest Word</th><td>" + stats.longWord.word + "</td><td>" + stats.longWord.count + "</td></tr>";
    code += "<tr><th>Reading Time (275 Words/min)</th><td>" + stats.readTime + "</td><td></td></tr>";
    
    $('.stats-table > tbody').html(code);
  }

  // Count Words
  var words
  function countWords() {
    var text = $('#text').val();
    var wordsTemplate;
    var words = [];
    text = text.toLowerCase().replace(/[^\u00c4\u00e4\u00d6\u00f6\u00dc\u00fc\u00dfa-z0-9]/gi, ' ').split(/[ \r?\n|\r]+/).clean("");

    text.forEach(function(part) {
      var x = 0;
      wordsTemplate = {word: "", count: ""};
      var found = false;
      while (x < words.length) {
        if (part == words[x].word) {
          words[x].count++;
          found = true;
        }
        x++;
      }
      if (!found) {
        words[x] = wordsTemplate;
        words[x].word = part;
        words[x].count = 1;
      }
    }, this);
    
    if (sortBy == 'word' && sortOrder != 'desc') {
      printWords(words.sort(sortByWordAsc));
    } else if (sortBy == 'word' && sortOrder == 'desc') {
      printWords(words.sort(sortByWordDesc));
    } else if (sortBy == 'count' && sortOrder == 'asc') {
      printWords(words.sort(sortByCountAsc));
    } else {
      printWords(words.sort(sortByCountDesc));
    }
    printStats(words);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }








  // Last modified date in footer
  var last_mod = $.datepicker.formatDate('dd.mm.yy', new Date(document.lastModified));
  $('#last_mod').html(last_mod);

  // Generate Sort-By-Buttons
  var sortBy = 'count';
  var sortOrder = 'desc';
  $('#sort_btn_block').on('click', '.btn-sort', function(){
    var id = this.id;
    if (id == 'wordAsc') {
      sortBy = 'word';
      sortOrder = 'asc';
    } else if (id == 'wordDesc') {
      sortBy = 'word';
      sortOrder = 'desc';
    } else if (id == 'countAsc') {
      sortBy = 'count';
      sortOrder = 'asc';
    } else if (id == 'countDesc') {
      sortBy = 'count';
      sortOrder = 'desc';
    }
    countWords();


    var message = '<h4><small>Sort by:</small> ';
    var code = '';
    if (sortBy == 'word') {
      if (sortOrder == 'asc') {
        code += '<button class="btn btn-default btn-sort" id="wordDesc" role="button">Word DESC</button>';
        code += '<button class="btn btn-default btn-sort" id="countDesc" role="button">Count DESC</button>';
      } else {
        code += '<button class="btn btn-default btn-sort" id="wordAsc" role="button">Word ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="countDesc" role="button">Count DESC</button>';
      }
    } else if (sortBy == 'count') {
      if (sortOrder == 'desc') {
        code += '<button class="btn btn-default btn-sort" id="wordAsc" role="button">Word ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="countAsc" role="button">Count ASC</button>';
      } else {
        code += '<button class="btn btn-default btn-sort" id="wordAsc" role="button">Word ASC</button>';
        code += '<button class="btn btn-default btn-sort" id="countDesc" role="button">Count DESC</button>';
      }
    }
    
    if (sortBy == 'word') {
      if (sortOrder == 'asc') {
        message += 'Word ascending';
      } else {
        message += 'Word descending';
      }
    } else if (sortBy == 'count') {
      if (sortOrder == 'desc') {
        message += 'Count descending';
      } else {
        message += 'Count ascending';
      }
    } else {
      message += 'Count descending';
    }

    message += '</h4>';
    $('#sort_btn_block').html(message + code);
  });
  
  // Count Words
  $('#text').bind('input propertychange', countWords);
});