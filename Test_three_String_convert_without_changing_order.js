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




"My user is AdminUser" 
"ym resu si resunimda"
"abcdefgh 123"
"!@#$%$% "
1234556
"a b c d e f g h "
"This is a sample testing where the given string is revered"
"q"
"samplesamplesamplesamplesample"





