# Overview
PanServer is a web service for retrieving information regarding a webpage. It is based on Django and the [Django REST framework](http://www.django-rest-framework.org/). If you are looking for information on how to setup the server from scratch, please refer to the [Server Setup](https://github.com/aknobloch/Pan/blob/master/Documentation/Server%20Setup.md) documentation. However, please note that setting up the server from scratch should not be necessary, thanks to Linux Containers.

# Prerequisites
* Project cloned on local machine.
* Python3 and Django - You may find help [here](https://docs.djangoproject.com/en/2.0/topics/install/) and [here](https://stackoverflow.com/questions/10763440/how-to-install-python3-version-of-package-via-pip-on-ubuntu).
* Django REST framework - [Install Guide](http://www.django-rest-framework.org/).

# Building and Development

## Architecture Overview
The following section provides a brief overview of the basic structure of the PanServer. Much of this is echos of Django and [Django REST framework](http://www.django-rest-framework.org/), so for a more in-depth explanation of the architecture you can look at the documentation for those frameworks.

* `PanServer/PanRestAPI/` 

   This is the top-level directory for the REST API. This is formally known as a "module" in Django-speak.
   
* `PanServer/PanServer/` 

   This is the top-level directory for the server itself. This defines the global server settings and what URL's are available.
   
* `PanServer/PanServer/urls.py`

   This file contains an array called `urlpatterns` that defines the URLs that the REST framework will support, as well as linking to the `views` that are associated with each URL. When an incoming request is made to the server, the URL is compared with those in the `urlpatterns` array, and when a match is made, the request is forwarded to the associated view.
   
* `PanServer/PanRestAPI/views.py`

   This file is responsible for handling requests. Each function is a specific request, which accepts specific header types (PUT, POST, GET, etc). The code in the function is ran when a URL with the associated header is requested by the server. This relationship is explained above, in the `urls.py` file.
   
* `PanServer/PanRestAPI/models.py` 

   This defines the data models and their fields. More information on models can be found in the [official documentation](https://docs.djangoproject.com/en/2.0/topics/db/models/).
   
* `PanServer/PanRestAPI/serializers.py` 

   These are the classes responsible for serialization and deserialization of the data structures defined in `models.py`. Serializers take JSON data, validate it and save it to the database. They also take data from the database and convert them into Python data models. More information on serialization can be found via the [Django REST framework documentation](http://www.django-rest-framework.org/tutorial/1-serialization/).
   
* `PanServer/PanRestAPI/request_handlers.py`

   This file contains class definitions for request handlers. Request handlers are simply convenience classes to aid in the processing of requests. All API endpoints defined in the `views.py` file should be routed through one or ore of these handlers.

## Debugging and Testing
When the variable `DEBUG` in the `settings.py` file is set to `True`, then debug logs are written to the `debug.log` file in the top level `PanServer` directory. When introducing new code, it is important to **always use the Django logger** and not print statements. More information on the logger can be found [in the official docs](https://docs.djangoproject.com/en/2.0/topics/logging/). 

For quick testing of API calls, I highly recommend the program [Insomnia](https://insomnia.rest/download/).

## Google Cloud Service
Pan relies on GCS for some of its core functionality. In order to run the server, you will need this installed on your machine, as well as the authentication credentials for the server. To install the GCS dependency, simply run `pip install --upgrade google-cloud-language`. Remember to use `pip3`, or the equivalent command to ensure that the Python environment that the server is running on is the same that the GCS dependency is being installed to. Additionally, you will need to create a file to store the server API authentication token, as well as set the `GOOGLE_APPLICATION_CREDENTIALS` variable to that file. For instance, if you store the authentication token in a file located at `/home/example/gcs_auth` then you would run the command `export GOOGLE_APPLICATION_CREDENTIALS="/home/example/gcs_auth"` to set this variable. The authentication token can be found by navigating to the PanServer project in the Google Cloud console, then to APIs & Services > Credentials. 

## Starting the Server
Running the server is fairly straightforward to do. Firstly, make sure that the `DEBUG` variable is set to `True` in the `settings.py` file. Next, you'll need to start the server using Python 3. Navigate to the `PanServer` directory and execute `python manage.py runserver`. You may need to explicitly designate `python3` in your command. This will start the server on your local machine, and it will now be accessible via `127.0.0.1:8000`. 

## Graphically Managing the DB
Pan Server uses SQLite3, which is largely managed via the API and Django. For manual database management, I like to use [SQLiteStudio](https://sqlitestudio.pl/index.rvt?act=about). The database file is located at `Pan/PanServer/db.sqlite3`. 

## Deployment
TODO: document lxd container migration and copying, and updating. make sure debug=False
If you are looking for information on setting up the server from scratch, you can find instructions for that in the [Server Setup](https://github.com/aknobloch/Pan/blob/master/Documentation/Server%20Setup.md) documentation.
