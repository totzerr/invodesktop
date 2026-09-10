#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
revision="${1:-HEAD}"
build="$root/dist"

rm -rf "$build"
mkdir -p "$build"
git -C "$root" archive --format=tar "$revision" | tar -xf - -C "$build"
mkdir -p "$build/.openai"
cp "$root/.openai/hosting.json" "$build/.openai/hosting.json"
printf "Sites preview prepared from %s\n" "$revision"
