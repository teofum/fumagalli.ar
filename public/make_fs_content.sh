#! /bin/bash

function get_file_type {
  e="$(echo "$1" | sed -E "s/.*\.([^\.]+)$/\1/g")"

  if [ "$e" = "jpg" ] || [ "$e" = "jpeg" ] || [ "$e" = "png" ] || [ "$e" = "webp" ] || [ "$e" = "gif" ]; then
    type="image"
  elif [ "$e" = "md" ]; then
    type="md"
  elif [ "$e" = "mdx" ]; then
    type="mdx"
  elif [ "$e" = "jsdos" ]; then
    type="dos"
  elif [ "$e" = "app" ]; then
    type="app"
  else
    type="file"
  fi
}

function get_file_name {
  name="$(echo "$1" | sed -E "s/.*\/([^/]+)$/\1/g")"
}

function get_file_size {
  size="$(wc -c <"$1" | sed -E "s/ //g")"
}

function get_file_created {
  created="$(stat -f '%B' "$1")"
}

function get_file_modified {
  modified="$(stat -f '%m' "$1")"
}

function directory {
  echo "$2{"
  echo "$2  class: 'dir',"
  get_file_name "$1"
  echo "$2  name: '$name',"
  get_file_created "$1"
  echo "$2  created: $created,"
  get_file_modified "$1"
  echo "$2  modified: $modified,"
  echo "$2  items: ["
  $0 "$1" "  $2" # recursively print contents of directory
  echo "$2  ],"
  echo "$2},"
}

function file {
  echo "$2{"
  echo "$2  class: 'file',"
  get_file_type "$1"
  echo "$2  type: '$type',"
  get_file_name "$1"
  echo "$2  name: '$name',"
  get_file_created "$1"
  echo "$2  created: $created,"
  get_file_modified "$1"
  echo "$2  modified: $modified,"
  get_file_size "$1"
  echo "$2  size: $size,"
  echo "$2},"
}

find "$1"/* -maxdepth 0 -type d 2> /dev/null | while read file; do directory "$file" "  $2"; done
find "$1"/* -maxdepth 0 -type f 2> /dev/null | while read file; do file "$file" "  $2"; done