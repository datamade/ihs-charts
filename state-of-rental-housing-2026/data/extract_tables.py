"""Extract SOR 2026 chart tables from the IHS appendix workbook into CSVs
matching the layout of the 2023 data/output files.

Usage (requires openpyxl):
    python data/extract_tables.py [source.xlsx] [output_dir]

Defaults to the workbook in data/source/ and writes to data/output/.
"""
import csv
import sys
from pathlib import Path

import openpyxl

HERE = Path(__file__).resolve().parent
DEFAULT_SRC = HERE / "source" / "IHS_Draft_Appendix_SOR2026_Cook_Chicago_Suburbs_11092026_Datamade_Report_Charts_AC.xlsx"

src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / "output"
ws = openpyxl.load_workbook(src, data_only=True).worksheets[0]


def v(cell):
    return ws[cell].value


def num(x):
    return f"{x:.10f}"


def pct(x):
    return f"{x * 100:.1f}%"


def cols(start, end):
    from openpyxl.utils import column_index_from_string as ci, get_column_letter as gl
    return [gl(i) for i in range(ci(start), ci(end) + 1)]


def write(name, rows):
    with open(out_dir / name, "w", newline="") as f:
        csv.writer(f, lineterminator="\n").writerows(rows)
    print(f"wrote {name}: {len(rows) - 1} rows x {len(rows[0]) - 1} cols")


YEAR_COLS = cols("B", "M")  # 2012..2024 (no 2020)

# Figure 1: years are rows in xlsx (A3:G14); CSV has years as columns.
f1_rows = range(3, 15)
f1_cols = cols("B", "G")
write("1-renters-income-composition.csv",
      [[""] + [str(v(f"A{r}")) for r in f1_rows]]
      + [[v(f"{c}2")] + [num(v(f"{c}{r}")) for r in f1_rows] for c in f1_cols])

# Figure 2: same orientation as CSV (A17:M24).
write("2-renters-age-composition.csv",
      [[""] + [str(v(f"{c}17")) for c in YEAR_COLS]]
      + [[v(f"A{r}")] + [num(v(f"{c}{r}")) for c in YEAR_COLS] for r in range(18, 25)])

# Figure 3: years are columns in xlsx (A27:M31); CSV has years as rows.
f3_rows = range(28, 32)
write("3-supply-distribution.csv",
      [[""] + [v(f"A{r}") for r in f3_rows]]
      + [[str(v(f"{c}27"))] + [num(v(f"{c}{r}")) for r in f3_rows] for c in YEAR_COLS])

# Figure 4: same orientation (A34:D46), whole households.
write("4-supply-demand-gap.csv",
      [["", v("B34"), v("C34"), v("D34")]]
      + [[str(v(f"A{r}"))] + [str(round(v(f"{c}{r}"))) for c in "BCD"] for r in range(35, 47)])

# Figure 5: same orientation (A49:M52), formatted percents.
write("5-supply-demand-gap-change.csv",
      [[""] + [str(v(f"{c}49")) for c in YEAR_COLS]]
      + [[v(f"A{r}")] + [pct(v(f"{c}{r}")) for c in YEAR_COLS] for r in range(50, 53)])

# Figure 6: years are rows in xlsx (A56:B67); CSV has years as columns.
f6_rows = range(56, 68)
write("6-rent-more-than-30-pct-income.csv",
      [[""] + [str(v(f"A{r}")) for r in f6_rows],
       [v("B55")] + [pct(v(f"B{r}")) for r in f6_rows]])

# Figure 7: year header in row 70 spans 3 columns; status in row 71 (B..AK).
f7_cols = cols("B", "AK")
header = [""]
for i, c in enumerate(f7_cols):
    year = v(f"{f7_cols[i - i % 3]}70")
    header.append(f"{year} {v(f'{c}71')}")
write("7-rent-burden.csv",
      [header]
      + [[v(f"A{r}")] + [num(v(f"{c}{r}")) for c in f7_cols] for r in range(72, 78)])  # excludes Total row

# Figure 8: submarket table (A81:H99). Counts rounded, shares as percents.
f8_cols = cols("B", "H")
write("8-puma.csv",
      [["Submarket (PUMA)"] + [v(f"{c}81").strip() for c in f8_cols]]
      + [[v(f"A{r}")]
         + [str(round(v(f"{c}{r}"))) for c in "BCD"]
         + [pct(v(f"{c}{r}")) for c in "EFGH"]
         for r in range(82, 100)])
