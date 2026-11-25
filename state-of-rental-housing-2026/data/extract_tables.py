"""Extract SOR 2026 chart tables from the IHS appendix workbook into one CSV
per figure in data/output/, numbered to match the report's figures.

Usage (requires openpyxl):
    python data/extract_tables.py [source.xlsx] [output_dir]

Defaults to the rev1 workbook in data/source/ and writes to data/output/.
Cell ranges are specific to that workbook's layout; check them if IHS sends
a new revision.
"""
import csv
import sys
from pathlib import Path

import openpyxl
from openpyxl.utils import column_index_from_string, get_column_letter

HERE = Path(__file__).resolve().parent
DEFAULT_SRC = HERE / "source" / "IHS_Draft_Appendix_SOR2024_Cook_Chicago_Suburbs_11232026_Datamade_Report_Charts_AC_rev1_SD.xlsx"

src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / "output"
ws = openpyxl.load_workbook(src, data_only=True).worksheets[0]


def v(cell):
    return ws[cell].value


def num(x):
    return f"{x:.10f}"


def pct(x):
    return f"{x * 100:.1f}%"


def count(x):
    return str(round(x))


def cols(start, end):
    return [get_column_letter(i)
            for i in range(column_index_from_string(start), column_index_from_string(end) + 1)]


def label(x):
    return str(x).strip()


def write(name, rows):
    with open(out_dir / name, "w", newline="") as f:
        csv.writer(f, lineterminator="\n").writerows(rows)
    print(f"wrote {name}: {len(rows) - 1} rows x {len(rows[0]) - 1} cols")


YEAR_COLS = cols("B", "M")  # 2012..2024 (no 2020)


def years_across(header_row, data_rows, fmt):
    """Table with years across columns B..M and one series per row."""
    return ([[""] + [label(v(f"{c}{header_row}")) for c in YEAR_COLS]]
            + [[label(v(f"A{r}"))] + [fmt(v(f"{c}{r}")) for c in YEAR_COLS] for r in data_rows])


def years_down(year_rows, value_cols, fmt, header_row=None):
    """Transpose a table with years down column A into years across columns."""
    return ([[""] + [label(v(f"A{r}")) for r in year_rows]]
            + [[label(v(f"{c}{header_row}"))] + [fmt(v(f"{c}{r}")) for r in year_rows] for c in value_cols])


# Figure 1: renter and owner households (years down A3:C14). Years as rows, like figure 7.
write("1-renter-owner-households.csv",
      [["", label(v("B2")), label(v("C2"))]]
      + [[label(v(f"A{r}")), count(v(f"B{r}")), count(v(f"C{r}"))] for r in range(3, 15)])

# Figure 2: share of households that rent (A19:B30).
write("2-share-households-rent.csv", years_down(range(19, 31), ["B"], pct, header_row=18))

# Figure 3: renters by income (years down A35:G46).
write("3-renters-income-composition.csv", years_down(range(35, 47), cols("B", "G"), num, header_row=34))

# Figure 4: renters by age (years across, A50:M57).
write("4-renters-age-composition.csv", years_across(50, range(51, 58), num))

# Figure 5: rental supply by building type (years across in xlsx, A61:M65); years as rows in CSV.
f5_rows = range(62, 66)
write("5-supply-distribution.csv",
      [[""] + [label(v(f"A{r}")) for r in f5_rows]]
      + [[label(v(f"{c}61"))] + [num(v(f"{c}{r}")) for r in f5_rows] for c in YEAR_COLS])

# Figure 6: indexed change in rental units by building size (years across, A69:M73).
write("6-indexed-change-building-size.csv", years_across(69, range(70, 74), pct))

# Figure 7: affordable supply, demand and gap (years down, A77:D89).
write("7-supply-demand-gap.csv",
      [["", label(v("B77")), label(v("C77")), label(v("D77"))]]
      + [[label(v(f"A{r}"))] + [count(v(f"{c}{r}")) for c in "BCD"] for r in range(78, 90)])

# Figure 8: percent change in supply and demand since 2012 (years across, A93:M96).
write("8-supply-demand-gap-change.csv", years_across(93, range(94, 97), pct))

# Figure 9: affordability gap characteristics by period (A100:D103), stored as decimals.
write("9-affordability-gap-characteristics.csv",
      [[""] + [label(v(f"{c}100")) for c in "BCD"]]
      + [[label(v(f"A{r}"))] + [num(v(f"{c}{r}")) for c in "BCD"] for r in range(101, 104)])

# Figure 10: share of renters cost burdened (years down, A110:B122).
write("10-rent-more-than-30-pct-income.csv", years_down(range(111, 123), ["B"], pct, header_row=110))

# Figure 11: cost burdened by severity (years across, A137:M139), stored as decimals.
write("11-cost-burden-severity.csv", years_across(137, range(138, 140), num))

# Figure 12: rent burden status by income. Uses the full-precision source table (A126:AK133)
# rather than the rounded, reshaped copy under the figure 12 heading.
f12_cols = cols("B", "AK")
header = [""]
for i, c in enumerate(f12_cols):
    year = v(f"{f12_cols[i - i % 3]}126")
    header.append(f"{year} {label(v(f'{c}127'))}")
write("12-rent-burden.csv",
      [header] + [[label(v(f"A{r}"))] + [num(v(f"{c}{r}")) for c in f12_cols] for r in range(128, 134)])

# Figure 13: submarket supply, demand and gap (A218:E236). Counts rounded, share as percent.
write("13-submarkets.csv",
      [["Submarket (PUMA)"] + [label(v(f"{c}218")) for c in "BCDE"]]
      + [[label(v(f"A{r}"))] + [count(v(f"{c}{r}")) for c in "BCD"] + [pct(v(f"E{r}"))]
         for r in range(219, 237)])
