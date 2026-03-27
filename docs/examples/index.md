---
layout: default
title: Examples
description: Minimal pixeltxt YAML examples for text overlays.
---

## Examples

Below is a minimal configuration. Paths are relative to the working directory you pass with `pixeltxt run --cwd`.

### Basic YAML

```yaml
base: ./photo.png
output: ./photo-labeled.png
layers:
  - type: text
    text: 'Hello'
    x: 32
    y: 64
    fontSize: 28
    color: '#ffffff'
    anchor: start
```

Run:

```bash
pixeltxt run --cwd /path/to/folder
```

Use `-c` / `--config` when the file is not named `pixeltxt.yaml` / `pixeltxt.yml` / `pixeltxt.json`:

```bash
pixeltxt run --cwd /path/to/folder -c my-config.yml
```

### Multiple layers

Later layers draw on top of earlier ones:

```yaml
base: ./certificate.jpg
output: ./certificate-filled.png
layers:
  - type: text
    text: 'Recipient Name'
    x: 300
    y: 260
    fontSize: 26
    color: '#1a1a1a'
    fontFamily: sans-serif
    anchor: middle
  - type: text
    text: 'Subtitle line'
    x: 300
    y: 300
    fontSize: 15
    color: '#444444'
    anchor: middle
```

See the [full config reference](https://github.com/djom202/pixeltxt/blob/main/README.md#configuration) in the README for `fontPath`, stroke, and output formats.
