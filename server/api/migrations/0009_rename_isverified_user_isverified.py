# Generated by Django 4.2.17 on 2025-02-11 06:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_user_isverified'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='isverified',
            new_name='isVerified',
        ),
    ]
