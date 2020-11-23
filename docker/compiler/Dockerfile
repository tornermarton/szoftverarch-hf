
# from https://github.com/michal-h21/make4ht-action

FROM debian:unstable-slim

#LABEL "maintainer"="Michal Hoftich <michal.h21@gmail.com>"
#LABEL "repository"="https://github.com/michal-h21/make4ht"
#LABEL "homepage"="https://github.com/michal-h21/make4ht"

LABEL "com.github.actions.name"="LaTeX to XML"
LABEL "com.github.actions.description"="Convert LaTeX documents to XML with make4ht."
LABEL "com.github.actions.icon"="code"
LABEL "com.github.actions.color"="blue"

ENV DEBIAN_FRONTEND noninteractive

# Fix openjre installation isssue
RUN mkdir -p /usr/share/man/man1

# Install all TeX and LaTeX dependencies
RUN apt-get update && \
    apt-get install --yes -y --no-install-recommends \
    python3 python3-pip

RUN apt-get install --yes -y --no-install-recommends \
    make luatex texlive texlive-base texlive-luatex texlive-latex-extra \
    tidy texlive-extra-utils python3-pygments python3-setuptools dvisvgm

RUN apt-get install --yes -y --no-install-recommends \
    texlive-plain-generic texlive-generic-recommended \
    pandoc latexmk lmodern fonts-lmodern tex-gyre fonts-texgyre

RUN apt-get install --yes -y --no-install-recommends \
    default-jre-headless zip curl xz-utils dvipng \
    texlive-lang-english && \
    apt-get autoclean && apt-get --purge --yes autoremove && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN python3 --version

RUN pip3 install flask

ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
ADD scripts /home/scripts
RUN chmod +x /home/scripts/*

ENTRYPOINT ["python3", "/home/scripts/service.py"]
