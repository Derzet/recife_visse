import csv
import json
import datetime

with open('../data/casos-chikungunya2015.csv', 'r') as file:
    reader = csv.DictReader(file.read().replace(';', ',').splitlines())
    json_data = []
    for case in reader:
        date = datetime.datetime.strptime(case['dt_notificacao'], '%Y/%m/%d %H:%M:%S.%f')
        json_data.append({'dia': date.day,
                          'mes': date.month,
                          'ano': date.year,
                          'bairro': case['co_bairro_residencia']})

    with open('time_histogram_data.json', 'w', encoding='utf-8') as outfile:
        json.dump(json_data, outfile, indent=4, sort_keys=True, separators=(',', ':'))
