FROM ruby:2.6

COPY . /usr/local/src
WORKDIR /usr/local/src

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential

RUN gem uninstall -x bundler && gem install bundler -v 2.0.1
RUN bundle install
