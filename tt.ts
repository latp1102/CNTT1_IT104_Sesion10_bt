class Passenger {
    private static idCounter = 1
    passengerId: number;
    name: string;
    passportNumber: string;
    constructor(passengerId: number, name: string, passportNumber: string){
        this.passengerId = passengerId;
        this.name = name;
        this.passportNumber = passportNumber;
    }
    getDetails(): string {
        return `pass: ${this.passengerId} - Name: ${this.name} - pass: ${this.passportNumber}`;
    }
}

abstract class Flight {
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: Date;
    capacity: number;
    bookedSeats: number = 0;
    constructor(flightNumber: string, origin: string, destination: string, departureTime: Date, capacity: number, bookedSeats: number){
        this.flightNumber = flightNumber;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.capacity = capacity;
        this.bookedSeats = bookedSeats;
    }
    bookSeat(): void {
        if(!this.isFull()){
            this.bookedSeats++;
        }
    }
    isFull(): boolean {
        return this.bookedSeats >= this.capacity;
    }
    abstract calculateBaggageFee(weight: number): number;
}
class DomesticFlight extends Flight {
    calculateBaggageFee(weight: number): number {
        return weight * 50000;
    }
}
class InternationalFlight extends Flight {
    calculateBaggageFee(weight: number): number {
        return weight * 10 * 25000;
    }
}

class Booking {
    private static bookingCounter = 1
    bookingId: number;
    passenger: Passenger;
    flight: FillLight;
    numberOfTickets: number;
    totalCost: number;
    constructor(bookingId: number, passenger: Passenger, flight: Flight, numberOfTickets: number, totalCost: number){
        this.bookingId = bookingId;
        this.passenger = passenger;
        this.flight = flight;
        this.numberOfTickets = numberOfTickets;
        this.totalCost = totalCost;
    }
    getBookingDetails(): string {
        return `Mã đặt: ${this.bookingId} - Hàng khách: ${this.passenger} - Số vé: ${this.numberOfTickets} - Tổng: ${this.totalCost}`
    }
}
class GenericRepository<T> {
    private items: T[] = [];
    add(item: T): void {
        this.items.push(item);
    }
    getAll(): T[] {
        return this.items;
    }
}
