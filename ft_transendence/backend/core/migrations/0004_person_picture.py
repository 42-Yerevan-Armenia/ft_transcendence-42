# Generated by Django 3.2.24 on 2024-02-24 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_person_dummy_field'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='picture',
            field=models.TextField(blank=True, null=True),
        ),
    ]