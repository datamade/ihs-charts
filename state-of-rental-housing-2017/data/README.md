# IHS Data Prep

Requires a Posix environment (Mac OS X, Linux).

### SOP:

1. Create a Python virtualenv and install dependencies with `pip install -r requirements.txt`

2. `make all` will generate CSVs in the `output/` directory

3. `make clean` will remove everything in `output/`

*Note: The CSVs that are in this repo but **not** in `output/` are old, and only here for temporary debugging purposes.* 
