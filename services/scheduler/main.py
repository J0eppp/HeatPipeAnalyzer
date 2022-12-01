import schedule
import time
import signal

class GracefulKiller:
  kill_now = False
  def __init__(self):
    signal.signal(signal.SIGINT, self.exit_gracefully)
    signal.signal(signal.SIGTERM, self.exit_gracefully)

  def exit_gracefully(self,signum, frame):
    self.kill_now = True

def job():
    print("I'm working...")

schedule.every(10).seconds.do(job)

if __name__ == "__main__":
    job()


    killer = GracefulKiller()

    while True:
        if killer.kill_now:
            break

        schedule.run_pending()
        time.sleep(1)