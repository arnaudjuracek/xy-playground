![preview](preview.png?raw=true "preview")

### Usage

###### preview a job

```sh
$ yarn [preview|start] # or ST3/VSCode node build on index.js
```

###### queue a job to [`xy-server`](https://github.com/xy-plotter/xy-server)

```sh
$ yarn queue
```

###### release a job
Use [`git release <TITLE>`](https://gist.github.com/arnaudjuracek/318872b3029f0e0de1555fd232e2f58c#git-aliases)</sup>, or:
```sh
$ git commit -am "Release <TITLE>" 
$ git tag -a -m "<TITLE>"
```

### References

- [xy-plotter/xy](https://github.com/xy-plotter/xy)
- [xy-plotter/xy-server](https://github.com/xy-plotter/xy-server)
- [arnaudjuracek/missing-math](https://github.com/arnaudjuracek/missing-math)

### License
[MIT](https://tldrlegal.com/license/mit-license).
