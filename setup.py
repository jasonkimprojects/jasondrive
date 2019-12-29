"""
jasondrive package config file.
"""

from setuptools import setup

setup(
    name='jasondrive',
    version='1.0.0',
    packages=['jasondrive'],
    include_package_data=True,
    install_requires=[
        'Flask==1.1.1',
        ],
    )

