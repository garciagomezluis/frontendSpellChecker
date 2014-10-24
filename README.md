#frontendSpellChecker

##What?

Yes, this is another (and **very simple**: It means that special characters and latins are not contemplated for example) javascript Peter Norvig's implementation of his "spelling corrector" (but I consider this is more like a interpretation of his [essay](http://norvig.com/spell-correct.html)). As he mentioned in the article, the working process is based on a little probability theory and all this is implemented in two technical steps: loading data (training) and comparing values to "guess" the word.

##Can it be used?

I wouldn't, but if you want to try is just to load a simple file in the front-side.

**Example**

	//On the client side
		var checker = spellChecker({
			"locationAddWord": "spellChecker/loadWord/"
		});

		checker.loadTrainingFile("spellChecker/words/");

		console.log( checker.getSuggest( "manday", false ) );


	//On the server side: words.json
		{
			"sunday": 533,
			"monday": 400,
			"tuesday": 657,
			"wednesday": 120,
			"thursday": 725,
			"friday": 473,
			"saturday": 476
		}


	//On the server side: There is a rutine to level up a word's score (frequency)
		match(url, "spellChecker/loadWord/:{word}") = {
			//Code to level up the word's score in words.json file.
			//While this: the local copy in the client side is being updated.
		};


	//On the server side: There is another routine to send words.json file when it is required
		match(url, "spellChecker/words/")={
			//Code to send the words.json;
		};

spellChecker can be initialized as:

	var checker = spellChecker({
		["locationAddWord": String],
		["keySensitive:": Bool],
		["maxEditDistance": Int],
		["minWordFrequency": Int]
	});

where

* `locationAddWord`: Is the path to the file which tracks the new word (if it not exist or just increases its frequency value) in words.json
* `keySensitive`: It returns false if "word" and "Word" does not match
* `maxEditDistance`: It only returns the value which needs *maxEditDistance or less* changes to match with one of the words in words.json
* `minWordFrequency`: It only returns the value which has a frequency higher than minWordFrequency 

The checker object has only two public methods:

	checker.loadTrainingFile( path_to_url_to_get_the_file_with_ajax: String );

	checker.getSuggest( word: String, getInfoWithExtraData: Bool );

* `loadTrainingFile`: Sends a request to the path specified in *locationAddWord* to get words.json
* `getInfoWithExtraData`: Used for testing

##Can I try now?

[Here](http://yatusabee.com.ar/spellChecker): It works fine for one-word phrases (I guess it could be useful when static data is required).

##Have this a mistake?

If I made a mistake please (In writing too (my native language is Spanish)) [tell me](http://yatusabee.com.ar) or you can just fork this =).

##Licence

[General Public Licence](http://www.gnu.org/copyleft/gpl.html)