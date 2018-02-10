# Graphically Managing the DB
For database management, I like to use [SQLiteStudio](https://sqlitestudio.pl/index.rvt?act=about). The database file is located at `Pan/PanServer/dv.sqlite3`. 

# Database API Documentation
### Models
Django handles a large portion of database serialization natively. More information can be found in the [official documentation](https://docs.djangoproject.com/en/2.0/topics/db/models/), but the data models for the database can be found in the `models.py` file located in the PanRestAPI app folder. The database modeling and serialization was assisted by the [Django REST framework documentation](http://www.django-rest-framework.org/tutorial/1-serialization/).
