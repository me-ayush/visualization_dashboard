# custom_filters.py
from django import template

register = template.Library()

@register.filter(name='unique_topics')
def unique_topics(data_list):
    unique_set = set()
    unique_data_list = []

    for data in data_list:
        if data.topic not in unique_set and data.topic != '':
            unique_set.add(data.topic)
            unique_data_list.append({'value':data.topic.title(), "key": data.topic})

    return unique_data_list
