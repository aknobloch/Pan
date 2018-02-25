# Overview
PanServer is a web service for retrieving information regarding a webpage. It is based on Django and the [Django REST framework](http://www.django-rest-framework.org/). If you are looking for information on how to setup the server from scratch, please refer to the [Server Setup](https://github.com/aknobloch/Pan/blob/master/Documentation/Server%20Setup.md) documentation. However, please note that setting up the server from scratch should not be necessary, thanks to Linux Containers.

# Quick Start
TODO: link to document cloning and installing the LXD container.

TODO: quick setup for local testing, link to https://insomnia.rest/download/#ubuntu for testing

# Building and Development

## Development
TODO: Small development tutorial

## Starting the Server

## Managing the Database
### Graphically Managing the DB
Pan Server uses SQLite3, which is largely managed via the API and Django. For manual database management, I like to use [SQLiteStudio](https://sqlitestudio.pl/index.rvt?act=about). The database file is located at `Pan/PanServer/dv.sqlite3`. 

### Models
Django handles a large portion of database serialization natively. More information can be found in the [official documentation](https://docs.djangoproject.com/en/2.0/topics/db/models/), but the data models for the database can be found in the `models.py` file located in the PanRestAPI app folder. The database modeling and serialization was assisted by the [Django REST framework documentation](http://www.django-rest-framework.org/tutorial/1-serialization/).
