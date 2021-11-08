The whole task could be implemented easily by splitting input text, then matching again dictionary for count and searching stopwords in dictionary to filter out. But whole of this is costly operation.

As for optimization, I implemented AhoCorasick Algorithm( The fastest alogrithm to find match of list of patterns). Also, had to customize the original Algorithm flow to best suit this project needs. But main concept comes from this AhoCorasick Alogrithm. Limited pattern to ASCII characters only to avoid high memory consumption. Currently each AhoCorasick automaton state contains array of 40 next state link, but if we want to match only Alphabets, this Array of States could be lessen to 26 and stateIndex could be calculated in O(1) time by substracting ASCII value of 'a' Alphabet character. i.e. 'b'-'a' = 1, 'z'-'a' = 25, 'a'-'a'=0 

* To avoid reiteration of input text, again and again, combined Stopword search, MetaKeyword search, and posbilbly valid word finding under same iteration of the input text.
* Removed spaces/newlines from HTML and Html Body text that was concurrent more than onces to optimize calculation
* [Mash.SEOAnalyzer.NET](https://github.com/its-mash/Mash.SEOAnalyzer.NET.git) supports result Caching if Calculation flags doesn't change 

### Related repository links:

- [Mash.AhoCorasick.NET](https://github.com/its-mash/Mash.AhoCorasick.NET.git)
- [Mash.SEOAnalyzer.NET](https://github.com/its-mash/Mash.SEOAnalyzer.NET.git)
- [Mash.HelperMethods.NET](https://github.com/its-mash/Mash.HelperMethods.NET.git)

### TODO
- [ ] Add Input Validation (Frond-end, Backend) and Error Handling.
- [ ] Add Html Page rendering( script rendering ) before SEO Analyzation 
- [ ] Replace harsh Regex Checking to find possible External link with custom logics that utilize AhoCorasick pattern matching iteration( This will avoid reiteration of the same input)
- [ ] Add Comment
- [ ] Look for further optimization
- [ ] Add Testing


### Notes
 - pull recursively `git clone --recurse-submodules https://github.com/cameronmcnz/surface.git`