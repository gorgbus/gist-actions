"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const action_1 = require("@octokit/action");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const gist_id = core_1.default.getInput("gist_id");
    const action = core_1.default.getInput("action");
    switch (action) {
        case "get": {
            const octokit = new action_1.Octokit();
            const filename = core_1.default.getInput("file_name");
            const gist = yield octokit.gists.get({ gist_id });
            const files = gist.data.files;
            if (!files)
                throw "No files found in gist";
            let file;
            if (!filename)
                file = files[Object.keys(files)[0]];
            else if (files[filename])
                file = files[filename];
            else
                throw "File not found in gist";
            if (!(file === null || file === void 0 ? void 0 : file.content))
                throw "File content not found";
            core_1.default.setOutput("content", file.content);
            break;
        }
        case "update": {
            const token = core_1.default.getInput("token");
            if (!token)
                throw "Token not provided";
            const octokit = new action_1.Octokit({
                auth: token,
            });
            const filename = core_1.default.getInput("file_name");
            const content = core_1.default.getInput("content");
            if (!filename)
                throw "File name not provided";
            if (!content)
                throw "File content not provided";
            yield octokit.gists.update({
                gist_id,
                files: {
                    [filename]: {
                        content
                    }
                }
            });
            break;
        }
        default: throw "Invalid action";
    }
});
main().catch((error) => {
    console.error(error);
    core_1.default.setFailed(error.message);
});
