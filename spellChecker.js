/*	Frontend SpellChecker
    Copyright (C) <2014>  Luis García

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>. */

var spellChecker = function( options ) {

	var KEY_SENSITIVE = options.keySensitive || false;
	var LOCATION_ADD_WORD = options.locationAddWord;
	var MAX_EDIT_DISTANCE = options.maxEditDistance || 6;
	var MIN_WORD_FREQUENCY = options.minWordFrequency || 5;
	var basedData = {};
	
	var levenshteinDistance = function( str1, str2 ) {

		if( str1 === undefined || str1 === null || str1.trim() === "" ) return false;
		if( str2 === undefined || str2 === null || str2.trim() === "" ) return false;

		var lstr1 = str1.length,
			lstr2 = str2.length,
			d = [];

		for( var i = 0; i <= lstr1; i++ ) d[i] = [i];

		for( var i = 0; i <= lstr2; i++ ) d[0][i] = i;

		for( var j = 1; j <= lstr2; j++ ) {
			for( var i = 1; i <= lstr1; i++ ) {
				if( str1[ i - 1] == str2[ j - 1 ] ) d[i][j] = d[i-1][j-1];
				else {
					d[i][j] = Math.min( d[i][j-1], d[i-1][j-1], d[i-1][j] ) + 1;
				}
			}
		}

		return d[ lstr1 ][ lstr2 ];
	};

	var sendRequest = function( location ) {
	  	var xmlhttp;

	    if (window.XMLHttpRequest) {
	        xmlhttp = new XMLHttpRequest();
	    } else {
	        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	    }

	    xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == 4 ) {
	           if(xmlhttp.status == 200){
	               basedData = JSON.parse( xmlhttp.responseText );
	           }
	           else if(xmlhttp.status == 400) {
	              console.log('There was an error 400');
	           }
	           else {
	              console.log('something else other than 200 was returned')
	           }
	        }
	    };

	    xmlhttp.open("GET", location, true);
    	xmlhttp.send();
	};

	var loadTrainingFile = function( filePath ) {
		sendRequest( filePath );
	};

	var trackWord = function( word ) {
		//request to the server to add the word's score to the common file
		if( ! ( LOCATION_ADD_WORD === undefined || LOCATION_ADD_WORD === null ) )
			sendRequest( LOCATION_ADD_WORD + word );

		//updating the local copy
		if( ! ( word in basedData ) ) {
			basedData[word] = 1;
		} else {
			basedData[word]++; 
		}
	};

	var getClosestCandidates = function( word ) {
		var candidates = [];
		var suggest = [];

		//getting data about similar words
		for( var key in basedData ) {
			var editDistance = levenshteinDistance( key, word );
			//filtering by edit distance
			if( editDistance <= MAX_EDIT_DISTANCE ) {
				candidates.push({
					"name": key, "distance": editDistance, "times": basedData[key]
				});
			}
		}

		//filtering by minimum frequency of appearance on the previous set
		candidates = candidates.filter(function(x,i){
			return candidates[i].times >= MIN_WORD_FREQUENCY;
		});

		if( candidates.length )
		{
			//getting the cases with the lowest edit distance(*)
			var min = candidates[0].distance;
			for( var i = 0; i < candidates.length; i++ ) {
				if( min === candidates[i].distance ) suggest.push(candidates[i]);
				if( min > candidates[i].distance ) {
					suggest = [];
					suggest.push(candidates[i]);
					min = candidates[i].distance
				}
			}
		}

		//sorting the previous set by the frequence of appearance (*)
		return suggest.sort(function(a,b){
			return b.times - a.times;
		});
	};

	var getSuggest = function( word, withExtraData ) {

		var suggest = [];
		var candidates = [];

		//It shoud match with the words file
		if( !KEY_SENSITIVE ) word = word.toLowerCase();

		//getting candidates: this are sorted by frequence appearance and with the minimum edit distance founded (+)
		suggest = candidates = getClosestCandidates( word );

		//tracking the entered word
		trackWord( word );

		if( !withExtraData ) {
			//getting the names on the previous set (+)
			suggest = candidates.map(function(x,i){
				return candidates[i].name;
			});
		}

		return suggest;
	};

	return {
		"getSuggest": getSuggest,
		"loadTrainingFile": loadTrainingFile
	};

};
