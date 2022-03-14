# Changelog

<a name="2.0.3"></a>
## 2.0.3 (2022-02-24)

### Fixed

- 🐛 fix: revert findMinLexicographicalLCS as the previous change is incorrectly [[57485d6](https://github.com/guanghechen/algorithm.ts/commit/57485d6e1164c1af5b38bec2f19c86b5fdc543a7)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[afd8033](https://github.com/guanghechen/algorithm.ts/commit/afd8033fd8519b9fc8d06603f4fe928306db7a72)]


<a name="2.0.2"></a>
## 2.0.2 (2022-02-24)

### Changed

- 🎨 [BREAKING] feat: change return type of findMinLexicographicalLCS -- return pairs instead of confusing number[] [[b0af7fe](https://github.com/guanghechen/algorithm.ts/commit/b0af7fea9c64b5c20bffc3ff5368b77056150c37)]
- ⚡ improve: optimize space complexity, from O(N1xN2) to O(N1) or O(N2) [[f3efd52](https://github.com/guanghechen/algorithm.ts/commit/f3efd52de24759ae31f271591cd558a043678292)]

### Miscellaneous

- 📝 docs: update README [[79e9ac6](https://github.com/guanghechen/algorithm.ts/commit/79e9ac649170251ddb348fb40f5160fb23366631)]
- 📝 docs: update CHANGELOG [[58e20ce](https://github.com/guanghechen/algorithm.ts/commit/58e20ceab94e287097e217c66dbac21a9fb4054b)]


<a name="2.0.1"></a>
## 2.0.1 (2022-02-22)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/lcs&#x27; [[3c59c78](https://github.com/guanghechen/algorithm.ts/commit/3c59c784656b8b983ea3cc420b973cf4ea37007f)]

### Miscellaneous

- 📝 docs: update package descriptions [[a2455ed](https://github.com/guanghechen/algorithm.ts/commit/a2455edb5dbf5e7662e85e04733b86b8d5e30a5b)]
- 📝 docs: update README [[de7b296](https://github.com/guanghechen/algorithm.ts/commit/de7b2965d6d29e780efed5e0ce3a4dba97093c6b)]
- 📝 docs: update CHANGELOG [[d3d48ab](https://github.com/guanghechen/algorithm.ts/commit/d3d48ab53932c2e6669c9c055a9c2b7e610dd947)]


<a name="2.0.0"></a>
## 2.0.0 (2022-02-06)

### Added

- ✅ test: update tests [[44297c8](https://github.com/guanghechen/algorithm.ts/commit/44297c8360a8817f0da39095609e456db6aa00d8)]
- ✅ test: update tests [[949a6c7](https://github.com/guanghechen/algorithm.ts/commit/949a6c7122026e7e2687d15114765fca5256fa86)]
- ✅ test(mcmf): update tests [[7c3e3dc](https://github.com/guanghechen/algorithm.ts/commit/7c3e3dcbee08f7f9e436c3298fd57fe09e5d885e)]
- ✅ test: simplify tests [[75d9be3](https://github.com/guanghechen/algorithm.ts/commit/75d9be3929f6589c4da16d335b2df145e885514a)]
- ✅ test(isap): update tests [[f3f9841](https://github.com/guanghechen/algorithm.ts/commit/f3f98419ddcbec6db0fb3ec1097ce31ad579bf58)]
- ✅ test(dinic): update tests [[4bc8373](https://github.com/guanghechen/algorithm.ts/commit/4bc8373ba0c7964f4a2bbf37911778dddc7706ad)]
- ✨ feat: implement &#x27;@algorithm.ts/bipartite-graph-matching&#x27; [[5a46561](https://github.com/guanghechen/algorithm.ts/commit/5a465613546012588bcc83f79768513ef92a730c)]
- ✅ test: update tests [[e942a21](https://github.com/guanghechen/algorithm.ts/commit/e942a21fe8481d7912a40adca8c023408cb2aa81)]

### Changed

- 🔧 chore: update coverage threshold (make strictly) [[ac18ca0](https://github.com/guanghechen/algorithm.ts/commit/ac18ca005a19da91864255c38981cdb9082bdac5)]
- 🎨 [BREAKING] feat: rewrite &#x27;@algorithm.ts/sliding-window&#x27; [[5521403](https://github.com/guanghechen/algorithm.ts/commit/5521403ee10b7ddb41c468ebb3c77ce31cf3c1ac)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[5ffc752](https://github.com/guanghechen/algorithm.ts/commit/5ffc75251be9056a00d045626dca20cd4a65c887)]


<a name="2.0.0-alpha.0"></a>
## 2.0.0-alpha.0 (2022-02-02)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/bellman-ford&#x27; [[ca399d0](https://github.com/guanghechen/algorithm.ts/commit/ca399d0b8fc1e1489c862215e79ce971bbd51217)]
- ✨ feat: implement &#x27;@algorithm.ts/dijkstra-bigint&#x27; [[5b3cf4f](https://github.com/guanghechen/algorithm.ts/commit/5b3cf4f5eff6054be7dababd071b7bdde166ff53)]
- ✅ test: update tests &amp; update README [[e8882e1](https://github.com/guanghechen/algorithm.ts/commit/e8882e1b5f56759d558c49307760a33ed30fe18d)]

### Changed

- 🎨 [BREAKING] refactor: add &#x27;I&#x27; as prefix name for interface types [[7253441](https://github.com/guanghechen/algorithm.ts/commit/7253441870bd61579f644b47c64b9a50b169afc3)]
- 🎨 [BREAKING] improve: change the interface of @algorithm.ts/dijkstra and @algorithm.ts/dijkstra-bigint [[6854588](https://github.com/guanghechen/algorithm.ts/commit/68545885a400c3d807594451582540a844724ae0)]
- 🎨 improve(mcmf): update types &amp; improve shortest-path algorithm [[4fbcbdc](https://github.com/guanghechen/algorithm.ts/commit/4fbcbdc46d29c520fecb3421abba1cef6b6934bc)]
- 🎨 refactor: rename &#x27;PriorityQueue&#x27; to &#x27;IPriorityQueue&#x27; [[0004fe8](https://github.com/guanghechen/algorithm.ts/commit/0004fe85db72d931870ef90590472da679d7db72)]
- 🎨 refactor: rename &#x27;CircularQueue&#x27; to &#x27;ICircularQueue&#x27; [[ae8f349](https://github.com/guanghechen/algorithm.ts/commit/ae8f349e9e2d9e99e435fb3fe02070a8e393d47b)]

### Breaking changes

- 💥 [breaking] refactor: refactor dijkstra to make it more robust [[1543fea](https://github.com/guanghechen/algorithm.ts/commit/1543feac979a0fa3e920f96668d7dd8e34d712f5)]

### Miscellaneous

- 📝 docs: update READMEs [[4341cb8](https://github.com/guanghechen/algorithm.ts/commit/4341cb80d760d189a41799dd2ba638a104757f1f)]
- 📝 docs: update README [[f3f0807](https://github.com/guanghechen/algorithm.ts/commit/f3f0807a707617ca134010598887b26a9e3562da)]


<a name="1.0.24"></a>
## 1.0.24 (2022-01-22)

### Added

- ✨ feat：implement &#x27;@algorithm.ts/huffman&#x27; [[c3ebdda](https://github.com/guanghechen/algorithm.ts/commit/c3ebdda6224e4147e616e0fcd4cfafb8e659f466)]
- ✨ feat：implement &#x27;@algorithm.ts/base64&#x27; [[5aef00b](https://github.com/guanghechen/algorithm.ts/commit/5aef00b59f57e2a15dec110b5af2ab320373d85c)]

### Changed

- 🔧 chore: update jest coveraage threshold [[07fa6cf](https://github.com/guanghechen/algorithm.ts/commit/07fa6cf7a804cf4fea37aa5f96c4df3a71238858)]
- 🔧 chore: update yarn.lock [[3457be5](https://github.com/guanghechen/algorithm.ts/commit/3457be5a9e4d7500959b9f0f1e6938fdbbc8c598)]
- 🎨 style: set print width to 100 (old is 80) [[dd57d3f](https://github.com/guanghechen/algorithm.ts/commit/dd57d3f5b59edb82426bc84fbf687bfa08c8cfe4)]
- ⬆️ chore: upgrade dependencies [[46da4bc](https://github.com/guanghechen/algorithm.ts/commit/46da4bcc3839c623dfa15a747e16bbc7402c68f0)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[c29da8f](https://github.com/guanghechen/algorithm.ts/commit/c29da8f0a5559190e83f8670d383d8b771fda062)]
- 📝 docs: update READMEs [[89d28d1](https://github.com/guanghechen/algorithm.ts/commit/89d28d1bbf2b7db1f87dbfde8d079a82925a5847)]
- 📝 docs: update CHANGELOG [[fecbf5a](https://github.com/guanghechen/algorithm.ts/commit/fecbf5abb777efd078e56fb2b9ef9f8f7d5bf552)]


<a name="1.0.23"></a>
## 1.0.23 (2021-11-28)

### Added

- ✨ feat(@algorithm.ts/findset): support EnhancedFindset (use through ) [[da80941](https://github.com/guanghechen/algorithm.ts/commit/da80941d186c70a7f656b370bb8a21ae8d879529)]
- 👷‍♂️ chore: update ci configs [[709dc6f](https://github.com/guanghechen/algorithm.ts/commit/709dc6fff2e914b27d3cd2d4d05f19949787f8df)]

### Changed

- ⚡ improve(findset): use Unit32Array instead of number[] to save memory and get better performance [[a6d97d2](https://github.com/guanghechen/algorithm.ts/commit/a6d97d25dd01728c5181f126d1ef9afb9c7ab4e6)]
- ⬆️ chore: upgrade devDependencies [[3f8b2d5](https://github.com/guanghechen/algorithm.ts/commit/3f8b2d5e72a31bcbe33faad818266f030d5c7c6e)]

### Miscellaneous

-   improve(findset): add new member func &#x27;initNode&#x27; to init a specify node in the findset [[a93bc91](https://github.com/guanghechen/algorithm.ts/commit/a93bc91aff2cdb1bfa26f8f069009f1d786b47a3)]
-  [BREAKING] refactor: rename &#x27;FindSet&#x27; to &#x27;Findset&#x27; [[5b8c25f](https://github.com/guanghechen/algorithm.ts/commit/5b8c25ff01963252a3c65ead0d0031a26428b5fc)]
- 📝 docs(@algorithm.ts/roman): update README [[d334490](https://github.com/guanghechen/algorithm.ts/commit/d33449052d318db10a4e12dc51498852cf6f173b)]
- 📝 docs(@algorithm.ts/roman): update README [[ba78363](https://github.com/guanghechen/algorithm.ts/commit/ba78363aad832703b28ea091e17a92ae2bcdd4ab)]
- 📝 docs: update CHANGELOG [[02213d0](https://github.com/guanghechen/algorithm.ts/commit/02213d09a727dcac60ce3435c1e6199a5b4ee10d)]


<a name="1.0.22"></a>
## 1.0.22 (2021-10-19)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/roman&#x27; [[fcc07fd](https://github.com/guanghechen/algorithm.ts/commit/fcc07fdb9888c1faa90746d0df3b86c97d8b5507)]

### Changed

- ⬆️ chore: upgrade devDependencies [[1dea6c1](https://github.com/guanghechen/algorithm.ts/commit/1dea6c123d9b857f91c31109f30e8ec6d0c1e50d)]

### Miscellaneous

- 📝 docs: fix invalid link references [[ab06d7b](https://github.com/guanghechen/algorithm.ts/commit/ab06d7b59aa215d0f326420e71e021fc7510a696)]
- 📝 docs: update CHANGELOG [[fdc755b](https://github.com/guanghechen/algorithm.ts/commit/fdc755b174201f98a994b19eb026ee52296469c2)]


<a name="1.0.21"></a>
## 1.0.21 (2021-10-07)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/sieve-totient&#x27; [[38a939f](https://github.com/guanghechen/algorithm.ts/commit/38a939f4844451d26346c38cde1994e36e660ded)]

### Miscellaneous

- 📝 docs: update READMEs [[2e17b5b](https://github.com/guanghechen/algorithm.ts/commit/2e17b5b58cbc7c6119264ff851fa24f0942c11ac)]
- 📝 docs: update CHANGELOG [[a33554d](https://github.com/guanghechen/algorithm.ts/commit/a33554d7612d593f8c7407555dfa9cbe8eeb233a)]


<a name="1.0.20"></a>
## 1.0.20 (2021-10-07)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/sieve-prime&#x27; [[fee8d9a](https://github.com/guanghechen/algorithm.ts/commit/fee8d9aae9d08be91b30dc4dd23e4214332907af)]

### Changed

- ⚡ improve: prefer Unit32Array instead of number[] [[eb890fe](https://github.com/guanghechen/algorithm.ts/commit/eb890fe2ab0fca8ecb09b34e77f42424dbae5970)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[0c3ab92](https://github.com/guanghechen/algorithm.ts/commit/0c3ab92515f976376ba4284d837d6bc814208791)]


<a name="1.0.19"></a>
## 1.0.19 (2021-10-07)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/manacher&#x27; [[a2151f1](https://github.com/guanghechen/algorithm.ts/commit/a2151f1cb9e1b3a7df38c1c3386a0425a1cc19df)]

### Changed

- ⬆️ chore: upgrade devDependencies [[68cf3e1](https://github.com/guanghechen/algorithm.ts/commit/68cf3e1388baa9734e588016651318aee0389058)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[b617ec5](https://github.com/guanghechen/algorithm.ts/commit/b617ec569e8461f915a758dcfeeeac25a79284ab)]


<a name="1.0.18"></a>
## 1.0.18 (2021-09-21)

### Added

- ✨ feat(@algorithm.ts/calculate): support to perform bigint and decimal arithmetics [[2371dab](https://github.com/guanghechen/algorithm.ts/commit/2371dabd2e4ed25b7fa1fd82ff89e57d83a82468)]

### Changed

- ⬆️ chore: upgrade devDependencies &amp; fix linter warnings [[4e110da](https://github.com/guanghechen/algorithm.ts/commit/4e110da0a0fc8488a8aa819ff2a77150243752cd)]

### Miscellaneous

- 📝 docs: update READMEs [[2168e61](https://github.com/guanghechen/algorithm.ts/commit/2168e615921a1411b449ba7bee3548e3306427a7)]
- 📝 docs: update README [[b13c7b2](https://github.com/guanghechen/algorithm.ts/commit/b13c7b29462a670df4abb945778e26067ebafdf5)]
- 📝 docs: update CHANGELOG [[3f010b8](https://github.com/guanghechen/algorithm.ts/commit/3f010b8607fe37fbe5cfa6f58f992083ade71813)]


<a name="1.0.17"></a>
## 1.0.17 (2021-09-20)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/calculate&#x27; [[22001ff](https://github.com/guanghechen/algorithm.ts/commit/22001ff6bbd0a9451a45f8d6fbed8ab1f693ab5e)]

### Miscellaneous

- 📝 docs: update READMEs [[b30be1f](https://github.com/guanghechen/algorithm.ts/commit/b30be1f29a545f2525a4b4422795387f8fa70333)]
- 📝 docs: update CHANGELOG [[9cd3f2d](https://github.com/guanghechen/algorithm.ts/commit/9cd3f2de73ac0b2c8f25a232f0830012ef7931a4)]


<a name="1.0.16"></a>
## 1.0.16 (2021-09-11)

### Added

- ✨ feat: implemented bigint versions of lower-bound and upper-bound [[97846b1](https://github.com/guanghechen/algorithm.ts/commit/97846b1f06f19bf57c666de1422a3833dd5259d5)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[e27d876](https://github.com/guanghechen/algorithm.ts/commit/e27d8766120d28c4bee975844bccf871e6e99c19)]


<a name="1.0.15"></a>
## 1.0.15 (2021-09-11)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/upper-bound&#x27; [[1bd4ef0](https://github.com/guanghechen/algorithm.ts/commit/1bd4ef0d0f6526792609ef481a8d0e4864a4ef39)]
- ✨ feat: implement &#x27;@algorithm.ts/lower-bound&#x27; [[b1cbb99](https://github.com/guanghechen/algorithm.ts/commit/b1cbb9915d5959b38bfea992bb227a5613b183f9)]

### Miscellaneous

- 📝 docs: update README [[ba86828](https://github.com/guanghechen/algorithm.ts/commit/ba8682840bc759f44055641d93501e92e89c93ae)]
- 📝 docs: update README [[aa74fd2](https://github.com/guanghechen/algorithm.ts/commit/aa74fd2cc32c479476f6ffc808982deb73226841)]
- 📝 docs: update CHANGELOG [[f8e28f7](https://github.com/guanghechen/algorithm.ts/commit/f8e28f778bd5d3b52950bc7a5cafd9fa9c2e5d98)]


<a name="1.0.14"></a>
## 1.0.14 (2021-09-08)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/sliding-window&#x27; [[bf4276b](https://github.com/guanghechen/algorithm.ts/commit/bf4276b8db2e224bc4f056be285dc45d1de4f33f)]
- ✨ feat(trie): export new function &#x27;hasPrefixMatched&#x27; [[5bdb306](https://github.com/guanghechen/algorithm.ts/commit/5bdb3066663d222fbdbeac826f8c43e121ec7d82)]

### Miscellaneous

- 📝 docs(priority-queue): update README [[1746090](https://github.com/guanghechen/algorithm.ts/commit/17460905bc7228cc6a49fabbad7e0457c5cc28ee)]
- 📝 docs: update CHANGELOG [[5dc4fd9](https://github.com/guanghechen/algorithm.ts/commit/5dc4fd975c0cbf3601b5b90e9ac425a64a1e6b4f)]


<a name="1.0.13"></a>
## 1.0.13 (2021-09-06)

### Added

- ✨ feat: implemented &#x27;@algorithm.ts/gcd&#x27; [[2b3c113](https://github.com/guanghechen/algorithm.ts/commit/2b3c113240a019677956b63d1137099a55a08531)]

### Miscellaneous

- 📝 docs: update README [[3c5be84](https://github.com/guanghechen/algorithm.ts/commit/3c5be84d74979ffff4eba3772216e8cd4a48ab9d)]
- 📝 docs: update CHANGELOG [[ba0a822](https://github.com/guanghechen/algorithm.ts/commit/ba0a8229605256a419c5f08e95528f6d25250a20)]


<a name="1.0.12"></a>
## 1.0.12 (2021-08-29)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/dijkstra&#x27; [[9d61f0f](https://github.com/guanghechen/algorithm.ts/commit/9d61f0f3e44793403ecbb925ca4b148659caaef1)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[188e1bc](https://github.com/guanghechen/algorithm.ts/commit/188e1bc45cde62a60fe4d62eed9ca2bdf72b5ff3)]


<a name="1.0.11"></a>
## 1.0.11 (2021-08-28)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/trie&#x27; [[39a26a1](https://github.com/guanghechen/algorithm.ts/commit/39a26a179e4b67a809b51782d6c271cd921b0a27)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[1acaaa3](https://github.com/guanghechen/algorithm.ts/commit/1acaaa3d9fb9d57f725e8b8a17fd1018b523957a)]


<a name="1.0.10"></a>
## 1.0.10 (2021-08-27)

### Added

- ✨ feat(binary-search-tree): export createBinaryIndexTree1Mod and createBinaryIndexTree2Mod [[602aaaf](https://github.com/guanghechen/algorithm.ts/commit/602aaafa73623d309f2da3bc4f263581d7f1ba1b)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[dea9c50](https://github.com/guanghechen/algorithm.ts/commit/dea9c503a5f84e18fd8060a0e429da5814674b0b)]


<a name="1.0.9"></a>
## 1.0.9 (2021-08-24)

### Changed

- 🎨 improve(dinic,isap,mcmf): totalEdges is not required [[ba20cc9](https://github.com/guanghechen/algorithm.ts/commit/ba20cc92831972e060ec4da7e79aeb75b931ae3f)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[8d82092](https://github.com/guanghechen/algorithm.ts/commit/8d82092007d685004604c17b8a820cae55ff8835)]


<a name="1.0.8"></a>
## 1.0.8 (2021-08-24)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/mcmf&#x27; [[1f7f8c7](https://github.com/guanghechen/algorithm.ts/commit/1f7f8c713d420d8ae3fc5705688cb22d63aff17c)]
- ✨ feat: implement &#x27;@algorithm.ts/dinic&#x27; [[bb5ac22](https://github.com/guanghechen/algorithm.ts/commit/bb5ac22249374e0cf4932605e4d663dc101c314d)]
- ✨ feat: implement &#x27;@algorithm.ts/isap&#x27; [[a1d36ec](https://github.com/guanghechen/algorithm.ts/commit/a1d36ec15761e40e59a2621be7196d12705a58c5)]

### Changed

- 🎨 improve(isap, dinic): rename .maxflow to .maxFlow [[bbf2590](https://github.com/guanghechen/algorithm.ts/commit/bbf25907fcc2c1f54b504256be071633d491a387)]
- ⬆️ chore: upgrade devDependencies [[a79aa1b](https://github.com/guanghechen/algorithm.ts/commit/a79aa1bc821a801bdf6f677c169577064cce5971)]

### Miscellaneous

- 📝 docs: update README [[1f5ce72](https://github.com/guanghechen/algorithm.ts/commit/1f5ce726951e3b5a15a6e6701ddc2117bdcf78d0)]
- 📝 docs: update READMEs [[de2a217](https://github.com/guanghechen/algorithm.ts/commit/de2a217fa3773fd4e94f265acc0fd707ccd7bd36)]


<a name="1.0.7"></a>
## 1.0.7 (2021-08-21)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/circular-queue&#x27; [[95e40f5](https://github.com/guanghechen/algorithm.ts/commit/95e40f50ba74aef385cecc75df4574a69588a8a6)]

### Miscellaneous

-  improve(priority-queue): resize the array while initializing [[5d6df88](https://github.com/guanghechen/algorithm.ts/commit/5d6df88a264dfee7802810628bfb9c07fd0ce0b8)]
- 🚧 improve(binary-search-tree): no longer necessary to specify the initial size when create a new BIT [[8ec5f4d](https://github.com/guanghechen/algorithm.ts/commit/8ec5f4d4e432a6df911e95026f9dd7e54b5cc40a)]
- 📝 docs: update README [[39901fb](https://github.com/guanghechen/algorithm.ts/commit/39901fbb321cdf757591a26aacf65cd787ae1d25)]


<a name="1.0.6"></a>
## 1.0.6 (2021-08-20)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/findset&#x27; [[0a23268](https://github.com/guanghechen/algorithm.ts/commit/0a23268f328e9bf729aa44a4ad3a3ca5e79a2f0a)]

### Changed

- ⬆️ chore: upgrade dev dependencies [[25ed124](https://github.com/guanghechen/algorithm.ts/commit/25ed1244442267a194b0c5ef923415ef147c2ffb)]

### Miscellaneous

- 📝 docs: update README [[bbd6fae](https://github.com/guanghechen/algorithm.ts/commit/bbd6fae97a5f1726c4e066d9fba579a9663e9873)]
- 📝 docs: update README [[0dfbb8d](https://github.com/guanghechen/algorithm.ts/commit/0dfbb8d6c30d33a9b226fd2ea1703c9111e60ff2)]
- 📝 docs: update CHANGELOG [[07fea47](https://github.com/guanghechen/algorithm.ts/commit/07fea47b50eec6cdf810570b11b5e059327281d8)]


<a name="1.0.5"></a>
## 1.0.5 (2021-08-09)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/binary-index-tree&#x27; [[1440439](https://github.com/guanghechen/algorithm.ts/commit/1440439500f9c4a9a831361e5dfe051e28a41533)]

### Miscellaneous

- 📝 docs: update READMEs [[ec51481](https://github.com/guanghechen/algorithm.ts/commit/ec514815af1449d0008e14d40f93a4b98ffe4993)]
- 📝 docs: update CHANGELOG [[32f54c1](https://github.com/guanghechen/algorithm.ts/commit/32f54c15479a9849225df2b6b38b5989fdae49bb)]


<a name="1.0.4"></a>
## 1.0.4 (2021-08-03)

### Added

- ✨ feat(priority-queue): support build Priority Queue with O(N) complexity [[a1d2455](https://github.com/guanghechen/algorithm.ts/commit/a1d245558bb501a359c6f2203753a6bf8e94f670)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[f8004d4](https://github.com/guanghechen/algorithm.ts/commit/f8004d461728c3ba944193e8c4f310d7f0b8a9a8)]


<a name="1.0.3"></a>
## 1.0.3 (2021-08-03)

### Added

- ✨ feat: implement &#x27;@algorithm.ts/priority-queue&#x27; [[6994a46](https://github.com/guanghechen/algorithm.ts/commit/6994a466586a7dc160fbb9037bbfb9ac75b624a8)]

### Changed

- ⬆️ chore: upgrade devDependencies [[f9b7325](https://github.com/guanghechen/algorithm.ts/commit/f9b732541b2988a257c548757eb65360f7c006cd)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[f5f6d0c](https://github.com/guanghechen/algorithm.ts/commit/f5f6d0ce52709bd36464ff85b92dbf5d44b36293)]


<a name="1.0.2"></a>
## 1.0.2 (2021-07-28)

### Added

- ✨ feat(sudoku): exports new utility func &#x27;createSegmentCodeMap&#x27; [[2322eef](https://github.com/guanghechen/algorithm.ts/commit/2322eef8f24195969eb2537737a3e46916fcc176)]

### Changed

- ⚡ improve(sudoku): improve performance on &#x27;checkSudokuSolution&#x27; [[e2350a0](https://github.com/guanghechen/algorithm.ts/commit/e2350a0f73af60b835cc746af2fa1cc79e0636ad)]
- 🎨 rename(sudoku): rename type &#x27;SudokuGameData&#x27; to &#x27;SudokuData&#x27; [[6ef309d](https://github.com/guanghechen/algorithm.ts/commit/6ef309d0b385428a0e2dade70a3dd421f0ce928e)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[df45e2c](https://github.com/guanghechen/algorithm.ts/commit/df45e2c9e79fef6b5e7be115f2fa29765b543b3f)]


<a name="1.0.1"></a>
## 1.0.1 (2021-07-26)

### Added

- ✨ feat: impelemnt &#x27;sudoku&#x27; [[7f94624](https://github.com/guanghechen/algorithm.ts/commit/7f94624cb3cc5feb49921da16e060514cbf0806a)]
- ✨ feat(knuth-shuffle): export utililty function &#x27;randomInt&#x27; [[ca51c82](https://github.com/guanghechen/algorithm.ts/commit/ca51c82c09344f92fde32c1ed7d2a1ea719bfab4)]
- ✅ test(dlx): update tests [[6d03d70](https://github.com/guanghechen/algorithm.ts/commit/6d03d704ab60f66f76b67dce901e94a0d3e25b7b)]
- ✨ feat: implement &#x27;dlx&#x27; [[0c4f7a9](https://github.com/guanghechen/algorithm.ts/commit/0c4f7a9c130e3c4e4b9f13e4cb8b1151c034e2a2)]

### Changed

- 🎨 improve(knuth-shuffle): support to shuffle sub-range of array [[56ffc5c](https://github.com/guanghechen/algorithm.ts/commit/56ffc5c0de833b1e3f5be2b23be53e9bd6cb3d08)]

### Removed

- ➖ chore: remove unnecessary dependencies [[5aaa280](https://github.com/guanghechen/algorithm.ts/commit/5aaa2803e73282c5b7355312043eda71fe9f828d)]

### Miscellaneous

- 📝 docs: update README [[85145dc](https://github.com/guanghechen/algorithm.ts/commit/85145dc876eb48834330197f45ff206ff402ac72)]


<a name="1.0.0"></a>
## 1.0.0 (2021-07-25)

### Added

- ✨ feat: implement &#x27;knuth-shuffle&#x27; [[58b39c5](https://github.com/guanghechen/algorithm.ts/commit/58b39c5baa34f2ce38908d192ad3f5291920adaf)]
- 🎉 initialize [[a03a7e2](https://github.com/guanghechen/algorithm.ts/commit/a03a7e2dbcf85ad794c16c25d64ff71fcfca87b3)]

### Changed

- 🚚 rename: move package from @guanghechen/* to @algorithm.ts/* [[5534850](https://github.com/guanghechen/algorithm.ts/commit/5534850405fccf423a203786858695ad828cefe8)]
- ♿ improve(knuth-shuffle): add default export [[f098256](https://github.com/guanghechen/algorithm.ts/commit/f09825685e381e2196031dda7bf0257700848306)]

### Miscellaneous

- 📝 docs: update CHANGELOG [[c23dbdd](https://github.com/guanghechen/algorithm.ts/commit/c23dbddd2ac429ac370581671a07f0f798bb07d9)]
- 📝 docs: update README [[c00749b](https://github.com/guanghechen/algorithm.ts/commit/c00749bc24ff7293ac46136758dd265a62d2366d)]
- 📝 docs: add CHANGELOG [[c946120](https://github.com/guanghechen/algorithm.ts/commit/c946120cc8620ec19de1456730f17b1d7f97341b)]
- 🔨 chore: allow to publish sub-packages with different versions [[90db8aa](https://github.com/guanghechen/algorithm.ts/commit/90db8aa4c6b728484f287007c4cbdc0a3be71b34)]
- 📝 docs: add README [[18590b0](https://github.com/guanghechen/algorithm.ts/commit/18590b0c0d64aca543608681f24276101d578691)]
- 🔨 chore: add development configs [[2aae64c](https://github.com/guanghechen/algorithm.ts/commit/2aae64c2f5c9e6600ae0815a14e296478f3ac427)]
