# TypeScript

```
npm install -D typescript ts-node @types/node
```

-   타입스크립트는 런타임이 없습니다. 그래서 js로 컴파일시켜야합니다,
-   npx tsc index.ts

근데 번들/빌드가 너무 귀찮기때문에 ts-node를 사용합니다.(개발할때만 사용)

터미널에서 아래 명령어 입력하면 사용가능합니다.

```
npx ts-node [파일명]
```

-   tsconfig.json 파일 생성 (js파일로 번들할때 사용)

```json
{
    "compilerOptions": {
        "outDir": "./dist/", //번들된 파일의 저장폴더설정
        "esModuleInterop": true, //import 문법을 사용하게 해줌
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "strict": true,
        "baseUrl": ".",
        "typeRoots": ["./node_modules/@types", "./@types"], //module import할때 필요한 설정
        "paths": {
            "@core/*": ["src/core/*"],
            "*": ["@types/*"] //module import할때 필요한 설정
        }
    }
}
```

-   npx tsc --build

**src/core/index.ts**

```typescript
import utils from '@core/utils/utils.ts';
```

```
npm install -D tsconfig-paths
```

npx ts-node -r tsconfig-paths/register [파일명]

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev:ts":"ts-node -r tsconfig-paths/register"
  }
  //스크립트에 명령어로 저장해놓고 실행할때 npm run dev:ts index 이런식으로 사용.
```

`타입스크립트는 외부 라이브러리 가져올때 화가난다`
예를 들어 express 를 받아오려면

```
npm i --save-dev @types/express
```

이렇게 설치해야합니다.

eslint , prettier
->
코드 맞추려고 사용합니다 (팀플,협업등에서 사용)

```
npm install -D eslint prettier eslint-plugin-prettier eslint-config-prettier
```

-   .eslintrc 파일 생성
-   .prettierrc 파일 생성

**.eslintrc**

```json
{
    "extends": ["plugin:prettier/recommended"]
}
```

**.prettierrc**

```json
{
    "printWidth": 120,
    "tabWidth": 4,
    "singleQuote": true,
    "trailingComma": "all",
    "semi": true,
    "arrowParens": "always"
}
```

-   vscode에서 설정 (ctrl+,) formatter검색해서 default 를 prettier로 바꾸고 format save 체크합니다. 그리고 확장파일에서 prettier검색후 첫번째 두번째거 다운로드합니다.

-   테스트코드를 작성하는 프레임워크를 설치하려고합니다.

`javascript -> jest`
`typescript -> jest`

```sh
$ npm install -D ts-jest @types/jest babel-core
$ npm install -D @babel/preset-typescript @babel/preset-env
```

**babel.config.js**

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { node: 'current' },
            },
        ],
        '@babel/preset-typescript',
    ],
};
```

**jest.config.ts**

```js
import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['<rootDir>/**/*.test.(js|ts)'], //test할 폴더등을 정해서 그녀석들만 돌리게 설정하는부분
    moduleNameMapper: {
        // 별칭
    },
    testEnvironment: 'node',
    verbose: true, //console.log를 고급지게 찍어주는 녀석
    preset: 'ts-jest',
};

export default config;
```

-   실행시키려면 터미널에 npx jest

# 작업순서

## 목적: 마이닝구현

1. 체인구현
2. 난이도구현
3. 마이닝 구현

pow는 hash값을 통해서 앞에있는 자리수에 0이 몇개 들어갔는가를 찾는 형식.
그래서 hash를 2진수로 바꿔야한다.

## 체인은 길이가 긴체인이 우선순위로 짧은체인이있으면 긴체인에 갖다붙인다.
