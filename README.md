# Wordle Game Solver

## Setup

Install packages via [yarn](https://yarnpkg.com/getting-started/install) or [npm](https://docs.npmjs.com/cli/v8/configuring-npm/install):

```
yarn
```

or

```
npm install
```

## Running

### Game Mode

Starts a normal game of wordle:

```
yarn start
npm start
```

### Solve/Suggestion Mode

Starts a normal game of wordle with "next best word" suggestions:

```
yarn start:solve
npm run start:solve
```

### Reverse Mode

Starts a game of reverse wordle where you are told which word to use in another game of wordle. You input the result of the word into the reverse mode and it suggests which bext word you should use next.

```
yarn start:reverse
npm run start:reverse
```

### Quicksolve Mode

Outputs the current solution for the day on: http://powerlanguage.co.uk/wordle/

```
yarn start:quicksolve
npm run start:quicksolve
```
