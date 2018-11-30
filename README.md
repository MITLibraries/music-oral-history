[![Build Status](https://travis-ci.org/MITLibraries/music-oral-history.svg?branch=master)](https://travis-ci.org/MITLibraries/music-oral-history)
[![Code Climate](https://codeclimate.com/github/MITLibraries/music-oral-history/badges/gpa.svg)](https://codeclimate.com/github/MITLibraries/music-oral-history)
[![Stories in Ready](https://badge.waffle.io/MITLibraries/music-oral-history.svg?label=ready&title=Ready)](http://waffle.io/MITLibraries/music-oral-history)

Music Oral History
========

This is a child WordPress theme of the [MIT Libraries parent theme](https://github.com/MITLibraries/MITlibraries-parent) built specifically for the [Music Oral History](http://libraries.mit.edu/music-oral-history) resource.

It implements a custom header UI, as well as page templates specific to the content provided by this resource.

## A note for developers and contributors:

Pull requests are evaluated by Travis-CI for syntax errors and security flaws using relevant sections of the WordPress Coding Standards. They are also evaluated by CodeClimate using static code analysis and linting provided by PHPCS and PHPMD. We expect that contributors are running those tools locally, or otherwise ensuring that pull requests conform to those standards. We have included the `codesniffer.local.xml` configuration for local use, which is typically invoked by the following command:

```
phpcs -psvn . --standard=./codesniffer.local.xml --extensions=php --report=source --report=full
```
