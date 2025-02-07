/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');
const ISPROD = process.env.NODE_ENV === 'production';
module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    "./.eslintrc-auto-import.json",  // Import auto-import API configuration file
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    'require': true,
    FileSystemWritableFileStream: 'readonly',
    FileSystemFileHandle: 'readonly',
    ParentMethod: 'readonly'
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'postcss.config.js',
    'tailwind.config.js',
    'viteUtil/viteProxyServer/vite-plugin-proxy-server.ts',
    'public/',
    'src/assets',
    'auto-imports.d.ts',
    'components.d.ts'
  ],
  rules: {
    'linebreak-style': ['error', 'unix'], // Indentation style
    'no-constant-condition': 'error', // Disallow constant expressions in conditions. if(true) is meaningless
    'no-undef': 'error', // Any reference to an undeclared variable will cause a warning, should be checked individually, not globally disabled
    'no-fallthrough': 'error', // Cases without break should not be globally disabled, handle exceptions individually
    'no-case-declarations': 'error', // Variable hoisting in switch case
    'no-inner-declarations': ['error', 'functions'], // Disallow variable or function declarations in nested blocks
    // Disallow unnecessary boolean type conversions
    'no-extra-boolean-cast': 'error', // Disallow unnecessary boolean type conversions (no-extra-boolean-cast) 'extends': 'eslint:recommended' enables this rule.
    'no-unused-vars': ['off', { // Disallow unused variables
      vars: 'all', // Check all variables, including those in the global environment. This is the default value.
      args: 'none' // Do not check parameters
    }],
    'vue/no-unused-vars': 'error',
    'vue/no-parsing-error': 'error', // Report template parsing errors, should not be disabled
    'vue/no-side-effects-in-computed-properties': 'error', // Disallow complex operations in computed properties, such as modifying data, keep default, should not be globally disabled

    /*
     * 20220504 - v8.14.0
     * Documentation: https://eslint.org/docs/rules/ + [rule]
     */
    'array-callback-return': ['error', { allowImplicit: true }], // Enforce return statements in array method callbacks
    'no-await-in-loop': 'error', // Disallow await in loop bodies
    'no-constructor-return': 'error', // Disallow return statements in constructors
    'no-duplicate-imports': 'off', // Merge multiple imports from the same module
    'no-promise-executor-return': 'error', // Disallow return statements in Promise executors
    'no-self-compare': 'error', // Disallow self-comparison x === x
    'no-template-curly-in-string': 'error', // Disallow template literal placeholder syntax in regular strings.
    'no-unmodified-loop-condition': 'error', // Disallow unmodified loop conditions. Infinite loop
    'no-unreachable-loop': 'error', // Disallow loops with bodies that allow only one iteration
    'no-unused-private-class-members': ISPROD ? 'error' : 'off', // Allow unused class members, exists in scenarios where developers predefine structures. Validate before release
    'no-use-before-define': 'error', // Disallow the use of variables before they are defined !!!
    'require-atomic-updates': 'error', // Report errors in assignments that may be based on outdated values, async traps
    'accessor-pairs': 'error', // Provide setter when getter is present, getter can be present without setter
    'arrow-body-style': 'off', // Arrow function bodies use braces in multi-line scenarios, disallow braces in single-line scenarios (disabled, often appears with type annotations in single line)
    'block-scoped-var': 'error', // Disallow the use of var in block scope
    'camelcase': 'error', // Use camelCase or underscores when naming variables
    'capitalized-comments': 'off', // Disallow capitalized comments
    'class-methods-use-this': ISPROD ? 'error' : 'off', // Enforce class methods to use this, if a class method does not use this, it can sometimes be made static. Validate before release
    'complexity': ['error', 100], // Maximum if else nesting level limit 10
    'consistent-return': 'error', // Enforce consistent return statements
    'consistent-this': ['error', 'that'], // that can only be used to refer to this
    'curly': ['off', 'all'], // if, else must use braces
    'default-case': 'error', // Switch statements must have a Default branch
    'default-case-last': 'error', // Default in switch statements must be at the end
    'default-param-last': 'off', // Parameters with default values must be at the end, more standardized function writing
    'dot-notation': 'error', // Use dot notation when possible
    'eqeqeq': ['error', 'always'], // Enforce the use of === and !==
    'func-name-matching': 'off', // Do not enforce that the variable receiving the function has the same name as the function
    'func-names': ['error', 'never'], // Omit redundant function names
    'func-style': ['off'], // Do not enforce function definition style
    'grouped-accessor-pairs': ['error', 'getBeforeSet'], // Getter and setter for the same property need to be adjacent, getter before setter
    'guard-for-in': 'off', // Do not check prototype chain in for in
    'id-denylist': 'off', // Disallow specific identifiers
    'id-length': ['off', { exceptions: ['t', 'h', 'i', 'v', 'x', 'y', 'z', 'j', 'k', 'r', 'g', 'b', 'a'] }], // Enforce a minimum identifier length of 2
    'max-depth': ['error', 4], // Enforce a maximum depth that blocks can be nested
    'max-lines': ['error', 4000], // Maximum number of lines per file
    'max-lines-per-function': ['error', 500], // Maximum number of lines per function
    'max-nested-callbacks': ['error', 5], // Enforce a maximum depth that callbacks can be nested
    'max-params': ['error', 10], // Limit the maximum number of parameters in function definitions
    'max-statements': ['error', 100], // Maximum number of statements in a block
    'multiline-comment-style': 'off', // Do not enforce a specific style for multiline comments
    'new-cap': ['error', { // Require constructor names to begin with a capital letter
      newIsCap: true, // Require new operator to be used with capitalized functions.
      capIsNew: false // Allow calling capitalized functions without the new operator
    }],
    'no-alert': 'error', // Disallow alert, use debugger for breakpoints
    'no-array-constructor': 'error', // Array constructors are generally discouraged, use array literal notation instead
    'no-bitwise': 'off', // Disallow bitwise operators, if necessary, add comments and ignore per line
    'no-caller': 'error', // Disallow caller or callee (no-caller)
    'no-confusing-arrow': [
      'error',
      { allowParens: true, onlyOneSimpleParam: false }
    ], // Disallow arrow functions where they could be confused with comparisons
    'no-console': ISPROD ? 'error' : 'off', // No console in production, allowed in development
    'no-continue': 'error', // Improve code robustness by disallowing continue
    'no-else-return': 'off', // Allow return before else
    'no-empty-function': 'off', // Allow empty functions, writing a clear comment for empty functions is a good habit
    'no-eq-null': 'error', // Disallow == comparison with null
    'no-eval': 'error', // Disallow eval()
    'no-extend-native': 'error', // Disallow extending native objects
    'no-extra-bind': 'error', // Disallow unnecessary function binding (bind method)
    'no-extra-label': 'error', // Disallow unnecessary labels
    'no-floating-decimal': 'error', // Numbers must have a digit before or after the decimal point
    'no-implicit-coercion': 'error', // Disallow shorthand type conversions
    'no-implicit-globals': 'error', // Disallow variable declarations in the global scope. Avoid "polluting" global variables
    'no-implied-eval': 'error', // Disallow implied eval()
    'no-inline-comments': 'off', // Allow inline comments
    'no-invalid-this': 'error', // Disallow this outside of classes or class-like objects
    'no-iterator': 'error', // Disallow iterator
    'no-label-var': 'error', // Disallow labels that share a name with a variable
    'no-labels': 'error', // Disallow labeled statements, default to false
    'no-lone-blocks': 'error', // Disallow unnecessary nested blocks
    'no-lonely-if': 'error', // Disallow if statements as the only statement in else blocks, should be merged as else if ()
    'no-loop-func': 'error', // Disallow function declarations in loops
    'no-magic-numbers': ['off', { ignoreArrayIndexes: true, ignore: [0, 1, 2, 3, 200, 400, 401, 403, 404, 405, 500] }], // Disallow magic numbers, temporarily disabled
    'no-mixed-operators': 'off', // Allow mixed operators
    'no-multi-assign': 'error', // Disallow multiple assignments, difficult to read
    'no-multi-str': 'error', // Disallow multiline strings
    'no-negated-condition': 'off', // Avoid negated conditions, difficult to read
    'no-nested-ternary': 'off', // Allow nested ternary expressions
    'no-new': 'error', // Avoid using new alone
    'no-new-func': 'error', // Disallow Function constructor
    'no-new-object': 'error', // Disallow Object constructor
    'no-new-wrappers': 'error', // Disallow primitive wrapper instances
    'no-octal-escape': 'error', // Disallow octal escape sequences in string literals
    'no-param-reassign': 'off', // Allow parameter reassignment within functions
    'no-plusplus': 'off', // Allow ++ increment symbol alone, except within for loops. Can use +=, -= instead
    'no-proto': 'error', // Disallow __proto__
    'no-restricted-exports': 'off', // Allow exporting any variable name
    // 'no-restricted-globals': [ // Variable protection
    //   'error',
    //   {
    //     name: '_Vue_',
    //     message: 'Global variable protection, do not occupy.'
    //   }
    // ],
    'no-return-assign': ['error', 'except-parens'], // Disallow assignment in return statements except when using parentheses
    'no-return-await': 'error', // Disallow unnecessary return await
    'no-script-url': 'error', // Disallow Script URL
    'no-sequences': 'error', // Disallow comma operators
    'no-shadow': 'off', // Disallow variable declarations from shadowing variables declared in the outer scope, use ts checks
    'no-ternary': 'off', // Allow ternary operators
    'no-throw-literal': 'error', // Restrict what can be thrown as an exception
    'no-undef-init': 'off', // Allow initializing variables to undefined, some scenarios have special meaning for undefined
    'no-undefined': 'off', // Allow undefined as an identifier
    'no-underscore-dangle': 'off', // Allow underscores as identifiers
    'no-unneeded-ternary': ['error', { // Disallow ternary operators when simpler alternatives exist
      defaultAssignment: true // Disallow conditional expressions as default assignment patterns
    }],
    'no-unused-expressions': ['error', { allowShortCircuit: true }], // Disallow unused expressions
    'no-useless-call': 'error', // Disallow unnecessary .call() and .apply()
    'no-useless-computed-key': 'error', // Disallow unnecessary computed property keys in objects and classes
    'no-useless-concat': 'error', // Disallow unnecessary concatenation of literals 'a' + 'b'
    'no-useless-constructor': 'error', // Disallow unnecessary constructors
    'no-useless-rename': 'error', // Disallow renaming import, export, and destructured assignments to the same name
    'no-useless-return': 'error', // Disallow redundant return statements
    'no-var': 'error', // Require let or const instead of var
    'no-void': 'error', // Disallow void operator
    'object-shorthand': 'error', // Object shorthand, single letter
    'one-var': 'off', // No restrictions on variable declaration position
    'prefer-arrow-callback': ['error', { allowUnboundThis: false }], // Require arrow functions as callbacks
    'prefer-const': 'off', // Suggest using const
    'prefer-destructuring': 'off', // Prefer destructuring from arrays and objects
    'prefer-exponentiation-operator': 'error', // Use ** instead of Math.pow
    'prefer-object-has-own': 'error', // Use Object.hasOwn instead of Object.hasOwnProperty
    'prefer-object-spread': 'error', // Restrict Object usage scenarios, use object spread whenever possible
    'prefer-rest-params': 'error', // Use ...args to collect parameters, avoid using arguments
    'prefer-spread': 'error', // Suggest using spread syntax instead of .apply()
    'prefer-template': 'error', // Suggest using template literals instead of string concatenation
    'quote-props': ['error', 'as-needed'], // Add quotes around properties as needed
    'radix': ['error', 'as-needed'], // Do not omit the second parameter radix when converting non-decimal numbers with parseInt
    'require-await': 'off', // async functions must contain await
    'spaced-comment': ['error', 'always', { // Require or disallow a space before comments
      markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','] // 'markers' is an array of strings, these strings are block comment markers
    }],
    'strict': ['error', 'global'], // Only allow global use strict declaration
    'vars-on-top': 'error', // var variable declarations should be at the top, manually perform variable hoisting
    'yoda': 'error', // Disallow yoda expressions, variable in front, value behind in conditions
    'array-bracket-newline': 'off', // Enforce line breaks after opening and before closing array brackets
    'array-bracket-spacing': 'error', // Disallow or enforce spaces inside of brackets, 1. With spaces var arr = [ 'foo', 'bar' ]; 2. Without spaces var arr = ['foo', 'bar', 'baz'];
    'array-element-newline': 'off', // Array element newline style
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }], // Require parentheses around arrow function arguments
    'arrow-spacing': ['error', { // Enforce consistent spacing before and after the arrow in arrow functions
      before: true,
      after: true
    }],
    'block-spacing': ['error', 'always'], // Enforce consistent spacing inside single-line blocks
    'brace-style': ['error', '1tbs', { // Brace style
      allowSingleLine: true // Allow single-line blocks
    }],
    'comma-dangle': ['error', 'never'], // Disallow trailing commas, IE8 error
    'comma-spacing': ['error', { // Enforce consistent spacing before and after commas
      before: false,
      after: true
    }],
    'comma-style': ['error', 'last'], // Comma style
    'computed-property-spacing': 'error', // Disallow or enforce spaces inside computed property brackets
    'dot-location': ['error', 'property'], // Dot operator and property on the same line
    'eol-last': 'off', // Require or disallow newline at the end of files
    'func-call-spacing': 'off', // Require or disallow spacing between function identifiers and their invocations
    'function-call-argument-newline': 'off', // Do not enforce function call argument newline
    'generator-star-spacing': ['error', { before: true, after: false }], // Enforce consistent spacing around * in generator functions
    'implicit-arrow-linebreak': 'error', // Enforce the location of arrow function bodies to be on the same line
    'indent': ['off', 2],
    'jsx-quotes': ['error', 'prefer-single'], // Enforce the consistent use of single quotes in JSX attributes
    'key-spacing': ['error', { // Enforce consistent spacing between keys and values in object literal properties
      beforeColon: false,
      afterColon: true
    }],
    'keyword-spacing': ['error', { // Enforce consistent spacing before and after keywords
      before: true,
      after: true
    }],
    'line-comment-position': 'off', // Line comment position, can be above or behind
    'lines-around-comment': ['error', {
      beforeBlockComment: false,
      beforeLineComment: false,
      allowBlockStart: true,
      allowClassStart: true,
      allowObjectStart: true
    }], // Enforce empty lines around comments
    'object-curly-newline': 'off', // Do not enforce object newline
    'lines-between-class-members': ['off', 'never'], // Disallow empty lines between class members
    'max-len': ['error', { code: 20000 }], // Maximum line length
    'max-statements-per-line': ['error', { max: 3 }], // Maximum number of statements per line
    'new-parens': 'error', // Require parentheses when invoking a constructor with no arguments
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }], // Maximum number of chained calls
    'no-extra-parens': ['off', 'functions'], // Disallow unnecessary parentheses
    'no-multi-spaces': 'error', // Disallow multiple spaces
    'no-multiple-empty-lines': ['error', { // Disallow multiple empty lines
      max: 1, // Enforce a maximum number of consecutive empty lines.
      maxEOF: 1, // Enforce a maximum number of consecutive empty lines at the end of files
      maxBOF: 0 // Enforce a maximum number of consecutive empty lines at the beginning of files
    }],
    'no-trailing-spaces': 'off', // Do not check for trailing spaces
    'no-whitespace-before-property': 'error', // Disallow whitespace before properties
    'nonblock-statement-body-position': ['error', 'beside'], // Enforce single-line statements to be on the same line
    'object-curly-spacing': ['error', 'always', { // Enforce consistent spacing inside braces
      objectsInObjects: false
    }],
    'object-property-newline': 'off', // Do not enforce object property newline
    'operator-linebreak': ['error', 'before'], // Enforce consistent linebreak style for operators, place linebreaks before operators
    'padded-blocks': ['error', 'never'], // Disallow padding within blocks
    'quotes': ['error', 'single', { // Enforce the consistent use of single quotes
      avoidEscape: true, // Allow strings to use single or double quotes as long as the string contains a quote that would have to be escaped otherwise
      allowTemplateLiterals: true // Allow strings to use backticks
    }],
    'rest-spread-spacing': ['error', 'never'], // Disallow spacing between rest and spread operators and their expressions
    'semi': ['error', 'always'], // Enforce semicolon usage
    // 'semi': 'off', // Do not enforce semicolon usage
    'semi-spacing': 'error', // Enforce consistent spacing after semicolons
    'semi-style': ['error', 'last'], // Enforce semicolon placement at the end
    'space-before-blocks': ['error', 'always'], // Enforce consistent spacing before blocks
    'space-before-function-paren': ['error', 'never'], // Disallow spacing before function parentheses
    'space-in-parens': ['error', 'never'], // Disallow spacing inside parentheses foo('bar');
    'space-infix-ops': 'error', // Enforce consistent spacing around infix operators
    'space-unary-ops': ['error', { // Enforce consistent spacing before or after unary operators
      words: true, // Applies to unary word operators such as: new, delete, typeof, void, yield
      nonwords: false // Applies to these unary operators: -、+、--、++、!、!!
    }],
    'switch-colon-spacing': 'error', // Enforce consistent spacing around colons of switch statements
    'template-curly-spacing': ['error', 'never'], // Enforce consistent spacing inside template string curly braces ${people.name}
    'wrap-iife': ['error', 'any'], // Require parentheses around IIFE, no restriction on execution style
    'yield-star-spacing': ['error', 'before'], //* Enforce consistent spacing around * in yield* expressions
    'no-debugger': ISPROD ? 'error' : 'off', // Disallow debugger

    /*
    * 20220504 -  V8.7.1
    * Documentation: https://eslint.vuejs.org/rules/ + [rule].html
    */
    'vue/define-macros-order': ['error', {
      order: ['defineProps', 'defineEmits']
    }], // Enforce the order of defineEmits and defineProps
    'vue/match-component-import-name': 'error', // Require registered component names to match imported component names
    // "vue/no-restricted-html-elements": ["error", "button", "marquee"],// Disallowed HTML elements
    'vue/prefer-prop-type-boolean-first': 'error', // Enforce Boolean to be first in prop type definitions
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always'
    }], // Require or disallow newline before closing bracket in tags
    'vue/component-tags-order': ['error', {
      order: ['template', 'script', 'style']
    }], // Vue single file component tag order
    'vue/no-v-html': 'error', // Disallow v-html
    'vue/this-in-template': 'error', // Disallow this in template
    'vue/attribute-hyphenation': 'off', // Use hyphenated attributes
    'vue/component-definition-name-casing': 'error', // Component name in definition should use camelCase
    'vue/first-attribute-linebreak': 'error', // Attribute newline style
    'vue/html-closing-bracket-spacing': 'error', // Disallow spacing before closing bracket in tags
    'vue/html-end-tags': 'error', // Require end tags
    'vue/html-indent': 'off', // Enforce HTML indentation
    'vue/html-quotes': 'error', // Use double quotes in HTML
    'vue/html-self-closing': 'error', // Prefer self-closing tags
    'vue/max-attributes-per-line': ['error', { // Limit the maximum number of attributes per line
      singleline: 5, // Maximum number of attributes per line when the opening tag is in one line
      multiline: 5
    }],
    'vue/multiline-html-element-content-newline': 'error', // Enforce newline before and after content in multiline elements
    'vue/mustache-interpolation-spacing': 'error', // Enforce consistent spacing in mustache interpolations
    'vue/no-multi-spaces': 'error', // Disallow multiple spaces
    'vue/no-spaces-around-equal-signs-in-attribute': 'error', // Disallow spaces around equal signs in attributes
    'vue/no-template-shadow': 'error', // Enforce scope rules in template
    'vue/one-component-per-file': 'error', // One component per file
    'vue/prop-name-casing': 'error', // Enforce camelCase for prop names in Vue components
    'vue/require-default-prop': 'off', // Prop must have default value, disabled
    'vue/require-explicit-emits': 'error', // Events must be declared in emits to be used
    'vue/require-prop-types': 'off', // Prop must have type restriction, disabled
    'vue/singleline-html-element-content-newline': 'off', // Enforce newline
    'vue/v-bind-style': 'error', // Use : for attribute binding, avoid using v-bind
    'vue/v-on-event-hyphenation': 'off', // Enforce hyphenated event names in template
    'vue/v-on-style': 'error', // Use shorthand @, avoid using v-on
    'vue/v-slot-style': 'error', // Use shorthand for slots
    'vue/attributes-order': 'off', // Attribute order
    'vue/no-lone-template': 'error', // Avoid unnecessary template
    'vue/no-multiple-slot-args': 'error', // Disallow passing multiple arguments to scoped slots
    'vue/order-in-components': 'error', // Enforce order of properties in components
    // Other rules:
    'vue/block-lang': ['error', // This rule disallows using languages other than those available in your application for the lang attribute of block elements
      {
        script: {
          lang: ['js', 'ts']
        },
        route: {
          lang: '' // route custom block can only use default json5
        }
      }
    ],
    'vue/block-tag-newline': 'error', // This rule enforces (or disallows) newlines before and after block tags
    'vue/component-api-style': ['error', // This rule aims to keep the API style used to define Vue components consistent in your project
      ['script-setup', 'composition', 'options'] // "script-setup", "composition", "composition-vue2", or "options"
    ],
    'vue/component-name-in-template-casing': ['off', 'PascalCase', { // This rule aims to warn about tag names in Vue.js templates that are not in the configured casing.
      registeredComponentsOnly: false
    }],
    'vue/component-options-name-casing': 'error', // Enforce PascalCase for component names in components option
    'vue/custom-event-name-casing': ['error', 'camelCase'], // In Vue 3, using camelCase or kebab-case as custom event names does not restrict their use in v-on. However, following JavaScript conventions, camelCase is more natural.
    'vue/html-button-has-type': 'off', // Do not check if button type attribute uses invalid type
    'vue/html-comment-content-newline': 'error', // Enforce consistent newline before and after HTML comment content
    'vue/html-comment-content-spacing': 'error', // Enforce consistent spacing before and after HTML comment content
    'vue/html-comment-indent': 'off', // Enforce consistent indentation style in HTML comments
    'vue/match-component-file-name': 'error', // Component name attribute should match file name
    'vue/new-line-between-multi-line-property': 'off', // No empty lines between object properties
    'vue/next-tick-style': 'error', // Enforce using Promise style nextTick callback, disallow passing callback
    /*
     * ✓ GOOD
     * Vue.nextTick().then(() => callback());
     * await Vue.nextTick(); callback();
     * this.$nextTick().then(() => callback());
     * await this.$nextTick(); callback();
     */
    'vue/no-bare-strings-in-template': 'off', // Allow inserting strings in template, prefer using internationalization files
    'vue/no-boolean-default': ['error', 'default-false'], // Enforce boolean type prop default value to be false: https://blog.csdn.net/weixin_34246551/article/details/88009159
    'vue/no-child-content': 'error', // Due to v-html, v-text causing child elements to be invalid
    'vue/no-duplicate-attr-inheritance': 'error', // When using v-bind="$attrs", specify inheritAttrs: false
    'vue/no-empty-component-block': 'off', // Allow empty template, script, style, considering scenarios of batch creating pages during development
    'vue/multi-word-component-names': 'off', // Disable multi-word component name restriction
    'vue/no-expose-after-await': 'error', // Disallow async registration of expose()
    'vue/no-invalid-model-keys': 'error', // Validate keys in model
    'vue/no-multiple-objects-in-class': 'error', // Use object style to assign class
    'vue/no-potential-component-option-typo': 'error', // Disallow potential typos in component options
    'vue/no-reserved-component-names': ['error', { // Disallow defining components with native name conflicts
      disallowVueBuiltInComponents: true,
      disallowVue3BuiltInComponents: true
    }],
    'vue/no-restricted-block': 'off', // Disallow specific blocks, custom blocks: ["error", "style", "foo", "bar"]
    'vue/no-restricted-call-after-await': 'off', // Disallow async calls to restricted methods
    'vue/no-restricted-class': 'off', // Disallow specific classes: ["error", "forbidden", "forbidden-two", "forbidden-three"]
    'vue/no-restricted-component-options': 'off', // Disallow specific component options: ["error", "init", "beforeCompile", "compiled"]
    'vue/no-restricted-custom-event': 'off', // Disallow specific events: ["error", "input", "/^forbidden/"]
    'vue/no-restricted-props': 'off', // Disallow specific props: ["error", "value", "/^forbidden/"]
    'vue/no-restricted-static-attribute': 'off', // Disallow specific attributes: ["error", "foo", "bar"]
    'vue/no-restricted-v-bind': 'off', // Disallow using v-bind to bind specific attributes: ["error", "/^v-/", "foo", "bar"]
    'vue/no-static-inline-styles': 'off', // Disallow using static inline styles, extract to class, keep template clean
    'vue/no-template-target-blank': 'error', // Disallow target="_blank" without rel="noopener noreferrer", security issue: https://www.cnblogs.com/tangyuu/p/6912044.html
    'vue/no-this-in-before-route-enter': 'error', // Disallow using this in beforeRouteEnter method
    'vue/no-undef-components': 'off', // Considering global components, do not check for undefined components
    'vue/no-undef-properties': 'error', // Disallow using undefined properties
    'vue/no-unsupported-features': ['error', {
      version: '^3.2.31'
    }], // Disallow using deprecated syntax
    'vue/no-unused-properties': 'off', // Disallow unused props
    'vue/no-unused-refs': 'off', // Do not disallow unused refs, may be used in mixin or parent component
    'vue/no-use-computed-property-like-method': 'error', // Disallow using computed properties like methods, disallow executing computed properties
    'vue/no-useless-mustaches': 'error', // Disallow useless string templates {{ "Lorem ipsum" }}
    'vue/no-useless-v-bind': 'error', // Disallow unnecessary v-bind directives
    'vue/no-v-text-v-html-on-component': 'error', // Disallow v-text / v-html on custom components
    'vue/no-v-text': 'error', // Disallow v-text
    'vue/padding-line-between-blocks': ['error', 'always'], // Require padding with one or more newlines between blocks
    'vue/prefer-import-from-vue': 'error', // Enforce importing from "vue" instead of "@vue/*"
    'vue/prefer-separate-static-class': 'error', // Require static class names in templates to be in a separate class attribute, dynamic class and
    'vue/prefer-true-attribute-shorthand': 'error', // V-bind attribute shorthand when value is true
    'vue/require-direct-export': 'error', // Require direct export of components
    'vue/require-emit-validator': 'error', // Require type definition in emit
    'vue/require-expose': 'off', // Do not enforce using expose to declare public properties
    'vue/require-name-property': 'error', // Component must have name property
    'vue/script-indent': ['error', 2, {
      baseIndent: 1,
      switchCase: 1
    }], // Enforce consistent indentation in <script> tags
    'vue/sort-keys': 'off', // Do not enforce sorting of properties
    'vue/static-class-names-order': 'off', // Do not enforce sorting of class names
    'vue/v-for-delimiter-style': 'off', // Do not enforce using forin or forof
    'vue/v-on-function-call': 'error', // Disallow parentheses in v-on method calls without arguments: <button v-on:click="closeModal">
    // The following are extended rules, consistent with previous rule configurations
    'vue/array-bracket-newline': 'off', // Do not enforce line breaks after opening and before closing array brackets
    'vue/array-bracket-spacing': 'error', // Disallow or enforce spaces inside of brackets, '"'never" (default) Disallow spaces inside array brackets, 1. With spaces var arr = [ "foo", "bar" ]; 2. Without spaces var arr = ["foo", "bar", "baz"];
    'vue/arrow-spacing': ['error', { // Enforce consistent spacing before and after the arrow in arrow functions
      before: true,
      after: true
    }],
    'vue/block-spacing': ['error', 'always'], // Enforce consistent spacing inside single-line blocks
    'vue/brace-style': ['error', '1tbs', {
      allowSingleLine: true
    }], // Brace style
    'vue/camelcase': 'error', // Use camelCase when naming variables
    'vue/comma-dangle': ['error', 'never'], // Disallow trailing commas
    'vue/comma-spacing': ['error', { // Enforce consistent spacing before and after commas
      before: false,
      after: true
    }],
    'vue/comma-style': ['error', 'last'], // Comma style
    'vue/dot-location': ['error', 'property'], // Dot operator and property on the same line
    'vue/dot-notation': 'error', // Use dot notation when possible
    'vue/eqeqeq': ['error', 'always'], // Enforce the use of === and !==
    'vue/func-call-spacing': 'error', // Require or disallow spacing between function identifiers and their invocations
    'vue/key-spacing': ['error', { // Enforce consistent spacing between keys and values in object literal properties
      beforeColon: false,
      afterColon: true
    }],
    'vue/keyword-spacing': ['error', { // Enforce consistent spacing before and after keywords
      before: true,
      after: true
    }],
    'vue/max-len': ['error', { code: 20000 }], // Maximum line length
    'vue/no-constant-condition': 'error', // Disallow constant expressions in conditions, related: https://eslint.org/docs/rules/no-constant-condition
    'vue/no-empty-pattern': 'error', // Disallow empty destructuring patterns (no-empty-pattern) "extends: "eslint:recommended" enables this rule
    'vue/no-extra-parens': ['off', 'functions'], // Disallow unnecessary parentheses (no-extra-parens) function
    'vue/no-irregular-whitespace': 'error', // Disallow irregular whitespace, related: https://eslint.org/docs/rules/no-irregular-whitespace
    'vue/no-loss-of-precision': 'error', // Disallow loss of precision in numeric literals, related: https://eslint.org/docs/rules/no-loss-of-precision
    'vue/no-sparse-arrays': 'error', // Disallow sparse arrays, related: https://eslint.org/docs/rules/no-sparse-arrays
    'vue/no-useless-concat': 'error', // Disallow unnecessary concatenation of literals "a" + "b"
    'vue/object-curly-newline': 'off', // Do not enforce object newline
    'vue/object-curly-spacing': ['error', 'always', { // Enforce consistent spacing inside braces
      objectsInObjects: false // objectsInObjects: true Enforce spacing inside braces of objects that start or end with an object element (when the first option is never)
    }],
    'vue/object-property-newline': 'off',
    'vue/operator-linebreak': ['error', 'before'], // Enforce consistent linebreak style for operators, place linebreaks before operators
    'vue/object-shorthand': 'error', // Object shorthand, single letter
    'vue/prefer-template': 'error', // Require or disallow newline before closing bracket in tags
    'vue/quote-props': ['error', 'as-needed'], // Add quotes around properties as needed
    'vue/space-in-parens': ['error', 'never'], // Enforce consistent spacing inside parentheses
    'vue/space-infix-ops': 'error', // Enforce consistent spacing around infix operators
    'vue/space-unary-ops': ['error', { // Enforce consistent spacing before or after unary operators
      words: true, // Applies to unary word operators such as: new, delete, typeof, void, yield
      nonwords: false // Applies to these unary operators: -、+、--、++、!、!!
    }],
    'vue/template-curly-spacing': ['error', 'never'], // Enforce consistent spacing inside template string curly braces ${people.name}

    // typescript-eslint v5.22 https://typescript-eslint.io/rules/
    '@typescript-eslint/no-empty-function': 'off', // Disallow empty functions
    '@typescript-eslint/no-explicit-any': 'off', // Disallow the use of the any type
    '@typescript-eslint/no-unused-vars': 'off', // Disallow unused variables
    '@typescript-eslint/ban-ts-comment': 'off', // Disallow @ts-<directive> comments or require descriptions after directives
    '@typescript-eslint/brace-style': ['error', '1tbs', { // Brace style
      allowSingleLine: true // Allow single-line blocks
    }],
    '@typescript-eslint/comma-dangle': ['error', 'never'], // Disallow trailing commas
    '@typescript-eslint/comma-spacing': ['error', { // Enforce consistent spacing before and after commas
      before: false,
      after: true
    }],
    '@typescript-eslint/default-param-last': 'off', // Enforce default parameters to be last
    '@typescript-eslint/dot-notation': 'off', // Enforce dot notation whenever possible
    '@typescript-eslint/func-call-spacing': 'error', // Require or disallow spacing between function identifiers and their invocations
    '@typescript-eslint/indent': ['off', 2],
    '@typescript-eslint/keyword-spacing': ['error', { // Enforce consistent spacing before and after keywords
      before: true,
      after: true
    }],
    '@typescript-eslint/lines-between-class-members': ['off', 'never'], // Require or disallow empty lines between class members
    '@typescript-eslint/no-dupe-class-members': 'error', // Disallow duplicate class members
    '@typescript-eslint/no-duplicate-imports': 'error', // Disallow duplicate imports
    '@typescript-eslint/no-this-alias': 'off', // Disallow aliasing this
    '@typescript-eslint/no-extra-parens': 'off', // Disallow unnecessary parentheses
    '@typescript-eslint/no-invalid-this': 'off', // Disallow this outside of classes or class-like objects
    '@typescript-eslint/no-loop-func': 'error', // Disallow function declarations in loops
    '@typescript-eslint/no-magic-numbers': 'off', // Disallow magic numbers
    '@typescript-eslint/no-redeclare': 'error', // Disallow variable redeclaration
    '@typescript-eslint/no-restricted-imports': 'error', // Disallow specified modules when loaded by import
    '@typescript-eslint/no-shadow': 'error', // Disallow variable declarations from shadowing variables declared in the outer scope
    '@typescript-eslint/no-throw-literal': 'off', // Disallow throwing literals as exceptions
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }], // Disallow unused expressions
    '@typescript-eslint/no-use-before-define': 'off', // Disallow the use of variables before they are defined  !!!
    '@typescript-eslint/no-useless-constructor': 'error', // Disallow unnecessary constructors
    '@typescript-eslint/object-curly-spacing': ['error', 'always', { // Enforce consistent spacing inside braces
      objectsInObjects: false
    }],
    '@typescript-eslint/quotes': ['error', 'single', { // Enforce the consistent use of single quotes
      avoidEscape: true, // Allow strings to use single or double quotes as long as the string contains a quote that would have to be escaped otherwise
      allowTemplateLiterals: true // Allow strings to use backticks
    }],
    '@typescript-eslint/return-await': 'off', // Enforce consistent return await
    '@typescript-eslint/semi': ['error', 'always'], // Require or disallow semicolons instead of ASI
    '@typescript-eslint/space-before-function-paren': ['error', 'never'], // Enforce consistent spacing before function parentheses
    '@typescript-eslint/space-infix-ops': 'error', // This rule is aimed at ensuring there are spaces around infix operators.

    // The following content is to be sorted out
    // '@typescript-eslint/array-type', // Require using T[] or Array<T> for arrays
    // '@typescript-eslint/class-literal-property-style', // Ensure that literals on classes are exposed in a consistent style
    // '@typescript-eslint/consistent-indexed-object-style', // Enforce or disallow the use of record types
    // '@typescript-eslint/consistent-type-assertions', // Enforce consistent type assertions
    // '@typescript-eslint/consistent-type-definitions', // Consistent type definitions interface or type
    // '@typescript-eslint/consistent-type-exports', // Enforce consistent usage of type exports
    // '@typescript-eslint/consistent-type-imports', // Enforce consistent usage of type imports
    // '@typescript-eslint/explicit-function-return-type', // Require explicit return types on functions and class methods
    '@typescript-eslint/explicit-member-accessibility': 'off', // Require explicit accessibility modifiers on class properties and methods
    // '@typescript-eslint/explicit-module-boundary-types', // Require explicit return and argument types on exported functions and class public class methods
    // '@typescript-eslint/member-delimiter-style', // Require a specific member delimiter style for interfaces and type literals
    // '@typescript-eslint/member-ordering', // Require a consistent member declaration order
    // '@typescript-eslint/method-signature-style', // Enforce using a particular method signature syntax
    // '@typescript-eslint/naming-convention', // Enforce naming conventions for everything across a codebase
    // '@typescript-eslint/no-base-to-string', // Requires that .toString() is only called on objects which provide useful information when stringified
    // '@typescript-eslint/no-confusing-non-null-assertion', // Disallow non-null assertions in possibly confusing locations
    // '@typescript-eslint/no-confusing-void-expression', // Require void expressions to appear in statement position
    // '@typescript-eslint/no-dynamic-delete', // Disallow the delete operator with computed key expressions
    // '@typescript-eslint/no-extraneous-class', // Disallow classes used as namespaces
    // '@typescript-eslint/no-invalid-void-type', // Disallow usage of void type outside of generic or return types
    // '@typescript-eslint/no-meaningless-void-operator', // Disallow the void operator except when used to discard a value
    // '@typescript-eslint/no-non-null-asserted-nullish-coalescing', // Disallow non-null assertions in the left operand of a nullish coalescing operator
    // '@typescript-eslint/no-require-imports', // Disallow require() calls
    // '@typescript-eslint/no-type-alias', // Disallow the use of type aliases
    // '@typescript-eslint/no-unnecessary-boolean-literal-compare', // Flags unnecessary equality comparisons against boolean literals
    // '@typescript-eslint/no-unnecessary-condition', // Prevents conditionals where the type is always truthy or always falsy
    // '@typescript-eslint/no-unnecessary-qualifier', // Warns when a namespace qualifier is unnecessary
    // '@typescript-eslint/no-unnecessary-type-arguments', // Enforce that type arguments will not be used if not required
    // '@typescript-eslint/non-nullable-type-assertion-style', // Prefer using non-null assertions over explicit type casts when possible
    // '@typescript-eslint/parameter-properties', // Require or disallow parameter properties in class constructors
    // '@typescript-eslint/prefer-enum-initializers', // Prefer initializing each enum member value
    // '@typescript-eslint/prefer-for-of', // Prefer a ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access the array being iterated
    // '@typescript-eslint/prefer-function-type', // Use function types instead of interfaces with call signatures
    // '@typescript-eslint/prefer-includes', // Enforce includes method over indexOf method
    // '@typescript-eslint/prefer-literal-enum-member', // Require all enum members to be literal values to prevent unintended enum member name shadow issues
    // '@typescript-eslint/prefer-nullish-coalescing', // Enforce using nullish coalescing operator instead of logical chaining
    // '@typescript-eslint/prefer-optional-chain', // Prefer using concise optional chain expressions instead of chained logical ands
    // '@typescript-eslint/prefer-readonly', // Require private members to be marked as readonly if they are never modified outside of the constructor
    // '@typescript-eslint/prefer-readonly-parameter-types', // Require function parameters to be typed as readonly to prevent accidental mutation of inputs
    // '@typescript-eslint/prefer-reduce-type-parameter', // Prefer using type parameter when calling Array#reduce instead of casting
    // '@typescript-eslint/prefer-regexp-exec', // Enforce RegExp#exec over String#match if no global flag is provided
    // '@typescript-eslint/prefer-return-this-type', // Enforce returning this type from methods when possible
    // '@typescript-eslint/prefer-string-starts-ends-with', // Enforce using String#startsWith and String#endsWith instead of other equivalent methods of checking substrings
    // '@typescript-eslint/prefer-ts-expect-error', // Suggest using @ts-expect-error over @ts-ignore
    // '@typescript-eslint/promise-function-async', // Require any function or method that returns a Promise to be marked async
    // '@typescript-eslint/require-array-sort-compare', // Require Array#sort calls to always provide a compareFunction
    // '@typescript-eslint/sort-type-union-intersection-members', // Enforce members of a type union/intersection to be sorted alphabetically
    // '@typescript-eslint/strict-boolean-expressions', // Restrict what types are allowed in boolean expressions
    // '@typescript-eslint/switch-exhaustiveness-check', // Exhaustiveness checking in switch with union type
    // '@typescript-eslint/type-annotation-spacing', // Require consistent spacing around type annotations
    // '@typescript-eslint/typedef', // Require that all functions have a return type
    // '@typescript-eslint/unified-signatures', // Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter
    // '@typescript-eslint/init-declarations', // Require or disallow initialization in variable declarations
    // '@typescript-eslint/padding-line-between-statements': 'error', // Require or disallow padding lines between statements
  }
};
