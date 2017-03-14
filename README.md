# Interactive Charts The DePaul Institute for Housing Studies

## Running locally

The IHS Charts run on [Jekyll](https://jekyllrb.com/), a Ruby-based web framework. Make sure you have Ruby 2.0+ installed (we recommend using [RVM](https://rvm.io/) or [rbenv](http://rbenv.org/) to manage Ruby versions) and then run the following commands to serve the site locally:

```bash
# Install from GitHub via SSH
git clone git@github.com:datamade/ihs-charts.git
cd ihs-charts

# Make sure you have Bundler (Ruby package manager) installed
gem install bundler

# Install this repo's Ruby dependencies
bundle install

# Start the webserver
bundle exec jekyll serve
```

To view the site, navigate to http://localhost:5000/ (or whatever address Jekyll printed to your console.)

# Web dependencies
We used the following open source tools:

* [Bootstrap](http://getbootstrap.com/) - Responsive HTML, CSS and Javascript framework
* [Leaflet](http://leafletjs.com/) - javascript library interactive maps
* [HighCharts](http://www.highcharts.com/) - javascript library online, interactive charts
* [GitHub pages](https://pages.github.com/) - free static website hosting

## Team

* Derek Eder - developer, content
* Eric van Zanten - developer, GIS data

## Errors / Bugs

If something is not behaving intuitively, it is a bug, and should be reported.
Report it here: https://github.com/datamade/ihs-charts/issues

## Note on Patches/Pull Requests
 
* Fork the project.
* Make your feature addition or bug fix.
* Commit, do not mess with rakefile, version, or history.
* Send a pull request. Bonus points for topic branches.

## Copyright

Copyright (c) 2016 DataMade. Released under the [MIT License](https://github.com/datamade/ihs-charts/blob/master/LICENSE).
