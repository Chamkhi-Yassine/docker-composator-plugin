# docker-composator-plugin

[![](https://dcbadge.vercel.app/api/server/zkKfj9gj2C?style=flat&theme=default-inverted)](https://discord.gg/zkKfj9gj2C)

Plugin for managing Docker Compose files in [Leto-Modelizer](https://github.com/ditrit/leto-modelizer).

## Build your plugin

```
npm run build
```

## Grammar

We use the grammar of the [docker-compose specification](https://github.com/compose-spec/compose-spec/blob/master/spec.md) that we translated to the syntax of the parser generator tool [Lidy](https://github.com/ditrit/lidy-js).

<table>
  <thead>
    <tr>
      <th colspan="2">Legends</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">$\textcolor{green}{\textbf{\Large{✓}}}$</td>
      <td>Full support</td>
    </tr>
    <tr>
      <td align="center">$\textcolor{orange}{\textsf{〜}}$</td>
      <td>Partial support</td>
    </tr>
    <tr>
      <td align="center">$\textcolor{red}{\textbf{\textsf{X}}}$</td>
      <td>Not supported but planned</td>
    </tr>
  </tbody>
</table>
<table>
  <thead>
    <tr>
      <th colspan="6">Functionalities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="5">Service</td>
      <td align="center">$\textcolor{green}{\Large{✓}}$</td>
    </tr>
    <tr>
      <td colspan="5">Volume</td>
      <td align="center">$\textcolor{green}{\Large{✓}}$</td>
    </tr>
    <tr>
      <td colspan="5">Network</td>
      <td align="center">$\textcolor{green}{\Large{✓}}$</td>
    </tr>
    <tr>
      <td colspan="5">Config</td>
      <td align="center">$\textcolor{green}{\Large{✓}}$</td>
    </tr>
    <tr>
      <td colspan="5">Secret</td>
      <td align="center">$\textcolor{green}{\Large{✓}}$</td>
    </tr>
  </tbody>
</table>

## Development

### Generate the parser

We use a [script](scripts/generate_parser.js) to generate the Docker-Compose parser.

You can directly run:

```
npm run generate:parser
```

### How to release

We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as guideline for the version management.

Steps to release:

- Create a new branch labeled `release/vX.Y.Z` from the latest `main`.
- Improve the version number in `package.json`, `package-lock.json` and `changelog.md`.
- Verify the content of the `changelog.md`.
- Commit the modifications with the label `Release version X.Y.Z`.
- Create a pull request on github for this branch into `main`.
- Once the pull request validated and merged, tag the `main` branch with `vX.Y.Z`
- After the tag is pushed, make the release on the tag in GitHub

### Git: Default branch

The default branch is main. Direct commit on it is forbidden. The only way to update the application is through pull request.

Release tag are only done on the `main` branch.

### Git: Branch naming policy

`[BRANCH_TYPE]/[BRANCH_NAME]`

- `BRANCH_TYPE` is a prefix to describe the purpose of the branch. Accepted prefixes are:
  - `feature`, used for feature development
  - `bugfix`, used for bug fix
  - `improvement`, used for refacto
  - `library`, used for updating library
  - `prerelease`, used for preparing the branch for the release
  - `release`, used for releasing project
  - `hotfix`, used for applying a hotfix on main
- `BRANCH_NAME` is managed by this regex: `[a-z0-9._-]` (`_` is used as space character).