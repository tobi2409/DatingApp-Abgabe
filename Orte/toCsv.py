import pandas

datatypes = {
	0: str,
	1: str,
	2: str,
	3: str,
	4: str,
	5: str,
	6: float,
	7: str,
	8: float,
	9: float,
	10: float,
	11: float
}

data = pandas.read_csv('DE.txt', '\t', header=0, dtype=datatypes, index_col=0)

data.to_csv('DE.csv')