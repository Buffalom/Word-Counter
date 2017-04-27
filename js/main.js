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

  // Count Words
  function countWords() {
    var sortBy = getUrlParameter('sortBy');
    var sortOrder = getUrlParameter('sortOrder');
    var text = this.value;
    var wordsTemplate;
    var words = [];
    text = text.toLowerCase().replace(/[^a-z0-9]/gi, ' ').split(/[ \r?\n|\r]+/).clean("");

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
  }








  // Last modified date in footer
  var last_mod = $.datepicker.formatDate('dd.mm.yy', new Date(document.lastModified));
  $('#last_mod').html(last_mod);

  // Generate Sort-By-Buttons
  var message = '<h4><small>Sort by:</small> ';
  var code = '';
  var sortBy = getUrlParameter('sortBy');
  var sortOrder = getUrlParameter('sortOrder');
  if (sortBy == 'word' && sortOrder != 'desc') {
    code += '<a class="btn btn-default" href="index.html?sortBy=word&sortOrder=desc" role="button">Word DESC</a>';
  } else {
    code += '<a class="btn btn-default" href="index.html?sortBy=word" role="button">Word ASC</a>';
  }
  if (sortBy != 'count' && sortOrder != 'asc') {
    code += '<a class="btn btn-default" href="index.html?sortBy=count&sortOrder=asc" role="button">Count ASC</a>';
  } else {
    code += '<a class="btn btn-default" href="index.html?sortBy=count" role="button">Count DESC</a>';
  }

  if (sortBy == 'word' && sortOrder != 'desc') {
    message += 'Word ascending';
  } else if (sortBy == 'word') {
    message += 'Word descending';
  } else if (sortBy == 'count' && sortOrder != 'asc') {
    message += 'Count descending';
  } else if (sortBy == 'count') {
    message += 'Count ascending';
  } else {
    message += 'Count descending';
  }
  message += '</h4>';
  $('#sort_btn_block').html(message + code);
  
  // Count Words
  $('#text').bind('input propertychange', countWords);
});