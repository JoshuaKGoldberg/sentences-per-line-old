# sentences-per-line

A [markdownlint](https://github.com/DavidAnson/markdownlint) rule that enforces each sentence is on its own line.

```diff
- First sentence. Second sentence.
+ First sentence.
+ Second sentence.
```

In other words, sentences-per-line makes sure no line contains more than one sentence.
This is useful because:

- Shorter lines result in simpler, easier-to-understand
- Longer lines are harder to read in source code

## Usage

First install this package as a devDependency:

```shell
npm i -D sentences-per-line
```

Then provide it to [markdownlint-cli's `--rules`](https://github.com/igorshubovych/markdownlint-cli)

```shell
markdownlint --rules sentences-per-line
```
