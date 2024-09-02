# gas-template
yarn v4 + clasp + typescriptのGAS開発環境テンプレート
## Getting Started

### Clone Repository

1. RepositoryのURLをコピーする
1. VSCodeのコマンドパレットで `Clone Repository in Container` と入力し、`Dev Containers: Clone Repository in Container Volume…` を選択
1. コピーしたGitHubのURLをペーストして Enter



### 初期設定

```
yarn
yarn clasp login
```


### 新規GASプロジェクトを作成する場合

1. 以下のコマンドを実行（ `{projectName}` は別の値に置き換える）

```
yarn clasp create --title={projectName}
mv build/.clasp.json .clasp.prod.json
```

2. build/appsscript.jsonをプロジェクトにあわせて修正する
  - 特に `oauthScopes`

3. 必要に応じてdev環境を用意する


### GoogleDrive上にある既存のGASプロジェクトを利用する場合

1. プロジェクトのrootDirに.clasp.prod.json（必要に応じて.clasp.dev.json）を手動で作成する  
    ※ .clasp.prod.jsonの内容は以下の通り
    ```
    {
      "scriptId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "rootDir": "build"
    }
    ```
1. build/appsscript.jsonをプロジェクトにあわせて修正する

### 参考URL

- [Yarnのバージョンによってnode_modulesが作成されない件について（voltaを使用）](https://qiita.com/ttf1998seiya/items/667e53b98e2f091f0143)
- [プロジェクトを壊さず安全に npm から yarn4 へ移行する](https://zenn.dev/wakamsha/articles/migrate-from-npm-to-yarn)
- [GAS + Typescript のいい感じのビルド環境を整える](https://zenn.dev/terass_dev/articles/a39ab8d0128eb1)
- [TypeScript+clasp+esbuildでGASのローカル開発をもっと便利に](https://zenn.dev/funteractiveinc/articles/776b5812833475)
