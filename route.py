from flask import Flask, render_template, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, Bus, Station, Route, RouteStation

app = Flask(__name__)

engine = create_engine('mysql+mysqlconnector://nrator:XXXXXXXX@nrator.mysql.pythonanywhere-services.com/nrator$bus?charset=utf8', pool_recycle=20)
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

app = Flask(__name__)

@app.route('/', methods = ['POST', 'GET'])
def home():
    if request.method == 'POST':
        bus_no = (request.form['bus_no']).upper()
        bus = session.query(Bus).filter_by(no=bus_no).one()
        routes = session.query(Route).filter_by(bus_id=bus.id)
        results = []
        for i in routes:
            stations = session.query(Station, RouteStation).\
                    join(RouteStation.route).\
                    join(Route.bus).\
                    filter(Bus.no==bus_no).\
                    filter(RouteStation.route_id==i.id).\
                    filter(Station.id==RouteStation.station_id)
            results.append(stations)
        return render_template('index.html', bus=bus, results=results)
    else:
        bus=[]
        results=[]
        return render_template('index.html', bus=bus, results=results)

if __name__ == '__main__':
    app.run()
