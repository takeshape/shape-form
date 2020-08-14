#!/bin/sh

GITHUB_URL_BASE="https://api.github.com/repos"

set +e
keychain_token=$(echo | git credential-osxkeychain get | grep 'password' | cut -d'=' -f 2)
package_repo=$(node -p -e "require('./package.json').repository.url")
package_repo=$([ "$package_repo" != "undefined" ] && echo "${package_repo//https:\/\/github.com\//}")
set -e

github_token="${GITHUB_TOKEN:-$keychain_token}"
event_type=${1:-"trigger:release"}
repo=${2:-$package_repo}

if [ -z $repo ]; then
    echo "no repo provided"
    exit 1
fi

curl --silent --fail \
    --header "Accept: application/vnd.github.everest-preview+json" \
    --header "Authorization: token ${github_token}" \
    --data "{ \"event_type\": \"${event_type}\" }" \
    ${GITHUB_URL_BASE}/${repo}/dispatches

echo "workflow event '${event_type}' triggered in repo '${repo}'"