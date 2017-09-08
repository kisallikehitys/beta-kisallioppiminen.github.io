class Exercises {

  /**
   * Generates an array with exercises and their corresponding IDs.
   * @param  {String} pageData Raw print.html data
   * @return {Array}          Array of exercises
   */
  static extractExercises(pageData) {
    // Matches chapter number OR exercise ID
    //const regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    const regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">\s*<header>\s*<h\d>\s*(?:<div\s+[^>]*>[^<]*<\/div>\s*)*<a\s+(?:[^>]*?\s+)*data-target="(#[a-zA-Z0-9ÅåÄäÖö.;:_-]+)"[^>]*>[^<]*<\/a>\s*<\/h\d>\s*<\/header>\s*<div\s+[^>]*>(.*?)(?:\s*<h2>[^<]*(?:<a(?:\s+[^>]+)*>[^<]*<\/a>\s*)?[^<]*<\/h2>\s*<div(?:\s+[^>]+)*>(.*?)<\/div>\s*)?<\/div>)/g;
    
    //TEST regex - not finished yet <div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">\s*<header>\s*<h\d>\s*(?:<div\s+[^>]*>[^<]*<\/div>\s*)*<a\s+(?:[^>]*?\s+)*data-target="(#[a-zA-Z0-9ÅåÄäÖö.;:_-]+)"[^>]*>[^<]*<\/a>\s*<\/h\d>\s*<\/header>\s*<div\s+[^>]*>(.*?)(?:\s*<h2>[^<]*(?:<a(?:\s+[^>]+)*>[^<]*<\/a>\s*)?[^<]*<\/h2>\s*<div(?:\s+[^>]+)*>(.*?)<\/div>\s*)?<\/div>
    let regex_array = regex.exec(pageData);

    let chapters = [];
    const chapterRegex = /<input[^\/]+id=.chapterNumber.\s+value=['"]?(\d+)['"]?\s?[^\/]+\/>.*?<article>.*?<section>\s*<header>\s*<h1>([^<]+)<\/h1>\s*<\/header>\s*<\/section>\s*<section\s+class="panel">\s*<header>\s*<h1>\s*<a\s+data-toggle="collapse"\s+class="collapsed"\s+data-target="#[\w-]*?"\s*>/g;
    
// REGEXP <article>\s*<section>\s*<header>\s*<h1>([^<]*)<\/h1>\s*<\/header>\s*<\/section>\s*<section class="panel">\s*<header>\s*<h1>\s*<a\s+data-toggle="collapse" class="collapsed" data-target="#luvun-tavoitteet"><\/article>
    // Initialize variables
    let exercises = [];
    let chapterNumber = 0;
    let exerciseCounter = 1;
    
    let chapterRegexArray;
    while ((chapterRegexArray = chapterRegex.exec(pageData)) !== null) {
        if (typeof chapterRegexArray[1] !== 'undefined' && chapterRegexArray[1] !== null) {
            let chapterNum = parseInt(chapterRegexArray[1]);
            chapters[chapterNum] = {
                number: chapterNum,
                name: chapterRegexArray[2],
                exercises: []
            };
            
        }
    }

    // While matches are found
    while (regex_array != null) {
      // If matches a chapter number
      if (regex_array[1] == null) {
        exercises.push({
          id: regex_array[2],
          displayNumber: `${chapterNumber}.${exerciseCounter}`, // TODO rename to displayNumber
          chapter: chapterNumber,
          number: exerciseCounter,
          domId: regex_array[3],
          assignment: regex_array[4],
          solution: regex_array[5]
        });
        chapters[chapterNumber].exercises.push({
          id: regex_array[2],
          displayNumber: `${chapterNumber}.${exerciseCounter}`, // TODO rename to displayNumber
          chapter: chapterNumber,
          number: exerciseCounter,
          domId: regex_array[3],
          assignment: regex_array[4],
          solution: regex_array[5]            
        });
        exerciseCounter++;
      // If matches an exercise ID  
      } else if (regex_array[2] == null) {
        chapterNumber = regex_array[1];
        exerciseCounter = 1;
      }
      regex_array = regex.exec(pageData);
    }
    return {exercises: exercises, chapters: chapters};
  }

}
