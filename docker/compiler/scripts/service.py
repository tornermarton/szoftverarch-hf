import fileinput
import json
import os
import subprocess
from pathlib import Path

from flask import Flask, request, jsonify

app = Flask(__name__)


# docker-compose up --build compiler

# curl "http://localhost:5000/process_all?arxiv_id=1903.11027&generated_id=4321"

@app.route('/process_all')
def process_all():
    arxiv_id = request.args.get('arxiv_id')
    generated_id = request.args.get('generated_id')

    _, code_get_source_by_id = get_source_by_id(arxiv_id, generated_id)
    _, code_replace_comments_before_compile = replace_comments_before_compile(generated_id)
    ret, code_compile_latex_source = compile_latex_source(generated_id)

    code = 500
    if code_get_source_by_id == 200 and code_replace_comments_before_compile == 200 and code_compile_latex_source == 200:
        code = 200

    main_file = json.loads(ret)["main_file"]
    return jsonify({ "main_file": main_file}), code


# curl "http://localhost:5000/get_source_by_id?arxiv_id=1903.11027&generated_id=4"

# a few arxiv ids to test with ( all .tar.gz files)
#   1907.11692 1910.01765 2004.15021 1801.09847 1906.05717 1909.13163 2004.05324
# yes: 1903.11027
# nope: 1506.02025

@app.route('/get_source_by_id')
def get_source_by_id_route():
    arxiv_id = request.args.get('arxiv_id')
    generated_id = request.args.get('generated_id')
    return get_source_by_id(arxiv_id, generated_id)


def get_source_by_id(arxiv_id, generated_id):
    bashCommand = "/home/scripts/get_source_by_id.bash " + str(arxiv_id) + " " + str(generated_id)
    process = subprocess.Popen(bashCommand, stdout = subprocess.PIPE, stderr = subprocess.PIPE, shell = True)
    output, error = process.communicate()

    code = 200
    if len(error) != 0:
        code = 500

    return jsonify({ "output": output.decode("utf-8"), "error": error.decode("utf-8") }), code


# curl "http://localhost:5000/replace_comments_before_compile?generated_id=4"

@app.route('/replace_comments_before_compile')
def replace_comments_before_compile_route():
    generated_id = request.args.get('generated_id')
    return replace_comments_before_compile(generated_id)


def replace_comments_before_compile(generated_id):
    path = os.path.join("/home/workspace", "doc_" + generated_id, "uncompressed")
    tex_files = list(Path(path).rglob("*.[tT][eE][xX]"))
    uncomment_files(tex_files)

    return jsonify({ "tex_files": [str(path) for path in tex_files] }), 200


def is_valid_comment(line):
    is_comment = line[0] == "%"
    is_long = 150 < len(line)
    is_not_table = " : " not in line
    is_not_graphics = "\\includegraphics" not in line
    is_not_caption = "\\caption" not in line
    is_not_percentage = "\\%" not in line  # todo remove

    return is_comment and is_long and is_not_table and is_not_graphics and is_not_caption and is_not_percentage


def uncomment_files(tex_files):
    for filepath in tex_files:
        with fileinput.FileInput(filepath, inplace = True, backup = '.bak') as file:
            for line in file:
                if is_valid_comment(line):
                    print(line.replace("%", "\n\ncommentedsectionstart"), end = '')
                    print("commentedsectionend", end = '')
                else:
                    print(line, end = '')


# curl "http://localhost:5000/compile_latex_source?generated_id=4"

@app.route('/compile_latex_source')
def compile_latex_source_route():
    generated_id = request.args.get('generated_id')
    return compile_latex_source(generated_id)


def compile_latex_source(generated_id):
    path = os.path.join("/home/workspace", "doc_" + generated_id, "uncompressed")
    tex_files = list(Path(path).rglob("*.[tT][eE][xX]"))

    main_file = [str(path) for path in tex_files][0].split("/")[-1]

    for tex_file in tex_files:
        if "main.tex" in str(tex_file):
            main_file = str(tex_file).split("/")[-1]
            break

    bashCommand = "make4ht " + main_file + " -d " + path + "/compiled_output"
    process = subprocess.Popen(bashCommand, cwd = path, stdout = subprocess.PIPE, stderr = subprocess.PIPE,
                               shell = True)
    output, error = process.communicate()
    output = output.decode("utf-8")
    error = error.decode("utf-8")

    code = 200
    if len(error) != 0 or "finished" not in output[-10:]:
        code = 500
    return jsonify({ "output": output, "error": error, "main_file": main_file }), code


if __name__ == '__main__':
    app.run(host = "0.0.0.0")
