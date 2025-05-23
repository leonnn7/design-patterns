export interface Subscriber {
  update(event: ParkingLotEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(event: ParkingLotEvent): void;
}

export type ParkingLotEventType = "enter" | "exit";
export interface ParkingLotEvent {
  type: ParkingLotEventType;
  lot: ParkingLot;
}

export class ParkingLot implements Publisher {
  public occupied: number = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number,
  ) {}

  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter(s => s !== subscriber);
  }

  notify(event: ParkingLotEvent): void {
    for (const s of this.subscribers) {
      s.update(event);
    }
  }

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notify({ type: "enter", lot: this });
    } else {
      throw new Error(`the parking lot is full`);
    }
  }

  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify({ type: "exit", lot: this });
    } else {
      throw new Error(`the parking lot is empty`);
    }
  }

  isFull() {
    return this.occupied == this.capacity;
  }

  isEmpty() {
    return this.occupied == 0;
  }
}

export class Display implements Subscriber {
  update(event: ParkingLotEvent): void {
    if (event.type === "enter") {
      console.log(`A car entered the lot ${event.lot.name}: ${event.lot.occupied}/${event.lot.capacity} occupied.`);
    } else if (event.type === "exit") {
      console.log(`A car left the lot ${event.lot.name}: ${event.lot.occupied}/${event.lot.capacity} occupied.`);
    }
  }
}
