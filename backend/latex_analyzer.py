import fileinput
from pathlib import Path

"""
Removes some comments in the latex source.
Adds tags before and after each section: 
commentedsectionstart and commentedsectionend
"""

def is_valid_comment(line):
    is_comment = line[0] == "%"
    is_long = 150 < len(line)
    is_not_table = " : " not in line
    is_not_graphics = "\\includegraphics" not in line
    is_not_caption = "\\caption" not in line
    is_not_percentage = "\\%" not in line  # todo remove

    return is_comment and is_long and is_not_table and is_not_graphics and is_not_caption and is_not_percentage


def get_tex_files():
    return list(Path("./latex_source/uncompressed").rglob("*.[tT][eE][xX]"))


def show_comments():
    for filepath in get_tex_files():
        print(filepath)
        with open(filepath) as file:
            lines = file.readlines()

        for line in lines:
            if is_valid_comment(line):
                print(len(line), line)


def uncomment_files():
    for filepath in get_tex_files():
        with fileinput.FileInput(filepath, inplace = True, backup = '.bak') as file:
            for line in file:
                if is_valid_comment(line):
                    print(line.replace("%", "commentedsectionstart"), end = '')
                    print("commentedsectionend", end = '')
                else:
                    print(line, end = '')


if __name__ == '__main__':
    # show_comments()
    uncomment_files()
