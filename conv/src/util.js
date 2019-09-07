function argmax(array) {
    return array.map((x, i) => [x, i])
        .reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function argmin(array) {
    return array.map((x, i) => [x, i])
        .reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}
function fill_missing(dict,keys,value){
    keys.forEach(function(key,idx){
        if(!(key in dict)){
            dict[key] = value;
        }
    });
}
function to_dict(keys,values){
    if(keys.length < values.length){
        throw "to_dict: keys and values are not the same length";
    }
    var els = {};
    for(var i=0; i < values.length; i += 1){
        els[keys[i]] = values[i];
    }
    return els;
}
function is_defined(token){
	  return token != ""
		    && token != null
		    && token != undefined;
}
/**
* @param {string} a
 * @param {string} b
 * @return {number}
 */
function levenshtein_distance(a, b) {
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  // Fill the first row of the matrix.
  // If this is first row then we're transforming empty string to a.
  // In this case the number of transformations equals to size of a substring.
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }

  // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
}
