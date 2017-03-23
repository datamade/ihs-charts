SOURCE = source/SOR_Charts_Draft_03092017.xlsx

RENT_BURDEN_HEADER = ,2007,2012,2013,2014,2015

RENT_BURDEN_COMPOSITION_HEADER = ,2007 Not Burdened,2007 Burdened,2007 Severely Burdened,2012 Not Burdened,2012 Burdened,2012 Severely Burdened,2013 Not Burdened,2013 Burdened,2013 Severely Burdened,2014 Not Burdened,2014 Burdened,2014 Severely Burdened,2015 Not Burdened,2015 Burdened,2015 Severely Burdened

AMI_FORMAT = sed -e '2s/\</0-/' -e 's/ to /-/' -e '7s/Greater than 200\%/200\%\+/'

ROUND = python3 scripts/round.py

.PHONY: all clean
all: output/1-tenure.csv \
	output/2-renters-income-composition.csv \
	output/2-renters-income-total.csv \
	output/3-renters-age-composition.csv \
	output/3-renters-age-total.csv \
	output/6-supply.csv \
	output/7-affordability-gap.csv \
	output/7-affordability.csv \
	output/8-rent-burden.csv \
	output/8-rent-burden-composition.csv

clean:
	rm -Rf output/*

output/1-tenure.csv: $(SOURCE)
	in2csv --sheet "Tenure_2000_2015" "$<" | csvcut -c 2,3,4,5,6,7,8,9,10,11,12,13,14 | \
		head -3 | $(ROUND) 0,1,2,3,4,5,6,7,8,9,10,11,12 > $@

output/2-renters-income-composition.csv: $(SOURCE)
	in2csv --sheet "Renter_Income_2007_2012_2015" "$<" |  sed '1s/^.\{1\}//' | \
		$(AMI_FORMAT) | head -7 > $@

output/2-renters-income-total.csv: $(SOURCE)
	in2csv --sheet "Renter_Income_2007_2012_2015" "$<" | tail -8 | head -7 | \
		$(AMI_FORMAT) | $(ROUND) 1,2,3,4,5 > $@

output/3-renters-age-composition.csv: $(SOURCE)
	in2csv --sheet "Renters_Age_2007_2012_2015" "$<" | head -9 | tail -8 > $@

output/3-renters-age-total.csv: $(SOURCE)
	in2csv --sheet "Renters_Age_2007_2012_2015" "$<" | tail -9 | head -8 | $(ROUND) 1,2,3,4,5 > $@

output/6-supply.csv: $(SOURCE)
	in2csv --sheet "Stock_2007_2012_2015" "$<" | csvcut -c 1,2,3,4,5 | \
		sed '1s/^.\{1\}//' > $@

output/7-affordability-gap.csv: $(SOURCE)
	in2csv --sheet "Gap_Cook" "$<" | csvcut -c 4,7 | head -6 | sed '1s/^.\{1\}//' > $@

output/7-affordability.csv: $(SOURCE)
	in2csv --sheet "Gap_Cook" "$<" | csvcut -c 4,5,6 | head -6 | sed '1s/^.\{1\}//' > $@

output/8-rent-burden.csv: $(SOURCE)
	in2csv --sheet "Rent_Burden_2007_2012_2015" "$<" | tail -7 | head -6 | \
		csvcut -c 1,4,7,10,13,16 | sed -e $$'1s/^/$(RENT_BURDEN_HEADER)\\\n/' | \
		$(AMI_FORMAT) > $@

output/8-rent-burden-composition.csv: $(SOURCE)
	in2csv --sheet "Rent_Burden_2007_2012_2015" "$<" | tail -7 | head -6 | \
		sed -e $$'1s/^/$(RENT_BURDEN_COMPOSITION_HEADER)\\\n/' | $(AMI_FORMAT) > $@
