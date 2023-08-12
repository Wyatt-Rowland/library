# library

----This is a simple library made for the Odin Project. I tried to do as much as possible to further expand my understanding of JS, HTML, and CSS. 

      Despite the library functioning well, there's a few issues I want to address at some point. 


            In render(), the code is manipulating the DOM in a loop, which can hurt performance. I need to build a string or DOM fragment in the loop and then insert it into the DOM once after the loop, according to GPT4.0


            Inline Event Handlers, like "onclick="toggleRead(${i})", is bad because it mixes HTML and JS and is less manageable and scaleable. addEventListener is better. 


            "use strict" should be used to make sure the variables aren't used before they are declared


            I rely on global variables too much, like myLibrary, which could make the code harder to manage. IIFEs (Immediately Invoked Function Expressions), classes, and modules can prevent global scope pollution


            Unescaped User Input: I do nothing to sanitize or check user provided strings that are inserted into the DOM which can be a security risk and lead to Cross-Site scripting attacks (XSS).


            LocalStorage is ok for small applications, but for larger applications it wouldn't work. It has a size limit and doesn't work in all browsers. 


            JS style: I need to use const and let instead of var (which I mostly do) but I also need to follow more ES6 guides and use more arrow functions, which I still find confusing.


            Commenting: My comments are sparce and I could add many more to make the code easier to understand. 


            Accessibility: I haven't gone through the trouble of making the site accesible to smaller screens, mobile devices, or people with disabilities. 


            The site needs to be a little more responsive, and I need to use more em, rem, %, vw, vh, and media queries. 
            
