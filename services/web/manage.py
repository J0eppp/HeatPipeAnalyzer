# from flask.cli import FlaskGroup

from project import app  # , db


# cli = FlaskGroup(app)


# @cli.command("create_db")
# def create_db():
#     db.drop_all()
#     db.create_all()
#     db.session.commit()


if __name__ == "__main__":
    # cli()
    app.run(host='0.0.0.0', threaded=True, port=5000)
