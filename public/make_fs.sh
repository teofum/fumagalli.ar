#! /bin/bash

echo "import type { Directory } from './types';"
echo ""
echo "const FS_ROOT: Directory = {"
echo "  class: 'dir',"
echo "  name: 'My Computer',"
echo "  items: ["

echo "$(./make_fs_content.sh $1 '  ')"

echo "  ],"
echo "};"
echo ""
echo "export default FS_ROOT;"