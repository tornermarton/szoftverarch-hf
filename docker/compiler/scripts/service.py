import fileinput
import os
import subprocess
from pathlib import Path

from flask import Flask, request

app = Flask(__name__)


# curl "http://localhost:5000/get_source_by_id?arxiv_id=1905.02693&generated_id=2"

@app.route('/get_source_by_id')
def get_source_by_id():
    arxiv_id = request.args.get('arxiv_id')
    generated_id = request.args.get('generated_id')

    bashCommand = "/home/scripts/get_source_by_id.bash " + str(arxiv_id) + " " + str(generated_id)
    process = subprocess.Popen(bashCommand, stdout = subprocess.PIPE, stderr = subprocess.PIPE, shell = True)
    output, error = process.communicate()

    code = 200
    if len(error) != 0:
        code = 500

    return { "output": output.decode("utf-8"), "error": error.decode("utf-8") }, code


# curl "http://localhost:5000/replace_comments_before_compile?generated_id=2"

@app.route('/replace_comments_before_compile')
def replace_comments_before_compile():
    generated_id = request.args.get('generated_id')
    path = os.path.join("/home/workspace", "doc_" + generated_id, "uncompressed")
    tex_files = list(Path(path).rglob("*.[tT][eE][xX]"))
    uncomment_files(tex_files)

    return { "tex_files": [str(path) for path in tex_files] }


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
                    print(line.replace("%", "commentedsectionstart"), end = '')
                    print("commentedsectionend", end = '')
                else:
                    print(line, end = '')

# curl "http://localhost:5000/compile_latex_source?generated_id=2"

@app.route('/compile_latex_source')
def compile_latex_source():
    generated_id = request.args.get('generated_id')
    path = os.path.join("/home/workspace", "doc_" + generated_id, "uncompressed")
    tex_files = list(Path(path).rglob("*.[tT][eE][xX]"))
    main_file = [str(path) for path in tex_files][0].split("/")[-1]

    bashCommand = "make4ht " + main_file + " -d " + path + "/compiled_output"
    print(bashCommand)
    process = subprocess.Popen(bashCommand, cwd=path, stdout = subprocess.PIPE, stderr = subprocess.PIPE, shell = True)
    output, error = process.communicate()

    code = 200
    if len(error) != 0:
        code = 500
    print(error.decode("utf-8"), output.decode("utf-8"))
    return { "output": output.decode("utf-8"), "error": error.decode("utf-8") }, code


if __name__ == '__main__':
    app.run()
