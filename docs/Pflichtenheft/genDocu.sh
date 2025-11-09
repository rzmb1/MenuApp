#!/bin/sh

pandoc --listings --toc --number-sections --template eisvogel.tex --filter pandoc-plantuml \
       meta.yml \
       [0-9]*.md \
       -o pflichtenheft.pdf
