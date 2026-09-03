#!/usr/bin/env bash

set -euo pipefail

projects=()
args=()

while [[ $# -gt 0 ]]; do
	case "$1" in
		-p|--project)
			if [[ $# -lt 2 ]]; then
				echo "Missing value for $1." >&2
				exit 1
			fi

			projects+=("$2")
			shift 2
			;;
		*)
			args+=("$1")
			shift
			;;
	esac
done

if [[ ${#projects[@]} -eq 0 ]]; then
	echo "Usage: test-types-target.sh -p <tsconfig> [-p <tsconfig>...] <file...>" >&2
	exit 1
fi

if [[ ${#args[@]} -eq 0 ]]; then
	echo "Usage: test-types-target.sh -p <tsconfig> [-p <tsconfig>...] <file...>" >&2
	exit 1
fi

for project in "${projects[@]}"; do
	tscw "${args[@]}" -p "$project"
done
