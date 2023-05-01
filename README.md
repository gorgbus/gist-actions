# gist-actions
allows you to interact with github gists

# Requirements
create a personal access token with `gist` scope and add it as `env` to the job ([see in examples](#get-action))

# Inputs
`with:`
- `action` defines what you want to do (`get`,`update`)
- `gist_id` id of the gist you want to use
- `file_name` (optional if used in `get` action, defaults to 1st file) name of the file you want to `get`/`update`
- `content` (only used with `update` action) content of the file you want to update

# Example

## `get` action
```yaml
- name: Read gist
  id: gist_content
  uses: gorgbus/gist-actions@main
  env:
    GITHUB_TOKEN: ${{ secrets.TOKEN }}
  with:
    action: "get"
    gist_id: "ce9ca1f249b6a703d5f38b3816da0042"
    file_name: "meta.json"
    
- run: echo "meta.json content: ${{ steps.gist_content.outputs.content }}"
```

## `update` action
```yaml
- name: Read gist
  id: gist_content
  uses: gorgbus/gist-actions@main
  env:
    GITHUB_TOKEN: ${{ secrets.TOKEN }}
  with:
    action: "get"
    gist_id: "ce9ca1f249b6a703d5f38b3816da0042"
    file_name: "meta.json"
    
- name: Change content
  id: new_gist
  uses: gorgbus/edit-json-string@main
  with:
    json_string: ${{ steps.gist_content.outputs.content }}
    field: "version"
    value: "1.1.1"

- name: Update gist
  uses: gorgbus/gist-actions@main
  env:
    GITHUB_TOKEN: ${{ secrets.TOKEN }}
  with:
    action: "update"
    gist_id: "ce9ca1f249b6a703d5f38b3816da0042"
    file_name: "meta.json"
    content: ${{ steps.new_gist.outputs.content }}
```

# Output
- `steps.gist_content.outputs.content` (only used with `get` action) content of 1st file/selected file
