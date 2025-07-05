import { GoogleGenerativeAI }from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

export const aiSummariseCommit = async (diff: string) => {
    // htttps://github.com/AKASHLM010/Decode-Github/commit/<commithash>.diff
    const response = await model.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file,there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/opis/openai.ts]
* Lowered numeric tolerance for test files
\`\`\`
Most commits will have less comments than this example list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example  in your summary.
It is not given only as a example of appropriate summary comments.`,
        `Please summarise the following diff file : \n\n${diff}`,         
    ]);
    return response.response.text();
}

console.log(await aiSummariseCommit(`
    diff --git a/bun.lock b/bun.lock
index 14e5fed..fc1647f 100644
--- a/bun.lock
+++ b/bun.lock
@@ -34,10 +34,14 @@
         "@radix-ui/react-toggle-group": "^1.1.10",
         "@radix-ui/react-tooltip": "^1.2.7",
         "@t3-oss/env-nextjs": "^0.12.0",
+        "@tailwindcss/aspect-ratio": "^0.4.2",
+        "@tailwindcss/forms": "^0.5.10",
+        "@tailwindcss/typography": "^0.5.16",
         "@tanstack/react-query": "^5.69.0",
         "@trpc/client": "^11.0.0",
         "@trpc/react-query": "^11.0.0",
         "@trpc/server": "^11.0.0",
+        "autoprefixer": "^10.4.21",
         "class-variance-authority": "^0.7.1",
         "clsx": "^2.1.1",
         "cmdk": "^1.1.1",
@@ -59,6 +63,7 @@
         "sonner": "^2.0.5",
         "superjson": "^2.2.1",
         "tailwind-merge": "^3.3.1",
+        "usehooks-ts": "^3.1.1",
         "vaul": "^1.1.2",
         "zod": "^3.25.67",
       },
@@ -70,10 +75,10 @@
         "@types/react-dom": "^19.0.0",
         "eslint": "^9.23.0",
         "eslint-config-next": "^15.2.3",
-        "postcss": "^8.5.3",
+        "postcss": "^8.5.6",
         "prettier": "^3.5.3",
         "prettier-plugin-tailwindcss": "^0.6.11",
-        "tailwindcss": "^4.0.15",
+        "tailwindcss": "^4.1.11",
         "tw-animate-css": "^1.3.4",
         "typescript": "^5.8.2",
         "typescript-eslint": "^8.27.0",
@@ -361,6 +366,10 @@
 
     "@t3-oss/env-nextjs": ["@t3-oss/env-nextjs@0.12.0", "", { "dependencies": { "@t3-oss/env-core": "0.12.0" }, "peerDependencies": { "typescript": ">=5.0.0", "valibot": "^1.0.0-beta.7 || ^1.0.0", "zod": "^3.24.0" }, "optionalPeers": ["typescript", "valibot", "zod"] }, "sha512-rFnvYk1049RnNVUPvY8iQ55AuQh1Rr+qZzQBh3t++RttCGK4COpXGNxS4+45afuQq02lu+QAOy/5955aU8hRKw=="],
 
+    "@tailwindcss/aspect-ratio": ["@tailwindcss/aspect-ratio@0.4.2", "", { "peerDependencies": { "tailwindcss": ">=2.0.0 || >=3.0.0 || >=3.0.0-alpha.1" } }, "sha512-8QPrypskfBa7QIMuKHg2TA7BqES6vhBrDLOv8Unb6FcFyd3TjKbc6lcmb9UPQHxfl24sXoJ41ux/H7qQQvfaSQ=="],
+
+    "@tailwindcss/forms": ["@tailwindcss/forms@0.5.10", "", { "dependencies": { "mini-svg-data-uri": "^1.2.3" }, "peerDependencies": { "tailwindcss": ">=3.0.0 || >= 3.0.0-alpha.1 || >= 4.0.0-alpha.20 || >= 4.0.0-beta.1" } }, "sha512-utI1ONF6uf/pPNO68kmN1b8rEwNXv3czukalo8VtJH8ksIkZXr3Q3VYudZLkCsDd4Wku120uF02hYK25XGPorw=="],
+
     "@tailwindcss/node": ["@tailwindcss/node@4.1.11", "", { "dependencies": { "@ampproject/remapping": "^2.3.0", "enhanced-resolve": "^5.18.1", "jiti": "^2.4.2", "lightningcss": "1.30.1", "magic-string": "^0.30.17", "source-map-js": "^1.2.1", "tailwindcss": "4.1.11" } }, "sha512-yzhzuGRmv5QyU9qLNg4GTlYI6STedBWRE7NjxP45CsFYYq9taI0zJXZBMqIC/c8fViNLhmrbpSFS57EoxUmD6Q=="],
 
     "@tailwindcss/oxide": ["@tailwindcss/oxide@4.1.11", "", { "dependencies": { "detect-libc": "^2.0.4", "tar": "^7.4.3" }, "optionalDependencies": { "@tailwindcss/oxide-android-arm64": "4.1.11", "@tailwindcss/oxide-darwin-arm64": "4.1.11", "@tailwindcss/oxide-darwin-x64": "4.1.11", "@tailwindcss/oxide-freebsd-x64": "4.1.11", "@tailwindcss/oxide-linux-arm-gnueabihf": "4.1.11", "@tailwindcss/oxide-linux-arm64-gnu": "4.1.11", "@tailwindcss/oxide-linux-arm64-musl": "4.1.11", "@tailwindcss/oxide-linux-x64-gnu": "4.1.11", "@tailwindcss/oxide-linux-x64-musl": "4.1.11", "@tailwindcss/oxide-wasm32-wasi": "4.1.11", "@tailwindcss/oxide-win32-arm64-msvc": "4.1.11", "@tailwindcss/oxide-win32-x64-msvc": "4.1.11" } }, "sha512-Q69XzrtAhuyfHo+5/HMgr1lAiPP/G40OMFAnws7xcFEYqcypZmdW8eGXaOUIeOl1dzPJBPENXgbjsOyhg2nkrg=="],
@@ -391,6 +400,8 @@
 
     "@tailwindcss/postcss": ["@tailwindcss/postcss@4.1.11", "", { "dependencies": { "@alloc/quick-lru": "^5.2.0", "@tailwindcss/node": "4.1.11", "@tailwindcss/oxide": "4.1.11", "postcss": "^8.4.41", "tailwindcss": "4.1.11" } }, "sha512-q/EAIIpF6WpLhKEuQSEVMZNMIY8KhWoAemZ9eylNAih9jxMGAYPPWBn3I9QL/2jZ+e7OEz/tZkX5HwbBR4HohA=="],
 
+    "@tailwindcss/typography": ["@tailwindcss/typography@0.5.16", "", { "dependencies": { "lodash.castarray": "^4.4.0", "lodash.isplainobject": "^4.0.6", "lodash.merge": "^4.6.2", "postcss-selector-parser": "6.0.10" }, "peerDependencies": { "tailwindcss": ">=3.0.0 || insiders || >=4.0.0-alpha.20 || >=4.0.0-beta.1" } }, "sha512-0wDLwCVF5V3x3b1SGXPCDcdsbDHMBe+lkFzBRaHeLvNi+nrrnZ1lA18u+OTWO8iSWU2GxUOCvlXtDuqftc1oiA=="],
+
     "@tanstack/query-core": ["@tanstack/query-core@5.81.5", "", {}, "sha512-ZJOgCy/z2qpZXWaj/oxvodDx07XcQa9BF92c0oINjHkoqUPsmm3uG08HpTaviviZ/N9eP1f9CM7mKSEkIo7O1Q=="],
 
     "@tanstack/react-query": ["@tanstack/react-query@5.81.5", "", { "dependencies": { "@tanstack/query-core": "5.81.5" }, "peerDependencies": { "react": "^18 || ^19" } }, "sha512-lOf2KqRRiYWpQT86eeeftAGnjuTR35myTP8MXyvHa81VlomoAWNEd8x5vkcAfQefu0qtYCvyqLropFZqgI2EQw=="],
@@ -527,6 +538,8 @@
 
     "async-function": ["async-function@1.0.0", "", {}, "sha512-hsU18Ae8CDTR6Kgu9DYf0EbCr/a5iGL0rytQDobUcdpYOKokk8LEjVphnXkDkgpi0wYVsqrXuP0bZxJaTqdgoA=="],
 
+    "autoprefixer": ["autoprefixer@10.4.21", "", { "dependencies": { "browserslist": "^4.24.4", "caniuse-lite": "^1.0.30001702", "fraction.js": "^4.3.7", "normalize-range": "^0.1.2", "picocolors": "^1.1.1", "postcss-value-parser": "^4.2.0" }, "peerDependencies": { "postcss": "^8.1.0" }, "bin": { "autoprefixer": "bin/autoprefixer" } }, "sha512-O+A6LWV5LDHSJD3LjHYoNi4VLsj/Whi7k6zG12xTYaU4cQ8oxQGckXNX8cRHK5yOZ/ppVHe0ZBXGzSV9jXdVbQ=="],
+
     "available-typed-arrays": ["available-typed-arrays@1.0.7", "", { "dependencies": { "possible-typed-array-names": "^1.0.0" } }, "sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ=="],
 
     "axe-core": ["axe-core@4.10.3", "", {}, "sha512-Xm7bpRXnDSX2YE2YFfBk2FnF0ep6tmG7xPh8iHee8MIcrgq762Nkce856dYtJYLkuIoYZvGfTs/PbZhideTcEg=="],
@@ -539,6 +552,8 @@
 
     "braces": ["braces@3.0.3", "", { "dependencies": { "fill-range": "^7.1.1" } }, "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA=="],
 
+    "browserslist": ["browserslist@4.25.1", "", { "dependencies": { "caniuse-lite": "^1.0.30001726", "electron-to-chromium": "^1.5.173", "node-releases": "^2.0.19", "update-browserslist-db": "^1.1.3" }, "bin": { "browserslist": "cli.js" } }, "sha512-KGj0KoOMXLpSNkkEI6Z6mShmQy0bc1I+T7K9N81k4WWMrfz+6fQ6es80B/YLAeRoKvjYE1YSHHOW1qe9xIVzHw=="],
+
     "busboy": ["busboy@1.6.0", "", { "dependencies": { "streamsearch": "^1.1.0" } }, "sha512-8SFQbg/0hQ9xy3UNTB0YEnsNBbWfhf7RtnzpL7TkBiTBRfrQ9Fxcnz7VJsleJpyp6rVLvXiuORqjlHi5q+PYuA=="],
 
     "call-bind": ["call-bind@1.0.8", "", { "dependencies": { "call-bind-apply-helpers": "^1.0.0", "es-define-property": "^1.0.0", "get-intrinsic": "^1.2.4", "set-function-length": "^1.2.2" } }, "sha512-oKlSFMcMwpUg2ednkhQ454wfWiU/ul3CkJe/PEHcTKuiX6RpbehUiFMXu13HalGZxfUwCQzZG747YXBn1im9ww=="],
@@ -579,6 +594,8 @@
 
     "cross-spawn": ["cross-spawn@7.0.6", "", { "dependencies": { "path-key": "^3.1.0", "shebang-command": "^2.0.0", "which": "^2.0.1" } }, "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA=="],
 
+    "cssesc": ["cssesc@3.0.0", "", { "bin": { "cssesc": "bin/cssesc" } }, "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg=="],
+
     "csstype": ["csstype@3.1.3", "", {}, "sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw=="],
 
     "d3-array": ["d3-array@3.2.4", "", { "dependencies": { "internmap": "1 - 2" } }, "sha512-tdQAmyA18i4J7wprpYq8ClcxZy3SC31QMeByyCFyRt7BVHdREQZ5lpzoe5mFEYZUWe+oq8HBvk9JjpibyEV4Jg=="],
@@ -637,6 +654,8 @@
 
     "dunder-proto": ["dunder-proto@1.0.1", "", { "dependencies": { "call-bind-apply-helpers": "^1.0.1", "es-errors": "^1.3.0", "gopd": "^1.2.0" } }, "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A=="],
 
+    "electron-to-chromium": ["electron-to-chromium@1.5.179", "", {}, "sha512-UWKi/EbBopgfFsc5k61wFpV7WrnnSlSzW/e2XcBmS6qKYTivZlLtoll5/rdqRTxGglGHkmkW0j0pFNJG10EUIQ=="],
+
     "embla-carousel": ["embla-carousel@8.6.0", "", {}, "sha512-SjWyZBHJPbqxHOzckOfo8lHisEaJWmwd23XppYFYVh10bU66/Pn5tkVkbkCMZVdbUE5eTCI2nD8OyIP4Z+uwkA=="],
 
     "embla-carousel-react": ["embla-carousel-react@8.6.0", "", { "dependencies": { "embla-carousel": "8.6.0", "embla-carousel-reactive-utils": "8.6.0" }, "peerDependencies": { "react": "^16.8.0 || ^17.0.1 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc" } }, "sha512-0/PjqU7geVmo6F734pmPqpyHqiM99olvyecY7zdweCw+6tKEXnrE90pBiBbMMU8s5tICemzpQ3hi5EpxzGW+JA=="],
@@ -665,6 +684,8 @@
 
     "es-toolkit": ["es-toolkit@1.39.5", "", {}, "sha512-z9V0qU4lx1TBXDNFWfAASWk6RNU6c6+TJBKE+FLIg8u0XJ6Yw58Hi0yX8ftEouj6p1QARRlXLFfHbIli93BdQQ=="],
 
+    "escalade": ["escalade@3.2.0", "", {}, "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA=="],
+
     "escape-string-regexp": ["escape-string-regexp@4.0.0", "", {}, "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA=="],
 
     "eslint": ["eslint@9.30.0", "", { "dependencies": { "@eslint-community/eslint-utils": "^4.2.0", "@eslint-community/regexpp": "^4.12.1", "@eslint/config-array": "^0.21.0", "@eslint/config-helpers": "^0.3.0", "@eslint/core": "^0.14.0", "@eslint/eslintrc": "^3.3.1", "@eslint/js": "9.30.0", "@eslint/plugin-kit": "^0.3.1", "@humanfs/node": "^0.16.6", "@humanwhocodes/module-importer": "^1.0.1", "@humanwhocodes/retry": "^0.4.2", "@types/estree": "^1.0.6", "@types/json-schema": "^7.0.15", "ajv": "^6.12.4", "chalk": "^4.0.0", "cross-spawn": "^7.0.6", "debug": "^4.3.2", "escape-string-regexp": "^4.0.0", "eslint-scope": "^8.4.0", "eslint-visitor-keys": "^4.2.1", "espree": "^10.4.0", "esquery": "^1.5.0", "esutils": "^2.0.2", "fast-deep-equal": "^3.1.3", "file-entry-cache": "^8.0.0", "find-up": "^5.0.0", "glob-parent": "^6.0.2", "ignore": "^5.2.0", "imurmurhash": "^0.1.4", "is-glob": "^4.0.0", "json-stable-stringify-without-jsonify": "^1.0.1", "lodash.merge": "^4.6.2", "minimatch": "^3.1.2", "natural-compare": "^1.4.0", "optionator": "^0.9.3" }, "peerDependencies": { "jiti": "*" }, "optionalPeers": ["jiti"], "bin": { "eslint": "bin/eslint.js" } }, "sha512-iN/SiPxmQu6EVkf+m1qpBxzUhE12YqFLOSySuOyVLJLEF9nzTf+h/1AJYc1JWzCnktggeNrjvQGLngDzXirU6g=="],
@@ -725,6 +746,8 @@
 
     "for-each": ["for-each@0.3.5", "", { "dependencies": { "is-callable": "^1.2.7" } }, "sha512-dKx12eRCVIzqCxFGplyFKJMPvLEWgmNtUrpTiJIR5u97zEhRG8ySrtboPHZXx7daLxQVrl643cTzbab2tkQjxg=="],
 
+    "fraction.js": ["fraction.js@4.3.7", "", {}, "sha512-ZsDfxO51wGAXREY55a7la9LScWpwv9RxIrYABrlvOFBlH/ShPnrtsXeuUIfXKKOVicNxQ+o8JTbJvjS4M89yew=="],
+
     "function-bind": ["function-bind@1.1.2", "", {}, "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA=="],
 
     "function.prototype.name": ["function.prototype.name@1.1.8", "", { "dependencies": { "call-bind": "^1.0.8", "call-bound": "^1.0.3", "define-properties": "^1.2.1", "functions-have-names": "^1.2.3", "hasown": "^2.0.2", "is-callable": "^1.2.7" } }, "sha512-e5iwyodOHhbMr/yNrc7fDYG4qlbIvI5gajyzPnb5TCwyhjApznQh1BMFou9b30SevY43gCJKXycoCBjMbsuW0Q=="],
@@ -895,6 +918,12 @@
 
     "locate-path": ["locate-path@6.0.0", "", { "dependencies": { "p-locate": "^5.0.0" } }, "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw=="],
 
+    "lodash.castarray": ["lodash.castarray@4.4.0", "", {}, "sha512-aVx8ztPv7/2ULbArGJ2Y42bG1mEQ5mGjpdvrbJcJFU3TbYybe+QlLS4pst9zV52ymy2in1KpFPiZnAOATxD4+Q=="],
+
+    "lodash.debounce": ["lodash.debounce@4.0.8", "", {}, "sha512-FT1yDzDYEoYWhnSGnpE/4Kj1fLZkDFyqRb7fNt6FdYOSxlUWAtp42Eh6Wb0rGIv/m9Bgo7x4GhQbm5Ys4SG5ow=="],
+
+    "lodash.isplainobject": ["lodash.isplainobject@4.0.6", "", {}, "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA=="],
+
     "lodash.merge": ["lodash.merge@4.6.2", "", {}, "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ=="],
 
     "loose-envify": ["loose-envify@1.4.0", "", { "dependencies": { "js-tokens": "^3.0.0 || ^4.0.0" }, "bin": { "loose-envify": "cli.js" } }, "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q=="],
@@ -913,6 +942,8 @@
 
     "micromatch": ["micromatch@4.0.8", "", { "dependencies": { "braces": "^3.0.3", "picomatch": "^2.3.1" } }, "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA=="],
 
+    "mini-svg-data-uri": ["mini-svg-data-uri@1.4.4", "", { "bin": { "mini-svg-data-uri": "cli.js" } }, "sha512-r9deDe9p5FJUPZAk3A59wGH7Ii9YrjjWw0jmw/liSbHl2CHiyXj6FcDXDu2K3TjVAXqiJdaw3xxwlZZr9E6nHg=="],
+
     "minimatch": ["minimatch@3.1.2", "", { "dependencies": { "brace-expansion": "^1.1.7" } }, "sha512-J7p63hRiAjw1NDEww1W7i37+ByIrOWO5XQQAzZ3VOcL0PNybwpfmV/N05zFAzwQ9USyEcX6t3UO+K5aqBQOIHw=="],
 
     "minimist": ["minimist@1.2.8", "", {}, "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA=="],
@@ -937,6 +968,10 @@
 
     "no-case": ["no-case@3.0.4", "", { "dependencies": { "lower-case": "^2.0.2", "tslib": "^2.0.3" } }, "sha512-fgAN3jGAh+RoxUGZHTSOLJIqUc2wmoBwGR4tbpNAKmmovFoWq0OdRkb0VkldReO2a2iBT/OEulG9XSUc10r3zg=="],
 
+    "node-releases": ["node-releases@2.0.19", "", {}, "sha512-xxOWJsBKtzAq7DY0J+DTzuz58K8e7sJbdgwkbMWQe8UYB6ekmsQ45q0M/tJDsGaZmbC+l7n57UV8Hl5tHxO9uw=="],
+
+    "normalize-range": ["normalize-range@0.1.2", "", {}, "sha512-bdok/XvKII3nUpklnV6P2hxtMNrCboOjAcyBuQnWEhO665FwrSNRxU+AqpsyvO6LgGYPspN+lu5CLtw4jPRKNA=="],
+
     "object-assign": ["object-assign@4.1.1", "", {}, "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg=="],
 
     "object-inspect": ["object-inspect@1.13.4", "", {}, "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew=="],
@@ -979,6 +1014,10 @@
 
     "postcss": ["postcss@8.5.6", "", { "dependencies": { "nanoid": "^3.3.11", "picocolors": "^1.1.1", "source-map-js": "^1.2.1" } }, "sha512-3Ybi1tAuwAP9s0r1UQ2J4n5Y0G05bJkpUIO0/bI9MhwmD70S5aTWbXGBwxHrelT+XM1k6dM0pk+SwNkpTRN7Pg=="],
 
+    "postcss-selector-parser": ["postcss-selector-parser@6.0.10", "", { "dependencies": { "cssesc": "^3.0.0", "util-deprecate": "^1.0.2" } }, "sha512-IQ7TZdoaqbT+LCpShg46jnZVlhWD2w6iQYAcYXfHARZ7X1t/UGhhceQDs5X0cGqKvYlHNOuv7Oa1xmb0oQuA3w=="],
+
+    "postcss-value-parser": ["postcss-value-parser@4.2.0", "", {}, "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ=="],
+
     "prelude-ls": ["prelude-ls@1.2.1", "", {}, "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g=="],
 
     "prettier": ["prettier@3.6.2", "", { "bin": { "prettier": "bin/prettier.cjs" } }, "sha512-I7AIg5boAr5R0FFtJ6rCfD+LFsWHp81dolrFD8S79U9tb8Az2nGrJncnMSnys+bpQJfRUzqs9hnA81OAA3hCuQ=="],
@@ -1155,6 +1194,8 @@
 
     "unrs-resolver": ["unrs-resolver@1.9.2", "", { "dependencies": { "napi-postinstall": "^0.2.4" }, "optionalDependencies": { "@unrs/resolver-binding-android-arm-eabi": "1.9.2", "@unrs/resolver-binding-android-arm64": "1.9.2", "@unrs/resolver-binding-darwin-arm64": "1.9.2", "@unrs/resolver-binding-darwin-x64": "1.9.2", "@unrs/resolver-binding-freebsd-x64": "1.9.2", "@unrs/resolver-binding-linux-arm-gnueabihf": "1.9.2", "@unrs/resolver-binding-linux-arm-musleabihf": "1.9.2", "@unrs/resolver-binding-linux-arm64-gnu": "1.9.2", "@unrs/resolver-binding-linux-arm64-musl": "1.9.2", "@unrs/resolver-binding-linux-ppc64-gnu": "1.9.2", "@unrs/resolver-binding-linux-riscv64-gnu": "1.9.2", "@unrs/resolver-binding-linux-riscv64-musl": "1.9.2", "@unrs/resolver-binding-linux-s390x-gnu": "1.9.2", "@unrs/resolver-binding-linux-x64-gnu": "1.9.2", "@unrs/resolver-binding-linux-x64-musl": "1.9.2", "@unrs/resolver-binding-wasm32-wasi": "1.9.2", "@unrs/resolver-binding-win32-arm64-msvc": "1.9.2", "@unrs/resolver-binding-win32-ia32-msvc": "1.9.2", "@unrs/resolver-binding-win32-x64-msvc": "1.9.2" } }, "sha512-VUyWiTNQD7itdiMuJy+EuLEErLj3uwX/EpHQF8EOf33Dq3Ju6VW1GXm+swk6+1h7a49uv9fKZ+dft9jU7esdLA=="],
 
+    "update-browserslist-db": ["update-browserslist-db@1.1.3", "", { "dependencies": { "escalade": "^3.2.0", "picocolors": "^1.1.1" }, "peerDependencies": { "browserslist": ">= 4.21.0" }, "bin": { "update-browserslist-db": "cli.js" } }, "sha512-UxhIZQ+QInVdunkDAaiazvvT/+fXL5Osr0JZlJulepYu6Jd7qJtDZjlur0emRlT71EN3ScPoE7gvsuIKKNavKw=="],
+
     "uri-js": ["uri-js@4.4.1", "", { "dependencies": { "punycode": "^2.1.0" } }, "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg=="],
 
     "use-callback-ref": ["use-callback-ref@1.3.3", "", { "dependencies": { "tslib": "^2.0.0" }, "peerDependencies": { "@types/react": "*", "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0 || ^19.0.0-rc" }, "optionalPeers": ["@types/react"] }, "sha512-jQL3lRnocaFtu3V00JToYz/4QkNWswxijDaCVNZRiRTO3HQDLsdu1ZtmIUvV4yPp+rvWm5j0y0TG/S61cuijTg=="],
@@ -1163,6 +1204,10 @@
 
     "use-sync-external-store": ["use-sync-external-store@1.5.0", "", { "peerDependencies": { "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0" } }, "sha512-Rb46I4cGGVBmjamjphe8L/UnvJD+uPPtTkNvX5mZgqdbavhI4EbgIWJiIHXJ8bc/i9EQGPRh4DwEURJ552Do0A=="],
 
+    "usehooks-ts": ["usehooks-ts@3.1.1", "", { "dependencies": { "lodash.debounce": "^4.0.8" }, "peerDependencies": { "react": "^16.8.0  || ^17 || ^18 || ^19 || ^19.0.0-rc" } }, "sha512-I4diPp9Cq6ieSUH2wu+fDAVQO43xwtulo+fKEidHUwZPnYImbtkTjzIJYcDcJqxgmX31GVqNFURodvcgHcW0pA=="],
+
+    "util-deprecate": ["util-deprecate@1.0.2", "", {}, "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw=="],
+
     "vaul": ["vaul@1.1.2", "", { "dependencies": { "@radix-ui/react-dialog": "^1.1.1" }, "peerDependencies": { "react": "^16.8 || ^17.0 || ^18.0 || ^19.0.0 || ^19.0.0-rc", "react-dom": "^16.8 || ^17.0 || ^18.0 || ^19.0.0 || ^19.0.0-rc" } }, "sha512-ZFkClGpWyI2WUQjdLJ/BaGuV6AVQiJ3uELGk3OYtP+B6yCO7Cmn9vPFXVJkRaGkOJu3m8bQMgtyzNHixULceQA=="],
 
     "victory-vendor": ["victory-vendor@37.3.6", "", { "dependencies": { "@types/d3-array": "^3.0.3", "@types/d3-ease": "^3.0.0", "@types/d3-interpolate": "^3.0.1", "@types/d3-scale": "^4.0.2", "@types/d3-shape": "^3.1.0", "@types/d3-time": "^3.0.0", "@types/d3-timer": "^3.0.0", "d3-array": "^3.1.6", "d3-ease": "^3.0.1", "d3-interpolate": "^3.0.1", "d3-scale": "^4.0.2", "d3-shape": "^3.1.0", "d3-time": "^3.0.0", "d3-timer": "^3.0.1" } }, "sha512-SbPDPdDBYp+5MJHhBCAyI7wKM3d5ivekigc2Dk2s7pgbZ9wIgIBYGVw4zGHBml/qTFbexrofXW6Gu4noGxrOwQ=="],
diff --git a/package.json b/package.json
index 62aa8ef..8150734 100644
--- a/package.json
+++ b/package.json
@@ -75,6 +75,7 @@
     "sonner": "^2.0.5",
     "superjson": "^2.2.1",
     "tailwind-merge": "^3.3.1",
+    "usehooks-ts": "^3.1.1",
     "vaul": "^1.1.2",
     "zod": "^3.25.67"
   },
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 91b34c7..7f2d229 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -26,6 +26,8 @@ model User {
   emailAddress String  @unique
 
   credits     Int      @default(150)
+
+  userToProjects UserToProject[]
 }
 
 model Project {
@@ -33,8 +35,25 @@ model Project {
   createdAt   DateTime @default(now())
   updatedAt   DateTime @updatedAt
 
-  name        String
-  githubUrl     String
+  name         String
+  githubUrl    String
+  
   
   deletedAt DateTime?
+
+  userToProjects UserToProject[]
+}
+
+model UserToProject {
+  id          String   @id @default(cuid())
+  createdAt   DateTime @default(now())
+  updatedAt   DateTime @updatedAt
+
+  userId      String
+  projectId   String
+
+  user        User     @relation(fields: [userId], references: [id])
+  project     Project  @relation(fields: [projectId], references: [id])
+
+  @@unique([userId, projectId])
 }
\ No newline at end of file
diff --git a/public/path939.png b/public/path939.png
new file mode 100644
index 0000000..80f50dc
Binary files /dev/null and b/public/path939.png differ
diff --git a/src/app/(protected)/app-sidebar.tsx b/src/app/(protected)/app-sidebar.tsx
index 6f785c7..909ee35 100644
--- a/src/app/(protected)/app-sidebar.tsx
+++ b/src/app/(protected)/app-sidebar.tsx
@@ -22,6 +22,7 @@ import { Button } from '@/components/ui/button'  // Import the Button component
 import { Plus } from 'lucide-react'  // Import the Plus icon
 import Image from 'next/image';
+import useProject from '@/hooks/use-project'
 
 
 const items = [
@@ -47,25 +48,12 @@ const items = [
   },
 ]
 
-const Projects = [
-  {
-    name: 'Project 1',
-    url: '/projects/project1',
-  },
-  {
-    name: 'Project 2',
-    url: '/projects/project2',
-  },
-  {
-    name: 'Project 3',
-    url: '/projects/project3',
-  },
-]
 
 export const AppSidebar = () => {
   const pathname = usePathname()
   const {open} = useSidebar() 
   const [isMounted, setIsMounted] = useState(false)
+  const { projects , projectId, setProjectId } = useProject() // Assuming you have a hook to fetch projects
 
   useEffect(() => {
     setIsMounted(true)
@@ -115,15 +103,15 @@ export const AppSidebar = () => {
           <SidebarGroupLabel>Projects</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
-              {Projects.map((project) => {
+              {projects?.map((project) => {
                 return (
                   <SidebarMenuItem key={project.name}>
                     <SidebarMenuButton asChild>
-                      <div> 
+                      <div onClick={() => setProjectId(project.id)}> 
                         <div className={cn(
                           'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                           {
-                            '!bg-primary text-white': true
+                            '!bg-primary text-white': project.id === projectId
                           }
                         )}>
                           {project.name[0]}
diff --git a/src/app/(protected)/create/page.tsx b/src/app/(protected)/create/page.tsx
index f9cb75c..3fb3589 100644
--- a/src/app/(protected)/create/page.tsx
+++ b/src/app/(protected)/create/page.tsx
@@ -1,8 +1,11 @@
 'use client'
 import { Button } from '@/components/ui/button'
 import { Input } from '@/components/ui/input'
+import useRefetch from '@/hooks/use-refetch'
+import { api } from '@/trpc/react'
 import React from 'react'
 import {useForm} from 'react-hook-form'
+import { toast } from 'sonner'
 
 type FormInput = {
     repoUrl: string
@@ -12,8 +15,24 @@ type FormInput = {
 
 const CreatePage = () => {
     const {register, handleSubmit, reset } = useForm<FormInput>()
+    const createProject = api.project.createProject.useMutation()
+    const refetch = useRefetch()
+
     const onSubmit = (data: FormInput) => {
-        window.alert(JSON.stringify(data, null, 2))
+        createProject.mutate({
+            name: data.projectName,
+            githubUrl: data.repoUrl,
+            githubToken: data.githubToken
+        }, {
+            onSuccess: () => {
+                toast.success('Project created successfully!')
+                refetch()
+                reset()
+            },
+            onError: (error) => {
+                toast.error(Error)
+            }
+        })
         return true
     }
   return (
@@ -37,7 +56,7 @@ const CreatePage = () => {
                     placeholder='Github Token (Optional)' />
                     <div className='h-2'></div>
 
-                    <Button type='submit'>Create Project</Button>
+                    <Button type='submit' disabled={createProject.isPending}>Create Project</Button>
                 </form>
             </div>
         </div>
diff --git a/src/app/layout.tsx b/src/app/layout.tsx
index 0421574..3f6c05d 100644
--- a/src/app/layout.tsx
+++ b/src/app/layout.tsx
@@ -5,6 +5,7 @@ import { type Metadata } from "next";
 import { Geist } from "next/font/google";
 
 import { TRPCReactProvider } from "@/trpc/react";
+import { Toaster } from "sonner";
 
 export const metadata: Metadata = {
   title: "DECODE-Github",
@@ -25,6 +26,7 @@ export default function RootLayout({
       <html lang="en" className={geist.variable}>
       <body>
         <TRPCReactProvider>{children}</TRPCReactProvider>
+        <Toaster richColors/>
       </body>
     </html>
     </ClerkProvider>
diff --git a/src/hooks/use-project.ts b/src/hooks/use-project.ts
new file mode 100644
index 0000000..3004a52
--- /dev/null
+++ b/src/hooks/use-project.ts
@@ -0,0 +1,17 @@
+import React from 'react'
+import { api } from '@/trpc/react'
+import { useLocalStorage } from 'usehooks-ts'
+
+const useProject = () => {
+  const {data : projects} = api.project.getProjects.useQuery()
+  const [projectId, setProjectId] = useLocalStorage('DECODE-projectId', '')
+  const project = projects?.find((project) => project.id === projectId)
+  return{
+    projects,
+    project,
+    projectId,
+    setProjectId,
+  }
+}
+
+export default useProject
\ No newline at end of file
diff --git a/src/hooks/use-refetch.ts b/src/hooks/use-refetch.ts
new file mode 100644
index 0000000..3c912ea
--- /dev/null
+++ b/src/hooks/use-refetch.ts
@@ -0,0 +1,14 @@
+import { QueryClient, useQueryClient } from '@tanstack/react-query'
+import React from 'react'
+
+const useRefetch = () => {
+
+  const queryClient = useQueryClient()
+  return async () => {
+    await queryClient.refetchQueries({
+        type: 'active',
+    })
+  }
+}
+
+export default useRefetch
\ No newline at end of file
diff --git a/src/server/api/root.ts b/src/server/api/root.ts
index 59dac6a..53e5948 100644
--- a/src/server/api/root.ts
+++ b/src/server/api/root.ts
@@ -1,5 +1,6 @@
 import { postRouter } from "@/server/api/routers/post";
 import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
+import { projectRouter } from "./routers/project";
 
 /**
  * This is the primary router for your server.
@@ -8,6 +9,7 @@ import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
  */
 export const appRouter = createTRPCRouter({
   post: postRouter,
+  project: projectRouter
 });
 
 // export type definition of API
diff --git a/src/server/api/routers/project.ts b/src/server/api/routers/project.ts
new file mode 100644
index 0000000..d32ab76
--- /dev/null
+++ b/src/server/api/routers/project.ts
@@ -0,0 +1,39 @@
+import z from "zod";
+import { createTRPCRouter , protectedProcedure ,publicProcedure} from "../trpc";
+import db from "@/lib/db";
+
+export const projectRouter = createTRPCRouter({
+    createProject: protectedProcedure.input(
+        z.object({
+            name: z.string(),
+            githubUrl: z.string(),
+            githubToken: z.string().optional(),
+        })
+    ).mutation(async ({ ctx , input }) => {
+           const project = await ctx.db.project.create({
+            data: {
+                name: input.name,
+                githubUrl: input.githubUrl,
+                userToProjects: {
+                    create: {
+                        userId: ctx.user.userId!,
+                    },
+                },
+            },
+        });
+        return project;
+    }),
+    getProjects: protectedProcedure.query(async ({ ctx }) => {
+        return await ctx.db.project.findMany({
+            where: {
+                userToProjects: {
+                    some: { 
+                        userId: ctx.user.userId! 
+                    },
+                },
+                deletedAt: null
+            },
+            
+        })
+    })
+})
diff --git a/src/server/api/trpc.ts b/src/server/api/trpc.ts
index b38d2fa..a37670a 100644
--- a/src/server/api/trpc.ts
+++ b/src/server/api/trpc.ts
@@ -6,7 +6,9 @@
  * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
  * need to use are documented accordingly near the end.
  */
-import { initTRPC } from "@trpc/server";
+import db from "@/lib/db";
+import { auth } from "@clerk/nextjs/server";
+import { initTRPC, TRPCError } from "@trpc/server";
 import superjson from "superjson";
 import { ZodError } from "zod";
 
@@ -25,6 +27,7 @@ import { ZodError } from "zod";
 export const createTRPCContext = async (opts: { headers: Headers }) => {
   return {
     ...opts,
+    db,
   };
 };
 
@@ -76,6 +79,23 @@ export const createTRPCRouter = t.router;
  * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
  * network latency that would occur in production but not in local development.
  */
+const isAuthenticated = t.middleware(async ({ next, ctx }) => {
+  const user = await auth()
+  if(!user){
+    throw new TRPCError({
+      code: 'UNAUTHORIZED',
+      message: 'You must be logged in to access this resource.',
+    })
+  }
+  return next({
+    ctx: {
+      ...ctx,
+      user, // Add user to context
+      db: ctx.db, // Ensure db is available in context
+    },
+  })
+})
+
 const timingMiddleware = t.middleware(async ({ next, path }) => {
   const start = Date.now();
 
@@ -101,3 +121,5 @@ const timingMiddleware = t.middleware(async ({ next, path }) => {
  * are logged in.
  */
 export const publicProcedure = t.procedure.use(timingMiddleware);
+export const protectedProcedure = t.procedure
+  .use(isAuthenticated)
\ No newline at end of file`
))
