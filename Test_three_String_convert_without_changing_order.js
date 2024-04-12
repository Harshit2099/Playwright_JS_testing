"To reverse a string without changing the order of the string"


function reverseString(str) {
    var a;
    var b;
    var c;
    var e;
    a = str.split(" ").reverse().join(" ")    
    console.log(a)
    b = a.split("")
    console.log(b)
    c = b.reverse() 
    console.log(c)
    e = c.join("");
    return e
} 
console.log(reverseString("My user is AdminUser"));


// by using loops
function reverseWordsNoOrderChange(str3)
{       
    var words = str3.split(" ");
    console.log(words);
    var revWordsarray = [];    
    words.forEach(word =>
        {
            var revwordsstr = "";
            for (var i = word.length -1; i>=0; i--)
            {
                revwordsstr = revwordsstr + word[i];
                console.log(revwordsstr)
            }
            revWordsarray.push(revwordsstr);
            console.log(revWordsarray);
    })
    return revWordsarray.join(" ");
}

console.log(reverseWordsNoOrderChange("hello this is a test"));





"My user is AdminUser" 
"ym resu si resunimda"
"abcdefgh 123"
"!@#$%$% "
1234556
"a b c d e f g h "
"This is a sample testing where the given string is revered"
"q"
"samplesamplesamplesamplesample"





