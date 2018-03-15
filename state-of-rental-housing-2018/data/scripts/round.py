if __name__ == '__main__':
    import sys
    import csv

    cols = [int(i) for i in sys.argv[1].split(',')]

    reader = csv.reader(sys.stdin)
    writer = csv.writer(sys.stdout)

    header = next(reader)
    writer.writerow(header)

    for row in reader:
        out_row = []
        for i, cell in enumerate(row):
            if i in cols:
                out_cell = round(float(cell))
            else:
                out_cell = cell
            out_row.append(out_cell)
        writer.writerow(out_row)
