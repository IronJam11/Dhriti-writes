# Generated by Django 4.2.17 on 2025-02-11 05:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_user_otp_otp'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='isverified',
            field=models.BooleanField(default=False),
        ),
    ]
