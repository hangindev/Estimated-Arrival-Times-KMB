## Bus Estimated Time of Arrival - KMB

[![screenshot.png](https://s23.postimg.org/6cwd4lpij/screenshot.png)](https://postimg.org/image/bob9pbbl3/)

#### Intro
Since the official Estimated Time of Arrival - KMB is not mobile-friendly, an unofficial web app for mobile user to check estimated arrival times is built. Estimated times are retrieved from KMB server.

#### Project link
http://nrator.pythonanywhere.com/

#### Tools used
* Backend
  * Python for scraping bus data, loading data to database and seting up the web server(Flask, SQLAlchemy)
  * MySQL for database management
  * Hosted by PythonAnywhere
* Frontend
  * jQuery Mobile

#### Known Bug(s)
* Occasionally losing database connection and needed to restart server.
