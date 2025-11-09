# CI in Gitlab

## CI-Datei

Im root folder eine Datei .gitlab-ci.yml erstellen

Ein Liste an Stages definieren

```yaml
stages:
  - stage1
  - stage2
```

Eine Reihe an Jobs definieren, von denen jede folgendes Format hat

```yaml
<jobname>:
  stage: <stage>
  image: <image>
  services:
    - name: <serviceImage1>
      alias: <serviceAlias1>
    - name: <serviceImage2>
      alias: <serviceAlias2>
  variables:
    - <var1> : <val1>
    - <var2> : <val2>
  script:
   - <command1>
   - <command2>
   - <command3>
  artifacts:
    when: <on_succes/always>
    reports:
      <reportName> : <filepath>
```

jobname: der Name des Jobs
stage: die dem Job zugeordnete stage
image: das docker image, auf dem der Job laufen soll
varibles: setzt umgebungsvariablen fest, in js mit ```process.env.<varName>``` abrufbar
services: die services, die zum Ausführen des Jobs benötigt werden, z.B. DB
script: die auszuführenden Befehle
artifacts: Dateien, die als Ergebniss der pipe gespeichert werden sollen

Steht vor dem job-Namen ein Punkt ist dieser auskommentiert

Statt ```npm install``` wird ```npm ci``` verwendet, welches die packages aus dem package-lock.json statt aus dem package.json baut. Dadurch sind die Versionen genau spezifiziert.

Die Stages werden nacheinander in der Reihenfolge in der sie definiert wurden abgearbeiten. Die Jobs werden parallel abgearbeitet.

## Umgebungsvariablen

### Linux

```shell
export <varName>=<value>
```

### Windows

```shell
set <varName>=<value>
```

### Windows Powershell

```shell
$Env:<variable-name> = "<new-value>"
```

### NPM

```shell
npm i cross-env
```

```json
"test-ci" : "cross-env <varName>=<value> command"
```

### CI

in job:

```yml
variables:
  - <varname> : <value>
```
