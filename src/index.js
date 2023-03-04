const core = require("@actions/core");
const { Octokit } = require("@octokit/action");

const main = async () => {
    const gist_id = core.getInput("gist_id");
    const action = core.getInput("action");

    const octokit = new Octokit();

    switch (action) {
        case "get": {
            const filename = core.getInput("file_name");

            const gist = await octokit.gists.get({ gist_id });
            const files = gist.data.files;

            if (!files) throw "No files found in gist";

            let file;

            if (!filename) file = files[Object.keys(files)[0]];
            else if (files[filename]) file = files[filename];
            else throw "File not found in gist";

            if (!file?.content) throw "File content not found";

            core.setOutput("content", file.content);

            break;
        }

        case "update": {
            const filename = core.getInput("file_name");
            const content = core.getInput("content");

            if (!filename) throw "File name not provided";
            if (!content) throw "File content not provided";

            await octokit.gists.update({
                gist_id,
                files: {
                    [filename]: {
                        content
                    }
                }
            });

            break;
        }

        default: throw "Invalid action"
    }
}

main().catch((error) => {
    console.error(error);

    core.setFailed(error.message);
});